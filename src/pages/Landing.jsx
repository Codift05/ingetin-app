// src/pages/Landing.jsx — Public landing page for Inget.in
import { Link } from 'react-router-dom';
import {
    LogoIcon, TelegramIcon, BellIcon, CheckCircleIcon, ZapIcon,
    ArrowRightIcon, ShieldIcon, CalendarIcon, ChartBarIcon,
    MoonIcon, SunIcon,
} from '../components/Icons';
import { useTheme } from '../context/ThemeContext';
import './Landing.css';

const features = [
    {
        icon: TelegramIcon,
        title: 'Input via Telegram',
        desc: 'Cukup kirim pesan ke bot, tugas langsung tersimpan ke dashboard secara real-time.',
    },
    {
        icon: BellIcon,
        title: 'Reminder Otomatis',
        desc: 'Notifikasi dikirim H-3, H-1, dan H-0 deadline langsung ke chat pribadimu.',
    },
    {
        icon: ChartBarIcon,
        title: 'Dashboard Lengkap',
        desc: 'Pantau semua deadline, statistik, dan checklist dari satu tampilan terpusat.',
    },
    {
        icon: ZapIcon,
        title: 'Gratis & Cepat',
        desc: 'Tanpa biaya apapun. Cukup satu kali setup, seumur hidup diingatkan.',
    },
];

const steps = [
    {
        number: '01',
        title: 'Setup Bot Telegram',
        desc: 'Cari @IngetInBot di Telegram, kirim /start dan dapatkan Chat ID-mu.',
    },
    {
        number: '02',
        title: 'Tambah Tugas',
        desc: 'Ketik /tugas IMK deadline 25 Maret 23:59 — bot langsung menyimpan tugasmu.',
    },
    {
        number: '03',
        title: 'Pantau Dashboard',
        desc: 'Buka dashboard untuk melihat semua tugas, countdown, dan statistikmu.',
    },
    {
        number: '04',
        title: 'Terima Reminder',
        desc: 'Bot otomatis mengirim pengingat H-3, H-1, H-0 ke Telegram-mu.',
    },
];

export default function Landing() {
    const { isDark, toggleTheme } = useTheme();
    return (
        <div className="landing">
            {/* Navbar */}
            <nav className="landing-nav">
                <div className="landing-container">
                    <div className="nav-brand">
                        <img src="/MIP 2.png" height="38" alt="Inget.in" style={{ display: 'block', objectFit: 'contain' }} />
                    </div>
                    <div className="nav-links">
                        <a href="#fitur" className="nav-link">Fitur</a>
                        <a href="#cara-kerja" className="nav-link">Cara Kerja</a>
                        <button
                            className="landing-theme-toggle"
                            onClick={toggleTheme}
                            aria-label={isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
                            title={isDark ? 'Mode Terang' : 'Mode Gelap'}
                        >
                            {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
                        </button>
                        <Link to="/dashboard" className="btn btn-primary btn-sm">
                            Buka Dashboard <ArrowRightIcon size={14} />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="hero">
                <div className="landing-container">
                    <div className="hero-badge">
                        <TelegramIcon size={13} />
                        <span>Terintegrasi dengan Telegram Bot</span>
                    </div>
                    <h1 className="hero-title">
                        Jangan pernah lupa<br />
                        <span className="hero-title-accent">deadline tugas</span> lagi
                    </h1>
                    <p className="hero-desc">
                        Inget.in membantu mahasiswa mencatat tugas via Telegram, memantau deadline
                        di satu dashboard, dan menerima pengingat otomatis sebelum waktu habis.
                    </p>
                    <div className="hero-actions">
                        <Link to="/dashboard" className="btn btn-primary btn-lg">
                            Buka Dashboard
                            <ArrowRightIcon size={18} />
                        </Link>
                        <a href="#cara-kerja" className="btn btn-secondary btn-lg">
                            Lihat Cara Kerja
                        </a>
                    </div>

                    {/* Stats */}
                    <div className="hero-stats">
                        <div className="hero-stat">
                            <span className="hero-stat-value">Rp0</span>
                            <span className="hero-stat-label">Biaya setup</span>
                        </div>
                        <div className="hero-stat-divider" />
                        <div className="hero-stat">
                            <span className="hero-stat-value">3x</span>
                            <span className="hero-stat-label">Reminder per tugas</span>
                        </div>
                        <div className="hero-stat-divider" />
                        <div className="hero-stat">
                            <span className="hero-stat-value">Real-time</span>
                            <span className="hero-stat-label">Sinkronisasi data</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="fitur" className="section">
                <div className="landing-container">
                    <div className="section-head">
                        <p className="section-eyebrow">Fitur Utama</p>
                        <h2 className="section-title">Semua yang kamu butuhkan</h2>
                        <p className="section-sub">
                            Dirancang khusus untuk mahasiswa yang butuh sistem pengingat sederhana namun efektif.
                        </p>
                    </div>
                    <div className="features-grid">
                        {features.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="feature-card">
                                <div className="feature-icon">
                                    <Icon size={20} />
                                </div>
                                <h3 className="feature-title">{title}</h3>
                                <p className="feature-desc">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section id="cara-kerja" className="section section-alt">
                <div className="landing-container">
                    <div className="section-head">
                        <p className="section-eyebrow">Cara Kerja</p>
                        <h2 className="section-title">Mulai dalam 4 langkah mudah</h2>
                        <p className="section-sub">
                            Setup sekali, diingatkan selamanya. Tidak perlu buka aplikasi manual.
                        </p>
                    </div>
                    <div className="steps-grid">
                        {steps.map(({ number, title, desc }) => (
                            <div key={number} className="step-card">
                                <span className="step-number">{number}</span>
                                <h3 className="step-title">{title}</h3>
                                <p className="step-desc">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Telegram Command Preview */}
            <section className="section">
                <div className="landing-container">
                    <div className="telegram-preview-wrapper">
                        <div className="telegram-preview-info">
                            <p className="section-eyebrow">Demo Bot</p>
                            <h2 className="telegram-preview-title">Semudah chat WhatsApp</h2>
                            <p className="telegram-preview-desc">
                                Cukup kirim pesan ke bot dengan format sederhana. Bot akan otomatis
                                menyimpan tugasmu dan mengingatkan di waktu yang tepat.
                            </p>
                            <Link to="/settings" className="btn btn-primary" style={{ width: 'fit-content' }}>
                                Hubungkan Telegram
                                <TelegramIcon size={16} />
                            </Link>
                        </div>
                        <div className="telegram-chat-preview">
                            <div className="chat-header">
                                <div className="chat-avatar">
                                    <LogoIcon size={28} />
                                </div>
                                <div>
                                    <p className="chat-name">@IngetInBot</p>
                                    <p className="chat-status">online</p>
                                </div>
                            </div>
                            <div className="chat-messages">
                                <div className="chat-bubble user">
                                    /start
                                </div>
                                <div className="chat-bubble bot">
                                    Halo! Selamat datang di Inget.in.<br />
                                    Chat ID-mu: <strong>123456789</strong><br />
                                    Gunakan /tugas untuk menambah tugas.
                                </div>
                                <div className="chat-bubble user">
                                    /tugas IMK deadline 25 Maret 23:59
                                </div>
                                <div className="chat-bubble bot">
                                    Tugas berhasil disimpan!<br />
                                    Mata kuliah: <strong>IMK</strong><br />
                                    Deadline: <strong>25 Maret 2025, 23:59</strong><br />
                                    Kamu akan diingatkan H-3, H-1, H-0.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* Footer */}
            <footer className="landing-footer">
                <div className="landing-container">
                    <div className="footer-inner">
                        <div className="footer-brand">
                            <img src="/MIP 2.png" height="28" alt="Inget.in" style={{ display: 'block', objectFit: 'contain' }} />
                        </div>
                        <p className="footer-copy">
                            Develop by Miftahuddin S. Arsyad
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
