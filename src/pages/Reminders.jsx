// src/pages/Reminders.jsx
import { useTaskContext } from '../context/TaskContext';
import { BellIcon, CheckCircleIcon, ClockIcon, TelegramIcon } from '../components/Icons';
import './Reminders.css';

function formatDate(iso) {
    return new Date(iso).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
}

function getReminderStatus(task) {
    const reminders = [];
    const deadline = new Date(task.deadline);

    const h3Date = new Date(deadline - 3 * 24 * 60 * 60 * 1000);
    const h1Date = new Date(deadline - 1 * 24 * 60 * 60 * 1000);
    const h0Date = new Date(deadline);

    reminders.push({
        label: 'H-3 Reminder',
        scheduledAt: h3Date.toISOString(),
        sent: task.reminderSent?.h3 || false,
        type: 'h3',
    });
    reminders.push({
        label: 'H-1 Reminder',
        scheduledAt: h1Date.toISOString(),
        sent: task.reminderSent?.h1 || false,
        type: 'h1',
    });
    reminders.push({
        label: 'H-0 Reminder',
        scheduledAt: h0Date.toISOString(),
        sent: task.reminderSent?.h0 || false,
        type: 'h0',
    });

    return reminders;
}

export default function Reminders() {
    const { tasks } = useTaskContext();

    const allReminders = tasks.flatMap(task => {
        const reminders = getReminderStatus(task);
        return reminders.map(r => ({ ...r, task }));
    }).sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));

    const sentCount = allReminders.filter(r => r.sent).length;
    const pendingCount = allReminders.filter(r => !r.sent).length;

    return (
        <div className="reminders-page">
            {/* Summary */}
            <div className="reminders-summary">
                <div className="reminder-stat sent">
                    <div className="reminder-stat-accent" />
                    <div className="reminder-stat-body">
                        <div className="reminder-stat-value">{sentCount}</div>
                        <div className="reminder-stat-label">Terkirim</div>
                    </div>
                    <div className="reminder-stat-icon-bg">
                        <BellIcon size={20} />
                    </div>
                </div>
                <div className="reminder-stat pending">
                    <div className="reminder-stat-accent" />
                    <div className="reminder-stat-body">
                        <div className="reminder-stat-value">{pendingCount}</div>
                        <div className="reminder-stat-label">Terjadwal</div>
                    </div>
                    <div className="reminder-stat-icon-bg">
                        <ClockIcon size={20} />
                    </div>
                </div>
            </div>


            {/* Timeline */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="reminders-header">
                    <span>Riwayat & Jadwal Reminder</span>
                    <span className="reminders-header-sub">Semua notifikasi dikirim ke Telegram pribadimu</span>
                </div>
                <div className="reminders-list">
                    {allReminders.length === 0 ? (
                        <div style={{ padding: 'var(--space-10)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                            <p>Tidak ada reminder. Tambah tugas terlebih dahulu.</p>
                        </div>
                    ) : (
                        allReminders.map((r, idx) => {
                            const isPast = new Date(r.scheduledAt) < new Date();
                            const isUpcoming = !r.sent && !isPast;
                            const isSent = r.sent;
                            return (
                                <div key={`${r.task.id}-${r.type}`} className={`reminder-item ${isSent ? 'sent' : isPast ? 'missed' : 'upcoming'}`}>
                                    <div className="reminder-timeline">
                                        <div className={`reminder-dot ${isSent ? 'sent' : isPast ? 'missed' : 'upcoming'}`}>
                                            {isSent ? <CheckCircleIcon size={12} /> : <BellIcon size={12} />}
                                        </div>
                                        {idx < allReminders.length - 1 && <div className="reminder-line" />}
                                    </div>
                                    <div className="reminder-content">
                                        <div className="reminder-item-header">
                                            <span className="reminder-item-task">{r.task.title}</span>
                                            <span className={`badge ${isSent ? 'badge-success' : isPast ? 'badge-danger' : 'badge-accent'}`}>
                                                {isSent ? 'Terkirim' : isPast ? 'Terlewat' : 'Terjadwal'}
                                            </span>
                                        </div>
                                        <div className="reminder-item-meta">
                                            <span>{r.task.subject}</span>
                                            <span className="reminder-item-type">{r.label}</span>
                                            <span className="reminder-item-date">{formatDate(r.scheduledAt)}</span>
                                        </div>
                                        {isSent && (
                                            <div className="reminder-item-sent">
                                                <TelegramIcon size={12} />
                                                <span>Dikirim ke Telegram</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
