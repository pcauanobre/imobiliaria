export const proprietariosCss = `
:root {
  --bg:#f5f7fb; 
  --card:#fff; 
  --text:#0f172a; 
  --muted:#64748b;
  --brand:#0B1321; 
  --border:#e2e8f0; 
  --ring:0 0 0 3px rgba(11,19,33,.22);
  --shadow:0 14px 40px rgba(2,6,23,.08); 
  --purple:#4f46e5; 
  --purple-100:#eef2ff;
}

/* ===== Layout geral ===== */
.page { padding:24px }
.header { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px }

/* ===== Breadcrumb ===== */
.breadcrumb { color: var(--muted); font-size:14px }
.breadcrumb-active {
  font-weight:700;
  color: var(--brand); 
}

/* ===== Busca ===== */
.searchwrap { margin:8px auto 16px; width:100%; max-width:560px; display:flex; justify-content:center }
.input {
  width:100%; background:#fff; border:1px solid var(--border); border-radius:14px;
  padding:12px 14px; font-size:15.5px; outline:none;
}
.input:focus { box-shadow:var(--ring); border-color:#94a3b8 }

/* ===== Botões ===== */
.btn {
  display:inline-flex; align-items:center; gap:6px; border-radius:10px;
  border:1px solid var(--border); padding:6px 10px; background:#f8fafc;
  color:#0f172a; font-weight:700; cursor:pointer; font-size:13px;
  width:auto; white-space:nowrap; transition:all .15s ease;
}
.btn.primary { background:var(--brand); color:#fff; border-color:transparent }
.btn.ghost { background:#fff }
.btn:hover { filter:brightness(.98) }
.btn.micro { padding:3px 8px; font-size:11.5px; border-radius:8px; font-weight:600 }

/* ===== Cards & Tabelas ===== */
.card { background:var(--card); border:1px solid rgba(2,6,23,.06); border-radius:22px; box-shadow:var(--shadow) }
.cardhead { display:flex; justify-content:space-between; align-items:center; padding:14px 18px; border-bottom:1px solid var(--border) }
.cardhead h2 { margin:0 0 2px; font-size:18px }
.cardhead p { margin:0; color:var(--muted); font-size:13.5px }

.tablewrap { overflow:auto }
.table { width:100%; border-collapse:separate; border-spacing:0 }
.table thead th {
  background:#f8fafc; text-align:left; font-size:12.5px; letter-spacing:.03em;
  color:#475569; padding:12px 16px; border-bottom:1px solid var(--border);
}
.table tbody td { padding:12px 16px; border-bottom:1px solid #eef2f7; font-size:15px }
.table tbody tr:hover { background:#fafafa }
.rowact { display:flex; gap:8px }
.iconbtn { border:0; background:transparent; padding:6px; border-radius:10px; cursor:pointer }
.iconbtn:hover { background:#f1f5f9 }
.iconbtn.danger:hover { background:#ffeef0 }

/* ===== Modal principal ===== */
.backdrop { position:fixed; inset:0; background:rgba(2,6,23,.45); display:flex; align-items:center; justify-content:center; padding:20px; z-index:40 }
.modal { width:100%; max-width:980px; background:#fff; border:1px solid rgba(2,6,23,.06); border-radius:18px; box-shadow:var(--shadow) }
.modalhead { display:flex; align-items:center; justify-content:space-between; padding:14px 18px; border-bottom:1px solid var(--border) }
.modal-title { display:flex; align-items:flex-start; gap:12px }
.modal-title h3 { margin:0; font-size:18px }
.modal-sub { margin:2px 0 0; color:#64748b; font-size:13px }
.xbtn { border:0; background:transparent; border-radius:10px; padding:8px; cursor:pointer }
.xbtn:hover { background:#f1f5f9 }
.tabbar { display:flex; gap:8px; padding:12px 18px }
.tab { border:1px solid #e5e7eb; background:#fff; border-radius:999px; padding:8px 12px; font-weight:600; color:#475569; cursor:pointer }
.tab.active { background:var(--purple-100); border-color:#dbe3ff; color:#3730a3 }
.modalbody { padding:16px 18px }

.info-card { background:#f9fbff; border:1px solid #e6eefc; border-radius:14px; padding:14px }
.infogrid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px }
@media (max-width:720px){ .infogrid { grid-template-columns:1fr } }
.k { font-size:12px; color:#64748b }
.v { font-size:15.5px; color:#0f172a; margin-top:6px }
.editwrap { display:flex; justify-content:flex-end; margin-top:12px; gap:8px }
.editbtn { display:inline-flex; gap:6px; align-items:center; border:1px solid #e5e7eb; border-radius:10px; background:#fff; padding:8px 12px; cursor:pointer }
.editbtn:hover { background:#f8fafc }
.savebtn { background:#4f46e5; color:#fff; border:0; border-radius:10px; padding:8px 12px; cursor:pointer }

/* ===== Confirmação exclusão ===== */
.small-modal { width:100%; max-width:520px; background:#fff; border:1px solid rgba(2,6,23,.06); border-radius:16px; box-shadow:var(--shadow); padding:16px }
.confirm-title { margin:0 0 6px; font-size:18px }
.confirm-text { margin:0 0 12px; color:#475569 }
.confirm-input { width:100%; border:1px solid var(--border); border-radius:12px; padding:10px 12px; font-size:15px }
.confirm-actions { margin-top:12px; display:flex; gap:8px; justify-content:flex-end }
.danger { background:#ef4444; color:#fff; border:0; border-radius:10px; padding:8px 12px; cursor:pointer }

/* ===== Botão maior (padrão) ===== */
.btn.big {
  padding:10px 18px;
  font-size:14.5px;
  border-radius:12px;
  font-weight:700;
}
`;
