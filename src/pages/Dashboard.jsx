// src/pages/Dashboard.jsx
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import AddTaskModal from '../components/AddTaskModal';
import {
    CheckCircleIcon, ClockIcon, AlertTriangleIcon, BellIcon,
    PlusIcon, TelegramIcon, CheckIcon, ArrowRightIcon
} from '../components/Icons';
import './Dashboard.css';

function getCountdown(deadline) {
    const now = new Date();
    const dl = new Date(deadline);
    const diff = dl - now;

    if (diff <= 0) return { label: 'Lewat waktu', value: 'OVERDUE', type: 'overdue' };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days === 0 && hours === 0) return { label: `${minutes}m tersisa`, value: `${minutes}m`, type: 'urgent' };
    if (days === 0) return { label: `${hours}j ${minutes}m tersisa`, value: `${hours}j`, type: 'urgent' };
    if (days <= 1) return { label: `${days}h ${hours}j tersisa`, value: `H-${days}`, type: 'urgent' };
    if (days <= 3) return { label: `${days} hari tersisa`, value: `H-${days}`, type: 'warning' };
    return { label: `${days} hari tersisa`, value: `H-${days}`, type: 'normal' };
}

function getUrgencyClass(type) {
    if (type === 'urgent' || type === 'overdue') return 'urgent';
    if (type === 'warning') return 'warning';
    return 'normal';
}

function DonutChart({ completed, pending, overdue }) {
    const total = completed + pending + overdue || 1;
    const r = 52;
    const cx = 64;
    const cy = 64;
    const circumference = 2 * Math.PI * r;

    const completedPct = completed / total;
    const pendingPct = pending / total;
    const overduePct = overdue / total;

    const completedLen = completedPct * circumference;
    const pendingLen = pendingPct * circumference;
    const overdueLen = overduePct * circumference;

    return (
        <svg width="128" height="128" className="donut-svg">
            {/* Track */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--color-border)" strokeWidth="12" />
            {/* Overdue */}
            {overduePct > 0 && (
                <circle
                    cx={cx} cy={cy} r={r} fill="none"
                    stroke="var(--color-danger)" strokeWidth="12"
                    strokeDasharray={`${overdueLen} ${circumference - overdueLen}`}
                    strokeDashoffset={circumference * 0.25}
                    transform={`rotate(${360 * (completedPct + pendingPct)} ${cx} ${cy})`}
                    style={{ transition: 'stroke-dasharray 0.8s ease' }}
                />
            )}
            {/* Pending */}
            {pendingPct > 0 && (
                <circle
                    cx={cx} cy={cy} r={r} fill="none"
                    stroke="var(--color-warning)" strokeWidth="12"
                    strokeDasharray={`${pendingLen} ${circumference - pendingLen}`}
                    strokeDashoffset={circumference * 0.25}
                    transform={`rotate(${360 * completedPct} ${cx} ${cy})`}
                    style={{ transition: 'stroke-dasharray 0.8s ease' }}
                />
            )}
            {/* Completed */}
            {completedPct > 0 && (
                <circle
                    cx={cx} cy={cy} r={r} fill="none"
                    stroke="var(--color-success)" strokeWidth="12"
                    strokeDasharray={`${completedLen} ${circumference - completedLen}`}
                    strokeDashoffset={circumference * 0.25}
                    style={{ transition: 'stroke-dasharray 0.8s ease' }}
                />
            )}
            {/* Center text */}
            <text x={cx} y={cy - 6} textAnchor="middle" fill="var(--color-text-primary)"
                fontSize="20" fontWeight="700" fontFamily="Inter, sans-serif">
                {Math.round(completedPct * 100)}%
            </text>
            <text x={cx} y={cy + 14} textAnchor="middle" fill="var(--color-text-muted)"
                fontSize="10" fontFamily="Inter, sans-serif">
                selesai
            </text>
        </svg>
    );
}

export default function Dashboard() {
    const { tasks, toggleTask, getStats } = useTaskContext();
    const [showModal, setShowModal] = useState(false);
    const [countdown, setCountdown] = useState({});

    const stats = getStats();

    const updateCountdowns = useCallback(() => {
        const newCD = {};
        tasks.forEach(t => { if (t.status === 'pending') newCD[t.id] = getCountdown(t.deadline); });
        setCountdown(newCD);
    }, [tasks]);

    useEffect(() => {
        updateCountdowns();
        const timer = setInterval(updateCountdowns, 30000);
        return () => clearInterval(timer);
    }, [updateCountdowns]);

    const upcomingTasks = tasks
        .filter(t => t.status === 'pending')
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 5);

    return (
        <div className="dashboard">
            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-card-label">Total Tugas</span>
                        <div className="stat-card-icon blue"><ClockIcon size={18} /></div>
                    </div>
                    <div className="stat-card-value">{stats.total}</div>
                    <div className="stat-card-sub">Semua tugas yang tercatat</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-card-label">Selesai</span>
                        <div className="stat-card-icon green"><CheckCircleIcon size={18} /></div>
                    </div>
                    <div className="stat-card-value">{stats.completed}</div>
                    <div className="progress-bar-wrapper">
                        <div className="progress-bar-fill" style={{ width: `${stats.completionRate}%` }} />
                    </div>
                    <div className="stat-card-sub">{stats.completionRate}% completion rate</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-card-label">Mendesak</span>
                        <div className="stat-card-icon orange"><AlertTriangleIcon size={18} /></div>
                    </div>
                    <div className="stat-card-value">{stats.urgent}</div>
                    <div className="stat-card-sub">Deadline dalam 3 hari</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <span className="stat-card-label">Terlambat</span>
                        <div className="stat-card-icon red"><BellIcon size={18} /></div>
                    </div>
                    <div className="stat-card-value">{stats.overdue}</div>
                    <div className="stat-card-sub">Lewat batas waktu</div>
                </div>
            </div>

            {/* Upcoming Tasks */}
            <div>
                <div className="section-header">
                    <h2 className="section-title">Tugas Mendatang</h2>
                    <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
                            <PlusIcon size={14} /> Tambah Tugas
                        </button>
                        <Link to="/tasks" className="section-action" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                            Lihat semua <ArrowRightIcon size={14} />
                        </Link>
                    </div>
                </div>
                <div className="upcoming-list">
                    {upcomingTasks.length === 0 ? (
                        <div className="card empty-state">
                            <CheckCircleIcon size={40} style={{ margin: '0 auto', color: 'var(--color-text-muted)' }} />
                            <p className="empty-title">Tidak ada tugas pending</p>
                            <p className="empty-sub">Semua tugas sudah diselesaikan atau belum ada tugas.</p>
                        </div>
                    ) : (
                        upcomingTasks.map(task => {
                            const cd = countdown[task.id] || getCountdown(task.deadline);
                            const urgency = getUrgencyClass(cd.type);
                            return (
                                <div key={task.id} className={`upcoming-card ${urgency}`}>
                                    <button
                                        className="upcoming-checkbox"
                                        onClick={() => toggleTask(task.id)}
                                        aria-label="Tandai selesai"
                                    >
                                        <CheckIcon size={10} style={{ color: 'transparent' }} />
                                    </button>
                                    <div className="upcoming-info">
                                        <div className="upcoming-title">{task.title}</div>
                                        <div className="upcoming-meta">
                                            <span className="upcoming-subject">{task.subject}</span>
                                            <span className="upcoming-source">
                                                {task.source === 'telegram' ? 'via Telegram' : 'Manual'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="upcoming-countdown">
                                        <div className={`countdown-value ${cd.type}`}>{cd.value}</div>
                                        <div className="countdown-label">{cd.label}</div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Bottom: Productivity + Telegram Guide */}
            <div className="dashboard-bottom">
                {/* Productivity Donut */}
                <div className="productivity-card">
                    <div className="section-header" style={{ marginBottom: 0 }}>
                        <h2 className="section-title">Produktivitas</h2>
                    </div>
                    <div className="donut-wrapper">
                        <DonutChart
                            completed={stats.completed}
                            pending={stats.pending - stats.overdue}
                            overdue={stats.overdue}
                        />
                        <div className="donut-legend">
                            <div className="donut-legend-item">
                                <div className="donut-dot" style={{ background: 'var(--color-success)' }} />
                                <span className="donut-legend-label">Selesai</span>
                                <span className="donut-legend-count">{stats.completed}</span>
                            </div>
                            <div className="donut-legend-item">
                                <div className="donut-dot" style={{ background: 'var(--color-warning)' }} />
                                <span className="donut-legend-label">Berlangsung</span>
                                <span className="donut-legend-count">{Math.max(0, stats.pending - stats.overdue)}</span>
                            </div>
                            <div className="donut-legend-item">
                                <div className="donut-dot" style={{ background: 'var(--color-danger)' }} />
                                <span className="donut-legend-label">Terlambat</span>
                                <span className="donut-legend-count">{stats.overdue}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Telegram Guide */}
                <div className="telegram-guide">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                        <TelegramIcon size={16} />
                        <p className="telegram-guide-title" style={{ margin: 0 }}>Perintah Telegram Bot</p>
                    </div>
                    <div className="command-list">
                        <div className="command-item">
                            <span className="command-code">/tugas [MK] deadline [tanggal] [jam]</span>
                            <span className="command-desc">Tambah tugas baru via Telegram</span>
                        </div>
                        <div className="command-item">
                            <span className="command-code">/daftar</span>
                            <span className="command-desc">Lihat semua tugas pending</span>
                        </div>
                        <div className="command-item">
                            <span className="command-code">/selesai [ID]</span>
                            <span className="command-desc">Tandai tugas sebagai selesai</span>
                        </div>
                        <div className="command-item">
                            <span className="command-code">/hapus [ID]</span>
                            <span className="command-desc">Hapus tugas dari daftar</span>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && <AddTaskModal onClose={() => setShowModal(false)} />}
        </div>
    );
}
