export function normalizeBasePath(value?: string): string {
  if (!value) return '';
  const trimmed = value.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) {
    return '';
  }
  const cleaned = trimmed.replace(/\/+$/, '');
  if (!cleaned || cleaned === '/') {
    return '';
  }
  if (!/^\/[a-zA-Z0-9._/-]+$/.test(cleaned)) {
    return '';
  }
  return cleaned;
}

export function getBasePath(): string {
  const envBase = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);
  if (envBase) {
    return envBase;
  }
  if (
    typeof window !== 'undefined' &&
    window.location.pathname.startsWith('/Urwidgets')
  ) {
    return '/Urwidgets';
  }
  return '';
}

export function withBasePath(assetPath: string): string {
  if (!assetPath) return '';
  if (
    assetPath.startsWith('http://') ||
    assetPath.startsWith('https://') ||
    assetPath.startsWith('data:')
  ) {
    return assetPath;
  }
  const normalized = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
  const base = getBasePath();
  if (base && normalized.startsWith(`${base}/`)) {
    return normalized;
  }
  return `${base}${normalized}`;
}

export async function downloadReleaseArtifact(filename: string): Promise<void> {
  const safeName = filename.replace(/^\/releases\//, '').trim();
  const staticUrl = withBasePath(`/releases/${encodeURIComponent(safeName)}`);

  try {
    const response = await fetch(staticUrl, { cache: 'no-store' });
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
    const anchor = document.createElement('a');
    anchor.href = staticUrl;
    anchor.download = safeName;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }
}

