'use client';

import React, { useState, useMemo } from 'react';
import {
  Download,
  FileCode,
  Package,
  Copy,
  Check,
  Search,
  Terminal,
  FolderTree,
} from 'lucide-react';
import { NATIVE_SOURCE_FILES, NativeSourceFile } from '@/lib/native-source-registry';
import { downloadReleaseArtifact } from '@/lib/download-release';

const ARTIFACT_PACKAGES = [
  {
    name: 'URWidgets_3.1.0_amd64.deb',
    href: '/api/download/URWidgets_3.1.0_amd64.deb',
    size: 'v3.1.0 (495 KB xz)',
    kind: 'Official Debian Release Package (.deb) · v3.1.0',
    description:
      'Production v3.1.0 Debian package (dist/URWidgets_3.1.0_amd64.deb) with complete codebase cleanup, shared Rust/Tauri core library crate, deduplicated KDE Plasma 5 Plasmoids, desktop entry + SVG icon, postinst/prerm hooks, and Author Portfolio (rissaxie.com) & Instagram (@hrisgtaa_).',
    installCmd: 'sudo dpkg -i URWidgets_3.1.0_amd64.deb && sudo apt-get install -f',
  },
  {
    name: 'urwidgets-bundle.deb',
    href: '/api/download/urwidgets-bundle.deb',
    size: 'v3.1.0 (495 KB xz)',
    kind: 'Debian Complete 10-Widget Bundle (.deb) · v3.1.0',
    description:
      'Alias of URWidgets_3.1.0_amd64.deb for script compatibility. Installs /usr/bin/urwidgets-daemon, /usr/share/kservices5/plasma-applet-org.urwidgets.*, desktop entry, icon, and systemd user service.',
    installCmd: 'sudo dpkg -i urwidgets-bundle.deb && sudo apt-get install -f',
  },
  {
    name: 'urwidgets-bundle.zip',
    href: '/api/download/urwidgets-bundle.zip',
    size: 'v3.1.0 (1.6 MB)',
    kind: 'Complete Source & Plasmoid Bundle (.zip) · v3.1.0',
    description:
      'Complete v3.1.0 ZIP archive containing cleaned Rust Cargo workspace (core/src/lib.rs + main.rs), Tauri Control Center connected to urwidgets_daemon, all 10 KDE Plasma 5 Plasmoids, and CHANGELOG.md.',
    installCmd: 'unzip urwidgets-bundle.zip && cd urwidgets && ./scripts/install.sh',
  },
  {
    name: 'urwidgets.plasmoid',
    href: '/api/download/urwidgets.plasmoid',
    size: 'v3.1.0 (477 KB)',
    kind: 'Native KDE Plasma 5 Applet (.plasmoid) · v3.1.0',
    description:
      'Standard KDE Plasma 5 kpackagetool5 archive containing metadata.desktop (v3.1.0), cleaned QML widgets, double-buffered PhotoWidget.qml, and Author Portfolio & Instagram links in configGeneral.qml.',
    installCmd: 'kpackagetool5 --type Plasma/Applet --install urwidgets.plasmoid',
  },
  {
    name: 'urwidgets-source.tar.gz',
    href: '/api/download/urwidgets-source.tar.gz',
    size: 'v3.1.0 (1.5 MB)',
    kind: 'Complete Compilable Source Tarball (.tar.gz) · v3.1.0',
    description:
      'Full v3.1.0 Rust Cargo workspace (core/), 10 standalone KDE Plasma 5 Plasmoids (plasma/widgets/), unified Plasmoid (plasma/plasmoid/), Tauri 2 config, and install/package scripts.',
    installCmd: 'tar -xzf urwidgets-source.tar.gz && cd urwidgets && ./scripts/install.sh',
  },
  {
    name: 'SHA256SUMS',
    href: '/api/download/SHA256SUMS',
    size: 'v3.1.0 (SHA-256)',
    kind: 'Cryptographic Checksum Manifest · v3.1.0',
    description:
      'SHA-256 checksums for URWidgets_3.1.0_amd64.deb, urwidgets-bundle.deb, urwidgets-bundle.zip, urwidgets.plasmoid, and urwidgets-source.tar.gz.',
    installCmd: 'sha256sum -c SHA256SUMS',
  },
];

export default function SourceAndPackagesView() {
  const [selectedPath, setSelectedPath] = useState<string>(
    'urwidgets/CHANGELOG.md'
  );
  const [categoryFilter, setCategoryFilter] = useState<
    'all' | 'rust' | 'qml' | 'scripts' | 'docs'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedFile, setCopiedFile] = useState(false);
  const [downloadingPkg, setDownloadingPkg] = useState<string | null>(null);

  const filteredFiles = useMemo(() => {
    return NATIVE_SOURCE_FILES.filter((file) => {
      if (categoryFilter === 'rust' && !file.path.includes('/core/') && !file.path.endsWith('Cargo.toml')) {
        return false;
      }
      if (categoryFilter === 'qml' && !file.path.includes('/plasma/')) {
        return false;
      }
      if (categoryFilter === 'scripts' && !file.path.includes('/scripts/') && !file.path.includes('/control-center/')) {
        return false;
      }
      if (categoryFilter === 'docs' && !file.path.endsWith('.md') && !file.path.endsWith('LICENSE')) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          file.path.toLowerCase().includes(q) ||
          file.content.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [categoryFilter, searchQuery]);

  const currentFile: NativeSourceFile =
    filteredFiles.find((f) => f.path === selectedPath) ||
    filteredFiles[0] ||
    NATIVE_SOURCE_FILES[0];

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(currentFile.content);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  return (
    <section className="space-y-6">
      {/* Section 1: Installable Release Packages */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Package className="w-5 h-5 text-sky-400" />
              Generated Installation Artifacts (.deb & .plasmoid)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Packaged via <code className="font-mono">dpkg-deb</code> and{' '}
              <code className="font-mono">zipfile</code> directly from the{' '}
              <code className="font-mono">/urwidgets</code> project workspace.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 tabular-nums">
            4 Verified Deliverables · Ready for Linux Mint + KDE Plasma 5
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ARTIFACT_PACKAGES.map((pkg) => (
            <div
              key={pkg.name}
              className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-sm font-bold text-sky-400">
                    {pkg.name}
                  </span>
                  <span className="text-xs text-slate-400 font-mono tabular-nums">
                    {pkg.size} · {pkg.kind}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {pkg.description}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="bg-slate-900 rounded-lg px-3 py-1.5 font-mono text-[11px] text-slate-300 truncate flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{pkg.installCmd}</span>
                </div>
                <div className="flex justify-end">
                  <a
                    href={pkg.href}
                    download={pkg.name}
                    onClick={async (e) => {
                      e.preventDefault();
                      setDownloadingPkg(pkg.name);
                      try {
                        await downloadReleaseArtifact(pkg.name);
                      } finally {
                        setDownloadingPkg(null);
                      }
                    }}
                    className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {downloadingPkg === pkg.name ? `Downloading ${pkg.name}...` : `Download ${pkg.name}`}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Complete Native Source Code Explorer */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-semibold text-white">
              Native Rust & KDE Plasma 5 Source Tree ({NATIVE_SOURCE_FILES.length} files)
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
              {(
                [
                  { id: 'all', label: 'All Files' },
                  { id: 'rust', label: 'Rust Daemon' },
                  { id: 'qml', label: 'Plasma 5 QML' },
                  { id: 'scripts', label: 'Scripts & Tauri' },
                  { id: 'docs', label: 'Docs' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCategoryFilter(tab.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    categoryFilter === tab.id
                      ? 'bg-sky-500 text-slate-950 font-semibold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                aria-label="Search Source Files"
                placeholder="Filter file or symbol..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
          {/* Left File List */}
          <div className="lg:col-span-4 border-r border-slate-800 bg-slate-950/60 max-h-[560px] overflow-y-auto divide-y divide-slate-800/60">
            {filteredFiles.map((f) => {
              const active = f.path === currentFile.path;
              return (
                <button
                  key={f.path}
                  type="button"
                  onClick={() => setSelectedPath(f.path)}
                  className={`w-full px-4 py-2.5 text-left flex items-center justify-between gap-2 transition-colors ${
                    active
                      ? 'bg-sky-500/15 text-sky-300 font-semibold'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileCode className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span className="text-xs font-mono truncate">
                      {f.path.replace(/^urwidgets\//, '')}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 tabular-nums shrink-0">
                    {f.lines}L
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Code Viewer */}
          <div className="lg:col-span-8 flex flex-col bg-slate-950">
            <div className="px-4 py-2.5 bg-slate-900/70 border-b border-slate-800 flex items-center justify-between gap-2">
              <div className="font-mono text-xs text-slate-200 truncate">
                {currentFile.path} · {currentFile.lines} lines ·{' '}
                {currentFile.sizeBytes} bytes
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 whitespace-nowrap"
              >
                {copiedFile ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Source
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-[510px] overflow-y-auto leading-relaxed">
              <code>{currentFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
