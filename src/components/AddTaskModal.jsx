// src/components/AddTaskModal.jsx
import { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { XIcon, PlusIcon, CalendarIcon } from './Icons';
import './AddTaskModal.css';

const SUBJECTS = [
    'Sistem Operasi', 'IMK', 'Basis Data', 'Jaringan Komputer',
    'Struktur Data', 'Etika Profesi', 'RPL', 'Kalkulus',
    'Algoritma', 'Pemrograman Web', 'Lainnya',
];

export default function AddTaskModal({ onClose }) {
    const { addTask } = useTaskContext();
    const [form, setForm] = useState({
        title: '',
        subject: '',
        deadline: '',
        deadlineTime: '23:59',
    });
    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!form.title.trim()) e.title = 'Nama tugas wajib diisi';
        if (!form.subject) e.subject = 'Mata kuliah wajib dipilih';
        if (!form.deadline) e.deadline = 'Deadline wajib diisi';
        return e;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        const deadlineISO = new Date(`${form.deadline}T${form.deadlineTime}`).toISOString();
        addTask({
            title: form.title.trim(),
            subject: form.subject,
            deadline: deadlineISO,
            status: 'pending',
            source: 'manual',
        });
        onClose();
    };

    const set = (k) => (e) => {
        setForm(prev => ({ ...prev, [k]: e.target.value }));
        if (errors[k]) setErrors(prev => ({ ...prev, [k]: null }));
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <div className="modal-header">
                    <h2 className="modal-title">Tambah Tugas Baru</h2>
                    <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Tutup">
                        <XIcon size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="form-label" htmlFor="task-title">Nama Tugas</label>
                            <input
                                id="task-title"
                                type="text"
                                className={`form-input ${errors.title ? 'input-error' : ''}`}
                                placeholder="Contoh: Laporan Praktikum Sistem Operasi"
                                value={form.title}
                                onChange={set('title')}
                            />
                            {errors.title && <span className="input-error-msg">{errors.title}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="task-subject">Mata Kuliah</label>
                            <select
                                id="task-subject"
                                className={`form-input form-select ${errors.subject ? 'input-error' : ''}`}
                                value={form.subject}
                                onChange={set('subject')}
                            >
                                <option value="">Pilih mata kuliah...</option>
                                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            {errors.subject && <span className="input-error-msg">{errors.subject}</span>}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label" htmlFor="task-deadline">Tanggal Deadline</label>
                                <input
                                    id="task-deadline"
                                    type="date"
                                    className={`form-input ${errors.deadline ? 'input-error' : ''}`}
                                    min={today}
                                    value={form.deadline}
                                    onChange={set('deadline')}
                                />
                                {errors.deadline && <span className="input-error-msg">{errors.deadline}</span>}
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="task-time">Jam</label>
                                <input
                                    id="task-time"
                                    type="time"
                                    className="form-input"
                                    value={form.deadlineTime}
                                    onChange={set('deadlineTime')}
                                />
                            </div>
                        </div>

                        <div className="modal-tip">
                            <CalendarIcon size={14} />
                            <span>Reminder otomatis akan dikirim via Telegram pada H-3, H-1, dan H-0 deadline.</span>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Batal
                        </button>
                        <button type="submit" className="btn btn-primary">
                            <PlusIcon size={16} />
                            Tambah Tugas
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
