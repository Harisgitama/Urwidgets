import QtQuick 2.15
import QtQuick.Layouts 1.15

ColumnLayout {
    id: qaRoot
    spacing: 8
    clip: true

    property int gridCols: plasmoid.configuration.quickActionsColumns || 2

    WidgetGrid {
        columns: qaRoot.gridCols
        rowSpacing: 8
        columnSpacing: 8

        Repeater {
            model: [
                { label: "Files", icon: "system-file-manager", cmd: "dolphin ~" },
                { label: "Terminal", icon: "utilities-terminal", cmd: "konsole" },
                { label: "Projects", icon: "folder-development", cmd: "xdg-open ~/Projects" },
                { label: "Settings", icon: "preferences-system", cmd: "systemsettings5" }
            ]
            Rectangle {
                Layout.fillWidth: true
                Layout.fillHeight: true
                Layout.minimumHeight: 42
                radius: 14
                color: cellMouse.pressed
                    ? (theme.isDark ? Qt.rgba(1, 1, 1, 0.16) : Qt.rgba(0, 0, 0, 0.10))
                    : theme.subtleSurfaceColor

                ColumnLayout {
                    anchors.centerIn: parent
                    spacing: 4

                    WidgetIcon {
                        iconName: modelData.icon
                        iconSize: 20
                        Layout.alignment: Qt.AlignHCenter
                    }

                    WidgetText {
                        themeObj: theme
                        text: modelData.label
                        font.pixelSize: 11
                        font.weight: Font.Medium
                        elide: Text.ElideRight
                        Layout.alignment: Qt.AlignHCenter
                    }
                }

                MouseArea {
                    id: cellMouse
                    anchors.fill: parent
                    hoverEnabled: false
                    cursorShape: Qt.PointingHandCursor
                    onClicked: daemonExecutable.connectSource(modelData.cmd)
                }
            }
        }
    }
}
