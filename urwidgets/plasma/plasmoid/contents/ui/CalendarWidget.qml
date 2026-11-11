import QtQuick 2.15
import QtQuick.Layouts 1.15

ColumnLayout {
    id: calendarRoot
    spacing: 8

    property int viewYear: (new Date()).getFullYear()
    property int viewMonth: (new Date()).getMonth()
    property int selectedDay: (new Date()).getDate()
    property string localeCode: plasmoid.configuration.calendarLocale || "en-US"
    property int firstDayOfWeek: plasmoid.configuration.calendarFirstDay !== undefined ? plasmoid.configuration.calendarFirstDay : 1

    readonly property var monthsEn: ["January","February","March","April","May","June","July","August","September","October","November","December"]
    readonly property var monthsId: ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"]
    readonly property var weekdaysMonEn: ["M","T","W","T","F","S","S"]
    readonly property var weekdaysSunEn: ["S","M","T","W","T","F","S"]
    readonly property var weekdaysMonId: ["Sen","Sel","Rab","Kam","Jum","Sab","Min"]
    readonly property var weekdaysSunId: ["Min","Sen","Sel","Rab","Kam","Jum","Sab"]

    readonly property var activeWeekdays: {
        var isId = localeCode.indexOf("id") === 0
        if (isId) return firstDayOfWeek === 1 ? weekdaysMonId : weekdaysSunId
        return firstDayOfWeek === 1 ? weekdaysMonEn : weekdaysSunEn
    }

    readonly property string activeMonthTitle: {
        var isId = localeCode.indexOf("id") === 0
        var mName = isId ? monthsId[viewMonth] : monthsEn[viewMonth]
        return mName + " " + viewYear
    }

    property var gridCells: []

    function rebuildCalendar() {
        var firstDate = new Date(viewYear, viewMonth, 1)
        var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
        var rawDow = firstDate.getDay()
        var leading = firstDayOfWeek === 1 ? ((rawDow + 6) % 7) : rawDow
        var now = new Date()
        var cells = []
        for (var i = 0; i < leading; i++) {
            cells.push({ day: 0, isToday: false, isSelected: false, hasEvent: false })
        }
        for (var d = 1; d <= daysInMonth; d++) {
            var isT = (viewYear === now.getFullYear() && viewMonth === now.getMonth() && d === now.getDate())
            cells.push({
                day: d,
                isToday: isT,
                isSelected: d === selectedDay,
                hasEvent: (d === 12 || d === 18 || d === 24)
            })
        }
        while (cells.length < 42) {
            cells.push({ day: 0, isToday: false, isSelected: false, hasEvent: false })
        }
        gridCells = cells
    }

    function navigateMonth(delta) {
        var nextM = viewMonth + delta
        var nextY = viewYear
        if (nextM < 0) { nextM = 11; nextY -= 1 }
        else if (nextM > 11) { nextM = 0; nextY += 1 }
        viewMonth = nextM
        viewYear = nextY
        rebuildCalendar()
    }

    function jumpToToday() {
        var now = new Date()
        viewYear = now.getFullYear()
        viewMonth = now.getMonth()
        selectedDay = now.getDate()
        rebuildCalendar()
    }

    // Immediate reactivity when global/per-widget theme or accent color changes
    Connections {
        target: theme
        function onAccentColorChanged() { calendarRoot.rebuildCalendar() }
        function onIsDarkChanged() { calendarRoot.rebuildCalendar() }
        function onWidgetStyleChanged() { calendarRoot.rebuildCalendar() }
    }

    Component.onCompleted: rebuildCalendar()

    RowLayout {
        Layout.fillWidth: true
        spacing: 4

        WidgetText {
            themeObj: theme
            text: calendarRoot.activeMonthTitle
            font.pixelSize: 15
            font.weight: Font.DemiBold
            Layout.fillWidth: true
            elide: Text.ElideRight
        }

        WidgetButton {
            themeObj: theme
            label: calendarRoot.firstDayOfWeek === 1 ? "Mon" : "Sun"
            pill: true
            onClicked: {
                calendarRoot.firstDayOfWeek = calendarRoot.firstDayOfWeek === 1 ? 0 : 1
                plasmoid.configuration.calendarFirstDay = calendarRoot.firstDayOfWeek
                calendarRoot.rebuildCalendar()
            }
        }

        WidgetButton {
            themeObj: theme
            label: calendarRoot.localeCode.indexOf("id") === 0 ? "ID" : "EN"
            pill: true
            onClicked: {
                calendarRoot.localeCode = calendarRoot.localeCode.indexOf("id") === 0 ? "en-US" : "id-ID"
                plasmoid.configuration.calendarLocale = calendarRoot.localeCode
                calendarRoot.rebuildCalendar()
            }
        }

        WidgetButton {
            themeObj: theme
            label: "Today"
            pill: true
            onClicked: calendarRoot.jumpToToday()
        }

        WidgetButton {
            themeObj: theme
            label: "‹"
            pill: true
            onClicked: calendarRoot.navigateMonth(-1)
        }

        WidgetButton {
            themeObj: theme
            label: "›"
            pill: true
            onClicked: calendarRoot.navigateMonth(1)
        }
    }

    GridLayout {
        columns: 7
        Layout.fillWidth: true
        Layout.fillHeight: true
        columnSpacing: 2
        rowSpacing: 2

        Repeater {
            model: calendarRoot.activeWeekdays
            WidgetText {
                themeObj: theme
                muted: true
                text: modelData
                font.pixelSize: 10
                font.weight: Font.DemiBold
                horizontalAlignment: Text.AlignHCenter
                Layout.fillWidth: true
            }
        }

        Repeater {
            model: calendarRoot.gridCells
            Item {
                Layout.fillWidth: true
                Layout.fillHeight: true

                Rectangle {
                    anchors.centerIn: parent
                    width: 24
                    height: 24
                    radius: 12
                    color: modelData.isToday
                        ? theme.accentColor
                        : (modelData.isSelected && modelData.day > 0 ? theme.subtleSurfaceColor : "transparent")
                    border.width: modelData.isSelected && !modelData.isToday && modelData.day > 0 ? 1 : 0
                    border.color: theme.accentColor

                    WidgetText {
                        anchors.centerIn: parent
                        themeObj: theme
                        text: modelData.day > 0 ? modelData.day : ""
                        color: modelData.isToday ? "#FFFFFF" : theme.textColor
                        font.pixelSize: 12
                        font.weight: (modelData.isToday || modelData.isSelected) ? Font.DemiBold : Font.Normal
                    }

                    Rectangle {
                        visible: modelData.hasEvent && !modelData.isToday && modelData.day > 0
                        width: 4
                        height: 4
                        radius: 2
                        color: theme.accentColor
                        anchors.horizontalCenter: parent.horizontalCenter
                        anchors.bottom: parent.bottom
                        anchors.bottomMargin: 1
                    }
                }

                MouseArea {
                    anchors.fill: parent
                    enabled: modelData.day > 0
                    cursorShape: modelData.day > 0 ? Qt.PointingHandCursor : Qt.ArrowCursor
                    onClicked: {
                        if (modelData.day > 0) {
                            calendarRoot.selectedDay = modelData.day
                            calendarRoot.rebuildCalendar()
                        }
                    }
                }
            }
        }
    }
}
