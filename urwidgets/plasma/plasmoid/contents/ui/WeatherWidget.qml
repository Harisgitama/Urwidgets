import QtQuick 2.15
import QtQuick.Layouts 1.15

ColumnLayout {
    id: weatherRoot
    spacing: 4

    property bool useCelsius: plasmoid.configuration.weatherCelsius !== undefined ? plasmoid.configuration.weatherCelsius : true
    property string locationName: plasmoid.configuration.weatherLocation || "Bandung"
    property real baseTempC: root.daemonSnapshot.weather ? root.daemonSnapshot.weather.temp_c : 29.0
    property string conditionText: root.daemonSnapshot.weather ? root.daemonSnapshot.weather.condition : "Mostly Clear"

    function formatDeg(c) {
        var val = useCelsius ? Math.round(c) : Math.round(c * 9 / 5 + 32)
        return val + "°"
    }

    RowLayout {
        Layout.fillWidth: true
        WidgetText {
            themeObj: theme
            text: weatherRoot.locationName
            font.pixelSize: 14
            font.weight: Font.DemiBold
            Layout.fillWidth: true
            elide: Text.ElideRight
        }
        WidgetButton {
            themeObj: theme
            label: weatherRoot.useCelsius ? "°C" : "°F"
            pill: true
            onClicked: {
                weatherRoot.useCelsius = !weatherRoot.useCelsius
                plasmoid.configuration.weatherCelsius = weatherRoot.useCelsius
            }
        }
    }

    WidgetText {
        themeObj: theme
        text: weatherRoot.formatDeg(weatherRoot.baseTempC)
        font.pixelSize: 42
        font.weight: Font.Light
        font.letterSpacing: -1.0
    }

    Rectangle {
        width: 18
        height: 18
        radius: 9
        color: "#F5A623"
        Layout.topMargin: 2
        Layout.bottomMargin: 2
    }

    Item { Layout.fillHeight: true }

    WidgetText {
        themeObj: theme
        text: weatherRoot.conditionText
        font.pixelSize: 12
        font.weight: Font.Medium
    }

    WidgetText {
        themeObj: theme
        muted: true
        text: "H:" + weatherRoot.formatDeg(29) + "  L:" + weatherRoot.formatDeg(18)
        font.pixelSize: 11
    }
}
