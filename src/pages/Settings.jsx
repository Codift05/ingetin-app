// src/pages/Settings.jsx
import { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { TelegramIcon, CheckCircleIcon, ExternalLinkIcon, BellIcon, TrashIcon } from '../components/Icons';
import './Settings.css';

export default function Settings() {
    const { telegramConnected, setTelegramConnected, telegramChatId, setTelegramChatId, setTasks } = useTaskContext();
    const [chatIdInput, setChatIdInput] = useState(telegramChatId);
    const [saved, setSaved] = useState(false);
    const [reminderSettings, setReminderSettings] = useState({
        h3: true, h1: true, h0: true,
    });

    const handleSave = (e) => {
        e.preventDefault();
        if (chatIdInput.trim()) {
            setTelegramChatId(chatIdInput.trim());
            setTelegramConnected(true);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
    };

    const handleDisconnect = () => {
        setTelegramConnected(false);
        setTelegramChatId('');
        setChatIdInput('');
    };

    const handleClearData = () => {
        if (window.confirm('Yakin ingin menghapus semua data tugas? Tindakan ini tidak dapat dibatalkan.')) {
            setTasks([]);
            localStorage.removeItem('ingetin_tasks');
        }
    };

    return (
        <div className="settings-page">
            {/* Telegram Connection */}
            <div className="card settings-section">
                <div className="settings-section-header">
                    <div className="settings-section-icon">
                        <TelegramIcon size={20} />
                    </div>
                    <div>
                        <h2 className="settings-section-title">Integrasi Telegram</h2>
                        <p className="settings-section-desc">Hubungkan bot Telegram untuk input tugas dan menerima reminder otomatis</p>
                    </div>
                </div>

                {telegramConnected ? (
                    <div className="telegram-connected">
                        <div className="telegram-connected-info">
                            <CheckCircleIcon size={16} />
                            <span>Terhubung sebagai <strong>{telegramChatId}</strong></span>
                        </div>
                        <button className="btn btn-secondary btn-sm" onClick={handleDisconnect}>
                            Putuskan Koneksi
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="telegram-form">
                        <div className="form-group">
                            <label className="form-label" htmlFor="chat-id">Username atau Chat ID Telegram</label>
                            <input
                                id="chat-id"
                                type="text"
                                className="form-input"
                                placeholder="Contoh: @namauser atau 123456789"
                                value={chatIdInput}
                                onChange={e => setChatIdInput(e.target.value)}
                            />
                            <p className="form-hint">
                                Dapatkan Chat ID dengan mengirim pesan ke{' '}
                                <a href="https://t.me/IngetInBot" target="_blank" rel="noopener" className="link">
                                    @IngetInBot
                                </a>
                                {' '}dan ketik <code>/start</code>
                            </p>
                        </div>

                        <div className="settings-bot-steps">
                            <p className="settings-steps-title">Cara menghubungkan:</p>
                            <ol className="settings-steps-list">
                                <li>Buka Telegram dan cari <strong>@IngetInBot</strong></li>
                                <li>Kirim pesan <code>/start</code> ke bot</li>
                                <li>Bot akan membalas dengan Chat ID-mu</li>
                                <li>Masukkan Chat ID di atas dan klik Simpan</li>
                            </ol>
                        </div>

                        <div className="settings-actions">
                            <button type="submit" className="btn btn-primary">
                                {saved ? <><CheckCircleIcon size={16} /> Tersimpan</> : 'Simpan & Hubungkan'}
                            </button>
                            <a
                                href="https://t.me/IngetInBot"
                                target="_blank"
                                rel="noopener"
                                className="btn btn-secondary"
                            >
                                <TelegramIcon size={16} /> Buka Bot Telegram <ExternalLinkIcon size={14} />
                            </a>
                        </div>
                    </form>
                )}
            </div>

            {/* Reminder Settings */}
            <div className="card settings-section">
                <div className="settings-section-header">
                    <div className="settings-section-icon">
                        <BellIcon size={20} />
                    </div>
                    <div>
                        <h2 className="settings-section-title">Pengaturan Reminder</h2>
                        <p className="settings-section-desc">Pilih kapan kamu ingin menerima notifikasi deadline</p>
                    </div>
                </div>

                <div className="reminder-toggles">
                    {[
                        { key: 'h3', label: 'H-3 Deadline', desc: '3 hari sebelum deadline' },
                        { key: 'h1', label: 'H-1 Deadline', desc: '1 hari sebelum deadline' },
                        { key: 'h0', label: 'H-0 Deadline', desc: 'Tepat di hari deadline' },
                    ].map(({ key, label, desc }) => (
                        <div key={key} className="reminder-toggle-item">
                            <div>
                                <p className="reminder-toggle-label">{label}</p>
                                <p className="reminder-toggle-desc">{desc}</p>
                            </div>
                            <button
                                className={`toggle-btn ${reminderSettings[key] ? 'active' : ''}`}
                                onClick={() => setReminderSettings(prev => ({ ...prev, [key]: !prev[key] }))}
                                aria-label={`Toggle ${label}`}
                                role="switch"
                                aria-checked={reminderSettings[key]}
                            >
                                <span className="toggle-thumb" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Danger Zone */}
            <div className="card settings-section settings-danger">
                <div className="settings-section-header">
                    <div className="settings-section-icon danger">
                        <TrashIcon size={20} />
                    </div>
                    <div>
                        <h2 className="settings-section-title">Zona Berbahaya</h2>
                        <p className="settings-section-desc">Tindakan ini bersifat permanen dan tidak dapat dikembalikan</p>
                    </div>
                </div>
                <div className="settings-actions">
                    <button className="btn btn-danger btn-sm" onClick={handleClearData}>
                        <TrashIcon size={14} /> Hapus Semua Data Tugas
                    </button>
                </div>
            </div>

            {/* About */}
            <div className="settings-about">
                <p className="about-name">Inget.in v1.0.0</p>
                <p className="about-desc">Smart Academic Reminder — Dibuat untuk mahasiswa Indonesia</p>
            </div>
        </div>
    );
}
