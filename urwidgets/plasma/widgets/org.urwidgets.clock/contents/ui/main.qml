import QtQuick 2.15
import QtQuick.Layouts 1.15
import org.kde.plasma.plasmoid 2.0
import org.kde.plasma.core 2.0 as PlasmaCore

Item {
    id: root
    width: PlasmaCore.Units.gridUnit * 18
    height: PlasmaCore.Units.gridUnit * 13
    Plasmoid.backgroundHints: PlasmaCore.Types.NoBackground
    Plasmoid.preferredRepresentation: Plasmoid.fullRepresentation
    clip: true

    // Synchronized Global Theme & Style properties across all 10 standalone desktop widgets
    property string globalAppearanceMode: plasmoid.configuration.appearanceMode || "light"
    property string globalWidgetStyle: plasmoid.configuration.widgetStyle || "default"
    property string globalAccentColorId: plasmoid.configuration.accentColorId || "pink"
    property string globalCustomAccentHex: plasmoid.configuration.customAccentHex || "#FF5A79"
    property string globalThemePreset: plasmoid.configuration.themePreset || "warm-minimal"
    property bool syncingGlobalTheme: false

    WidgetTheme {
        id: theme
    }

    property var daemonSnapshot: ({})
    readonly property bool isPhotoWidget: (plasmoid.configuration.widgetKind || "clock") === "photos"

    // Cross-Plasmoid Global Theme Synchronization via ~/.config/urwidgets/global_theme.json
    PlasmaCore.DataSource {
        id: globalThemeSyncSource
        engine: "executable"
        connectedSources: []
        onNewData: function(sourceName, data) {
            if (sourceName.indexOf("_read=") === 0 && data["stdout"]) {
                var raw = data["stdout"].trim()
                if (raw.length > 2) {
                    try {
                        var parsed = JSON.parse(raw)
                        root.syncingGlobalTheme = true
                        if (parsed.appearanceMode && parsed.appearanceMode !== root.globalAppearanceMode) {
                            root.globalAppearanceMode = parsed.appearanceMode
                            plasmoid.configuration.appearanceMode = parsed.appearanceMode
                        }
                        if (parsed.widgetStyle && parsed.widgetStyle !== root.globalWidgetStyle) {
                            root.globalWidgetStyle = parsed.widgetStyle
                            plasmoid.configuration.widgetStyle = parsed.widgetStyle
                        }
                        if (parsed.accentColorId && parsed.accentColorId !== root.globalAccentColorId) {
                            root.globalAccentColorId = parsed.accentColorId
                            plasmoid.configuration.accentColorId = parsed.accentColorId
                        }
                        if (parsed.customAccentHex && parsed.customAccentHex !== root.globalCustomAccentHex) {
                            root.globalCustomAccentHex = parsed.customAccentHex
                            plasmoid.configuration.customAccentHex = parsed.customAccentHex
                        }
                        if (parsed.themePreset && parsed.themePreset !== root.globalThemePreset) {
                            root.globalThemePreset = parsed.themePreset
                            plasmoid.configuration.themePreset = parsed.themePreset
                        }
                        root.syncingGlobalTheme = false
                    } catch (e) {
                        root.syncingGlobalTheme = false
                    }
                }
            }
            disconnectSource(sourceName)
        }
        function readSharedGlobalTheme() {
            connectSource("_read=" + Date.now() + "; cat ~/.config/urwidgets/global_theme.json 2>/dev/null || true")
        }
        function writeSharedGlobalTheme() {
            if (root.syncingGlobalTheme) return
            writeDebounceTimer.restart()
        }
    }

    Timer {
        id: writeDebounceTimer
        interval: 450
        repeat: false
        onTriggered: {
            if (root.syncingGlobalTheme) return
            var payload = JSON.stringify({
                appearanceMode: root.globalAppearanceMode,
                widgetStyle: root.globalWidgetStyle,
                accentColorId: root.globalAccentColorId,
                customAccentHex: root.globalCustomAccentHex,
                themePreset: root.globalThemePreset,
                updatedAt: Date.now()
            })
            var safeJson = payload.replace(/'/g, "")
            globalThemeSyncSource.connectSource("_write=" + Date.now() + "; mkdir -p ~/.config/urwidgets && printf '%s' '" + safeJson + "' > ~/.config/urwidgets/global_theme.json")
        }
    }

    Connections {
        target: plasmoid.configuration
        function onAppearanceModeChanged() {
            root.globalAppearanceMode = plasmoid.configuration.appearanceMode || "light"
            globalThemeSyncSource.writeSharedGlobalTheme()
        }
        function onWidgetStyleChanged() {
            root.globalWidgetStyle = plasmoid.configuration.widgetStyle || "default"
            globalThemeSyncSource.writeSharedGlobalTheme()
        }
        function onAccentColorIdChanged() {
            root.globalAccentColorId = plasmoid.configuration.accentColorId || "pink"
            globalThemeSyncSource.writeSharedGlobalTheme()
        }
        function onCustomAccentHexChanged() {
            root.globalCustomAccentHex = plasmoid.configuration.customAccentHex || "#FF5A79"
            globalThemeSyncSource.writeSharedGlobalTheme()
        }
        function onThemePresetChanged() {
            root.globalThemePreset = plasmoid.configuration.themePreset || "warm-minimal"
            globalThemeSyncSource.writeSharedGlobalTheme()
        }
    }

    // Passive 30-second cross-widget sync (prevents 1.5s shell process storm while keeping desktop 100% responsive)
    Timer {
        interval: 30000
        running: true
        repeat: true
        onTriggered: globalThemeSyncSource.readSharedGlobalTheme()
    }

    PlasmaCore.DataSource {
        id: daemonExecutable
        engine: "executable"
        connectedSources: []
        onNewData: function(sourceName, data) {
            if (data["stdout"]) {
                try {
                    var parsed = JSON.parse(data["stdout"])
                    if (parsed.clock) {
                        root.daemonSnapshot = parsed
                    }
                } catch (e) {}
            }
            disconnectSource(sourceName)
        }
        function invokeMethod(methodAndArgs) {
            if (methodAndArgs === "GetSnapshot") {
                connectSource("qdbus org.urwidgets.Daemon /org/urwidgets/Daemon org.urwidgets.Daemon1.GetSnapshot 2>/dev/null || true")
            } else {
                connectSource("_dbus=" + Date.now() + "; (qdbus org.urwidgets.Daemon /org/urwidgets/Daemon org.urwidgets.Daemon1." + methodAndArgs + " >/dev/null 2>&1 &) || true")
            }
        }
    }

    WidgetSurface {
        anchors.fill: parent
        themeObj: theme
        fullBleed: root.isPhotoWidget
    }

    Loader {
        id: widgetLoader
        anchors.fill: parent
        anchors.margins: root.isPhotoWidget ? 0 : theme.spaceCard
        source: {
            var kind = plasmoid.configuration.widgetKind || "clock"
            switch (kind) {
                case "clock": return "ClockWidget.qml"
                case "calendar": return "CalendarWidget.qml"
                case "weather": return "WeatherWidget.qml"
                case "pomodoro": return "PomodoroWidget.qml"
                case "notes": return "NotesWidget.qml"
                case "agenda": return "AgendaWidget.qml"
                case "todo": return "AgendaWidget.qml"
                case "photos": return "PhotoWidget.qml"
                case "music_player": return "MusicPlayerWidget.qml"
                case "quick_actions": return "QuickActionsWidget.qml"
                case "system_monitor": return "SystemMonitorWidget.qml"
                default: return "ClockWidget.qml"
            }
        }
    }

    Component.onCompleted: {
        Plasmoid.setAction("modeLight", i18n("Global Appearance: Light"), "weather-clear")
        Plasmoid.setAction("modeDark", i18n("Global Appearance: Dark"), "weather-clear-night")
        Plasmoid.setAction("styleDefault", i18n("Global Style: Default"), "preferences-desktop-theme")
        Plasmoid.setAction("styleClear", i18n("Global Style: Clear Glass"), "preferences-desktop-theme")
        Plasmoid.setAction("styleTinted", i18n("Global Style: Accent Tinted"), "preferences-desktop-color")
        globalThemeSyncSource.readSharedGlobalTheme()
        daemonExecutable.invokeMethod("GetSnapshot")
    }

    function action_modeLight() {
        plasmoid.configuration.appearanceMode = "light"
        root.globalAppearanceMode = "light"
        globalThemeSyncSource.writeSharedGlobalTheme()
    }
    function action_modeDark() {
        plasmoid.configuration.appearanceMode = "dark"
        root.globalAppearanceMode = "dark"
        globalThemeSyncSource.writeSharedGlobalTheme()
    }
    function action_styleDefault() {
        plasmoid.configuration.widgetStyle = "default"
        root.globalWidgetStyle = "default"
        globalThemeSyncSource.writeSharedGlobalTheme()
    }
    function action_styleClear() {
        plasmoid.configuration.widgetStyle = "clear"
        root.globalWidgetStyle = "clear"
        globalThemeSyncSource.writeSharedGlobalTheme()
    }
    function action_styleTinted() {
        plasmoid.configuration.widgetStyle = "tinted"
        root.globalWidgetStyle = "tinted"
        globalThemeSyncSource.writeSharedGlobalTheme()
    }
}
