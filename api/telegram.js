import { createClient } from '@supabase/supabase-js';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create a Supabase client with the service role key to bypass RLS in the secure backend environment
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

async function sendMessage(chatId, text) {
    await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML'
        })
    });
}

// Format: /tugas [Mata Kuliah] deadline [tanggal] [jam]
// Example: /tugas Matematika deadline 25-10-2023 15:00
async function handleTugasCommand(chatId, messageText) {
    try {
        const regex = /\/tugas\s+(.+?)\s+deadline\s+(.+)$/i;
        const match = messageText.match(regex);

        if (!match) {
            return await sendMessage(chatId, "❌ Format salah. Gunakan:\n<code>/tugas [Spasi] [Nama Tugas & Matkul] [Spasi] deadline [Spasi] [Tgl/Jam]</code>\nContoh:\n<code>/tugas Makalah Matematika deadline 2026-12-31 23:59</code>");
        }

        const titleAndSubject = match[1].trim(); // Puts everything before "deadline" here
        const deadlineStr = match[2].trim();

        // Let's attempt to parse a basic deadline. If the user types any string, JS Date might parse it.
        // For production, a library like dayjs or precise regex is better, but this handles simple formats.
        const deadlineDate = new Date(deadlineStr);
        if (isNaN(deadlineDate.getTime())) {
            return await sendMessage(chatId, "❌ Format tanggal tidak valid. Coba gunakan format YYYY-MM-DD HH:mm");
        }

        // We will just use the titleAndSubject as the Title, and assign a default 'General' subject for now if we can't distinctly parse it,
        // or we just save the whole string to the title and generic subject.
        const newTask = {
            title: titleAndSubject,
            subject: 'Dari Telegram', // or try to extract if format is strict
            deadline: deadlineDate.toISOString(),
            status: 'pending',
            source: 'telegram',
            reminderSent: { h3: false, h1: false, h0: false }
        };

        const { data, error } = await supabase
            .from('tasks')
            .insert([newTask])
            .select()
            .single();

        if (error) throw error;

        await sendMessage(chatId, `✅ <b>Tugas Berhasil Ditambahkan!</b>\n\n📌 <b>Judul:</b> ${data.title}\n⏰ <b>Deadline:</b> ${deadlineDate.toLocaleString('id-ID')}\n\n<i>Tugas kamu otomatis tersinkronisasi dengan Dashboard Inget.in.</i>`);

    } catch (error) {
        console.error('Error in handleTugasCommand:', error);
        await sendMessage(chatId, "⚠️ Terjadi kesalahan saat menyimpan tugas ke database.");
    }
}

async function handleDaftarCommand(chatId) {
    try {
        const { data: tasks, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('status', 'pending')
            .order('deadline', { ascending: true });

        if (error) throw error;

        if (!tasks || tasks.length === 0) {
            return await sendMessage(chatId, "✨ Keren! Kamu tidak memiliki tugas yang *pending*. Semua beres!");
        }

        let message = "📋 <b>Daftar Tugas Pending Kamu:</b>\n\n";
        tasks.forEach((t, i) => {
            const date = new Date(t.deadline).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
            message += `${i + 1}. <b>${t.title}</b> [${t.subject}]\n   ⏰ ${date}\n   ID: <code>${t.id}</code>\n\n`;
        });

        message += "<i>Gunakan /selesai [ID] untuk menandai tugas selesai.</i>";
        await sendMessage(chatId, message);

    } catch (error) {
        console.error('Error in handleDaftarCommand:', error);
        await sendMessage(chatId, "⚠️ Terjadi kesalahan saat membaca database.");
    }
}

async function handleSelesaiCommand(chatId, messageText) {
    try {
        const parts = messageText.split(' ');
        if (parts.length < 2) {
            return await sendMessage(chatId, "❌ Format salah. Gunakan: <code>/selesai [ID-Tugas]</code>");
        }

        const taskId = parts[1];

        const { data, error } = await supabase
            .from('tasks')
            .update({ status: 'completed' })
            .eq('id', taskId)
            .select()
            .single();

        if (error || !data) {
            return await sendMessage(chatId, "⚠️ ID Tugas tidak ditemukan atau gagal diupdate.");
        }

        await sendMessage(chatId, `✅ Tugas <b>${data.title}</b> telah ditandai Selesai! Pertahankan kerja bagusmu! 🎉`);

    } catch (error) {
        console.error('Error in handleSelesaiCommand:', error);
        await sendMessage(chatId, "⚠️ Terjadi kesalahan saat update tugas.");
    }
}


export default async function handler(req, res) {
    // Only accept POST requests from Telegram
    if (req.method !== 'POST') {
        return res.status(200).send('Webhook is listening...');
    }

    try {
        const update = req.body;

        // Ensure there is a message and text
        if (update.message && update.message.text) {
            const chatId = update.message.chat.id;
            const text = update.message.text.trim();

            if (text.startsWith('/start')) {
                await sendMessage(chatId, "Halo! 👋 Saya Ingetdongbot, asisten pengingat tugas untuk Inget.in!\n\nPerintah yang bisa kamu gunakan:\n🔹 /daftar - Lihat tugas pending\n🔹 /tugas [Nama Tugas] deadline [YYYY-MM-DD HH:mm] - Tambah tugas\n🔹 /selesai [ID] - Tandai tugas selesai");
            }
            else if (text.startsWith('/tugas')) {
                await handleTugasCommand(chatId, text);
            }
            else if (text.startsWith('/daftar')) {
                await handleDaftarCommand(chatId);
            }
            else if (text.startsWith('/selesai')) {
                await handleSelesaiCommand(chatId, text);
            }
            else {
                await sendMessage(chatId, "🤔 Perintah tidak dikenali. Ketik /start untuk melihat panduan.");
            }
        }

        // Always return 200 OK so Telegram doesn't retry
        return res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Webhook error:', error);
        // Still return 200 to prevent Telegram from retrying on internal bot crash
        return res.status(200).json({ ok: false, error: error.message });
    }
}
