# Installing & Testing URWidgets on KDE Plasma 5

## Option 1: Install `urwidgets-bundle.deb` (Recommended)

```bash
sudo dpkg -i urwidgets-bundle.deb
sudo apt-get install -f
```

## Option 2: Install via `scripts/install.sh`

```bash
cd urwidgets
chmod +x scripts/install.sh
./scripts/install.sh
```

After updating an already-running KDE Plasma 5 session, reload Plasma's QML cache so the new WidgetWall surfaces appear immediately:

```bash
kbuildsycoca5 --noincremental
plasmashell --replace &
```

## Testing Individual Widgets with `plasmoidviewer`

```bash
plasmoidviewer -a org.urwidgets.ecosystem
plasmoidviewer -a org.urwidgets.clock
plasmoidviewer -a org.urwidgets.calendar
plasmoidviewer -a org.urwidgets.pomodoro
plasmoidviewer -a org.urwidgets.weather
plasmoidviewer -a org.urwidgets.notes
plasmoidviewer -a org.urwidgets.music
plasmoidviewer -a org.urwidgets.agenda
plasmoidviewer -a org.urwidgets.photos
plasmoidviewer -a org.urwidgets.quickactions
plasmoidviewer -a org.urwidgets.sysmonitor
```
