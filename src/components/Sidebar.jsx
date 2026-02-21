// src/components/Sidebar.jsx
import { NavLink, Link } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import {
    HomeIcon, ListIcon, BellIcon,
    SettingsIcon, TelegramIcon, ArrowRightIcon,
} from './Icons';
import './Sidebar.css';

const navItems = [
    { label: 'Dashboard', icon: HomeIcon, to: '/dashboard' },
    { label: 'Tugas', icon: ListIcon, to: '/tasks', showBadge: true },
    { label: 'Reminder', icon: BellIcon, to: '/reminders' },
];

export default function Sidebar({ isOpen, onClose }) {
    const { tasks, getStats, telegramConnected, telegramChatId } = useTaskContext();
    const stats = getStats();
    const pendingCount = stats.pending;

    return (
        <>
            {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                {/* Logo */}
                <div className="sidebar-logo">
                    <img src="/MIP 2.png" height="36" alt="Inget.in" style={{ objectFit: 'contain', display: 'block' }} />
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    <span className="sidebar-section-label">Menu</span>
                    {navItems.map(({ label, icon: Icon, to, showBadge }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                            onClick={onClose}
                        >
                            <Icon size={18} className="sidebar-item-icon" />
                            <span>{label}</span>
                            {showBadge && pendingCount > 0 && (
                                <span className="sidebar-item-badge">{pendingCount}</span>
                            )}
                        </NavLink>
                    ))}

                    <span className="sidebar-section-label">Konfigurasi</span>
                    <NavLink
                        to="/settings"
                        className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                        onClick={onClose}
                    >
                        <SettingsIcon size={18} className="sidebar-item-icon" />
                        <span>Pengaturan</span>
                    </NavLink>
                </nav>

                {/* Telegram status footer */}
                <div className="sidebar-footer">
                    <div className="sidebar-telegram-status">
                        <TelegramIcon size={16} />
                        <div className="sidebar-telegram-info">
                            <div className="sidebar-telegram-label">Telegram Bot</div>
                            <div className="sidebar-telegram-sub">
                                {telegramConnected ? `@${telegramChatId}` : 'Belum terhubung'}
                            </div>
                        </div>
                        <div className={`sidebar-telegram-dot ${telegramConnected ? 'connected' : 'disconnected'}`} />
                    </div>

                    {/* Back to Landing */}
                    <Link to="/" className="sidebar-back-home" onClick={onClose}>
                        <ArrowRightIcon size={14} style={{ transform: 'rotate(180deg)' }} />
                        <span>Kembali ke Beranda</span>
                    </Link>
                </div>
            </aside>
        </>
    );
}
