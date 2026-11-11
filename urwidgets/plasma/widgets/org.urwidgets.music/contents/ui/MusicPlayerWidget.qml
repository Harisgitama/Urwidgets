import QtQuick 2.15
import QtQuick.Controls 2.15 as QQC2
import QtQuick.Layouts 1.15
import org.kde.plasma.core 2.0 as PlasmaCore

ColumnLayout {
    id: musicRoot
    spacing: 6
    clip: true

    property string sourceType: plasmoid.configuration.musicSourceType || "local"
    property string musicFolder: plasmoid.configuration.musicFolderPath || plasmoid.configuration.musicLocalFolder || "~/Music/"
    property string streamUrl: plasmoid.configuration.musicStreamUrl || "https://ice2.somafm.com/groovesalad-128-mp3"
    property bool isPlaying: false
    property bool isMuted: false
    property int currentIndex: 0
    property int positionSecs: 0
    property int durationSecs: 214
    property int volumePct: plasmoid.configuration.musicVolume !== undefined ? plasmoid.configuration.musicVolume : 80
    property bool shuffle: false
    property string repeatMode: "all"
    property string activeDrawer: "none" // "none" | "source" | "queue"
    property string statusMessage: ""

    ListModel {
        id: tracksModel
        ListElement {
            title: "Velvet Horizon"
            artist: "Klangwerk & Sol"
            album: "~/Music/"
            cover: "../images/photo_widget_architecture.jpg"
            url: "~/Music/"
            dur: 214
        }
        ListElement {
            title: "Warm Linen Rain"
            artist: "Harbor Ensemble"
            album: "~/Music/"
            cover: "../images/photo_widget_botanical.jpg"
            url: "/usr/share/sounds/freedesktop/stereo/complete.oga"
            dur: 188
        }
        ListElement {
            title: "Subtle Drift"
            artist: "Aura Nord"
            album: "~/Music/"
            cover: "../images/alpine_mist_wallpaper.jpg"
            url: "/usr/share/sounds/freedesktop/stereo/bell.oga"
            dur: 246
        }
    }

    // Non-Blocking Single-Instance Background Audio & Folder Scanner (Rust Native CLI + POSIX Shell Fallback — Zero Parenthesis Syntax Bugs)
    PlasmaCore.DataSource {
        id: musicAudioRunner
        engine: "executable"
        connectedSources: []
        onNewData: function(sourceName, data) {
            if (sourceName.indexOf("_mscan=") === 0 && data["stdout"]) {
                var lines = data["stdout"].trim().split("\n")
                var covers = [
                    Qt.resolvedUrl("../images/photo_widget_architecture.jpg").toString(),
                    Qt.resolvedUrl("../images/photo_widget_botanical.jpg").toString(),
                    Qt.resolvedUrl("../images/alpine_mist_wallpaper.jpg").toString()
                ]
                var validFiles = []
                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i].trim()
                    if (line.length > 1) validFiles.push(line)
                }
                if (validFiles.length > 0) {
                    tracksModel.clear()
                    for (var j = 0; j < validFiles.length; j++) {
                        var fp = validFiles[j]
                        var parts = fp.split("/")
                        var fn = parts[parts.length - 1] || ("Track " + (j + 1))
                        var cleanTitle = fn.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")
                        tracksModel.append({
                            title: cleanTitle,
                            artist: "Local Music Library",
                            album: musicRoot.musicFolder,
                            cover: covers[j % covers.length],
                            url: fp,
                            dur: 210
                        })
                    }
                    musicRoot.currentIndex = 0
                    musicRoot.statusMessage = "Loaded " + tracksModel.count + " tracks from " + musicRoot.musicFolder
                } else {
                    musicRoot.statusMessage = "Path set: " + musicRoot.musicFolder
                }
            }
            disconnectSource(sourceName)
        }
        function scanPath(rawPath) {
            var clean = (rawPath || "~/Music/").trim().replace(/^file:\/\//, "").replace(/"/g, "")
            var shPath = clean
            if (shPath.indexOf("~/") === 0) {
                shPath = "$HOME/" + shPath.substring(2)
            } else if (shPath === "~") {
                shPath = "$HOME"
            }
            var cmd = '_mscan=' + Date.now() + '; TARGET="' + shPath + '"; ' +
                      'if [ -x "$HOME/.local/bin/urwidgets-daemon" ]; then "$HOME/.local/bin/urwidgets-daemon" scan-music "$TARGET" 2>/dev/null && exit 0; fi; ' +
                      'if command -v urwidgets-ctl >/dev/null 2>&1; then urwidgets-ctl scan-music "$TARGET" 2>/dev/null && exit 0; fi; ' +
                      'if [ -f "$TARGET" ]; then echo "$TARGET"; ' +
                      'elif [ -d "$TARGET" ]; then ' +
                      'for f in "$TARGET"/* "$TARGET"/*/*; do ' +
                      '[ -f "$f" ] || continue; ' +
                      'case "$f" in *.mp3|*.MP3|*.flac|*.FLAC|*.ogg|*.OGG|*.oga|*.OGA|*.wav|*.WAV|*.m4a|*.M4A|*.aac|*.AAC|*.opus|*.OPUS) echo "$f" ;; esac; ' +
                      'done | sort | head -n 120; fi'
            connectSource(cmd)
        }
        function playUrl(rawTarget, volPct, muted) {
            var effVol = muted ? 0 : Math.max(0, Math.min(100, volPct))
            var clean = ((rawTarget && rawTarget.trim().length > 0) ? rawTarget.trim() : musicRoot.musicFolder).replace(/^file:\/\//, "").replace(/"/g, "")
            var shPath = clean
            if (shPath.indexOf("~/") === 0) {
                shPath = "$HOME/" + shPath.substring(2)
            } else if (shPath === "~") {
                shPath = "$HOME"
            }
            var cmd = '_mplay=' + Date.now() + '; TARGET="' + shPath + '"; VOL="' + effVol + '"; ' +
                      'if [ -x "$HOME/.local/bin/urwidgets-daemon" ]; then "$HOME/.local/bin/urwidgets-daemon" play-music "$TARGET" "$VOL" >/dev/null 2>&1 && exit 0; fi; ' +
                      'if command -v urwidgets-ctl >/dev/null 2>&1; then urwidgets-ctl play-music "$TARGET" "$VOL" >/dev/null 2>&1 && exit 0; fi; ' +
                      'if [ -f /tmp/urwidgets-music-audio.pid ]; then kill -TERM $(cat /tmp/urwidgets-music-audio.pid) 2>/dev/null || true; rm -f /tmp/urwidgets-music-audio.pid; fi; ' +
                      'case "$TARGET" in http://*|https://*) ;; *) ' +
                      'if [ -d "$TARGET" ]; then ' +
                      'FIRST_AUDIO=""; ' +
                      'for f in "$TARGET"/* "$TARGET"/*/*; do [ -f "$f" ] || continue; case "$f" in *.mp3|*.MP3|*.flac|*.FLAC|*.ogg|*.OGG|*.oga|*.OGA|*.wav|*.WAV|*.m4a|*.M4A|*.aac|*.AAC|*.opus|*.OPUS) FIRST_AUDIO="$f"; break ;; esac; done; ' +
                      'if [ -n "$FIRST_AUDIO" ]; then TARGET="$FIRST_AUDIO"; fi; ' +
                      'fi; ' +
                      'if [ ! -f "$TARGET" ]; then ' +
                      'for f in "$HOME/Music"/* "$HOME/Music"/*/*; do [ -f "$f" ] || continue; case "$f" in *.mp3|*.MP3|*.flac|*.FLAC|*.ogg|*.OGG|*.oga|*.OGA|*.wav|*.WAV|*.m4a|*.M4A|*.aac|*.AAC|*.opus|*.OPUS) TARGET="$f"; break ;; esac; done; ' +
                      'fi; ' +
                      'if [ ! -f "$TARGET" ]; then TARGET="/usr/share/sounds/freedesktop/stereo/complete.oga"; fi; ' +
                      'if [ ! -f "$TARGET" ]; then TARGET="/usr/share/sounds/alsa/Front_Center.wav"; fi ' +
                      ';; esac; ' +
                      'if command -v mpv >/dev/null 2>&1; then nohup mpv --no-video --really-quiet --volume="$VOL" "$TARGET" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-music-audio.pid; ' +
                      'elif command -v ffplay >/dev/null 2>&1; then nohup ffplay -nodisp -autoexit -loglevel quiet -volume "$VOL" "$TARGET" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-music-audio.pid; ' +
                      'elif command -v cvlc >/dev/null 2>&1; then nohup cvlc --intf dummy --play-and-exit --quiet "$TARGET" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-music-audio.pid; ' +
                      'elif command -v gst-play-1.0 >/dev/null 2>&1; then nohup gst-play-1.0 --quiet "$TARGET" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-music-audio.pid; ' +
                      'elif command -v pw-play >/dev/null 2>&1; then nohup pw-play "$TARGET" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-music-audio.pid; ' +
                      'elif command -v paplay >/dev/null 2>&1; then nohup paplay "$TARGET" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-music-audio.pid; ' +
                      'elif command -v aplay >/dev/null 2>&1; then nohup aplay -q "$TARGET" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-music-audio.pid; fi'
            connectSource(cmd)
        }
        function stopPlaybackProcess() {
            var cmd = '_mstop=' + Date.now() + '; ' +
                      'if [ -x "$HOME/.local/bin/urwidgets-daemon" ]; then "$HOME/.local/bin/urwidgets-daemon" stop-music >/dev/null 2>&1 || true; fi; ' +
                      'if [ -f /tmp/urwidgets-music-audio.pid ]; then kill -TERM $(cat /tmp/urwidgets-music-audio.pid) 2>/dev/null || true; rm -f /tmp/urwidgets-music-audio.pid; fi'
            connectSource(cmd)
        }
    }

    Component.onCompleted: {
        musicAudioRunner.scanPath(musicRoot.musicFolder)
    }

    Timer {
        interval: 1000
        running: musicRoot.isPlaying
        repeat: true
        onTriggered: {
            if (musicRoot.sourceType === "local") {
                if (musicRoot.positionSecs + 1 < musicRoot.durationSecs) {
                    musicRoot.positionSecs += 1
                } else if (musicRoot.repeatMode === "one") {
                    musicRoot.positionSecs = 0
                    musicRoot.loadAndPlayCurrent()
                } else {
                    musicRoot.nextTrack()
                }
            }
        }
    }

    function formatTime(secs) {
        var m = Math.floor(secs / 60)
        var s = secs % 60
        return m + ":" + (s < 10 ? "0" : "") + s
    }

    function loadAndPlayCurrent() {
        var targetRaw = ""
        if (sourceType === "stream") {
            targetRaw = streamUrl
            durationSecs = 0
            positionSecs = 0
        } else if (tracksModel.count > 0) {
            var tr = tracksModel.get(currentIndex % tracksModel.count)
            durationSecs = tr.dur || 200
            targetRaw = tr.url
        } else {
            targetRaw = musicRoot.musicFolder
        }
        if (isPlaying) {
            musicAudioRunner.playUrl(targetRaw, musicRoot.volumePct, musicRoot.isMuted)
        }
    }

    function prevTrack() {
        if (tracksModel.count > 0) {
            currentIndex = (currentIndex + tracksModel.count - 1) % tracksModel.count
            positionSecs = 0
            loadAndPlayCurrent()
        }
    }

    function nextTrack() {
        if (tracksModel.count > 0) {
            currentIndex = shuffle ? Math.floor(Math.random() * tracksModel.count) : ((currentIndex + 1) % tracksModel.count)
            positionSecs = 0
            loadAndPlayCurrent()
        }
    }

    function stopPlayback() {
        isPlaying = false
        positionSecs = 0
        musicAudioRunner.stopPlaybackProcess()
    }

    // Header Row: Track Info + Source & Queue Toggles
    RowLayout {
        Layout.fillWidth: true
        spacing: 10

        Rectangle {
            width: 48
            height: 48
            radius: 11
            clip: true
            color: theme.subtleSurfaceColor

            Image {
                anchors.fill: parent
                fillMode: Image.PreserveAspectCrop
                asynchronous: true
                cache: true
                sourceSize.width: 96
                sourceSize.height: 96
                source: tracksModel.count > 0 ? Qt.resolvedUrl(tracksModel.get(musicRoot.currentIndex % tracksModel.count).cover) : ""
            }
        }

        ColumnLayout {
            Layout.fillWidth: true
            spacing: 1

            WidgetText {
                themeObj: theme
                text: musicRoot.sourceType === "stream"
                    ? "Online Audio Stream"
                    : (tracksModel.count > 0 ? tracksModel.get(musicRoot.currentIndex % tracksModel.count).title : "No Track Selected")
                font.pixelSize: 13
                font.weight: Font.DemiBold
                elide: Text.ElideRight
                Layout.fillWidth: true
            }

            WidgetText {
                themeObj: theme
                muted: true
                text: musicRoot.sourceType === "stream"
                    ? musicRoot.streamUrl
                    : (tracksModel.count > 0 ? tracksModel.get(musicRoot.currentIndex % tracksModel.count).artist : "Type path e.g. ~/Music/")
                font.pixelSize: 11
                elide: Text.ElideRight
                Layout.fillWidth: true
            }

            WidgetText {
                themeObj: theme
                muted: true
                text: musicRoot.statusMessage.length > 0
                    ? musicRoot.statusMessage
                    : (musicRoot.sourceType === "local" ? (musicRoot.musicFolder || "~/Music/") : "Direct Stream Active")
                font.pixelSize: 9
                elide: Text.ElideRight
                Layout.fillWidth: true
            }
        }

        WidgetButton {
            themeObj: theme
            label: "Source"
            active: musicRoot.activeDrawer === "source"
            pill: true
            onClicked: musicRoot.activeDrawer = (musicRoot.activeDrawer === "source" ? "none" : "source")
        }

        WidgetButton {
            themeObj: theme
            label: "Queue (" + tracksModel.count + ")"
            active: musicRoot.activeDrawer === "queue"
            pill: true
            onClicked: musicRoot.activeDrawer = (musicRoot.activeDrawer === "queue" ? "none" : "queue")
        }
    }

    // Drawer 1: Source Selector (Plain Text Path Input e.g. ~/Music/ — No Folder Picker Dialog)
    ColumnLayout {
        visible: musicRoot.activeDrawer === "source"
        Layout.fillWidth: true
        spacing: 4

        RowLayout {
            Layout.fillWidth: true
            spacing: 4

            WidgetButton {
                themeObj: theme
                label: "Local Path"
                active: musicRoot.sourceType === "local"
                pill: true
                onClicked: {
                    musicRoot.sourceType = "local"
                    plasmoid.configuration.musicSourceType = "local"
                }
            }

            WidgetButton {
                themeObj: theme
                label: "Stream URL"
                active: musicRoot.sourceType === "stream"
                pill: true
                onClicked: {
                    musicRoot.sourceType = "stream"
                    plasmoid.configuration.musicSourceType = "stream"
                }
            }

            Item { Layout.fillWidth: true }

            WidgetButton {
                visible: musicRoot.sourceType === "local"
                themeObj: theme
                label: "Rescan"
                pill: true
                onClicked: {
                    musicAudioRunner.scanPath(localPathInput.text)
                }
            }
        }

        RowLayout {
            visible: musicRoot.sourceType === "local"
            Layout.fillWidth: true
            spacing: 4

            QQC2.TextField {
                id: localPathInput
                Layout.fillWidth: true
                placeholderText: "~/Music/ atau ~/Music/lagu.mp3"
                text: musicRoot.musicFolder
                font.pixelSize: 10
            }

            WidgetButton {
                themeObj: theme
                label: "Load"
                active: true
                pill: true
                onClicked: {
                    var entered = localPathInput.text.trim() || "~/Music/"
                    musicRoot.musicFolder = entered
                    musicRoot.sourceType = "local"
                    plasmoid.configuration.musicFolderPath = entered
                    plasmoid.configuration.musicLocalFolder = entered
                    plasmoid.configuration.musicSourceType = "local"
                    musicAudioRunner.scanPath(entered)
                }
            }
        }

        RowLayout {
            visible: musicRoot.sourceType === "stream"
            Layout.fillWidth: true
            spacing: 4

            QQC2.TextField {
                id: streamUrlInput
                Layout.fillWidth: true
                placeholderText: "https://ice2.somafm.com/groovesalad-128-mp3"
                text: musicRoot.streamUrl
                font.pixelSize: 10
            }

            WidgetButton {
                themeObj: theme
                label: "Connect"
                active: true
                pill: true
                onClicked: {
                    var candidate = streamUrlInput.text.trim()
                    if (candidate.indexOf("http://") === 0 || candidate.indexOf("https://") === 0) {
                        musicRoot.streamUrl = candidate
                        plasmoid.configuration.musicStreamUrl = candidate
                        musicRoot.statusMessage = "Connected stream"
                        musicRoot.isPlaying = true
                        musicRoot.loadAndPlayCurrent()
                    } else {
                        musicRoot.statusMessage = "Invalid URL (use http/https)"
                    }
                }
            }
        }
    }

    // Drawer 2: Playlist / Queue Management (Select Track, Remove)
    ColumnLayout {
        visible: musicRoot.activeDrawer === "queue"
        Layout.fillWidth: true
        spacing: 3

        Repeater {
            model: tracksModel
            Rectangle {
                Layout.fillWidth: true
                height: 22
                radius: 6
                color: index === musicRoot.currentIndex ? theme.subtleSurfaceColor : "transparent"

                RowLayout {
                    anchors.fill: parent
                    anchors.leftMargin: 6
                    anchors.rightMargin: 6
                    spacing: 6

                    WidgetText {
                        themeObj: theme
                        text: (index + 1) + ". " + model.title
                        font.pixelSize: 10
                        font.weight: index === musicRoot.currentIndex ? Font.DemiBold : Font.Normal
                        elide: Text.ElideRight
                        Layout.fillWidth: true
                    }

                    WidgetButton {
                        themeObj: theme
                        label: "Play"
                        pill: true
                        onClicked: {
                            musicRoot.currentIndex = index
                            musicRoot.positionSecs = 0
                            musicRoot.isPlaying = true
                            musicRoot.loadAndPlayCurrent()
                        }
                    }

                    WidgetButton {
                        themeObj: theme
                        label: "×"
                        pill: true
                        onClicked: {
                            tracksModel.remove(index)
                            if (musicRoot.currentIndex >= tracksModel.count) {
                                musicRoot.currentIndex = Math.max(0, tracksModel.count - 1)
                            }
                        }
                    }
                }
            }
        }
    }

    // Playback progress bar & Volume + Mute control
    ColumnLayout {
        visible: musicRoot.activeDrawer === "none"
        Layout.fillWidth: true
        spacing: 4

        Rectangle {
            Layout.fillWidth: true
            height: 5
            radius: 2.5
            color: theme.subtleSurfaceColor

            Rectangle {
                width: musicRoot.durationSecs > 0 ? parent.width * (musicRoot.positionSecs / musicRoot.durationSecs) : 0
                height: parent.height
                radius: 2.5
                color: theme.accentColor
            }

            MouseArea {
                anchors.fill: parent
                hoverEnabled: false
                cursorShape: Qt.PointingHandCursor
                onClicked: function(mouse) {
                    if (musicRoot.durationSecs > 0) {
                        var ratio = Math.max(0, Math.min(1, mouse.x / width))
                        musicRoot.positionSecs = Math.round(ratio * musicRoot.durationSecs)
                    }
                }
            }
        }

        RowLayout {
            Layout.fillWidth: true
            spacing: 6
            WidgetText {
                themeObj: theme
                muted: true
                text: musicRoot.formatTime(musicRoot.positionSecs)
                font.pixelSize: 10
            }
            Item { Layout.fillWidth: true }
            WidgetButton {
                themeObj: theme
                label: musicRoot.isMuted ? "🔇 Muted" : "🔊"
                active: musicRoot.isMuted
                pill: true
                onClicked: {
                    musicRoot.isMuted = !musicRoot.isMuted
                    if (musicRoot.isPlaying) {
                        musicRoot.loadAndPlayCurrent()
                    }
                }
            }
            WidgetButton {
                themeObj: theme
                label: "Vol " + musicRoot.volumePct + "%"
                pill: true
                onClicked: {
                    var nextV = (musicRoot.volumePct + 20)
                    if (nextV > 100) nextV = 20
                    musicRoot.isMuted = false
                    musicRoot.volumePct = nextV
                    plasmoid.configuration.musicVolume = nextV
                    if (musicRoot.isPlaying) {
                        musicRoot.loadAndPlayCurrent()
                    }
                }
            }
            Item { Layout.fillWidth: true }
            WidgetText {
                themeObj: theme
                muted: true
                text: musicRoot.sourceType === "stream" ? "LIVE" : musicRoot.formatTime(musicRoot.durationSecs)
                font.pixelSize: 10
            }
        }
    }

    // Bottom Transport Controls (Shuffle, Prev, Play/Pause, Stop, Next, Repeat)
    RowLayout {
        Layout.fillWidth: true
        spacing: 6

        WidgetButton {
            themeObj: theme
            label: "⇄"
            active: musicRoot.shuffle
            pill: true
            onClicked: {
                musicRoot.shuffle = !musicRoot.shuffle
            }
        }

        Item { Layout.fillWidth: true }

        WidgetButton {
            themeObj: theme
            label: "⏮"
            pill: true
            onClicked: musicRoot.prevTrack()
        }

        WidgetButton {
            themeObj: theme
            label: musicRoot.isPlaying ? "❚❚" : "▶"
            active: true
            pill: true
            onClicked: {
                musicRoot.isPlaying = !musicRoot.isPlaying
                if (musicRoot.isPlaying) {
                    musicRoot.loadAndPlayCurrent()
                } else {
                    musicAudioRunner.stopPlaybackProcess()
                }
            }
        }

        WidgetButton {
            themeObj: theme
            label: "■"
            pill: true
            onClicked: musicRoot.stopPlayback()
        }

        WidgetButton {
            themeObj: theme
            label: "⏭"
            pill: true
            onClicked: musicRoot.nextTrack()
        }

        Item { Layout.fillWidth: true }

        WidgetButton {
            themeObj: theme
            label: musicRoot.repeatMode === "one" ? "↻1" : "↻"
            active: musicRoot.repeatMode !== "off"
            pill: true
            onClicked: {
                musicRoot.repeatMode = musicRoot.repeatMode === "off" ? "all" : (musicRoot.repeatMode === "all" ? "one" : "off")
            }
        }
    }
}
