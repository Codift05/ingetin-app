// src/context/TaskContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MOCK_TASKS } from '../data/mockData';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState(() => {
        const stored = localStorage.getItem('ingetin_tasks');
        return stored ? JSON.parse(stored) : MOCK_TASKS;
    });
    const [telegramConnected, setTelegramConnected] = useState(false);
    const [telegramChatId, setTelegramChatId] = useState('');

    useEffect(() => {
        localStorage.setItem('ingetin_tasks', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = useCallback((task) => {
        const newTask = {
            id: Date.now().toString(),
            ...task,
            createdAt: new Date().toISOString(),
            reminderSent: { h3: false, h1: false, h0: false },
        };
        setTasks(prev => [newTask, ...prev]);
        return newTask;
    }, []);

    const toggleTask = useCallback((id) => {
        setTasks(prev => prev.map(t =>
            t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t
        ));
    }, []);

    const deleteTask = useCallback((id) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    }, []);

    const getStats = useCallback(() => {
        const total = tasks.length;
        const completed = tasks.filter(t => t.status === 'completed').length;
        const pending = tasks.filter(t => t.status === 'pending').length;
        const overdue = tasks.filter(t =>
            t.status === 'pending' && new Date(t.deadline) < new Date()
        ).length;
        const urgent = tasks.filter(t => {
            if (t.status !== 'pending') return false;
            const diff = new Date(t.deadline) - new Date();
            return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000;
        }).length;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { total, completed, pending, overdue, urgent, completionRate };
    }, [tasks]);

    const value = {
        tasks,
        setTasks,
        addTask,
        toggleTask,
        deleteTask,
        getStats,
        telegramConnected,
        setTelegramConnected,
        telegramChatId,
        setTelegramChatId,
    };

    return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTaskContext() {
    const ctx = useContext(TaskContext);
    if (!ctx) throw new Error('useTaskContext must be inside TaskProvider');
    return ctx;
}
