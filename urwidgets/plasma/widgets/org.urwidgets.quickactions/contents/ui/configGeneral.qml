import QtQuick 2.15
import QtQuick.Controls 2.15 as QQC2
import QtQuick.Layouts 1.15
import QtQuick.Dialogs 1.3
import org.kde.plasma.core 2.0 as PlasmaCore

Item {
    id: configPage
    width: childrenRect.width
    height: childrenRect.height

    // Writable cfg_* properties (Qt 5.15 compatible — avoids read-only ComboBox.currentValue alias errors)
    property string cfg_widgetKind: "clock"
    property string cfg_appearanceMode: "light"
    property string cfg_widgetStyle: "default"
    property string cfg_accentColorId: "pink"
    property string cfg_customAccentHex: "#FF5A79"
    property string cfg_themePreset: "warm-minimal"
    property alias cfg_elevationLevel: elevationSpin.value
    property alias cfg_surfaceOpacity: opacitySlider.value
    property alias cfg_backgroundColorOverride: bgColorField.text
    property alias cfg_gradientEnabled: gradientCheck.checked
    property alias cfg_cornerRadius: radiusSpin.value
    property alias cfg_borderOpacity: borderOpacitySlider.value
    property alias cfg_textColorOverride: textColorField.text
    property string cfg_iconStyle: "filled"
    property string cfg_preferredFontFamily: "auto"
    property alias cfg_customBgImage: bgImageField.text
    property string cfg_customBgFitMode: "cover"
    property string cfg_customBgPosition: "center"
    property string cfg_customBgOverlayMode: "auto"
    property alias cfg_customBgOverlayOpacity: bgOverlaySlider.value
    property string cfg_customBgTextContrast: "auto"
    property alias cfg_use24HourClock: clock24Check.checked
    property alias cfg_showClockSeconds: clockSecCheck.checked
    property alias cfg_clockLocationLabel: clockLocField.text
    property alias cfg_defaultSnoozeMins: snoozeSpin.value
    property alias cfg_defaultRingtonePath: defaultRingtoneField.text
    property string cfg_calendarLocale: "en-US"
    property alias cfg_weatherLocation: weatherLocField.text
    property alias cfg_weatherCelsius: weatherCelsiusCheck.checked
    property alias cfg_photoDirectory: photoDirField.text
    property alias cfg_photoSlideshowMode: photoSlideshowCheck.checked
    property alias cfg_photoIntervalSecs: photoIntervalSpin.value
    property string cfg_musicSourceType: "local"
    property alias cfg_musicFolderPath: musicFolderField.text
    property alias cfg_musicStreamUrl: musicStreamField.text
    property alias cfg_quickActionsColumns: qaColsSpin.value

    property bool pageReady: false

    PlasmaCore.DataSource {
        id: globalThemeBroadcastSource
        engine: "executable"
        connectedSources: []
        onNewData: function(sourceName, data) {
            disconnectSource(sourceName)
        }
    }

    Timer {
        id: broadcastDebounceTimer
        interval: 450
        repeat: false
        onTriggered: {
            var payload = JSON.stringify({
                appearanceMode: configPage.cfg_appearanceMode || "light",
                widgetStyle: configPage.cfg_widgetStyle || "default",
                accentColorId: configPage.cfg_accentColorId || "pink",
                customAccentHex: configPage.cfg_customAccentHex || "#FF5A79",
                themePreset: configPage.cfg_themePreset || "warm-minimal",
                updatedAt: Date.now()
            })
            var safeJson = payload.replace(/'/g, "")
            globalThemeBroadcastSource.connectSource("_write=" + Date.now() + "; mkdir -p ~/.config/urwidgets && printf '%s' '" + safeJson + "' > ~/.config/urwidgets/global_theme.json")
        }
    }

    function broadcastGlobalTheme() {
        if (!configPage.pageReady) return
        broadcastDebounceTimer.restart()
    }

    Component.onCompleted: {
        configPage.pageReady = true
    }

    onCfg_appearanceModeChanged: {
        var idx = appearanceCombo.indexOfValue(cfg_appearanceMode)
        if (idx >= 0 && appearanceCombo.currentIndex !== idx) appearanceCombo.currentIndex = idx
        broadcastGlobalTheme()
    }
    onCfg_widgetStyleChanged: {
        var idx = widgetStyleCombo.indexOfValue(cfg_widgetStyle)
        if (idx >= 0 && widgetStyleCombo.currentIndex !== idx) widgetStyleCombo.currentIndex = idx
        broadcastGlobalTheme()
    }
    onCfg_accentColorIdChanged: {
        var idx = accentColorCombo.indexOfValue(cfg_accentColorId)
        if (idx >= 0 && accentColorCombo.currentIndex !== idx) accentColorCombo.currentIndex = idx
        broadcastGlobalTheme()
    }
    onCfg_customAccentHexChanged: {
        if (customAccentHexField.text !== cfg_customAccentHex) {
            customAccentHexField.text = cfg_customAccentHex
        }
        broadcastGlobalTheme()
    }
    onCfg_themePresetChanged: {
        var idx = themePresetCombo.indexOfValue(cfg_themePreset)
        if (idx >= 0 && themePresetCombo.currentIndex !== idx) themePresetCombo.currentIndex = idx
        broadcastGlobalTheme()
    }

    ColorDialog {
        id: customHexColorDialog
        title: i18n("Select Custom Global Accent Color")
        onAccepted: {
            var hexStr = customHexColorDialog.color.toString().toUpperCase()
            configPage.cfg_customAccentHex = hexStr
            customAccentHexField.text = hexStr
            configPage.cfg_accentColorId = "custom"
        }
    }

    FileDialog {
        id: bgImageDialog
        title: i18n("Select Widget Background Image")
        nameFilters: ["Images (*.svg *.jpg *.jpeg *.png *.webp)"]
        onAccepted: {
            var p = decodeURIComponent(bgImageDialog.fileUrl.toString().replace(/^file:\/\//, ""))
            bgImageField.text = p
        }
    }

    ColumnLayout {
        spacing: 14
        width: 540

        QQC2.GroupBox {
            title: i18n("1. Global Theme & Style (Applies Across All URWidgets)")
            Layout.fillWidth: true
            GridLayout {
                columns: 2
                anchors.fill: parent
                rowSpacing: 8
                columnSpacing: 10

                QQC2.Label { text: i18n("Global Appearance Mode:") }
                QQC2.ComboBox {
                    id: appearanceCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "Light (Warm WidgetWall)", value: "light" },
                        { text: "Dark (Frosted Charcoal)", value: "dark" },
                        { text: "Auto (Follow Time/Preset)", value: "auto" }
                    ]
                    Component.onCompleted: currentIndex = Math.max(0, indexOfValue(configPage.cfg_appearanceMode))
                    onActivated: configPage.cfg_appearanceMode = currentValue
                }

                QQC2.Label { text: i18n("Global Surface Style:") }
                QQC2.ComboBox {
                    id: widgetStyleCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "Default (Soft Translucent)", value: "default" },
                        { text: "Dark (Deep Frosted)", value: "dark" },
                        { text: "Clear (High-Transparency Glass)", value: "clear" },
                        { text: "Tinted (Accent-Tinted Surface)", value: "tinted" },
                        { text: "Solid (Opaque High Contrast)", value: "solid" }
                    ]
                    Component.onCompleted: currentIndex = Math.max(0, indexOfValue(configPage.cfg_widgetStyle))
                    onActivated: configPage.cfg_widgetStyle = currentValue
                }

                QQC2.Label { text: i18n("Global Accent Color:") }
                QQC2.ComboBox {
                    id: accentColorCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "Pink (#E84A7F)", value: "pink" },
                        { text: "Blue (#007AFF)", value: "blue" },
                        { text: "Purple (#9B51E0)", value: "purple" },
                        { text: "Red (#E03E36)", value: "red" },
                        { text: "Orange (#F28C28)", value: "orange" },
                        { text: "Yellow (#E6B800)", value: "yellow" },
                        { text: "Green (#2E9E5B)", value: "green" },
                        { text: "Graphite (#6E6E73)", value: "graphite" },
                        { text: "Automatic", value: "auto" },
                        { text: "Custom Hex Color (#RRGGBB)", value: "custom" }
                    ]
                    Component.onCompleted: currentIndex = Math.max(0, indexOfValue(configPage.cfg_accentColorId))
                    onActivated: configPage.cfg_accentColorId = currentValue
                }

                QQC2.Label { text: i18n("Custom Accent Hex (#RRGGBB):") }
                RowLayout {
                    Layout.fillWidth: true
                    spacing: 6

                    Rectangle {
                        width: 24
                        height: 24
                        radius: 6
                        color: {
                            var h = customAccentHexField.text.trim()
                            return (/^#[0-9A-Fa-f]{6}$/.test(h) || /^#[0-9A-Fa-f]{3}$/.test(h)) ? h : "#FF5A79"
                        }
                        border.width: 1
                        border.color: Qt.rgba(0, 0, 0, 0.25)
                    }

                    QQC2.TextField {
                        id: customAccentHexField
                        placeholderText: i18n("#FF5A79")
                        text: configPage.cfg_customAccentHex
                        Layout.fillWidth: true
                        onTextEdited: {
                            var val = text.trim()
                            if (val.length > 0 && val.indexOf("#") !== 0) {
                                val = "#" + val
                            }
                            configPage.cfg_customAccentHex = val
                            if (/^#[0-9A-Fa-f]{6}$/.test(val) || /^#[0-9A-Fa-f]{3}$/.test(val)) {
                                configPage.cfg_accentColorId = "custom"
                            }
                        }
                    }

                    QQC2.Button {
                        text: i18n("Pick Color...")
                        onClicked: customHexColorDialog.open()
                    }
                }

                QQC2.Label { text: i18n("Global Atmosphere Preset:") }
                QQC2.ComboBox {
                    id: themePresetCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "WidgetWall Warm Minimal", value: "warm-minimal" },
                        { text: "Liquid Glass (Clear)", value: "liquid-glass" },
                        { text: "Pastel Editorial", value: "pastel-editorial" },
                        { text: "Aurora Gradient (Dark)", value: "aurora-gradient" },
                        { text: "Midnight Dark", value: "midnight" },
                        { text: "Monochrome Studio", value: "monochrome" }
                    ]
                    Component.onCompleted: currentIndex = Math.max(0, indexOfValue(configPage.cfg_themePreset))
                    onActivated: configPage.cfg_themePreset = currentValue
                }

                QQC2.Label { text: i18n("Icon Style:") }
                QQC2.ComboBox {
                    id: iconStyleCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "Filled", value: "filled" },
                        { text: "Outline", value: "outline" },
                        { text: "Minimal", value: "minimal" },
                        { text: "Monochrome", value: "monochrome" },
                        { text: "Accent-Tinted", value: "accent-tinted" }
                    ]
                    Component.onCompleted: currentIndex = Math.max(0, indexOfValue(configPage.cfg_iconStyle))
                    onActivated: configPage.cfg_iconStyle = currentValue
                }

                QQC2.Label { text: i18n("Typography Font:") }
                QQC2.ComboBox {
                    id: fontCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "System Default (SF Pro / Inter / Noto)", value: "auto" },
                        { text: "Noto Sans", value: "Noto Sans" },
                        { text: "Inter", value: "Inter" },
                        { text: "Ubuntu", value: "Ubuntu" },
                        { text: "JetBrains Mono", value: "JetBrains Mono" }
                    ]
                    Component.onCompleted: currentIndex = Math.max(0, indexOfValue(configPage.cfg_preferredFontFamily))
                    onActivated: configPage.cfg_preferredFontFamily = currentValue
                }

                QQC2.Label { text: i18n("3D Shadow Elevation (0–3):") }
                QQC2.SpinBox {
                    id: elevationSpin
                    from: 0
                    to: 3
                }

                QQC2.Label { text: i18n("Surface Opacity:") }
                QQC2.Slider {
                    id: opacitySlider
                    from: 0.35
                    to: 1.0
                    stepSize: 0.02
                    Layout.fillWidth: true
                }

                QQC2.Label { text: i18n("Corner Radius (px):") }
                QQC2.SpinBox {
                    id: radiusSpin
                    from: 10
                    to: 36
                }

                QQC2.Label { text: i18n("Border Opacity:") }
                QQC2.Slider {
                    id: borderOpacitySlider
                    from: 0.05
                    to: 0.90
                    stepSize: 0.05
                    Layout.fillWidth: true
                }

                QQC2.Label { text: i18n("Custom Surface Hex (Optional):") }
                QQC2.TextField {
                    id: bgColorField
                    placeholderText: i18n("Leave empty for global theme surface")
                    Layout.fillWidth: true
                }

                QQC2.Label { text: i18n("Custom Text Hex (Optional):") }
                QQC2.TextField {
                    id: textColorField
                    placeholderText: i18n("Leave empty for automatic contrast")
                    Layout.fillWidth: true
                }

                QQC2.CheckBox {
                    id: gradientCheck
                    text: i18n("Enable Subtle Surface Gradient")
                    Layout.columnSpan: 2
                }
            }
        }

        QQC2.GroupBox {
            title: i18n("2. Custom Image Background (SVG, JPG, JPEG, PNG, WebP)")
            Layout.fillWidth: true
            GridLayout {
                columns: 2
                anchors.fill: parent
                rowSpacing: 8
                columnSpacing: 10

                QQC2.Label { text: i18n("Image File:") }
                RowLayout {
                    Layout.fillWidth: true
                    spacing: 6
                    QQC2.TextField {
                        id: bgImageField
                        placeholderText: i18n("/path/to/background.jpg (.svg, .png, .webp)")
                        Layout.fillWidth: true
                    }
                    QQC2.Button {
                        text: i18n("Browse...")
                        onClicked: bgImageDialog.open()
                    }
                    QQC2.Button {
                        text: i18n("Reset")
                        onClicked: bgImageField.text = ""
                    }
                }

                QQC2.Label { text: i18n("Image Fit:") }
                QQC2.ComboBox {
                    id: bgFitCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "Cover (Crop to Fill)", value: "cover" },
                        { text: "Contain (Preserve Aspect)", value: "contain" },
                        { text: "Stretch (Fill Card)", value: "stretch" },
                        { text: "Center", value: "center" }
                    ]
                    Component.onCompleted: currentIndex = Math.max(0, indexOfValue(configPage.cfg_customBgFitMode))
                    onActivated: configPage.cfg_customBgFitMode = currentValue
                }

                QQC2.Label { text: i18n("Image Position:") }
                QQC2.ComboBox {
                    id: bgPosCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "Center", value: "center" },
                        { text: "Top", value: "top" },
                        { text: "Bottom", value: "bottom" },
                        { text: "Left", value: "left" },
                        { text: "Right", value: "right" }
                    ]
                    Component.onCompleted: currentIndex = Math.max(0, indexOfValue(configPage.cfg_customBgPosition))
                    onActivated: configPage.cfg_customBgPosition = currentValue
                }

                QQC2.Label { text: i18n("Overlay Mode:") }
                QQC2.ComboBox {
                    id: bgOverlayModeCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "Auto", value: "auto" },
                        { text: "Dark Scrim", value: "dark" },
                        { text: "Light Scrim", value: "light" }
                    ]
                    Component.onCompleted: currentIndex = Math.max(0, indexOfValue(configPage.cfg_customBgOverlayMode))
                    onActivated: configPage.cfg_customBgOverlayMode = currentValue
                }

                QQC2.Label { text: i18n("Overlay Opacity:") }
                QQC2.Slider {
                    id: bgOverlaySlider
                    from: 0.0
                    to: 0.85
                    stepSize: 0.05
                    Layout.fillWidth: true
                }

                QQC2.Label { text: i18n("Text Readability:") }
                QQC2.ComboBox {
                    id: bgTextContrastCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "Auto Contrast", value: "auto" },
                        { text: "Force Light Text", value: "light" },
                        { text: "Force Dark Text", value: "dark" }
                    ]
                    Component.onCompleted: currentIndex = Math.max(0, indexOfValue(configPage.cfg_customBgTextContrast))
                    onActivated: configPage.cfg_customBgTextContrast = currentValue
                }
            }
        }

        QQC2.GroupBox {
            title: i18n("3. Widget Module Settings (Clock Local Ringtone, To-Do List, Music, Photo)")
            Layout.fillWidth: true
            GridLayout {
                columns: 2
                anchors.fill: parent
                rowSpacing: 8
                columnSpacing: 10

                QQC2.Label { text: i18n("Widget Type:") }
                QQC2.ComboBox {
                    id: widgetKindCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "Clock & Alarms (widget.clock)", value: "clock" },
                        { text: "Monthly Calendar (widget.calendar)", value: "calendar" },
                        { text: "Weather (widget.weather)", value: "weather" },
                        { text: "Pomodoro Focus (widget.pomodoro)", value: "pomodoro" },
                        { text: "Notes (widget.notes)", value: "notes" },
                        { text: "To-Do List (widget.todo)", value: "agenda" },
                        { text: "Photo Frame (widget.photo_frame)", value: "photos" },
                        { text: "Music Player (widget.music_player)", value: "music_player" },
                        { text: "Quick Actions (widget.quick_actions)", value: "quick_actions" },
                        { text: "System Monitor (widget.system_monitor)", value: "system_monitor" }
                    ]
                    Component.onCompleted: currentIndex = Math.max(0, indexOfValue(configPage.cfg_widgetKind))
                    onActivated: configPage.cfg_widgetKind = currentValue
                }

                QQC2.Label { text: i18n("Nada Dering Alarm (Semua Alarm):") }
                QQC2.TextField {
                    id: defaultRingtoneField
                    placeholderText: i18n("~/Music/ atau ~/Music/ringtone.mp3")
                    Layout.fillWidth: true
                }

                QQC2.Label { text: i18n("Clock City / Subtitle:") }
                QQC2.TextField {
                    id: clockLocField
                    Layout.fillWidth: true
                }

                QQC2.Label { text: i18n("Default Alarm Snooze (mins):") }
                QQC2.SpinBox {
                    id: snoozeSpin
                    from: 1
                    to: 60
                }

                QQC2.CheckBox {
                    id: clock24Check
                    text: i18n("Use 24-hour clock format")
                    Layout.columnSpan: 2
                }

                QQC2.CheckBox {
                    id: clockSecCheck
                    text: i18n("Display clock seconds")
                    Layout.columnSpan: 2
                }

                QQC2.Label { text: i18n("Calendar Locale:") }
                QQC2.ComboBox {
                    id: localeCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "English (en-US)", value: "en-US" },
                        { text: "Bahasa Indonesia (id-ID)", value: "id-ID" }
                    ]
                    Component.onCompleted: currentIndex = Math.max(0, indexOfValue(configPage.cfg_calendarLocale))
                    onActivated: configPage.cfg_calendarLocale = currentValue
                }

                QQC2.Label { text: i18n("Weather Location:") }
                QQC2.TextField {
                    id: weatherLocField
                    Layout.fillWidth: true
                }

                QQC2.CheckBox {
                    id: weatherCelsiusCheck
                    text: i18n("Temperature in Celsius (°C)")
                    Layout.columnSpan: 2
                }

                QQC2.Label { text: i18n("Photo Frame Folder:") }
                QQC2.TextField {
                    id: photoDirField
                    placeholderText: i18n("Leave empty for bundled WidgetWall photography")
                    Layout.fillWidth: true
                }

                QQC2.CheckBox {
                    id: photoSlideshowCheck
                    text: i18n("Enable Photo Frame Slideshow Mode")
                    Layout.columnSpan: 2
                }

                QQC2.Label { text: i18n("Slideshow Interval (secs):") }
                QQC2.SpinBox {
                    id: photoIntervalSpin
                    from: 5
                    to: 3600
                }

                QQC2.Label { text: i18n("Music Source Mode:") }
                QQC2.ComboBox {
                    id: musicSourceCombo
                    Layout.fillWidth: true
                    textRole: "text"
                    valueRole: "value"
                    model: [
                        { text: "Local Music Path (~/Music/ or file)", value: "local" },
                        { text: "Online Audio Stream (Direct URL)", value: "stream" }
                    ]
                    Component.onCompleted: currentIndex = Math.max(0, indexOfValue(configPage.cfg_musicSourceType))
                    onActivated: configPage.cfg_musicSourceType = currentValue
                }

                QQC2.Label { text: i18n("Local Music Path:") }
                QQC2.TextField {
                    id: musicFolderField
                    placeholderText: i18n("~/Music/")
                    Layout.fillWidth: true
                }

                QQC2.Label { text: i18n("Direct Audio Stream URL:") }
                QQC2.TextField {
                    id: musicStreamField
                    placeholderText: i18n("https://ice2.somafm.com/groovesalad-128-mp3")
                    Layout.fillWidth: true
                }

                QQC2.Label { text: i18n("Quick Actions Columns:") }
                QQC2.SpinBox {
                    id: qaColsSpin
                    from: 2
                    to: 3
                }
            }
        }

        QQC2.GroupBox {
            title: i18n("4. Author & Developer Information")
            Layout.fillWidth: true
            ColumnLayout {
                anchors.fill: parent
                spacing: 6

                QQC2.Label {
                    text: i18n("Author")
                    opacity: 0.65
                    font.pixelSize: 11
                }
                QQC2.Label {
                    text: "Haris Gitama"
                    font.pixelSize: 13
                    font.weight: Font.DemiBold
                }

                QQC2.Label {
                    text: i18n("Portfolio")
                    opacity: 0.65
                    font.pixelSize: 11
                    Layout.topMargin: 4
                }
                QQC2.Label {
                    text: "rissaxie.com ↗"
                    font.pixelSize: 12
                    font.weight: Font.Medium
                    font.underline: portfolioMouse.containsMouse
                    MouseArea {
                        id: portfolioMouse
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: Qt.openUrlExternally("https://rissaxie.com")
                    }
                }

                QQC2.Label {
                    text: i18n("Instagram")
                    opacity: 0.65
                    font.pixelSize: 11
                    Layout.topMargin: 4
                }
                QQC2.Label {
                    text: "@hrisgtaa_ ↗"
                    font.pixelSize: 12
                    font.weight: Font.Medium
                    font.underline: instagramMouse.containsMouse
                    MouseArea {
                        id: instagramMouse
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: Qt.openUrlExternally("https://www.instagram.com/hrisgtaa_/")
                    }
                }

                RowLayout {
                    Layout.fillWidth: true
                    Layout.topMargin: 6
                    spacing: 6

                    QQC2.Label {
                        text: i18n("Developed by Haris Gitama")
                        opacity: 0.65
                        font.pixelSize: 11
                    }
                    QQC2.Label {
                        text: "·"
                        opacity: 0.45
                        font.pixelSize: 11
                    }
                    QQC2.Label {
                        text: "GitHub ↗"
                        opacity: 0.78
                        font.pixelSize: 11
                        font.underline: widgetCreditMouse.containsMouse
                        MouseArea {
                            id: widgetCreditMouse
                            anchors.fill: parent
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            onClicked: Qt.openUrlExternally("https://github.com/Harisgitama")
                        }
                    }
                    Item { Layout.fillWidth: true }
                }
            }
        }
    }
}
