import QtQuick 2.15
import org.kde.plasma.core 2.0 as PlasmaCore

Item {
    id: iconWrapper
    property string iconName: "preferences-desktop-theme"
    property int iconSize: 18
    implicitWidth: iconSize
    implicitHeight: iconSize

    PlasmaCore.IconItem {
        anchors.fill: parent
        source: iconWrapper.iconName
    }
}
