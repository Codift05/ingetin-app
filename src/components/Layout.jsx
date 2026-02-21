// src/components/Layout.jsx
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { MenuIcon, MoonIcon, SunIcon } from './Icons';
import { useTheme } from '../context/ThemeContext';
import './Layout.css';

const pageTitles = {
    '/dashboard': { title: 'Dashboard', subtitle: 'Pantau semua tugas dan deadline-mu' },
    '/tasks': { title: 'Daftar Tugas', subtitle: 'Kelola dan selesaikan tugas akademikmu' },
    '/reminders': { title: 'Reminder', subtitle: 'Riwayat dan jadwal notifikasi Telegram' },
    '/settings': { title: 'Pengaturan', subtitle: 'Konfigurasi bot Telegram dan akun' },
};

function formatDate(date) {
    return date.toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
}

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile overlay
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // For desktop toggle
    const location = useLocation();
    const page = pageTitles[location.pathname] || { title: 'Inget.in', subtitle: '' };
    const { isDark, toggleTheme } = useTheme();

    return (
        <div className="app-layout">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
            <div
                className="app-main"
                style={{ marginLeft: isSidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)' }}
            >
                <header className="app-header">
                    <div className="header-left">
                        <button
                            className="header-menu-btn"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Buka menu"
                        >
                            <MenuIcon size={20} />
                        </button>
                        <div>
                            <h1 className="header-title">{page.title}</h1>
                            {page.subtitle && <p className="header-subtitle">{page.subtitle}</p>}
                        </div>
                    </div>
                    <div className="header-right">
                        <span className="header-date">{formatDate(new Date())}</span>
                        <button
                            className="theme-toggle-btn"
                            onClick={toggleTheme}
                            aria-label={isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
                            title={isDark ? 'Mode Terang' : 'Mode Gelap'}
                        >
                            {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
                        </button>
                    </div>
                </header>
                <main className="app-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
