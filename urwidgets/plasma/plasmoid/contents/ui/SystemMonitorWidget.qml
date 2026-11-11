import QtQuick 2.15
import QtQuick.Layouts 1.15

ColumnLayout {
    id: sysRoot
    spacing: 8
    clip: true

    property real cpuPct: root.daemonSnapshot.system_monitor ? root.daemonSnapshot.system_monitor.cpu_usage_pct : 11.4
    property real memPct: root.daemonSnapshot.system_monitor ? root.daemonSnapshot.system_monitor.mem_usage_pct : 20.8
    property int batteryPct: root.daemonSnapshot.system_monitor && root.daemonSnapshot.system_monitor.battery_pct ? root.daemonSnapshot.system_monitor.battery_pct : 88

    Timer {
        interval: (plasmoid.configuration.sysmonIntervalSecs || 3) * 1000
        running: true
        repeat: true
        onTriggered: daemonExecutable.invokeMethod("GetSystemMetrics")
    }

    WidgetHeader {
        themeObj: theme
        title: "System"
        rightLabel: "Nominal"
    }

    ColumnLayout {
        Layout.fillWidth: true
        Layout.fillHeight: true
        spacing: 8

        Repeater {
            model: [
                { label: "Processor", val: Math.round(sysRoot.cpuPct) + "%", ratio: sysRoot.cpuPct / 100.0 },
                { label: "Memory", val: Math.round(sysRoot.memPct) + "%", ratio: sysRoot.memPct / 100.0 },
                { label: "Battery", val: sysRoot.batteryPct + "%", ratio: sysRoot.batteryPct / 100.0 }
            ]
            ColumnLayout {
                Layout.fillWidth: true
                spacing: 4

                RowLayout {
                    Layout.fillWidth: true
                    WidgetText {
                        themeObj: theme
                        muted: true
                        text: modelData.label
                        font.pixelSize: 11
                        Layout.fillWidth: true
                    }
                    WidgetText {
                        themeObj: theme
                        text: modelData.val
                        font.pixelSize: 11
                        font.weight: Font.DemiBold
                    }
                }

                Rectangle {
                    Layout.fillWidth: true
                    height: 5
                    radius: 2.5
                    color: theme.subtleSurfaceColor

                    Rectangle {
                        width: parent.width * Math.min(1.0, Math.max(0.04, modelData.ratio))
                        height: parent.height
                        radius: 2.5
                        color: theme.accentColor
                    }
                }
            }
        }
    }
}
