import QtQuick 2.15

Rectangle {
    id: btnRoot
    property var themeObj
    property string label: ""
    property bool active: false
    property bool pill: false
    signal clicked()

    implicitWidth: Math.max(24, btnText.implicitWidth + 14)
    implicitHeight: 24
    radius: pill ? height / 2 : (themeObj ? themeObj.controlRadius : 10)
    color: {
        if (active) return themeObj ? themeObj.accentColor : "#E84A7F"
        if (mouseArea.pressed) {
            return themeObj && themeObj.isDark ? Qt.rgba(1, 1, 1, 0.16) : Qt.rgba(0, 0, 0, 0.10)
        }
        return themeObj ? themeObj.subtleSurfaceColor : Qt.rgba(0, 0, 0, 0.05)
    }

    Text {
        id: btnText
        anchors.centerIn: parent
        text: btnRoot.label
        font.family: btnRoot.themeObj ? btnRoot.themeObj.resolvedFontFamily : "Sans Serif"
        font.pixelSize: 11
        font.weight: btnRoot.active ? Font.DemiBold : Font.Medium
        color: btnRoot.active ? "#FFFFFF" : (btnRoot.themeObj ? btnRoot.themeObj.textColor : "#1D1D1F")
    }

    MouseArea {
        id: mouseArea
        anchors.fill: parent
        hoverEnabled: false
        cursorShape: Qt.PointingHandCursor
        onClicked: btnRoot.clicked()
    }
}
