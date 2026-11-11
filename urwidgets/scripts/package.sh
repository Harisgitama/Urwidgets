#!/usr/bin/env bash
set -euo pipefail

echo "=== Packaging URWidgets v3.0.1 Release Artifacts (.plasmoid & .deb) ==="
mkdir -p dist

python3 -c '
import os, zipfile
with zipfile.ZipFile("dist/urwidgets.plasmoid", "w", zipfile.ZIP_DEFLATED) as zf:
    base = "plasma/plasmoid"
    for root, _, files in os.walk(base):
        for f in files:
            full = os.path.join(root, f)
            rel = os.path.relpath(full, base)
            zf.write(full, rel)
'
echo "[OK] Built dist/urwidgets.plasmoid"
