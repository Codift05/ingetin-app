// src/data/mockData.js — Mock data for Inget.in

export const MOCK_TASKS = [
    {
        id: '1',
        title: 'Laporan Praktikum Sistem Operasi',
        subject: 'Sistem Operasi',
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // H-2
        status: 'pending',
        source: 'telegram',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        reminderSent: { h3: true, h1: false, h0: false },
    },
    {
        id: '2',
        title: 'UTS Interaksi Manusia dan Komputer',
        subject: 'IMK',
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // H-5
        status: 'pending',
        source: 'telegram',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        reminderSent: { h3: false, h1: false, h0: false },
    },
    {
        id: '3',
        title: 'Project Akhir Basis Data',
        subject: 'Basis Data',
        deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(), // H-12
        status: 'pending',
        source: 'manual',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        reminderSent: { h3: false, h1: false, h0: false },
    },
    {
        id: '4',
        title: 'Resume Paper Jaringan Komputer',
        subject: 'Jaringan Komputer',
        deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Overdue
        status: 'completed',
        source: 'telegram',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        reminderSent: { h3: true, h1: true, h0: true },
    },
    {
        id: '5',
        title: 'Kuis Struktur Data — Linked List',
        subject: 'Struktur Data',
        deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // H-1 (urgent!)
        status: 'pending',
        source: 'telegram',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        reminderSent: { h3: true, h1: true, h0: false },
    },
    {
        id: '6',
        title: 'Makalah Etika Profesi IT',
        subject: 'Etika Profesi',
        deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // Past — completed
        status: 'completed',
        source: 'manual',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        reminderSent: { h3: true, h1: true, h0: true },
    },
    {
        id: '7',
        title: 'Tugas Kelompok Rekayasa Perangkat Lunak',
        subject: 'RPL',
        deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(), // H-8
        status: 'pending',
        source: 'manual',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        reminderSent: { h3: false, h1: false, h0: false },
    },
];

export const SUBJECTS = [
    'Semua',
    'Sistem Operasi',
    'IMK',
    'Basis Data',
    'Jaringan Komputer',
    'Struktur Data',
    'Etika Profesi',
    'RPL',
    'Kalkulus',
    'Algoritma',
];
