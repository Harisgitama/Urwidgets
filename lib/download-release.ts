
const RELEASE_PAGE_URL =
  "https://github.com/Harisgitama/Urwidgets/releases/tag/3.0.2";

const RELEASE_DOWNLOAD_BASE =
  "https://github.com/Harisgitama/Urwidgets/releases/download/3.0.2";

const ALLOWED_FILES = new Set([
  "URWidgets_3.1.0_amd64.deb",
  "SHA256SUMS",
  "urwidgets-bundle.deb",
  "urwidgets-bundle.zip",
  "urwidgets.plasmoid",
  "urwidgets-source.tar.gz",
  "urwidgets-engine.deb",
  "urwidgets-source.zip",
]);

export async function downloadReleaseArtifact(
  filename: string
): Promise<void> {
  // Normalize the requested filename and prevent path traversal.
  const safeName = filename
    .replace(/^\/?releases\//i, "")
    .split(/[\\/]/)
    .pop()
    ?.trim() ?? "";

  // Only allow explicitly approved release artifacts.
  if (!safeName || !ALLOWED_FILES.has(safeName)) {
    window.open(
      RELEASE_PAGE_URL,
      "_blank",
      "noopener,noreferrer"
    );
    return;
  }

  // GitHub Release direct asset URL.
  const downloadUrl =
    `${RELEASE_DOWNLOAD_BASE}/${encodeURIComponent(safeName)}`;

  // Let the browser handle the download directly.
  // No API route, fetch, Blob, or local filesystem access required.
  const anchor = document.createElement("a");

  anchor.href = downloadUrl;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  anchor.style.display = "none";

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
