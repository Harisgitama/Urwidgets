import QtQuick 2.15
import QtGraphicalEffects 1.15

Item {
    id: bgRoot
    property var themeObj
    property string imagePath: plasmoid.configuration.customBgImage || ""
    property string fitMode: plasmoid.configuration.customBgFitMode || "cover"
    property string bgPosition: plasmoid.configuration.customBgPosition || "center"
    property string overlayMode: plasmoid.configuration.customBgOverlayMode || "auto"
    property real overlayOpacity: plasmoid.configuration.customBgOverlayOpacity !== undefined ? plasmoid.configuration.customBgOverlayOpacity : 0.35

    readonly property bool hasValidImage: {
        if (!imagePath || imagePath.trim().length === 0) return false
        var lower = imagePath.toLowerCase()
        return lower.endsWith(".svg") || lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png") || lower.endsWith(".webp")
    }

    visible: hasValidImage && bgImage.status !== Image.Error

    Rectangle {
        id: clipMask
        anchors.fill: parent
        radius: themeObj ? themeObj.cornerRadius : 24
        visible: false
    }

    Image {
        id: bgImage
        anchors.fill: parent
        source: bgRoot.hasValidImage ? (bgRoot.imagePath.indexOf("://") !== -1 ? bgRoot.imagePath : ("file://" + bgRoot.imagePath)) : ""
        asynchronous: true
        cache: true
        sourceSize: Qt.size(640, 640)
        horizontalAlignment: {
            if (bgRoot.bgPosition === "left") return Image.AlignLeft
            if (bgRoot.bgPosition === "right") return Image.AlignRight
            return Image.AlignHCenter
        }
        verticalAlignment: {
            if (bgRoot.bgPosition === "top") return Image.AlignTop
            if (bgRoot.bgPosition === "bottom") return Image.AlignBottom
            return Image.AlignVCenter
        }
        fillMode: {
            if (bgRoot.fitMode === "contain") return Image.PreserveAspectFit
            if (bgRoot.fitMode === "stretch") return Image.Stretch
            if (bgRoot.fitMode === "center") return Image.Pad
            return Image.PreserveAspectCrop
        }
        layer.enabled: true
        layer.effect: OpacityMask {
            maskSource: clipMask
        }
    }

    // Readability contrast overlay
    Rectangle {
        anchors.fill: parent
        radius: themeObj ? themeObj.cornerRadius : 24
        color: {
            var op = Math.min(0.85, Math.max(0.0, bgRoot.overlayOpacity))
            if (bgRoot.overlayMode === "light") return Qt.rgba(0.96, 0.95, 0.93, op)
            if (bgRoot.overlayMode === "dark") return Qt.rgba(0.05, 0.05, 0.07, op)
            return (themeObj && themeObj.isDark)
                ? Qt.rgba(0, 0, 0, op)
                : Qt.rgba(0.08, 0.08, 0.1, op)
        }
    }
}
