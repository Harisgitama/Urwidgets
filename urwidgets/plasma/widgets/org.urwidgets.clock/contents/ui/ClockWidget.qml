import QtQuick 2.15
import QtQuick.Controls 2.15 as QQC2
import QtQuick.Layouts 1.15
import org.kde.plasma.core 2.0 as PlasmaCore

Item {
    id: clockRoot
    property date currentTime: new Date()
    property bool use24h: plasmoid.configuration.use24HourClock || false
    property bool showSecs: plasmoid.configuration.showClockSeconds || false
    property string locationLabel: plasmoid.configuration.clockLocationLabel || "Bandung"
    // Slide 0 = Main Clock, Slide 1 = Alarm Manager (Manual navigation only; never auto-rotates)
    property int activeSlide: 0
    property bool composerOpen: false
    property string editingAlarmId: ""
    property int pickerHour: 7
    property int pickerMinute: 30
    property string pickerLabel: "Morning Study"
    property string pickerRepeat: "Every day"
    property string pickerOneTimeDate: ""
    property int pickerSnoozeMins: plasmoid.configuration.defaultSnoozeMins || 10
    // Unified Global Alarm Ringtone Path (applies to ALL alarms, e.g. ~/Music/ or ~/Music/alarm.mp3)
    property string globalRingtonePath: plasmoid.configuration.defaultRingtonePath || "~/Music/"
    property int pickerVolume: 90
    property bool previewingSound: false
    property string activeDueAlarmId: ""
    property string activeDueAlarmLabel: ""
    property string activeDueAlarmRingtone: ""
    property string lastTriggeredMinuteKey: ""

    // Single-Instance Non-Blocking PID-Tracked Audio Runner (Rust Native CLI + Parenthesis-Free POSIX Fallback)
    PlasmaCore.DataSource {
        id: localAudioRunner
        engine: "executable"
        connectedSources: []
        onNewData: function(sourceName, data) {
            disconnectSource(sourceName)
        }
        function playFile(pathStr, isAlarmDue) {
            var rawPath = (pathStr && pathStr.trim().length > 0)
                ? pathStr.trim()
                : (clockRoot.globalRingtonePath || "~/Music/")
            var clean = rawPath.replace(/^file:\/\//, "").replace(/"/g, "")
            clockRoot.previewingSound = true

            var safePath = clean
            if (safePath.indexOf("~/") === 0) {
                safePath = "$HOME/" + safePath.substring(2)
            } else if (safePath === "~") {
                safePath = "$HOME"
            }

            var loopFlag = isAlarmDue ? "1" : "0"
            var loopMpv = isAlarmDue ? "--loop-file=inf " : ""
            var loopFf = isAlarmDue ? "-loop 0 " : ""
            var loopVlc = isAlarmDue ? "--loop " : ""
            var cmd = '_ts=' + Date.now() + '; TARGET_FILE="' + safePath + '"; VOL="' + clockRoot.pickerVolume + '"; ' +
                      'if [ -x "$HOME/.local/bin/urwidgets-daemon" ]; then "$HOME/.local/bin/urwidgets-daemon" play-alarm "$TARGET_FILE" "$VOL" "' + loopFlag + '" >/dev/null 2>&1 && exit 0; fi; ' +
                      'if command -v urwidgets-ctl >/dev/null 2>&1; then urwidgets-ctl play-alarm "$TARGET_FILE" "$VOL" "' + loopFlag + '" >/dev/null 2>&1 && exit 0; fi; ' +
                      'if [ -f /tmp/urwidgets-alarm-audio.pid ]; then kill -TERM $(cat /tmp/urwidgets-alarm-audio.pid) 2>/dev/null || true; rm -f /tmp/urwidgets-alarm-audio.pid; fi; ' +
                      'if [ -d "$TARGET_FILE" ]; then ' +
                      'FIRST_IN_DIR=""; ' +
                      'for f in "$TARGET_FILE"/* "$TARGET_FILE"/*/*; do [ -f "$f" ] || continue; case "$f" in *.mp3|*.MP3|*.wav|*.WAV|*.ogg|*.OGG|*.oga|*.OGA|*.flac|*.FLAC|*.m4a|*.M4A|*.aac|*.AAC|*.opus|*.OPUS) FIRST_IN_DIR="$f"; break ;; esac; done; ' +
                      'if [ -n "$FIRST_IN_DIR" ]; then TARGET_FILE="$FIRST_IN_DIR"; fi; ' +
                      'fi; ' +
                      'if [ ! -f "$TARGET_FILE" ]; then ' +
                      'for f in "$HOME/Music"/* "$HOME/Music"/*/*; do [ -f "$f" ] || continue; case "$f" in *.mp3|*.MP3|*.wav|*.WAV|*.ogg|*.OGG|*.oga|*.OGA|*.flac|*.FLAC|*.m4a|*.M4A|*.aac|*.AAC|*.opus|*.OPUS) TARGET_FILE="$f"; break ;; esac; done; ' +
                      'fi; ' +
                      'if [ ! -f "$TARGET_FILE" ]; then TARGET_FILE="/usr/share/sounds/freedesktop/stereo/alarm-clock-elapsed.oga"; fi; ' +
                      'if [ ! -f "$TARGET_FILE" ]; then TARGET_FILE="/usr/share/sounds/freedesktop/stereo/complete.oga"; fi; ' +
                      'if [ ! -f "$TARGET_FILE" ]; then TARGET_FILE="/usr/share/sounds/alsa/Front_Center.wav"; fi; ' +
                      'if command -v mpv >/dev/null 2>&1; then nohup mpv --no-video --really-quiet ' + loopMpv + '--volume="$VOL" "$TARGET_FILE" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-alarm-audio.pid; ' +
                      'elif command -v ffplay >/dev/null 2>&1; then nohup ffplay -nodisp -autoexit -loglevel quiet ' + loopFf + '-volume "$VOL" "$TARGET_FILE" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-alarm-audio.pid; ' +
                      'elif command -v cvlc >/dev/null 2>&1; then nohup cvlc --intf dummy --play-and-exit --quiet ' + loopVlc + '"$TARGET_FILE" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-alarm-audio.pid; ' +
                      'elif command -v gst-play-1.0 >/dev/null 2>&1; then nohup gst-play-1.0 --quiet "$TARGET_FILE" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-alarm-audio.pid; ' +
                      'elif command -v pw-play >/dev/null 2>&1; then nohup pw-play "$TARGET_FILE" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-alarm-audio.pid; ' +
                      'elif command -v paplay >/dev/null 2>&1; then nohup paplay "$TARGET_FILE" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-alarm-audio.pid; ' +
                      'elif command -v aplay >/dev/null 2>&1; then nohup aplay -q "$TARGET_FILE" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-alarm-audio.pid; ' +
                      'elif command -v canberra-gtk-play >/dev/null 2>&1; then nohup canberra-gtk-play -f "$TARGET_FILE" >/dev/null 2>&1 </dev/null & echo $! > /tmp/urwidgets-alarm-audio.pid; fi'
            connectSource(cmd)
        }
        function notifyDesktop(titleStr, bodyStr) {
            var t = (titleStr || "URWidgets Alarm").replace(/"/g, "")
            var b = (bodyStr || "Alarm sedang berbunyi").replace(/"/g, "")
            connectSource('_notify=' + Date.now() + '; if command -v notify-send >/dev/null 2>&1; then nohup notify-send -u critical -a "URWidgets Alarm" "' + t + '" "' + b + '" >/dev/null 2>&1 </dev/null & fi')
        }
        function stopAll() {
            clockRoot.previewingSound = false
            var cmd = '_stop=' + Date.now() + '; ' +
                      'if [ -x "$HOME/.local/bin/urwidgets-daemon" ]; then "$HOME/.local/bin/urwidgets-daemon" stop-alarm >/dev/null 2>&1 || true; fi; ' +
                      'if [ -f /tmp/urwidgets-alarm-audio.pid ]; then kill -TERM $(cat /tmp/urwidgets-alarm-audio.pid) 2>/dev/null || true; rm -f /tmp/urwidgets-alarm-audio.pid; fi'
            connectSource(cmd)
        }
    }

    function applyGlobalRingtoneToAllAlarms(newRingtonePath) {
        var clean = (newRingtonePath && newRingtonePath.trim().length > 0) ? newRingtonePath.trim() : "~/Music/"
        clockRoot.globalRingtonePath = clean
        plasmoid.configuration.defaultRingtonePath = clean
        for (var i = 0; i < alarmsModel.count; i++) {
            alarmsModel.setProperty(i, "ringtonePath", clean)
        }
        clockRoot.saveAlarmsToConfig()
        daemonExecutable.invokeMethod("AlarmAction 'set_global_ringtone|" + clean + "'")
    }

    // Sync Unified Alarm Ringtone from Widget Configuration (configGeneral.qml)
    Connections {
        target: plasmoid.configuration
        function onDefaultRingtonePathChanged() {
            var newDefault = (plasmoid.configuration.defaultRingtonePath || "").trim()
            if (newDefault.length > 0 && newDefault !== clockRoot.globalRingtonePath) {
                clockRoot.globalRingtonePath = newDefault
                for (var i = 0; i < alarmsModel.count; i++) {
                    alarmsModel.setProperty(i, "ringtonePath", newDefault)
                }
                clockRoot.saveAlarmsToConfig()
            }
        }
    }

    ListModel {
        id: alarmsModel
        ListElement { alarmId: "alm-wake"; timeStr: "07:00"; label: "Wake Up"; repeatText: "Weekdays"; oneTimeDate: ""; snoozeMins: 10; ringtonePath: "~/Music/"; volume: 90; enabled: true }
        ListElement { alarmId: "alm-study"; timeStr: "08:00"; label: "Morning Study"; repeatText: "Every day"; oneTimeDate: ""; snoozeMins: 5; ringtonePath: "~/Music/"; volume: 85; enabled: true }
        ListElement { alarmId: "alm-lunch"; timeStr: "12:30"; label: "Lunch Reminder"; repeatText: "Mon, Wed, Fri"; oneTimeDate: ""; snoozeMins: 15; ringtonePath: "~/Music/"; volume: 80; enabled: false }
    }

    function normalizeHHMM(rawTime) {
        var parts = (rawTime || "07:00").toString().trim().split(":")
        var h = parseInt(parts[0] || "7", 10)
        var m = parseInt(parts[1] || "0", 10)
        if (isNaN(h)) h = 7
        if (isNaN(m)) m = 0
        h = Math.max(0, Math.min(23, h))
        m = Math.max(0, Math.min(59, m))
        return padTwo(h) + ":" + padTwo(m)
    }

    function saveAlarmsToConfig() {
        var arr = []
        var unifiedTone = clockRoot.globalRingtonePath || "~/Music/"
        for (var i = 0; i < alarmsModel.count; i++) {
            var it = alarmsModel.get(i)
            arr.push({
                alarmId: it.alarmId,
                timeStr: normalizeHHMM(it.timeStr),
                label: it.label,
                repeatText: it.repeatText,
                oneTimeDate: it.oneTimeDate || "",
                snoozeMins: it.snoozeMins,
                ringtonePath: unifiedTone,
                volume: it.volume || 90,
                enabled: it.enabled
            })
        }
        plasmoid.configuration.alarmsJson = JSON.stringify(arr)
    }

    function loadAlarmsFromConfig() {
        var raw = plasmoid.configuration.alarmsJson || ""
        var cfgDefaultRingtone = plasmoid.configuration.defaultRingtonePath || "~/Music/"
        clockRoot.globalRingtonePath = cfgDefaultRingtone
        if (raw.trim().length > 2) {
            try {
                var parsed = JSON.parse(raw)
                if (Array.isArray(parsed) && parsed.length > 0) {
                    alarmsModel.clear()
                    for (var i = 0; i < parsed.length; i++) {
                        var a = parsed[i]
                        alarmsModel.append({
                            alarmId: a.alarmId || ("alm-" + i),
                            timeStr: normalizeHHMM(a.timeStr || "07:00"),
                            label: a.label || "Alarm",
                            repeatText: a.repeatText || "Every day",
                            oneTimeDate: a.oneTimeDate || "",
                            snoozeMins: a.snoozeMins || 10,
                            ringtonePath: cfgDefaultRingtone,
                            volume: a.volume || 90,
                            enabled: a.enabled !== undefined ? a.enabled : true
                        })
                    }
                }
            } catch (e) {}
        }
    }

    Component.onCompleted: {
        loadAlarmsFromConfig()
    }

    readonly property int enabledAlarmCount: {
        var count = 0
        for (var i = 0; i < alarmsModel.count; i++) {
            if (alarmsModel.get(i).enabled) count++
        }
        return count
    }

    readonly property string nextEnabledAlarmTime: {
        for (var i = 0; i < alarmsModel.count; i++) {
            if (alarmsModel.get(i).enabled) return alarmsModel.get(i).timeStr
        }
        return ""
    }

    function padTwo(val) {
        return val < 10 ? ("0" + val) : ("" + val)
    }

    Timer {
        interval: clockRoot.showSecs ? 1000 : 5000
        running: true
        repeat: true
        triggeredOnStart: true
        onTriggered: {
            var now = new Date()
            clockRoot.currentTime = now
            var hhmm = clockRoot.padTwo(now.getHours()) + ":" + clockRoot.padTwo(now.getMinutes())
            var datePrefix = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + "@" + hhmm
            for (var i = 0; i < alarmsModel.count; i++) {
                var alm = alarmsModel.get(i)
                var targetHHMM = clockRoot.normalizeHHMM(alm.timeStr)
                var uniqueTriggerKey = alm.alarmId + "|" + datePrefix
                if (alm.enabled && targetHHMM === hhmm && clockRoot.lastTriggeredMinuteKey !== uniqueTriggerKey) {
                    clockRoot.lastTriggeredMinuteKey = uniqueTriggerKey
                    clockRoot.activeDueAlarmId = alm.alarmId
                    clockRoot.activeDueAlarmLabel = alm.label + " (" + targetHHMM + ")"
                    var chosenRingtone = clockRoot.globalRingtonePath || "~/Music/"
                    clockRoot.activeDueAlarmRingtone = chosenRingtone
                    localAudioRunner.playFile(chosenRingtone, true)
                    localAudioRunner.notifyDesktop("Alarm: " + alm.label, "Waktu: " + targetHHMM + " — Klik Snooze atau Stop di URWidgets Clock")
                    break
                }
            }
        }
    }

    // Due Alarm Notification Banner (Supports Snooze + Stop)
    Rectangle {
        id: dueBanner
        visible: clockRoot.activeDueAlarmId !== ""
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.right: parent.right
        height: visible ? 30 : 0
        radius: 9
        z: 10
        color: Qt.rgba(0.96, 0.62, 0.04, 0.24)
        border.width: 1
        border.color: Qt.rgba(0.96, 0.62, 0.04, 0.55)

        RowLayout {
            anchors.fill: parent
            anchors.leftMargin: 8
            anchors.rightMargin: 8
            spacing: 6

            WidgetText {
                themeObj: theme
                text: "🔔 " + clockRoot.activeDueAlarmLabel
                font.pixelSize: 11
                font.weight: Font.DemiBold
                Layout.fillWidth: true
                elide: Text.ElideRight
            }

            WidgetButton {
                themeObj: theme
                label: "Snooze " + clockRoot.pickerSnoozeMins + "m"
                pill: true
                onClicked: {
                    localAudioRunner.stopAll()
                    var snoozeDate = new Date(new Date().getTime() + clockRoot.pickerSnoozeMins * 60000)
                    var snoozedHHMM = clockRoot.padTwo(snoozeDate.getHours()) + ":" + clockRoot.padTwo(snoozeDate.getMinutes())
                    for (var i = 0; i < alarmsModel.count; i++) {
                        if (alarmsModel.get(i).alarmId === clockRoot.activeDueAlarmId) {
                            alarmsModel.setProperty(i, "timeStr", snoozedHHMM)
                            break
                        }
                    }
                    clockRoot.saveAlarmsToConfig()
                    daemonExecutable.invokeMethod("AlarmAction 'snooze|" + clockRoot.activeDueAlarmId + "|" + clockRoot.pickerSnoozeMins + "'")
                    clockRoot.activeDueAlarmId = ""
                }
            }

            WidgetButton {
                themeObj: theme
                label: "Stop"
                active: true
                pill: true
                onClicked: {
                    localAudioRunner.stopAll()
                    daemonExecutable.invokeMethod("AlarmAction 'stop|" + clockRoot.activeDueAlarmId + "'")
                    clockRoot.activeDueAlarmId = ""
                }
            }
        }
    }

    // ================= SLIDE 1: MAIN CLOCK DISPLAY =================
    ColumnLayout {
        visible: clockRoot.activeSlide === 0
        anchors.fill: parent
        anchors.topMargin: dueBanner.visible ? 34 : 0
        spacing: 4

        RowLayout {
            Layout.fillWidth: true
            spacing: 6

            Rectangle {
                height: 22
                radius: 11
                color: theme.subtleSurfaceColor
                implicitWidth: badgeRow.implicitWidth + 14

                RowLayout {
                    id: badgeRow
                    anchors.centerIn: parent
                    spacing: 5

                    Rectangle {
                        width: 6
                        height: 6
                        radius: 3
                        color: clockRoot.enabledAlarmCount > 0 ? theme.accentColor : theme.mutedTextColor
                    }

                    WidgetText {
                        themeObj: theme
                        text: clockRoot.enabledAlarmCount > 0
                            ? (clockRoot.nextEnabledAlarmTime + " · " + clockRoot.enabledAlarmCount)
                            : "No active alarms"
                        font.pixelSize: 11
                        font.weight: Font.Medium
                    }
                }

                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    onClicked: clockRoot.activeSlide = 1
                }
            }

            Item { Layout.fillWidth: true }

            WidgetButton {
                themeObj: theme
                label: clockRoot.use24h ? "24h" : "12h"
                pill: true
                onClicked: {
                    clockRoot.use24h = !clockRoot.use24h
                    plasmoid.configuration.use24HourClock = clockRoot.use24h
                }
            }

            WidgetButton {
                themeObj: theme
                label: "Alarms ›"
                active: true
                pill: true
                onClicked: clockRoot.activeSlide = 1
            }
        }

        RowLayout {
            Layout.fillWidth: true
            spacing: 6
            Layout.alignment: Qt.AlignLeft | Qt.AlignVCenter

            WidgetText {
                id: mainTimeText
                themeObj: theme
                text: {
                    var fmt = clockRoot.use24h
                        ? (clockRoot.showSecs ? "HH:mm:ss" : "HH:mm")
                        : (clockRoot.showSecs ? "h:mm:ss" : "h:mm")
                    return Qt.formatTime(clockRoot.currentTime, fmt)
                }
                font.pixelSize: Math.min(52, Math.max(34, clockRoot.height * 0.36))
                font.weight: Font.Light
            }

            WidgetText {
                visible: !clockRoot.use24h
                themeObj: theme
                text: clockRoot.currentTime.getHours() >= 12 ? "PM" : "AM"
                color: theme.accentColor
                font.pixelSize: 18
                font.weight: Font.DemiBold
                Layout.alignment: Qt.AlignTop
                Layout.topMargin: 8
            }
        }

        RowLayout {
            Layout.fillWidth: true
            spacing: 5

            Rectangle {
                width: 7
                height: 7
                radius: 3.5
                color: theme.accentColor
            }

            WidgetText {
                themeObj: theme
                muted: true
                text: Qt.formatDate(clockRoot.currentTime, "ddd, MMM d") + ","
                font.pixelSize: 13
            }

            WidgetText {
                themeObj: theme
                text: clockRoot.locationLabel
                font.pixelSize: 13
                font.weight: Font.DemiBold
                elide: Text.ElideRight
                Layout.fillWidth: true
            }

            WidgetText {
                themeObj: theme
                muted: true
                text: "1 / 2"
                font.pixelSize: 10
            }
        }
    }

    // ================= SLIDE 2: ALARM MANAGER (UNIFIED RINGTONE PATH e.g. ~/Music/ FOR ALL ALARMS) =================
    ColumnLayout {
        visible: clockRoot.activeSlide === 1
        anchors.fill: parent
        anchors.topMargin: dueBanner.visible ? 34 : 0
        spacing: 4

        RowLayout {
            Layout.fillWidth: true
            spacing: 6

            WidgetButton {
                themeObj: theme
                label: "‹ Clock"
                pill: true
                onClicked: {
                    clockRoot.composerOpen = false
                    localAudioRunner.stopAll()
                    clockRoot.activeSlide = 0
                }
            }

            WidgetText {
                themeObj: theme
                text: "Alarms (" + clockRoot.enabledAlarmCount + ")"
                font.pixelSize: 12
                font.weight: Font.DemiBold
                Layout.fillWidth: true
                elide: Text.ElideRight
            }

            WidgetButton {
                themeObj: theme
                label: "Ring Test"
                pill: true
                onClicked: {
                    if (alarmsModel.count > 0) {
                        var targetAlm = alarmsModel.get(0)
                        clockRoot.activeDueAlarmId = targetAlm.alarmId
                        clockRoot.activeDueAlarmLabel = targetAlm.label + " (" + targetAlm.timeStr + ")"
                        clockRoot.activeDueAlarmRingtone = clockRoot.globalRingtonePath
                        localAudioRunner.playFile(clockRoot.globalRingtonePath, true)
                    }
                }
            }

            WidgetButton {
                themeObj: theme
                label: clockRoot.composerOpen ? "Close" : "+ Alarm"
                active: true
                pill: true
                onClicked: {
                    if (!clockRoot.composerOpen) {
                        clockRoot.editingAlarmId = ""
                        var now = new Date()
                        clockRoot.pickerHour = now.getHours()
                        clockRoot.pickerMinute = (now.getMinutes() + 1) % 60
                        clockRoot.pickerLabel = "Alarm Baru"
                    }
                    clockRoot.composerOpen = !clockRoot.composerOpen
                }
            }
        }

        // Unified Alarm Ringtone Bar (Applies to ALL Alarms — Plain Text Input e.g. ~/Music/)
        RowLayout {
            Layout.fillWidth: true
            spacing: 4

            WidgetText {
                themeObj: theme
                muted: true
                text: "♪ Nada:"
                font.pixelSize: 10
            }

            QQC2.TextField {
                id: unifiedRingtoneField
                Layout.fillWidth: true
                placeholderText: "~/Music/ atau ~/Music/alarm.mp3"
                text: clockRoot.globalRingtonePath
                font.pixelSize: 10
            }

            WidgetButton {
                themeObj: theme
                label: "Set"
                active: true
                pill: true
                onClicked: {
                    clockRoot.applyGlobalRingtoneToAllAlarms(unifiedRingtoneField.text)
                }
            }

            WidgetButton {
                themeObj: theme
                label: clockRoot.previewingSound ? "■ Stop" : "▶ Test"
                pill: true
                onClicked: {
                    if (clockRoot.previewingSound) {
                        localAudioRunner.stopAll()
                    } else {
                        clockRoot.applyGlobalRingtoneToAllAlarms(unifiedRingtoneField.text)
                        localAudioRunner.playFile(clockRoot.globalRingtonePath, false)
                    }
                }
            }
        }

        // Dedicated Alarm Composer (Time + Label + Repeat + Snooze)
        Rectangle {
            visible: clockRoot.composerOpen
            Layout.fillWidth: true
            Layout.fillHeight: true
            radius: 12
            color: theme.subtleSurfaceColor

            ColumnLayout {
                anchors.fill: parent
                anchors.margins: 7
                spacing: 4

                RowLayout {
                    Layout.fillWidth: true
                    spacing: 4

                    WidgetButton {
                        themeObj: theme
                        label: "-H"
                        onClicked: clockRoot.pickerHour = (clockRoot.pickerHour + 23) % 24
                    }
                    WidgetText {
                        themeObj: theme
                        text: clockRoot.padTwo(clockRoot.pickerHour) + ":" + clockRoot.padTwo(clockRoot.pickerMinute)
                        font.pixelSize: 15
                        font.weight: Font.Bold
                    }
                    WidgetButton {
                        themeObj: theme
                        label: "+H"
                        onClicked: clockRoot.pickerHour = (clockRoot.pickerHour + 1) % 24
                    }
                    WidgetButton {
                        themeObj: theme
                        label: "-M"
                        onClicked: clockRoot.pickerMinute = (clockRoot.pickerMinute + 59) % 60
                    }
                    WidgetButton {
                        themeObj: theme
                        label: "+M"
                        onClicked: clockRoot.pickerMinute = (clockRoot.pickerMinute + 1) % 60
                    }

                    QQC2.TextField {
                        id: alarmLabelInput
                        Layout.fillWidth: true
                        placeholderText: "Label alarm..."
                        text: clockRoot.pickerLabel
                        font.pixelSize: 11
                        onTextChanged: clockRoot.pickerLabel = text
                    }
                }

                // Repeat & Snooze Row
                RowLayout {
                    Layout.fillWidth: true
                    spacing: 4

                    Repeater {
                        model: ["Every day", "Weekdays", "Weekends", "Once"]
                        WidgetButton {
                            themeObj: theme
                            label: modelData
                            active: clockRoot.pickerRepeat === modelData
                            pill: true
                            onClicked: clockRoot.pickerRepeat = modelData
                        }
                    }

                    Item { Layout.fillWidth: true }

                    WidgetButton {
                        themeObj: theme
                        label: "Snooze " + clockRoot.pickerSnoozeMins + "m"
                        pill: true
                        onClicked: {
                            var opts = [5, 10, 15, 20, 30]
                            var idx = opts.indexOf(clockRoot.pickerSnoozeMins)
                            clockRoot.pickerSnoozeMins = opts[(idx + 1) % opts.length]
                        }
                    }
                }

                // Cancel / Confirm & Save Action Row
                RowLayout {
                    Layout.fillWidth: true
                    spacing: 6

                    WidgetText {
                        themeObj: theme
                        muted: true
                        text: "♪ " + clockRoot.globalRingtonePath
                        font.pixelSize: 10
                        elide: Text.ElideMiddle
                        Layout.fillWidth: true
                    }

                    WidgetButton {
                        themeObj: theme
                        label: "Batal"
                        pill: true
                        onClicked: {
                            localAudioRunner.stopAll()
                            clockRoot.composerOpen = false
                            clockRoot.editingAlarmId = ""
                        }
                    }

                    WidgetButton {
                        themeObj: theme
                        label: "Simpan Alarm"
                        active: true
                        pill: true
                        onClicked: {
                            var formattedTime = clockRoot.padTwo(clockRoot.pickerHour) + ":" + clockRoot.padTwo(clockRoot.pickerMinute)
                            var targetId = clockRoot.editingAlarmId !== "" ? clockRoot.editingAlarmId : ("alm-" + Date.now())
                            var cleanLabel = (clockRoot.pickerLabel || "Alarm").trim()
                            var cleanRingtone = (clockRoot.globalRingtonePath || "~/Music/").trim()
                            var updatedExisting = false
                            for (var i = 0; i < alarmsModel.count; i++) {
                                if (alarmsModel.get(i).alarmId === targetId) {
                                    alarmsModel.set(i, {
                                        alarmId: targetId,
                                        timeStr: formattedTime,
                                        label: cleanLabel,
                                        repeatText: clockRoot.pickerRepeat,
                                        oneTimeDate: clockRoot.pickerOneTimeDate,
                                        snoozeMins: clockRoot.pickerSnoozeMins,
                                        ringtonePath: cleanRingtone,
                                        volume: clockRoot.pickerVolume,
                                        enabled: true
                                    })
                                    updatedExisting = true
                                    break
                                }
                            }
                            if (!updatedExisting) {
                                alarmsModel.append({
                                    alarmId: targetId,
                                    timeStr: formattedTime,
                                    label: cleanLabel,
                                    repeatText: clockRoot.pickerRepeat,
                                    oneTimeDate: clockRoot.pickerOneTimeDate,
                                    snoozeMins: clockRoot.pickerSnoozeMins,
                                    ringtonePath: cleanRingtone,
                                    volume: clockRoot.pickerVolume,
                                    enabled: true
                                })
                            }
                            clockRoot.lastTriggeredMinuteKey = ""
                            clockRoot.saveAlarmsToConfig()
                            daemonExecutable.invokeMethod(
                                "AlarmAction 'upsert|" + targetId + "|" + formattedTime + "|" +
                                cleanLabel + "|" + clockRoot.pickerRepeat + "|" +
                                clockRoot.pickerSnoozeMins + "|" + cleanRingtone + "|" + clockRoot.pickerVolume + "'"
                            )
                            localAudioRunner.stopAll()
                            clockRoot.composerOpen = false
                            clockRoot.editingAlarmId = ""
                        }
                    }
                }
            }
        }

        // Scrollable Alarm List (When Composer is Closed)
        ListView {
            id: alarmsListView
            visible: !clockRoot.composerOpen
            Layout.fillWidth: true
            Layout.fillHeight: true
            clip: true
            boundsBehavior: Flickable.StopAtBounds
            spacing: 4
            model: alarmsModel

            delegate: Rectangle {
                width: alarmsListView.width
                height: 36
                radius: 9
                color: theme.subtleSurfaceColor

                RowLayout {
                    anchors.fill: parent
                    anchors.leftMargin: 8
                    anchors.rightMargin: 8
                    spacing: 5

                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 1

                        RowLayout {
                            spacing: 5
                            WidgetText {
                                themeObj: theme
                                text: model.timeStr
                                font.pixelSize: 13
                                font.weight: Font.DemiBold
                                opacity: model.enabled ? 1.0 : 0.45
                            }
                            WidgetText {
                                themeObj: theme
                                text: "— " + model.label
                                font.pixelSize: 11
                                opacity: model.enabled ? 0.9 : 0.45
                                elide: Text.ElideRight
                                Layout.fillWidth: true
                            }
                        }

                        WidgetText {
                            themeObj: theme
                            muted: true
                            text: model.repeatText + " · Snooze " + model.snoozeMins + "m · ♪ " + clockRoot.globalRingtonePath
                            font.pixelSize: 9
                            elide: Text.ElideRight
                            Layout.fillWidth: true
                        }
                    }

                    WidgetButton {
                        themeObj: theme
                        label: "Edit"
                        pill: true
                        onClicked: {
                            clockRoot.editingAlarmId = model.alarmId
                            var hm = (model.timeStr || "07:30").split(":")
                            clockRoot.pickerHour = parseInt(hm[0] || "7", 10)
                            clockRoot.pickerMinute = parseInt(hm[1] || "30", 10)
                            clockRoot.pickerLabel = model.label
                            clockRoot.pickerRepeat = model.repeatText
                            clockRoot.pickerSnoozeMins = model.snoozeMins
                            clockRoot.composerOpen = true
                        }
                    }

                    WidgetButton {
                        themeObj: theme
                        label: "×"
                        pill: true
                        onClicked: {
                            var delId = model.alarmId
                            alarmsModel.remove(index)
                            clockRoot.saveAlarmsToConfig()
                            daemonExecutable.invokeMethod("AlarmAction 'delete|" + delId + "'")
                        }
                    }

                    WidgetButton {
                        themeObj: theme
                        label: model.enabled ? "ON" : "OFF"
                        active: model.enabled
                        pill: true
                        onClicked: {
                            alarmsModel.setProperty(index, "enabled", !model.enabled)
                            clockRoot.lastTriggeredMinuteKey = ""
                            clockRoot.saveAlarmsToConfig()
                            daemonExecutable.invokeMethod("AlarmAction 'toggle|" + model.alarmId + "'")
                        }
                    }
                }
            }
        }
    }
}
