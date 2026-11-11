import QtQuick 2.15
import QtGraphicalEffects 1.15
import org.kde.plasma.core 2.0 as PlasmaCore

Item {
    id: photoRoot
    property int currentIndex: 0
    property bool slideshowMode: plasmoid.configuration.photoSlideshowMode !== undefined ? plasmoid.configuration.photoSlideshowMode : true
    property int intervalSecs: plasmoid.configuration.photoIntervalSecs || 12
    property string photoDir: plasmoid.configuration.photoDirectory || ""
    property string embeddedFallbackSvg: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='640' height='640' viewBox='0 0 640 640'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%232b5876'/><stop offset='100%' stop-color='%234e4376'/></linearGradient></defs><rect width='640' height='640' fill='url(%23g)'/><circle cx='490' cy='150' r='58' fill='%23f6d365' opacity='0.85'/><path d='M0 470 L180 310 L330 430 L470 290 L640 450 L640 640 L0 640 Z' fill='%231e3c52' opacity='0.75'/></svg>"
    property var bundledPhotos: [
        Qt.resolvedUrl("../images/photo_widget_architecture.jpg").toString(),
        Qt.resolvedUrl("../images/photo_widget_botanical.jpg").toString(),
        Qt.resolvedUrl("../images/alpine_mist_wallpaper.jpg").toString()
    ]
    property var customPhotos: []
    readonly property var activePhotos: (photoRoot.customPhotos && photoRoot.customPhotos.length > 0)
        ? photoRoot.customPhotos
        : photoRoot.bundledPhotos
    readonly property string currentPhotoUrl: {
        var list = photoRoot.activePhotos
        if (!list || list.length === 0) return photoRoot.embeddedFallbackSvg
        var idx = Math.max(0, photoRoot.currentIndex) % list.length
        return list[idx] || photoRoot.embeddedFallbackSvg
    }
    property string previousPhotoUrl: ""

    // Optional Rust/POSIX Directory Scanner when user sets a custom photo directory (Zero Qt.labs.folderlistmodel dependency)
    PlasmaCore.DataSource {
        id: photoDirScanner
        engine: "executable"
        connectedSources: []
        onNewData: function(sourceName, data) {
            if (sourceName.indexOf("_pscan=") === 0 && data["stdout"]) {
                var lines = data["stdout"].trim().split("\n")
                var found = []
                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i].trim()
                    if (line.length > 1) {
                        found.push(line.indexOf("file://") === 0 ? line : ("file://" + line))
                    }
                }
                photoRoot.customPhotos = found
                photoRoot.currentIndex = 0
            }
            disconnectSource(sourceName)
        }
        function scanDirectory(rawDir) {
            var clean = (rawDir || "").trim().replace(/^file:\/\//, "").replace(/"/g, "")
            if (clean.length === 0) {
                photoRoot.customPhotos = []
                return
            }
            var shPath = clean
            if (shPath.indexOf("~/") === 0) {
                shPath = "$HOME/" + shPath.substring(2)
            } else if (shPath === "~") {
                shPath = "$HOME"
            }
            var cmd = '_pscan=' + Date.now() + '; TARGET="' + shPath + '"; ' +
                      'if [ -x "$HOME/.local/bin/urwidgets-daemon" ]; then "$HOME/.local/bin/urwidgets-daemon" scan-photos "$TARGET" 2>/dev/null && exit 0; fi; ' +
                      'if command -v urwidgets-ctl >/dev/null 2>&1; then urwidgets-ctl scan-photos "$TARGET" 2>/dev/null && exit 0; fi; ' +
                      'if [ -f "$TARGET" ]; then echo "file://$TARGET"; ' +
                      'elif [ -d "$TARGET" ]; then ' +
                      'for f in "$TARGET"/* "$TARGET"/*/*; do ' +
                      '[ -f "$f" ] || continue; ' +
                      'case "$f" in *.jpg|*.JPG|*.jpeg|*.JPEG|*.png|*.PNG|*.webp|*.WEBP|*.svg|*.SVG) echo "file://$f" ;; esac; ' +
                      'done | sort | head -n 60; fi'
            connectSource(cmd)
        }
    }

    onPhotoDirChanged: {
        photoDirScanner.scanDirectory(photoRoot.photoDir)
    }

    Component.onCompleted: {
        if (photoRoot.photoDir && photoRoot.photoDir.trim().length > 0) {
            photoDirScanner.scanDirectory(photoRoot.photoDir)
        }
    }

    function advanceSlideSmoothly() {
        var list = photoRoot.activePhotos
        if (!list || list.length <= 1) return
        photoRoot.previousPhotoUrl = photoRoot.currentPhotoUrl
        crossfadeOverlayImage.opacity = 1.0
        photoRoot.currentIndex = (photoRoot.currentIndex + 1) % list.length
        fadeOutPrevAnim.restart()
    }

    Timer {
        interval: Math.max(5, photoRoot.intervalSecs) * 1000
        running: photoRoot.slideshowMode && photoRoot.visible
        repeat: true
        onTriggered: photoRoot.advanceSlideSmoothly()
    }

    Rectangle {
        id: maskRect
        anchors.fill: parent
        radius: theme.cornerRadius
        visible: false
    }

    // Pure clean rounded image display (Guaranteed visible primary layer + smooth crossfade overlay; no Crop/Slide/Next/Prev clutter)
    Item {
        anchors.fill: parent
        layer.enabled: true
        layer.effect: OpacityMask {
            maskSource: maskRect
        }

        Image {
            id: mainPhotoImage
            anchors.fill: parent
            fillMode: Image.PreserveAspectCrop
            source: photoRoot.currentPhotoUrl
            asynchronous: true
            cache: true
            smooth: true
            mipmap: false
            opacity: 1.0
            sourceSize: Qt.size(640, 640)
            onStatusChanged: {
                if (status === Image.Error && source.toString() !== photoRoot.embeddedFallbackSvg) {
                    source = photoRoot.embeddedFallbackSvg
                }
            }
        }

        Image {
            id: crossfadeOverlayImage
            anchors.fill: parent
            fillMode: Image.PreserveAspectCrop
            source: photoRoot.previousPhotoUrl
            visible: opacity > 0.01 && source.toString().length > 0
            asynchronous: true
            cache: true
            smooth: true
            mipmap: false
            opacity: 0.0
            sourceSize: Qt.size(640, 640)

            NumberAnimation on opacity {
                id: fadeOutPrevAnim
                from: 1.0
                to: 0.0
                duration: 550
                easing.type: Easing.InOutQuad
                running: false
            }
        }
    }

    // Consume 2-finger scroll / wheel gestures over Photo Frame so it never switches workspaces
    MouseArea {
        anchors.fill: parent
        acceptedButtons: Qt.NoButton
        hoverEnabled: false
        onWheel: function(wheel) {
            wheel.accepted = true
        }
    }
}
