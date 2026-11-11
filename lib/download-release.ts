export async function downloadReleaseArtifact(filename: string): Promise<void> {
  const safeName = filename.replace(/^\/releases\//, '').trim();
  const apiUrl = `/api/download/${encodeURIComponent(safeName)}?t=${Date.now()}`;

  try {
    const response = await fetch(apiUrl, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
    const blobUrl = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.download = safeName;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    window.setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 15000);
  } catch {
    // Fallback to direct API attachment link
    const anchor = document.createElement('a');
    anchor.href = apiUrl;
    anchor.download = safeName;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }
}
