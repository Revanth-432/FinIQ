import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useRouter, useFocusEffect } from 'expo-router';
import { Settings, LogOut, Award, Flame, Zap, BookOpen, Shield, TrendingUp, User } from 'lucide-react-native';

export default function ProfileScreen() {
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);

    // User Data State
    const [user, setUser] = useState<any>(null);
    const [avatarEmoji, setAvatarEmoji] = useState('👤'); // Default

    const [stats, setStats] = useState({
        lessonsCompleted: 0,
        totalXP: 0,
        streak: 1,
        joinDate: '',
    });

    // Avatar Mapping Helper
    const avatarMap: { [key: string]: string } = {
        'Default': '👤',
        'Bull': '🐂',
        'Bear': '🐻',
        'Rocket': '🚀',
        'Diamond': '💎',
        'Owl': '🦉'
    };

    // Load Data whenever screen comes into focus (updates after you edit profile)
    useFocusEffect(
        useCallback(() => {
            fetchProfileData();
        }, [])
    );

    const fetchProfileData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.replace('/(auth)/login');
                return;
            }

            setUser(user);

            // 1. SET AVATAR
            const savedAvatarId = user.user_metadata?.avatar_id || 'Default';
            setAvatarEmoji(avatarMap[savedAvatarId] || '👤');

            // 2. GET REAL STREAK
            const { data: profileData } = await supabase
                .from('profiles')
                .select('streak_count')
                .eq('id', user.id)
                .single();

            const realStreak = profileData?.streak_count || 1;

            // 3. GET LESSON COUNTS
            const { count } = await supabase
                .from('user_progress')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('is_completed', true);

            const lessons = count || 0;
            const calculatedXP = lessons * 50;

            // Format Date
            const date = new Date(user.created_at);
            const formattedDate = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

            setStats({
                lessonsCompleted: lessons,
                totalXP: calculatedXP,
                streak: realStreak,
                joinDate: formattedDate
            });

        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setRefreshing(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.replace('/(auth)/login');
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchProfileData();
    };

    // Title Logic
    const getTitle = (xp: number) => {
        if (xp >= 600) return { text: 'Wealth Master', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
        if (xp >= 300) return { text: 'Compound King', color: 'bg-purple-100 text-purple-800 border-purple-200' };
        if (xp >= 100) return { text: 'Smart Saver', color: 'bg-blue-100 text-blue-800 border-blue-200' };
        return { text: 'Financial Novice', color: 'bg-slate-100 text-slate-600 border-slate-200' };
    };

    const currentTitle = getTitle(stats.totalXP);

    // Badges Logic
    const badges = [
        { id: 1, name: 'First Step', icon: <Zap size={24} color={stats.lessonsCompleted >= 1 ? '#F59E0B' : '#94A3B8'} />, unlocked: stats.lessonsCompleted >= 1, desc: 'Complete 1 Lesson' },
        { id: 2, name: 'Quiz Whiz', icon: <Award size={24} color={stats.totalXP >= 150 ? '#8B5CF6' : '#94A3B8'} />, unlocked: stats.totalXP >= 150, desc: 'Earn 150 XP' },
        { id: 3, name: 'Module Master', icon: <BookOpen size={24} color={stats.lessonsCompleted >= 5 ? '#10B981' : '#94A3B8'} />, unlocked: stats.lessonsCompleted >= 5, desc: 'Complete 5 Lessons' },
        { id: 4, name: 'Streaker', icon: <Flame size={24} color={stats.streak >= 3 ? '#EF4444' : '#94A3B8'} />, unlocked: stats.streak >= 3, desc: '3 Day Streak' },
    ];

    return (
        <ScrollView
            className="flex-1 bg-slate-50"
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            {/* Header Section */}
            <View className="bg-white p-6 pt-12 rounded-b-3xl shadow-sm mb-6">
                <View className="flex-row justify-between items-start mb-4">
                    {/* DYNAMIC AVATAR */}
                    <View className="w-20 h-20 bg-indigo-50 rounded-full items-center justify-center border-4 border-white shadow-sm">
                        {avatarEmoji === '👤' ? (
                            <User size={40} color="#4F46E5" />
                        ) : (
                            <Text className="text-4xl">{avatarEmoji}</Text>
                        )}
                    </View>

                    <View className="flex-row space-x-2">
                        {/* Edit Button */}
                        <TouchableOpacity onPress={() => router.push('/profile-edit')} className="bg-slate-100 p-2 rounded-full">
                            <Settings size={20} color="#64748B" />
                        </TouchableOpacity>
                        {/* Sign Out Button */}
                        <TouchableOpacity onPress={handleSignOut} className="bg-red-50 p-2 rounded-full">
                            <LogOut size={20} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                </View>

                <Text className="text-2xl font-bold text-slate-900">
                    {user?.user_metadata?.full_name || 'Financial Learner'}
                </Text>
                <Text className="text-slate-400 text-sm mb-3">Joined {stats.joinDate}</Text>

                <View className={`self-start px-3 py-1 rounded-full border ${currentTitle.color}`}>
                    <Text className={`text-xs font-bold ${currentTitle.color.split(' ')[1]}`}>
                        {currentTitle.text}
                    </Text>
                </View>
            </View>

            {/* Glory Stats Row */}
            <View className="flex-row mx-4 mb-6 space-x-3">
                <View className="flex-1 bg-white p-4 rounded-2xl shadow-sm items-center border border-slate-100">
                    <Flame size={24} color="#F97316" fill={stats.streak > 0 ? "#FFEDD5" : "transparent"} />
                    <Text className="text-lg font-bold text-slate-800 mt-1">{stats.streak}</Text>
                    <Text className="text-xs text-slate-400 uppercase tracking-wider font-bold">Streak</Text>
                </View>

                <View className="flex-1 bg-white p-4 rounded-2xl shadow-sm items-center border border-slate-100">
                    <TrendingUp size={24} color="#3B82F6" />
                    <Text className="text-lg font-bold text-slate-800 mt-1">{stats.totalXP}</Text>
                    <Text className="text-xs text-slate-400 uppercase tracking-wider font-bold">Total XP</Text>
                </View>

                <View className="flex-1 bg-white p-4 rounded-2xl shadow-sm items-center border border-slate-100">
                    <BookOpen size={24} color="#10B981" />
                    <Text className="text-lg font-bold text-slate-800 mt-1">{stats.lessonsCompleted}</Text>
                    <Text className="text-xs text-slate-400 uppercase tracking-wider font-bold">Lessons</Text>
                </View>
            </View>

            {/* Badge Collection */}
            <View className="mx-4 mb-8">
                <Text className="text-lg font-bold text-slate-800 mb-4 ml-1">Badge Collection</Text>
                <View className="flex-row flex-wrap justify-between">
                    {badges.map((badge) => (
                        <View
                            key={badge.id}
                            className={`w-[48%] bg-white p-4 rounded-2xl mb-4 border items-center ${badge.unlocked ? 'border-slate-100 opacity-100 shadow-sm' : 'border-slate-100 opacity-50 bg-slate-50'
                                }`}
                        >
                            <View className={`p-3 rounded-full mb-2 ${badge.unlocked ? 'bg-indigo-50' : 'bg-slate-200'}`}>
                                {badge.icon}
                            </View>
                            <Text className="font-bold text-slate-800 text-center">{badge.name}</Text>
                            <Text className="text-xs text-slate-400 text-center mt-1">{badge.desc}</Text>

                            {!badge.unlocked && (
                                <View className="absolute top-2 right-2">
                                    <Shield size={12} color="#94A3B8" />
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}
