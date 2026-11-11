import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ALLOWED_FILES = new Set([
  'URWidgets_3.1.0_amd64.deb',
  'SHA256SUMS',
  'urwidgets-bundle.deb',
  'urwidgets-bundle.zip',
  'urwidgets.plasmoid',
  'urwidgets-source.tar.gz',
  'urwidgets-engine.deb',
  'urwidgets-source.zip',
]);

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  const { filename } = await context.params;
  const safeName = path.basename(filename || '');

  if (!ALLOWED_FILES.has(safeName)) {
    return NextResponse.json(
      { error: `Release artifact '${safeName}' not found.` },
      { status: 404 }
    );
  }

  const candidatePaths = [
    path.join(process.cwd(), 'dist', safeName),
    path.join(process.cwd(), 'public', 'releases', safeName),
    path.join(process.cwd(), safeName),
  ];

  const filePath = candidatePaths.find((p) => fs.existsSync(p));
  if (!filePath) {
    return NextResponse.json(
      { error: `Artifact file '${safeName}' is missing on disk.` },
      { status: 404 }
    );
  }

  const fileBuffer = await fs.promises.readFile(filePath);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${safeName}"`,
      'Content-Length': String(fileBuffer.byteLength),
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
