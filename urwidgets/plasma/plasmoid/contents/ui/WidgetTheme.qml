import QtQuick 2.15

QtObject {
    id: widgetTheme

    property string appearanceMode: (typeof root !== "undefined" && root.globalAppearanceMode) ? root.globalAppearanceMode : (plasmoid.configuration.appearanceMode || "light")
    property string widgetStyle: (typeof root !== "undefined" && root.globalWidgetStyle) ? root.globalWidgetStyle : (plasmoid.configuration.widgetStyle || "default")
    property string accentColorId: (typeof root !== "undefined" && root.globalAccentColorId) ? root.globalAccentColorId : (plasmoid.configuration.accentColorId || "pink")
    property string customAccentHex: (typeof root !== "undefined" && root.globalCustomAccentHex) ? root.globalCustomAccentHex : (plasmoid.configuration.customAccentHex || "#FF5A79")
    property string activePreset: (typeof root !== "undefined" && root.globalThemePreset) ? root.globalThemePreset : (plasmoid.configuration.themePreset || "warm-minimal")
    property int elevationLevel: plasmoid.configuration.elevationLevel !== undefined ? plasmoid.configuration.elevationLevel : 2
    property string backgroundColorOverride: plasmoid.configuration.backgroundColorOverride || ""
    property bool gradientEnabled: plasmoid.configuration.gradientEnabled !== undefined ? plasmoid.configuration.gradientEnabled : true
    property real borderOpacityOverride: plasmoid.configuration.borderOpacity !== undefined ? plasmoid.configuration.borderOpacity : 0.42
    property string textColorOverride: plasmoid.configuration.textColorOverride || ""
    property string iconStyle: plasmoid.configuration.iconStyle || "filled"

    function normalizeHex(rawHex, fallbackHex) {
        if (!rawHex) return fallbackHex
        var cleaned = rawHex.toString().trim()
        if (cleaned.indexOf("#") !== 0) cleaned = "#" + cleaned
        if (/^#[0-9A-Fa-f]{6}$/.test(cleaned)) return cleaned.toUpperCase()
        if (/^#[0-9A-Fa-f]{3}$/.test(cleaned)) {
            var r = cleaned.charAt(1)
            var g = cleaned.charAt(2)
            var b = cleaned.charAt(3)
            return ("#" + r + r + g + g + b + b).toUpperCase()
        }
        return fallbackHex
    }

    readonly property string resolvedFontFamily: {
        var overrideFam = plasmoid.configuration.preferredFontFamily || "auto"
        var installed = Qt.fontFamilies()
        if (overrideFam !== "auto" && installed.indexOf(overrideFam) !== -1) {
            return overrideFam
        }
        var candidates = [
            "SF Pro Display",
            "SF Pro Text",
            "Helvetica Neue",
            "Avenir Next",
            "Inter",
            "Plus Jakarta Sans",
            "Noto Sans Display",
            "Noto Sans",
            "Liberation Sans"
        ]
        for (var i = 0; i < candidates.length; i++) {
            if (installed.indexOf(candidates[i]) !== -1) {
                return candidates[i]
            }
        }
        return "Sans Serif"
    }

    readonly property int spaceMicro: 4
    readonly property int spaceCompact: 8
    readonly property int spaceStandard: 12
    readonly property int spaceCard: 18
    readonly property int spaceLarge: 22
    readonly property int spaceSection: 24

    readonly property int cornerRadius: plasmoid.configuration.cornerRadius || 24
    readonly property int controlRadius: 11

    readonly property int shadowRadius: {
        if (elevationLevel <= 0) return 0
        if (elevationLevel === 1) return 14
        if (elevationLevel === 2) return 24
        return 36
    }

    readonly property int shadowOffsetY: {
        if (elevationLevel <= 0) return 0
        if (elevationLevel === 1) return 4
        if (elevationLevel === 2) return 8
        return 14
    }

    readonly property var accentPalette: ({
        "auto": "#E84A7F",
        "blue": "#007AFF",
        "purple": "#9B51E0",
        "pink": "#E84A7F",
        "red": "#E03E36",
        "orange": "#F28C28",
        "yellow": "#E6B800",
        "green": "#2E9E5B",
        "graphite": "#6E6E73"
    })

    readonly property var softTintLightPalette: ({
        "auto": "#FCEBF1",
        "blue": "#EBF4FF",
        "purple": "#F3EBFF",
        "pink": "#FCEBF1",
        "red": "#FDECEB",
        "orange": "#FEF3E7",
        "yellow": "#FDF8E4",
        "green": "#EAF7EF",
        "graphite": "#F0F0F2"
    })

    readonly property var softTintDarkPalette: ({
        "auto": "#381B26",
        "blue": "#142744",
        "purple": "#2A1B42",
        "pink": "#381B26",
        "red": "#3B1A18",
        "orange": "#3B2512",
        "yellow": "#352C10",
        "green": "#143121",
        "graphite": "#27272A"
    })

    readonly property bool isDark: {
        if (widgetStyle === "dark") return true
        if (appearanceMode === "dark") return true
        if (appearanceMode === "light") return false
        return (activePreset === "midnight" || activePreset === "monochrome" || activePreset === "aurora-gradient")
    }

    readonly property string resolvedAccentHex: {
        if (accentColorId === "custom") {
            return normalizeHex(customAccentHex, "#FF5A79")
        }
        return accentPalette[accentColorId] || "#E84A7F"
    }

    readonly property color accentColor: resolvedAccentHex

    readonly property color surfaceColor: {
        if (backgroundColorOverride && backgroundColorOverride.trim().length > 0) {
            return backgroundColorOverride
        }
        if (widgetStyle === "tinted") {
            if (accentColorId === "custom") {
                return isDark ? Qt.darker(accentColor, 2.8) : Qt.lighter(accentColor, 1.82)
            }
            return isDark
                ? (softTintDarkPalette[accentColorId] || "#381B26")
                : (softTintLightPalette[accentColorId] || "#FCEBF1")
        }
        if (widgetStyle === "clear") {
            return isDark ? "#181920" : "#FAF9F6"
        }
        if (isDark) {
            return activePreset === "aurora-gradient" ? "#22243B" : "#1E1F25"
        }
        return activePreset === "pastel-editorial" ? "#F7F1EB" : "#F2EFE9"
    }

    readonly property color gradientEndColor: {
        if (!gradientEnabled) {
            return surfaceColor
        }
        if (widgetStyle === "tinted") {
            if (accentColorId === "custom") {
                return isDark ? Qt.darker(accentColor, 3.4) : Qt.lighter(accentColor, 1.65)
            }
            return isDark ? "#19191F" : "#F3EFEA"
        }
        if (isDark) {
            return activePreset === "aurora-gradient" ? "#192234" : "#17181D"
        }
        return "#E7E2DA"
    }

    readonly property real surfaceOpacity: {
        var base = plasmoid.configuration.surfaceOpacity || 0.86
        if (widgetStyle === "solid") return 0.98
        if (widgetStyle === "clear") return Math.min(0.62, base * 0.72)
        return base
    }

    readonly property color textColor: {
        var bgImg = plasmoid.configuration.customBgImage || ""
        var contrast = plasmoid.configuration.customBgTextContrast || "auto"
        if (bgImg.length > 0 && contrast === "light") return "#F5F5F7"
        if (bgImg.length > 0 && contrast === "dark") return "#1D1D1F"
        if (textColorOverride && textColorOverride.trim().length > 0) return textColorOverride
        return isDark ? "#F5F5F7" : "#1D1D1F"
    }
    readonly property color mutedTextColor: isDark ? "#98989F" : "#6E6C68"
    readonly property color subtleSurfaceColor: isDark ? Qt.rgba(1, 1, 1, 0.08) : Qt.rgba(0, 0, 0, 0.05)
    readonly property color borderColor: isDark
        ? Qt.rgba(1, 1, 1, Math.min(0.45, Math.max(0.05, borderOpacityOverride * 0.5)))
        : Qt.rgba(1, 1, 1, Math.min(0.85, Math.max(0.10, borderOpacityOverride)))
}
