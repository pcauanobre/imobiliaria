import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./layout.css";
import { useAuth } from "../../hooks/useAuth";
import ProfileModal from "./modals/ProfileModal";
import NotificationsModal from "./modals/NotificationsModal";
import HintModal from "./modals/HintModal";

/** Ícones SVG sem libs */
function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  } as any;

  switch (name) {
    case "home":
      return (
        <svg {...common}>
          <path d="M3 9.75L12 3l9 6.75" />
          <path d="M4.5 10.5V21a.75.75 0 0 0 .75.75H9.75V15a2.25 2.25 0 0 1 4.5 0v6.75h4.5A.75.75 0 0 0 19.5 21V10.5" />
        </svg>
      );
    case "dashboard":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "bell":
      return (
        <svg {...common}>
          <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.7 1.7 0 0 0 3.4 0" />
        </svg>
      );
    case "alert":
      return (
        <svg {...common}>
          <path d="m10.29 3.86-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.71-3.14l-8-14a2 2 0 0 0-3.42 0Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      );
    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 0-.33 1.82 2 2 0 1 1-3.32 0 1.65 1.65 0 0 0-.33-1.82 1.65 1.65 0 0 0-1-.6 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-.6-1 1.65 1.65 0 0 0-1.82-.33 2 2 0 1 1 0-3.32 1.65 1.65 0 0 0 1.82-.33 1.65 1.65 0 0 0 .6-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 5.94 2.3l.06.06A1.65 1.65 0 0 0 7 4.6a1.65 1.65 0 0 0 1-.6 1.65 1.65 0 0 0 .33-1.82 2 2 0 1 1 3.32 0 1.65 1.65 0 0 0 .33 1.82 1.65 1.65 0 0 0 1 .6 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.26.3.47.64.6 1a1.65 1.65 0 0 0 1.82.33 2 2 0 1 1 0 3.32 1.65 1.65 0 0 0-1.82.33c-.13.15-.34.49-.6 1Z" />
        </svg>
      );
    case "logout":
      return (
        <svg {...common}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      );
    case "edit":
      return (
        <svg {...common}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [hint, setHint] = useState<{ title: string; msg: string } | null>(null);

  const displayName = user?.nome ?? "Usuário";
  const email = user?.email ?? "—";
  const avatarUrl =
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=facearea&facepad=2&h=200";

  function openBadgeHint(kind: "Reajuste" | "Vencimento") {
    const base =
      "Essa opção irá abrir a área relacionada e indicar onde ficam os documentos/contratos vinculados.";
    const extra =
      kind === "Reajuste"
        ? " Use para ver contratos que precisam de atualização de valor."
        : " Use para ver contratos próximos do vencimento.";
    setHint({ title: kind, msg: base + extra });
  }

  return (
    <div className="layout-root">
      {/* SIDEBAR */}
      <aside className="side">
        <a href="/" className="brand" aria-label="Início">
          <span className="brand-logo"><Icon name="home" /></span>
          <div className="brand-text">
            <span className="brand-sub">Sistema Imobiliário</span>
            <span className="brand-title">Painel</span>
          </div>
        </a>

        {/* Notificações + sino (abre modal de lista) */}
        <div className="notif-card">
          <div className="notif-head">
            <h3>Notificações</h3>
            <button
              className="icon-btn ghost"
              title="Abrir todas"
              onClick={() => setShowNotifs(true)}
            >
              <Icon name="bell" />
            </button>
          </div>

          <ul className="notif-list">
            <li className="notif-item">
              <div className="notif-badge">
                <span
                  className="chip chip-orange"
                  onClick={() => openBadgeHint("Reajuste")}
                  title="Sobre reajustes"
                >
                  Reajuste
                </span>
              </div>
              <div className="notif-texts">
                <div className="notif-title">Contrato #1023</div>
                <div className="notif-sub">em 30 dias</div>
              </div>
            </li>

            <li className="notif-item">
              <div className="notif-badge">
                <span
                  className="chip chip-rose"
                  onClick={() => openBadgeHint("Vencimento")}
                  title="Sobre vencimentos"
                >
                  Vencimento
                </span>
              </div>
              <div className="notif-texts">
                <div className="notif-title">Contrato #4823</div>
                <div className="notif-sub">em 28 dias</div>
              </div>
            </li>

            <li className="notif-item">
              <div className="notif-badge">
                <span
                  className="chip chip-orange"
                  onClick={() => openBadgeHint("Reajuste")}
                  title="Sobre reajustes"
                >
                  Reajuste
                </span>
              </div>
              <div className="notif-texts">
                <div className="notif-title">Contrato #9033</div>
                <div className="notif-sub">em 12 dias</div>
              </div>
            </li>
          </ul>
        </div>

        {/* Navegação */}
        <nav className="nav">
          <NavLink to="/dashboard" className="nav-link">
            <Icon name="dashboard" /><span>Dashboard</span>
          </NavLink>
          <NavLink to="/proprietarios" className="nav-link">
            <Icon name="users" /><span>Proprietários</span>
          </NavLink>
          <NavLink to="/alertas" className="nav-link">
            <Icon name="alert" /><span>Alertas</span>
          </NavLink>
          <NavLink to="/config" className="nav-link">
            <Icon name="settings" /><span>Configurações</span>
          </NavLink>
        </nav>

        {/* Usuário */}
        <div className="user-box">
          <button className="avatar" onClick={() => setShowProfile(true)} title="Editar perfil">
            <img src={avatarUrl} alt="avatar" />
            <span className="avatar-overlay"><Icon name="edit" /></span>
          </button>

          <div className="user-info">
            <div className="user-name">{displayName}</div>
            <div className="user-email">{email}</div>
          </div>

          <button className="logout-btn" title="Sair" onClick={logout}>
            <Icon name="logout" size={20} />
          </button>
        </div>
      </aside>

      {/* CONTEÚDO */}
      <main className="content">{children}</main>

      {/* MODAIS */}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
      {showNotifs && <NotificationsModal onClose={() => setShowNotifs(false)} />}
      {hint && (
        <HintModal
          title={hint.title}
          message={hint.msg}
          onClose={() => setHint(null)}
        />
      )}
    </div>
  );
}
