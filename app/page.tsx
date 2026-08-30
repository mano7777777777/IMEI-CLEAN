'use client';

import { useMemo, useRef, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, CircleAlert, Database, FileCheck2, FileSpreadsheet, FileText, Fingerprint, Info, LoaderCircle, RefreshCw, Search, ShieldCheck, Sparkles, UploadCloud, X } from 'lucide-react';

type ImeiRow = { imei: string; date: string; valid: boolean; reason?: string };
type Notice = { message: string; kind: 'success' | 'error' } | null;
const demoSource = `12/08/2026
356938035643809
356938035643809
356938035643817
14/08/2026
490154203237518
352099001761481
12345678
17/08/2026
353918052109211`;

function isValidImei(value: string) {
  if (!/^\d{15}$/.test(value)) return false;
  let sum = 0;
  for (let i = 0; i < 15; i++) { let digit = Number(value[i]); if (i % 2 === 1) { digit *= 2; if (digit > 9) digit -= 9; } sum += digit; }
  return sum % 10 === 0;
}

function normalizeDate(line: string) {
  const match = line.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})$/);
  if (!match) return null;
  const year = match[3].length === 2 ? `20${match[3]}` : match[3];
  return `${match[1].padStart(2, '0')}/${match[2].padStart(2, '0')}/${year}`;
}

function parseSource(text: string) {
  const rows: ImeiRow[] = []; let date = '—';
  text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).forEach((line) => {
    const parsedDate = normalizeDate(line);
    if (parsedDate) date = parsedDate;
    else { const imei = line.replace(/[\s'";,]/g, ''); const formatOk = /^\d{15}$/.test(imei); const valid = formatOk && isValidImei(imei); rows.push({ imei, date, valid, reason: formatOk ? 'Clé de contrôle incorrecte' : '15 chiffres requis' }); }
  });
  return rows;
}

function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type })); const link = document.createElement('a'); link.href = url; link.download = name; link.click(); URL.revokeObjectURL(url);
}

function UploadZone({ title, detail, accept, onFile }: { title: string; detail: string; accept: string; onFile: (file: File) => void }) {
  const input = useRef<HTMLInputElement>(null); const [dragging, setDragging] = useState(false);
  return <button type="button" className={`upload-zone ${dragging ? 'is-dragging' : ''}`} onClick={() => input.current?.click()} onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(e) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0]); }}>
    <input ref={input} className="hidden" type="file" accept={accept} onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
    <span className="upload-icon"><UploadCloud size={20} /></span><span><strong>{title}</strong><small>{detail}</small></span><span className="browse">Parcourir</span>
  </button>;
}

export default function Home() {
  const [source, setSource] = useState(''); const [sourceName, setSourceName] = useState(''); const [system, setSystem] = useState<string[]>([]); const [systemName, setSystemName] = useState(''); const [rows, setRows] = useState<ImeiRow[]>([]); const [tab, setTab] = useState<'all' | 'valid' | 'invalid' | 'missing'>('all'); const [query, setQuery] = useState(''); const [page, setPage] = useState(1); const [notice, setNotice] = useState<Notice>(null); const [processing, setProcessing] = useState(false);
  const uniqueRows = useMemo(() => Array.from(new Map(rows.map((row) => [row.imei, row])).values()), [rows]);
  const validRows = uniqueRows.filter((row) => row.valid); const invalidRows = uniqueRows.filter((row) => !row.valid); const systemSet = useMemo(() => new Set(system), [system]); const missingRows = validRows.filter((row) => system.length && !systemSet.has(row.imei)); const duplicates = Math.max(0, rows.length - uniqueRows.length);
  const filtered = (tab === 'valid' ? validRows : tab === 'invalid' ? invalidRows : tab === 'missing' ? missingRows : uniqueRows).filter((row) => row.imei.includes(query)); const pageSize = 8; const pages = Math.max(1, Math.ceil(filtered.length / pageSize)); const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const notify = (message: string, kind: 'success' | 'error' = 'success') => { setNotice({ message, kind }); window.setTimeout(() => setNotice(null), 3200); };
  const readFile = (file: File, isSystem = false) => {
    if (file.size > 10 * 1024 * 1024) return notify('Le fichier dépasse la limite de 10 Mo.', 'error'); const reader = new FileReader();
    reader.onload = () => { const text = String(reader.result ?? ''); if (isSystem) { const values = Array.from(new Set(text.match(/\d{15}/g) ?? [])); setSystem(values); setSystemName(file.name); notify(`${values.length.toLocaleString('fr-FR')} IMEI système chargés.`); } else { setSource(text); setSourceName(file.name); setRows([]); notify('Fichier source prêt à être analysé.'); } };
    reader.onerror = () => notify('Impossible de lire ce fichier.', 'error'); reader.readAsText(file);
  };
  const process = () => { if (!source) return; setProcessing(true); window.setTimeout(() => { const parsed = parseSource(source); setRows(parsed); setProcessing(false); setTab('all'); setPage(1); notify(`${parsed.length.toLocaleString('fr-FR')} lignes analysées localement.`); }, 450); };
  const loadDemo = () => { setSource(demoSource); setSourceName('exemple_imei_aout.txt'); setRows(parseSource(demoSource)); setPage(1); notify('Exemple chargé. Vous pouvez explorer le rapport.'); };
  const exportCsv = () => { const exportRows = tab === 'missing' ? missingRows : uniqueRows; if (!exportRows.length) return notify('Aucune donnée à exporter.', 'error'); const csv = ['IMEI;Date;Statut', ...exportRows.map((r) => `${r.imei};${r.date};${r.valid ? 'Valide' : 'Invalide'}`)].join('\n'); download(`imei-${tab}-${new Date().toISOString().slice(0, 10)}.csv`, `\uFEFF${csv}`, 'text/csv;charset=utf-8'); notify('Export CSV généré.'); };
  const exportPrint = () => { if (!uniqueRows.length) return notify('Aucune donnée à exporter.', 'error'); window.print(); };

  return <main className="app-shell">
    <header className="topbar"><div className="brand"><span className="brand-mark"><Fingerprint size={22} /></span><div><strong>IMEI<span>flow</span></strong><small>Data quality workspace</small></div></div><div className="privacy"><ShieldCheck size={16} /><span>Traitement 100 % local</span></div></header>
    <section className="workspace">
      <div className="intro"><div><p className="eyebrow"><Sparkles size={14} /> Contrôle qualité IMEI</p><h1>Des listes propres.<br /><em>Des écarts visibles.</em></h1><p>Importez, validez et comparez vos numéros IMEI sans envoyer aucune donnée sur un serveur.</p></div><button className="demo-button" onClick={loadDemo}><RefreshCw size={16} /> Charger un exemple</button></div>
      <div className="layout">
        <aside className="control-card">
          <div className="step"><span>01</span><div><strong>Liste à nettoyer</strong><small>TXT · une date suivie des IMEI</small></div></div>
          {sourceName ? <div className="file-chip"><FileCheck2 size={18} /><div><strong>{sourceName}</strong><small>Fichier prêt</small></div><button aria-label="Retirer le fichier" onClick={() => { setSource(''); setSourceName(''); setRows([]); }}><X size={16} /></button></div> : <UploadZone title="Déposez votre liste" detail=".txt · 10 Mo maximum" accept=".txt,text/plain" onFile={(f) => readFile(f)} />}
          <button className="primary-button" disabled={!source || processing} onClick={process}>{processing ? <LoaderCircle className="spin" size={18} /> : <Sparkles size={18} />} {processing ? 'Analyse en cours…' : 'Nettoyer la liste'}</button>
          <div className="divider" /><div className="step"><span>02</span><div><strong>Base de comparaison</strong><small>Optionnel · TXT ou CSV</small></div></div>
          {systemName ? <div className="file-chip system"><Database size={18} /><div><strong>{systemName}</strong><small>{system.length.toLocaleString('fr-FR')} IMEI indexés</small></div><button aria-label="Retirer la base" onClick={() => { setSystem([]); setSystemName(''); }}><X size={16} /></button></div> : <UploadZone title="Ajouter la base système" detail="Détecte les IMEI manquants" accept=".txt,.csv,text/plain,text/csv" onFile={(f) => readFile(f, true)} />}
          <div className="secure-note"><ShieldCheck size={17} /><span><strong>Vos fichiers restent privés.</strong> L’analyse s’effectue dans votre navigateur.</span></div>
        </aside>
        <section className="results-card">
          <div className="results-head"><div><span className="section-kicker">Rapport d’analyse</span><h2>{rows.length ? `${uniqueRows.length.toLocaleString('fr-FR')} IMEI uniques` : 'Aucune analyse en cours'}</h2></div><div className="export-actions"><button onClick={exportCsv} disabled={!rows.length}><FileSpreadsheet size={17} /> CSV</button><button onClick={exportPrint} disabled={!rows.length}><FileText size={17} /> PDF</button></div></div>
          {rows.length ? <><div className="stats-grid">
            <article><span className="stat-icon blue"><Fingerprint size={18} /></span><div><small>Importés</small><strong>{rows.length}</strong><p>Toutes les lignes détectées</p></div></article><article><span className="stat-icon green"><Check size={18} /></span><div><small>Valides</small><strong>{validRows.length}</strong><p>{Math.round((validRows.length / Math.max(1, uniqueRows.length)) * 100)} % de conformité</p></div></article><article><span className="stat-icon amber"><RefreshCw size={18} /></span><div><small>Doublons</small><strong>{duplicates}</strong><p>Retirés automatiquement</p></div></article><article><span className="stat-icon red"><CircleAlert size={18} /></span><div><small>Invalides</small><strong>{invalidRows.length}</strong><p>À vérifier manuellement</p></div></article>
          </div><div className="table-tools"><div className="tabs" role="tablist">{([['all','Tous'],['valid','Valides'],['invalid','À vérifier'],['missing',`Manquants ${system.length ? `(${missingRows.length})` : ''}`]] as const).map(([id,label]) => <button key={id} role="tab" aria-selected={tab === id} disabled={id === 'missing' && !system.length} className={tab === id ? 'active' : ''} onClick={() => { setTab(id); setPage(1); }}>{label}</button>)}</div><label className="search"><Search size={16} /><input value={query} onChange={(e) => { setQuery(e.target.value.replace(/\D/g, '')); setPage(1); }} placeholder="Rechercher un IMEI" aria-label="Rechercher un IMEI" /></label></div>
          <div className="table-wrap"><table><thead><tr><th>IMEI</th><th>Date</th><th>Contrôle</th></tr></thead><tbody>{visible.map((row) => <tr key={row.imei}><td><span className="mono">{row.imei}</span></td><td>{row.date}</td><td><span className={`status ${row.valid ? 'valid' : 'invalid'}`}>{row.valid ? <Check size={13} /> : <CircleAlert size={13} />}{row.valid ? (tab === 'missing' ? 'Absent du système' : 'Conforme') : row.reason}</span></td></tr>)}</tbody></table>{!visible.length && <div className="no-result">Aucun IMEI ne correspond à ce filtre.</div>}</div><div className="pagination"><span>{filtered.length ? `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, filtered.length)} sur ${filtered.length}` : '0 résultat'}</span><div><button disabled={page === 1} onClick={() => setPage((p) => p - 1)} aria-label="Page précédente"><ChevronLeft size={17} /></button><span>Page {page} / {pages}</span><button disabled={page === pages} onClick={() => setPage((p) => p + 1)} aria-label="Page suivante"><ChevronRight size={17} /></button></div></div></> : <div className="empty-state"><span><Fingerprint size={34} /></span><h3>Votre rapport apparaîtra ici</h3><p>Importez un fichier TXT ou chargez l’exemple pour tester le nettoyage, la validation et l’export.</p><button onClick={loadDemo}>Voir avec des données d’exemple <ChevronRight size={16} /></button></div>}
        </section>
      </div>
    </section>
    <footer><span>IMEIflow Pro</span><p><Info size={14} /> Validation par algorithme de Luhn · Aucun stockage distant</p></footer>
    {notice && <div className={`toast ${notice.kind}`} role="status">{notice.kind === 'success' ? <Check size={17} /> : <CircleAlert size={17} />}{notice.message}</div>}
  </main>;
}
