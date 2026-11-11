import QtQuick 2.15
import QtQuick.Controls 2.15 as QQC2
import QtQuick.Layouts 1.15

ColumnLayout {
    id: todoWidgetRoot
    spacing: 6
    clip: true

    property bool showAddForm: false
    property string editingTodoId: ""
    property string newTitle: ""
    property string newDueDate: "2026-11-10"
    property string newDueTime: "17:00"
    property string newPriority: "high"
    property string filterMode: "all" // "all" | "active" | "done"

    ListModel {
        id: todoItemsModel
        ListElement { todoId: "todo-1"; title: "Math 12 - Unit 4 learning guide"; dueDateIso: "2026-11-09"; dueTime: "08:30"; priority: "high"; category: "School"; done: true }
        ListElement { todoId: "todo-2"; title: "Math 12 - Unit 4 Exam prep"; dueDateIso: "2026-11-09"; dueTime: "14:00"; priority: "high"; category: "School"; done: false }
        ListElement { todoId: "todo-3"; title: "Review KDE Plasma 5.27 QML shader cache"; dueDateIso: "2026-11-10"; dueTime: "16:30"; priority: "medium"; category: "Engineering"; done: false }
        ListElement { todoId: "todo-4"; title: "Package URWidgets v3.0.2 release archive"; dueDateIso: "2026-11-12"; dueTime: "18:00"; priority: "high"; category: "Release"; done: false }
    }

    function saveTodosToConfig() {
        var arr = []
        for (var i = 0; i < todoItemsModel.count; i++) {
            var it = todoItemsModel.get(i)
            arr.push({
                todoId: it.todoId,
                title: it.title,
                dueDateIso: it.dueDateIso,
                dueTime: it.dueTime,
                priority: it.priority,
                category: it.category || "General",
                done: it.done
            })
        }
        plasmoid.configuration.todoItemsJson = JSON.stringify(arr)
    }

    function loadTodosFromConfig() {
        var raw = plasmoid.configuration.todoItemsJson || ""
        if (raw.trim().length > 2) {
            try {
                var parsed = JSON.parse(raw)
                if (Array.isArray(parsed)) {
                    todoItemsModel.clear()
                    for (var i = 0; i < parsed.length; i++) {
                        var t = parsed[i]
                        todoItemsModel.append({
                            todoId: t.todoId || ("todo-" + i),
                            title: t.title || "Untitled To-Do",
                            dueDateIso: t.dueDateIso || "2026-11-10",
                            dueTime: t.dueTime || "17:00",
                            priority: t.priority || "medium",
                            category: t.category || "General",
                            done: t.done !== undefined ? t.done : false
                        })
                    }
                }
            } catch (e) {}
        }
    }

    Component.onCompleted: {
        loadTodosFromConfig()
    }

    readonly property int completedCount: {
        var c = 0
        for (var i = 0; i < todoItemsModel.count; i++) {
            if (todoItemsModel.get(i).done) c++
        }
        return c
    }

    function deadlineStatusText(dueDateIso, dueTime, isDone) {
        if (!dueDateIso || dueDateIso.length === 0) return "No deadline"
        if (isDone) return "Selesai · " + dueDateIso + " " + (dueTime || "")
        var todayIso = Qt.formatDate(new Date(), "yyyy-MM-dd")
        if (dueDateIso < todayIso) return "OVERDUE · " + dueDateIso + " " + (dueTime || "")
        if (dueDateIso === todayIso) return "HARI INI · " + (dueTime || "17:00")
        return "Deadline: " + dueDateIso + " " + (dueTime || "")
    }

    function isOverdue(dueDateIso, isDone) {
        if (isDone || !dueDateIso || dueDateIso.length === 0) return false
        var todayIso = Qt.formatDate(new Date(), "yyyy-MM-dd")
        return dueDateIso < todayIso
    }

    RowLayout {
        Layout.fillWidth: true
        spacing: 6

        ColumnLayout {
            spacing: 1
            Layout.fillWidth: true

            WidgetText {
                themeObj: theme
                text: "To-Do List"
                font.pixelSize: 15
                font.weight: Font.DemiBold
            }

            WidgetText {
                themeObj: theme
                muted: true
                text: todoWidgetRoot.completedCount + " / " + todoItemsModel.count + " selesai"
                font.pixelSize: 10
            }
        }

        Repeater {
            model: [
                { id: "all", label: "All" },
                { id: "active", label: "Active" },
                { id: "done", label: "Done" }
            ]
            WidgetButton {
                themeObj: theme
                label: modelData.label
                active: todoWidgetRoot.filterMode === modelData.id
                pill: true
                onClicked: todoWidgetRoot.filterMode = modelData.id
            }
        }

        WidgetButton {
            visible: todoWidgetRoot.completedCount > 0
            themeObj: theme
            label: "Clear Done"
            pill: true
            onClicked: {
                for (var i = todoItemsModel.count - 1; i >= 0; i--) {
                    if (todoItemsModel.get(i).done) {
                        var delId = todoItemsModel.get(i).todoId
                        todoItemsModel.remove(i)
                        daemonExecutable.invokeMethod("DeleteAgendaEvent '" + delId + "'")
                    }
                }
                todoWidgetRoot.saveTodosToConfig()
            }
        }

        WidgetButton {
            themeObj: theme
            label: todoWidgetRoot.showAddForm ? "Tutup" : "+ To-Do"
            active: true
            pill: true
            onClicked: {
                if (!todoWidgetRoot.showAddForm) {
                    todoWidgetRoot.editingTodoId = ""
                    todoWidgetRoot.newTitle = ""
                    todoWidgetRoot.newDueDate = Qt.formatDate(new Date(), "yyyy-MM-dd")
                    todoWidgetRoot.newDueTime = "17:00"
                    todoWidgetRoot.newPriority = "high"
                }
                todoWidgetRoot.showAddForm = !todoWidgetRoot.showAddForm
            }
        }
    }

    // Progress Bar
    Rectangle {
        Layout.fillWidth: true
        height: 4
        radius: 2
        color: theme.subtleSurfaceColor

        Rectangle {
            width: todoItemsModel.count > 0 ? parent.width * (todoWidgetRoot.completedCount / todoItemsModel.count) : 0
            height: parent.height
            radius: 2
            color: theme.accentColor
        }
    }

    // Add / Edit To-Do Form with Deadline Date + Time + Priority
    Rectangle {
        visible: todoWidgetRoot.showAddForm
        Layout.fillWidth: true
        height: 92
        radius: 10
        color: theme.subtleSurfaceColor

        ColumnLayout {
            anchors.fill: parent
            anchors.margins: 6
            spacing: 4

            QQC2.TextField {
                id: todoTitleInput
                Layout.fillWidth: true
                placeholderText: "Judul tugas / to-do baru..."
                text: todoWidgetRoot.newTitle
                font.pixelSize: 11
                onTextChanged: todoWidgetRoot.newTitle = text
            }

            RowLayout {
                Layout.fillWidth: true
                spacing: 4

                WidgetText {
                    themeObj: theme
                    muted: true
                    text: "Deadline:"
                    font.pixelSize: 10
                }

                QQC2.TextField {
                    id: todoDateInput
                    Layout.preferredWidth: 88
                    placeholderText: "YYYY-MM-DD"
                    text: todoWidgetRoot.newDueDate
                    font.pixelSize: 10
                    onTextChanged: todoWidgetRoot.newDueDate = text
                }

                QQC2.TextField {
                    id: todoTimeInput
                    Layout.preferredWidth: 54
                    placeholderText: "HH:MM"
                    text: todoWidgetRoot.newDueTime
                    font.pixelSize: 10
                    onTextChanged: todoWidgetRoot.newDueTime = text
                }

                Repeater {
                    model: ["high", "medium", "low"]
                    WidgetButton {
                        themeObj: theme
                        label: modelData === "high" ? "High" : (modelData === "medium" ? "Med" : "Low")
                        active: todoWidgetRoot.newPriority === modelData
                        pill: true
                        onClicked: todoWidgetRoot.newPriority = modelData
                    }
                }

                Item { Layout.fillWidth: true }

                WidgetButton {
                    themeObj: theme
                    label: "Simpan"
                    active: true
                    pill: true
                    onClicked: {
                        var cleanTitle = todoWidgetRoot.newTitle.trim()
                        if (cleanTitle.length > 0) {
                            var cleanDate = todoWidgetRoot.newDueDate.trim() || Qt.formatDate(new Date(), "yyyy-MM-dd")
                            var cleanTime = todoWidgetRoot.newDueTime.trim() || "17:00"
                            if (todoWidgetRoot.editingTodoId !== "") {
                                for (var i = 0; i < todoItemsModel.count; i++) {
                                    if (todoItemsModel.get(i).todoId === todoWidgetRoot.editingTodoId) {
                                        todoItemsModel.setProperty(i, "title", cleanTitle)
                                        todoItemsModel.setProperty(i, "dueDateIso", cleanDate)
                                        todoItemsModel.setProperty(i, "dueTime", cleanTime)
                                        todoItemsModel.setProperty(i, "priority", todoWidgetRoot.newPriority)
                                        break
                                    }
                                }
                            } else {
                                var tid = "todo-" + Date.now()
                                todoItemsModel.insert(0, {
                                    todoId: tid,
                                    title: cleanTitle,
                                    dueDateIso: cleanDate,
                                    dueTime: cleanTime,
                                    priority: todoWidgetRoot.newPriority,
                                    category: "General",
                                    done: false
                                })
                                daemonExecutable.invokeMethod(
                                    "AddAgendaEvent '" + cleanTitle + "' '" + cleanDate + "' '" + cleanTime + "' 'Work'"
                                )
                            }
                            todoWidgetRoot.saveTodosToConfig()
                            todoWidgetRoot.newTitle = ""
                            todoWidgetRoot.editingTodoId = ""
                            todoWidgetRoot.showAddForm = false
                        }
                    }
                }
            }
        }
    }

    // Scrollable To-Do Checklist with Deadline Badge, Edit & Hapus (Delete) Button
    ListView {
        id: todoListView
        Layout.fillWidth: true
        Layout.fillHeight: true
        clip: true
        spacing: 4
        model: todoItemsModel

        delegate: Item {
            readonly property bool matchesFilter: {
                if (todoWidgetRoot.filterMode === "active") return !model.done
                if (todoWidgetRoot.filterMode === "done") return model.done
                return true
            }
            width: todoListView.width
            height: matchesFilter ? 34 : 0
            visible: matchesFilter

            Rectangle {
                anchors.fill: parent
                radius: 9
                color: theme.subtleSurfaceColor

                RowLayout {
                    anchors.fill: parent
                    anchors.leftMargin: 8
                    anchors.rightMargin: 8
                    spacing: 7

                    // Checkbox toggle
                    Rectangle {
                        width: 16
                        height: 16
                        radius: 8
                        color: model.done ? theme.accentColor : "transparent"
                        border.width: 1.5
                        border.color: model.done ? theme.accentColor : theme.mutedTextColor

                        WidgetText {
                            visible: model.done
                            anchors.centerIn: parent
                            themeObj: theme
                            text: "✓"
                            color: "#FFFFFF"
                            font.pixelSize: 9
                            font.weight: Font.Bold
                        }

                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: {
                                todoItemsModel.setProperty(index, "done", !model.done)
                                todoWidgetRoot.saveTodosToConfig()
                                daemonExecutable.invokeMethod("ToggleAgendaEvent '" + model.todoId + "'")
                            }
                        }
                    }

                    // Priority indicator dot
                    Rectangle {
                        width: 6
                        height: 6
                        radius: 3
                        color: model.priority === "high" ? "#EF4444" : (model.priority === "medium" ? "#F59E0B" : "#10B981")
                    }

                    // Title + Deadline Subtitle
                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 1

                        WidgetText {
                            themeObj: theme
                            text: model.title
                            font.pixelSize: 11
                            font.weight: Font.Medium
                            font.strikeout: model.done
                            opacity: model.done ? 0.52 : 1.0
                            elide: Text.ElideRight
                            Layout.fillWidth: true
                        }

                        WidgetText {
                            themeObj: theme
                            muted: !todoWidgetRoot.isOverdue(model.dueDateIso, model.done)
                            color: todoWidgetRoot.isOverdue(model.dueDateIso, model.done) ? "#EF4444" : theme.mutedTextColor
                            text: "⏰ " + todoWidgetRoot.deadlineStatusText(model.dueDateIso, model.dueTime, model.done)
                            font.pixelSize: 9
                            font.weight: todoWidgetRoot.isOverdue(model.dueDateIso, model.done) ? Font.DemiBold : Font.Normal
                            elide: Text.ElideRight
                            Layout.fillWidth: true
                        }
                    }

                    // Edit Button
                    WidgetButton {
                        themeObj: theme
                        label: "Edit"
                        pill: true
                        onClicked: {
                            todoWidgetRoot.editingTodoId = model.todoId
                            todoWidgetRoot.newTitle = model.title
                            todoWidgetRoot.newDueDate = model.dueDateIso
                            todoWidgetRoot.newDueTime = model.dueTime
                            todoWidgetRoot.newPriority = model.priority
                            todoWidgetRoot.showAddForm = true
                        }
                    }

                    // Delete (Hapus) To-Do Button
                    WidgetButton {
                        themeObj: theme
                        label: "Hapus"
                        pill: true
                        onClicked: {
                            var targetId = model.todoId
                            todoItemsModel.remove(index)
                            todoWidgetRoot.saveTodosToConfig()
                            daemonExecutable.invokeMethod("DeleteAgendaEvent '" + targetId + "'")
                        }
                    }
                }
            }
        }
    }
}
