import QtQuick 2.15
import QtQuick.Controls 2.15 as QQC2
import QtQuick.Layouts 1.15

ColumnLayout {
    id: notesRoot
    spacing: 6
    clip: true

    property int currentNoteIndex: 0
    property string autosaveStatus: "Saved"

    ListModel {
        id: savedNotesModel
        ListElement {
            noteId: "note-1"
            title: "Desktop Widget Architecture"
            body: "Keep all 10 Plasmoids backed by a single urwidgets-daemon process over org.urwidgets.Daemon1 D-Bus.\n• SQLite WAL mode\n• Zero hover jitter"
            pinned: true
            updatedLabel: "Today"
        }
        ListElement {
            noteId: "note-2"
            title: "Reading & Study Notes"
            body: "Visual hierarchy through weight and proportion. Warm translucent surfaces (#EFECE7)."
            pinned: false
            updatedLabel: "Yesterday"
        }
    }

    // 400ms Debounced SQLite Autosave Timer (Never writes to SQLite on every keystroke)
    Timer {
        id: debounceAutosaveTimer
        interval: 400
        repeat: false
        onTriggered: {
            if (savedNotesModel.count > 0) {
                var item = savedNotesModel.get(notesRoot.currentNoteIndex)
                notesRoot.autosaveStatus = "Saved"
                daemonExecutable.invokeMethod(
                    "NoteUpsert '" + item.noteId + "' '" + item.title + "' '" + item.body + "' " + (item.pinned ? "true" : "false")
                )
            }
        }
    }

    RowLayout {
        Layout.fillWidth: true
        spacing: 6

        WidgetText {
            themeObj: theme
            text: savedNotesModel.count > 0 ? savedNotesModel.get(notesRoot.currentNoteIndex).title : "Notes"
            font.pixelSize: 14
            font.weight: Font.DemiBold
            elide: Text.ElideRight
            Layout.fillWidth: true
        }

        WidgetText {
            themeObj: theme
            muted: true
            text: notesRoot.autosaveStatus
            font.pixelSize: 10
        }

        WidgetButton {
            themeObj: theme
            label: savedNotesModel.count > 0 && savedNotesModel.get(notesRoot.currentNoteIndex).pinned ? "📌" : "Pin"
            active: savedNotesModel.count > 0 && savedNotesModel.get(notesRoot.currentNoteIndex).pinned
            pill: true
            onClicked: {
                if (savedNotesModel.count > 0) {
                    var cur = savedNotesModel.get(notesRoot.currentNoteIndex).pinned
                    savedNotesModel.setProperty(notesRoot.currentNoteIndex, "pinned", !cur)
                    debounceAutosaveTimer.restart()
                }
            }
        }

        WidgetButton {
            themeObj: theme
            label: "+"
            pill: true
            onClicked: {
                savedNotesModel.insert(0, {
                    noteId: "note-" + Date.now(),
                    title: "Quick Note " + (savedNotesModel.count + 1),
                    body: "",
                    pinned: false,
                    updatedLabel: "Just now"
                })
                notesRoot.currentNoteIndex = 0
                debounceAutosaveTimer.restart()
            }
        }
    }

    Rectangle {
        Layout.fillWidth: true
        Layout.fillHeight: true
        radius: 10
        color: theme.subtleSurfaceColor

        QQC2.TextArea {
            id: noteEditor
            anchors.fill: parent
            anchors.margins: 6
            wrapMode: TextEdit.Wrap
            background: null
            color: theme.textColor
            font.family: theme.resolvedFontFamily
            font.pixelSize: 12
            text: savedNotesModel.count > 0 ? savedNotesModel.get(notesRoot.currentNoteIndex).body : ""
            onTextChanged: {
                if (savedNotesModel.count > 0 && text !== savedNotesModel.get(notesRoot.currentNoteIndex).body) {
                    savedNotesModel.setProperty(notesRoot.currentNoteIndex, "body", text)
                    notesRoot.autosaveStatus = "Saving…"
                    debounceAutosaveTimer.restart()
                }
            }
        }
    }

    RowLayout {
        Layout.fillWidth: true
        spacing: 4

        Repeater {
            model: savedNotesModel
            WidgetButton {
                themeObj: theme
                label: (model.pinned ? "📌 " : "") + model.title
                active: index === notesRoot.currentNoteIndex
                pill: true
                onClicked: notesRoot.currentNoteIndex = index
            }
        }

        Item { Layout.fillWidth: true }
    }
}
