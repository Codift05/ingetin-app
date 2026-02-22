// src/context/TaskContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState([]);
    const [telegramConnected, setTelegramConnected] = useState(false);
    const [telegramChatId, setTelegramChatId] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .order('deadline', { ascending: true });

        if (!error && data) {
            setTasks(data);
        } else {
            console.error("Error fetching tasks:", error);
        }
    };

    const addTask = useCallback(async (task) => {
        const newTaskData = {
            title: task.title,
            subject: task.subject,
            deadline: task.deadline,
            status: task.status || 'pending',
            source: task.source || 'manual',
            reminderSent: { h3: false, h1: false, h0: false } // We can store this as JSONB in DB or ignore if not needed
        };

        const { data, error } = await supabase
            .from('tasks')
            .insert([newTaskData])
            .select()
            .single();

        if (error) {
            console.error("Error adding task:", error);
            return null;
        }

        setTasks(prev => [data, ...prev]);
        return data;
    }, []);

    const toggleTask = useCallback(async (id) => {
        const taskToToggle = tasks.find(t => t.id === id);
        if (!taskToToggle) return;

        const newStatus = taskToToggle.status === 'completed' ? 'pending' : 'completed';

        const { error } = await supabase
            .from('tasks')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) {
            setTasks(prev => prev.map(t =>
                t.id === id ? { ...t, status: newStatus } : t
            ));
        } else {
            console.error("Error toggling task:", error);
        }
    }, [tasks]);

    const deleteTask = useCallback(async (id) => {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id);

        if (!error) {
            setTasks(prev => prev.filter(t => t.id !== id));
        } else {
            console.error("Error deleting task:", error);
        }
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
