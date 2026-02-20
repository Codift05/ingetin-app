// src/pages/Tasks.jsx
import { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import AddTaskModal from '../components/AddTaskModal';
import {
    PlusIcon, TrashIcon, CheckIcon,
    CalendarIcon, TelegramIcon
} from '../components/Icons';
import './Tasks.css';

function SearchSVG({ size = 16 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );
}

function getDeadlineStatus(deadline, status) {
    if (status === 'completed') return 'completed';
    const diff = new Date(deadline) - new Date();
    if (diff <= 0) return 'overdue';
    if (diff < 24 * 60 * 60 * 1000) return 'urgent';
    if (diff < 3 * 24 * 60 * 60 * 1000) return 'warning';
    return 'normal';
}

function formatDeadline(deadline) {
    return new Date(deadline).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
}

export default function Tasks() {
    const { tasks, toggleTask, deleteTask } = useTaskContext();
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState('all'); // all, pending, completed, overdue
    const [search, setSearch] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('Semua');

    const subjects = ['Semua', ...new Set(tasks.map(t => t.subject))];

    const filtered = tasks.filter(t => {
        const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
            t.subject.toLowerCase().includes(search.toLowerCase());
        const matchSubject = subjectFilter === 'Semua' || t.subject === subjectFilter;
        const dlStatus = getDeadlineStatus(t.deadline, t.status);
        const matchFilter =
            filter === 'all' ? true :
                filter === 'completed' ? t.status === 'completed' :
                    filter === 'pending' ? t.status === 'pending' :
                        filter === 'overdue' ? dlStatus === 'overdue' : true;
        return matchSearch && matchSubject && matchFilter;
    }).sort((a, b) => {
        if (a.status !== b.status) return a.status === 'pending' ? -1 : 1;
        return new Date(a.deadline) - new Date(b.deadline);
    });

    const counts = {
        all: tasks.length,
        pending: tasks.filter(t => t.status === 'pending').length,
        completed: tasks.filter(t => t.status === 'completed').length,
        overdue: tasks.filter(t => t.status === 'pending' && new Date(t.deadline) < new Date()).length,
    };

    return (
        <div className="tasks-page">
            {/* Controls */}
            <div className="tasks-controls">
                <div className="tasks-search-wrapper">
                    <SearchSVG size={16} />
                    <input
                        type="text"
                        className="tasks-search form-input"
                        placeholder="Cari tugas atau mata kuliah..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="form-input form-select tasks-subject-filter"
                    value={subjectFilter}
                    onChange={e => setSubjectFilter(e.target.value)}
                >
                    {subjects.map(s => <option key={s}>{s}</option>)}
                </select>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <PlusIcon size={16} /> Tambah Tugas
                </button>
            </div>

            {/* Filter tabs */}
            <div className="filter-tabs">
                {[
                    { key: 'all', label: 'Semua' },
                    { key: 'pending', label: 'Berlangsung' },
                    { key: 'overdue', label: 'Terlambat' },
                    { key: 'completed', label: 'Selesai' },
                ].map(({ key, label }) => (
                    <button
                        key={key}
                        className={`filter-tab ${filter === key ? 'active' : ''}`}
                        onClick={() => setFilter(key)}
                    >
                        {label}
                        <span className="filter-tab-count">{counts[key]}</span>
                    </button>
                ))}
            </div>

            {/* Task table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {filtered.length === 0 ? (
                    <div style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        <p style={{ fontSize: 'var(--font-size-sm)' }}>Tidak ada tugas ditemukan</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop: Table */}
                        <div className="task-table-wrapper task-desktop-only">
                            <table className="task-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: 40 }}></th>
                                        <th>Tugas</th>
                                        <th>Mata Kuliah</th>
                                        <th>Deadline</th>
                                        <th>Status</th>
                                        <th>Sumber</th>
                                        <th style={{ width: 60 }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(task => {
                                        const dlStatus = getDeadlineStatus(task.deadline, task.status);
                                        return (
                                            <tr key={task.id} className={`task-row ${task.status === 'completed' ? 'completed' : ''}`}>
                                                <td>
                                                    <button
                                                        className={`task-check ${task.status === 'completed' ? 'checked' : ''}`}
                                                        onClick={() => toggleTask(task.id)}
                                                        aria-label="Toggle selesai"
                                                    >
                                                        {task.status === 'completed' && <CheckIcon size={11} />}
                                                    </button>
                                                </td>
                                                <td>
                                                    <span className={`task-title ${task.status === 'completed' ? 'done' : ''}`}>
                                                        {task.title}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="badge badge-default">{task.subject}</span>
                                                </td>
                                                <td>
                                                    <div className={`task-deadline deadline-${dlStatus}`}>
                                                        <CalendarIcon size={13} />
                                                        <span>{formatDeadline(task.deadline)}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`badge ${dlStatus === 'overdue' ? 'badge-danger' :
                                                        dlStatus === 'urgent' ? 'badge-warning' :
                                                            task.status === 'completed' ? 'badge-success' : 'badge-accent'
                                                        }`}>
                                                        {dlStatus === 'overdue' ? 'Terlambat' :
                                                            dlStatus === 'urgent' ? 'Mendesak' :
                                                                task.status === 'completed' ? 'Selesai' : 'Berlangsung'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="task-source">
                                                        {task.source === 'telegram' ? <TelegramIcon size={13} /> : null}
                                                        {task.source === 'telegram' ? 'Telegram' : 'Manual'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-ghost btn-sm task-delete"
                                                        onClick={() => deleteTask(task.id)}
                                                        aria-label="Hapus tugas"
                                                    >
                                                        <TrashIcon size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile: Card List */}
                        <div className="task-card-list task-mobile-only">
                            {filtered.map(task => {
                                const dlStatus = getDeadlineStatus(task.deadline, task.status);
                                return (
                                    <div key={task.id} className={`task-mobile-card ${task.status === 'completed' ? 'completed' : ''} border-${dlStatus}`}>
                                        <div className="task-mobile-card-top">
                                            <button
                                                className={`task-check ${task.status === 'completed' ? 'checked' : ''}`}
                                                onClick={() => toggleTask(task.id)}
                                                aria-label="Toggle selesai"
                                            >
                                                {task.status === 'completed' && <CheckIcon size={11} />}
                                            </button>
                                            <span className={`task-title ${task.status === 'completed' ? 'done' : ''}`}>
                                                {task.title}
                                            </span>
                                            <button
                                                className="btn btn-ghost btn-sm task-delete"
                                                onClick={() => deleteTask(task.id)}
                                                aria-label="Hapus tugas"
                                            >
                                                <TrashIcon size={14} />
                                            </button>
                                        </div>
                                        <div className="task-mobile-card-meta">
                                            <span className="badge badge-default">{task.subject}</span>
                                            <span className={`badge ${dlStatus === 'overdue' ? 'badge-danger' :
                                                dlStatus === 'urgent' ? 'badge-warning' :
                                                    task.status === 'completed' ? 'badge-success' : 'badge-accent'
                                                }`}>
                                                {dlStatus === 'overdue' ? 'Terlambat' :
                                                    dlStatus === 'urgent' ? 'Mendesak' :
                                                        task.status === 'completed' ? 'Selesai' : 'Berlangsung'}
                                            </span>
                                        </div>
                                        <div className={`task-deadline deadline-${dlStatus}`} style={{ fontSize: 'var(--font-size-xs)' }}>
                                            <CalendarIcon size={12} />
                                            <span>{formatDeadline(task.deadline)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>


            {showModal && <AddTaskModal onClose={() => setShowModal(false)} />}
        </div>
    );
}
