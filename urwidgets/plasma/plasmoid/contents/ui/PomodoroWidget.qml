import QtQuick 2.15
import QtQuick.Layouts 1.15

ColumnLayout {
    id: pomoRoot
    spacing: 6

    property string phase: "FOCUS"
    property bool running: false
    property int studyMins: plasmoid.configuration.pomodoroStudyMins || 25
    property int shortBreakMins: plasmoid.configuration.pomodoroShortBreakMins || 5
    property int longBreakMins: plasmoid.configuration.pomodoroLongBreakMins || 15
    property int remainingSecs: studyMins * 60
    property int totalSecs: studyMins * 60
    property int completedSessions: 2

    function formatSecs(s) {
        var mins = Math.floor(s / 60)
        var secs = s % 60
        return (mins < 10 ? "0" + mins : mins) + ":" + (secs < 10 ? "0" + secs : secs)
    }

    function cyclePhase() {
        running = false
        if (phase === "FOCUS") {
            phase = "BREAK"
            totalSecs = shortBreakMins * 60
        } else if (phase === "BREAK") {
            phase = "LONG"
            totalSecs = longBreakMins * 60
        } else {
            phase = "FOCUS"
            totalSecs = studyMins * 60
        }
        remainingSecs = totalSecs
        ringCanvas.requestPaint()
    }

    Timer {
        interval: 1000
        running: pomoRoot.running
        repeat: true
        onTriggered: {
            if (pomoRoot.remainingSecs > 1) {
                pomoRoot.remainingSecs -= 1
            } else {
                pomoRoot.remainingSecs = 0
                pomoRoot.running = false
                if (pomoRoot.phase === "FOCUS") {
                    pomoRoot.completedSessions = (pomoRoot.completedSessions + 1) % 5
                }
            }
            ringCanvas.requestPaint()
        }
    }

    Item {
        Layout.fillWidth: true
        Layout.fillHeight: true

        // Ensure immediate Canvas repaint whenever theme accent, dark mode, or widget style changes (no resize required)
        Connections {
            target: theme
            function onAccentColorChanged() { ringCanvas.requestPaint() }
            function onIsDarkChanged() { ringCanvas.requestPaint() }
            function onWidgetStyleChanged() { ringCanvas.requestPaint() }
        }

        Canvas {
            id: ringCanvas
            anchors.centerIn: parent
            width: Math.min(parent.width, parent.height)
            height: width
            onPaint: {
                var ctx = getContext("2d")
                ctx.reset()
                var cx = width / 2
                var cy = height / 2
                var r = (width / 2) - 8
                ctx.lineWidth = 6
                ctx.lineCap = "round"

                ctx.beginPath()
                ctx.arc(cx, cy, r, 0, Math.PI * 2, false)
                ctx.strokeStyle = theme.isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"
                ctx.stroke()

                var progress = pomoRoot.totalSecs > 0 ? (pomoRoot.remainingSecs / pomoRoot.totalSecs) : 1.0
                var startAngle = -Math.PI / 2
                var endAngle = startAngle + (Math.PI * 2 * progress)
                ctx.beginPath()
                ctx.arc(cx, cy, r, startAngle, endAngle, false)
                ctx.strokeStyle = theme.accentColor.toString()
                ctx.stroke()
            }
        }

        ColumnLayout {
            anchors.centerIn: parent
            spacing: 2

            WidgetText {
                themeObj: theme
                muted: true
                text: pomoRoot.phase
                font.pixelSize: 9
                font.weight: Font.DemiBold
                font.letterSpacing: 1.2
                Layout.alignment: Qt.AlignHCenter
            }

            WidgetText {
                themeObj: theme
                text: pomoRoot.formatSecs(pomoRoot.remainingSecs)
                font.pixelSize: 24
                font.weight: Font.DemiBold
                Layout.alignment: Qt.AlignHCenter
            }

            Rectangle {
                width: 24
                height: 24
                radius: 12
                color: "transparent"
                Layout.alignment: Qt.AlignHCenter

                WidgetText {
                    anchors.centerIn: parent
                    themeObj: theme
                    color: theme.accentColor
                    text: pomoRoot.running ? "❚❚" : "▶"
                    font.pixelSize: 12
                }

                MouseArea {
                    anchors.fill: parent
                    hoverEnabled: false
                    cursorShape: Qt.PointingHandCursor
                    onClicked: {
                        pomoRoot.running = !pomoRoot.running
                        daemonExecutable.invokeMethod(pomoRoot.running ? "PomodoroAction start" : "PomodoroAction pause")
                    }
                }
            }
        }
    }

    RowLayout {
        Layout.fillWidth: true
        spacing: 6

        WidgetButton {
            themeObj: theme
            label: "↺"
            pill: true
            onClicked: {
                pomoRoot.running = false
                pomoRoot.remainingSecs = pomoRoot.totalSecs
                ringCanvas.requestPaint()
                daemonExecutable.invokeMethod("PomodoroAction reset")
            }
        }

        Item { Layout.fillWidth: true }

        RowLayout {
            spacing: 5
            Repeater {
                model: 4
                Rectangle {
                    width: 6
                    height: 6
                    radius: 3
                    color: index < pomoRoot.completedSessions
                        ? theme.accentColor
                        : (theme.isDark ? Qt.rgba(1, 1, 1, 0.22) : Qt.rgba(0, 0, 0, 0.16))
                }
            }
        }

        Item { Layout.fillWidth: true }

        WidgetButton {
            themeObj: theme
            label: "⏭"
            pill: true
            onClicked: pomoRoot.cyclePhase()
        }
    }
}
