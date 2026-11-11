import QtQuick 2.15

Text {
    id: labelRoot
    property var themeObj
    property bool muted: false
    color: themeObj ? (muted ? themeObj.mutedTextColor : themeObj.textColor) : "#1D1D1F"
    font.family: themeObj ? themeObj.resolvedFontFamily : "Sans Serif"
    font.pixelSize: 13
    renderType: Text.NativeRendering
}
