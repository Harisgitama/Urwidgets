import QtQuick 2.15
import QtGraphicalEffects 1.15

Item {
    id: surfaceRoot
    property var themeObj
    property bool fullBleed: false

    // Absorb all touchpad 2-finger scroll / mouse wheel gestures on the widget surface
    // so scrolling over any widget NEVER bubbles up to the KDE Plasma Desktop Containment
    // to accidentally switch Virtual Desktops / Workspaces.
    MouseArea {
        anchors.fill: parent
        acceptedButtons: Qt.NoButton
        hoverEnabled: false
        onWheel: function(wheel) {
            wheel.accepted = true
        }
    }

    // Low-GPU Cached Floating Elevation DropShadow (17 samples + cached texture for <1% CPU/GPU idle)
    DropShadow {
        visible: themeObj ? (themeObj.elevationLevel > 0) : true
        anchors.fill: surfaceCard
        horizontalOffset: 0
        verticalOffset: themeObj ? Math.max(8, themeObj.shadowOffsetY * 1.15) : 10
        radius: themeObj ? Math.max(18, themeObj.shadowRadius * 1.1) : 22
        samples: 17
        cached: true
        color: themeObj && themeObj.isDark ? Qt.rgba(0, 0, 0, 0.52) : Qt.rgba(22/255, 19/255, 15/255, 0.18)
        source: surfaceCard
    }

    Rectangle {
        id: surfaceCard
        anchors.fill: parent
        radius: themeObj ? themeObj.cornerRadius : 24
        opacity: surfaceRoot.fullBleed ? 1.0 : (themeObj ? themeObj.surfaceOpacity : 0.86)
        gradient: Gradient {
            orientation: Gradient.Vertical
            GradientStop { position: 0.0; color: themeObj ? themeObj.surfaceColor : "#F2EFE9" }
            GradientStop { position: 1.0; color: themeObj ? themeObj.gradientEndColor : "#E7E2DA" }
        }
        border.width: 1
        border.color: themeObj ? themeObj.borderColor : Qt.rgba(1, 1, 1, 0.65)

        // Top Specular Liquid Glass Highlight Rim
        Rectangle {
            anchors.top: parent.top
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.margins: 1
            height: 1
            radius: parent.radius
            color: themeObj && themeObj.isDark ? Qt.rgba(1, 1, 1, 0.12) : Qt.rgba(1, 1, 1, 0.68)
        }
    }

    // Optional per-widget custom image background layer (SVG, JPG, JPEG, PNG, WebP)
    WidgetBackground {
        anchors.fill: parent
        themeObj: surfaceRoot.themeObj
    }
}
