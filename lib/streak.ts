import { supabase } from './supabase';

export const checkAndUpdatestreak = async (userId: string) => {
    const today = new Date().toISOString().split('T')[0]; // "2023-10-27"

    // 1. Get current profile
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('streak_count, last_active_at')
        .eq('id', userId)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
        console.error('Error fetching streak:', error);
        return 1;
    }

    // If profile doesn't exist yet (for old users), create it
    if (!profile) {
        await supabase.from('profiles').insert({
            id: userId,
            streak_count: 1,
            last_active_at: today
        });
        return 1;
    }

    const lastActive = profile.last_active_at;
    const currentStreak = profile.streak_count || 0;

    // A. If already logged in today, do nothing
    if (lastActive === today) {
        return currentStreak;
    }

    // B. Check if logged in yesterday (to continue streak)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = 1;

    if (lastActive === yesterdayStr) {
        // STREAK CONTINUES! 🔥
        newStreak = currentStreak + 1;
    } else {
        // STREAK BROKEN 😢 (Reset to 1)
        newStreak = 1;
    }

    // C. Update Database
    await supabase
        .from('profiles')
        .update({
            streak_count: newStreak,
            last_active_at: today
        })
        .eq('id', userId);

    return newStreak;
};
