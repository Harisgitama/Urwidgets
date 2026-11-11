import QtQuick 2.15
import QtQuick.Layouts 1.15

RowLayout {
    id: headerRoot
    property var themeObj
    property string title: ""
    property string rightLabel: ""
    Layout.fillWidth: true
    spacing: 6

    WidgetText {
        themeObj: headerRoot.themeObj
        text: headerRoot.title
        font.pixelSize: 14
        font.weight: Font.DemiBold
        Layout.fillWidth: true
        elide: Text.ElideRight
    }

    WidgetText {
        visible: headerRoot.rightLabel.length > 0
        themeObj: headerRoot.themeObj
        muted: true
        text: headerRoot.rightLabel
        font.pixelSize: 12
    }
}
