import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, Alert, Modal } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useRouter, useFocusEffect } from 'expo-router';
import { Settings, LogOut, Award, Flame, Zap, BookOpen, Shield, TrendingUp, User, GraduationCap, Trophy, Lock } from 'lucide-react-native';
import * as Progress from 'react-native-progress';
import { useOverallProgress } from '../../hooks/useOverallProgress';

export default function ProfileScreen() {
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);

    // User Data State
    const [user, setUser] = useState<any>(null);
    const [avatarEmoji, setAvatarEmoji] = useState('👤'); // Default

    // Global Progress Hook
    const userProgressData = useOverallProgress();

    // Modal State
    const [selectedBadge, setSelectedBadge] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);

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
        {
            id: 'rookie',
            icon: <Trophy size={24} color={stats.lessonsCompleted >= 1 ? '#F59E0B' : '#94A3B8'} />,
            name: 'The Rookie',
            desc: 'You completed your very first financial lesson. Welcome to the journey!',
            unlockRequirement: 'Complete your very first lesson.',
            unlocked: stats.lessonsCompleted >= 1
        },
        {
            id: 'survivor',
            icon: <Flame size={24} color={stats.streak >= 7 ? '#EF4444' : '#94A3B8'} />,
            name: '7-Day Survivor',
            desc: 'You have proven your dedication to financial literacy.',
            unlockRequirement: 'Maintain a 7-day learning streak.',
            unlocked: stats.streak >= 7
        },
        {
            id: 'offer-hacker',
            icon: <BookOpen size={24} color="#3B82F6" />,
            name: 'Offer Hacker',
            desc: 'You proved you know the difference between CTC and In-Hand Salary.',
            unlockRequirement: 'Master the "CTC Scam" lesson.',
            unlocked: false
        },
        {
            id: 'tax-ninja',
            icon: <Zap size={24} color="#10B981" />,
            name: 'Tax Ninja',
            desc: 'You are now aware of all the basic tax implications.',
            unlockRequirement: 'Complete the entire "First Salary Blueprint" module.',
            unlocked: false
        },
        {
            id: 'scam-shield',
            icon: <Shield size={24} color="#8B5CF6" />,
            name: 'Scam Shield',
            desc: 'You know exactly how to avoid modern financial traps.',
            unlockRequirement: 'Pass the "Avoiding Financial Scams" module.',
            unlocked: false
        },
        {
            id: 'diamond-hands',
            icon: <GraduationCap size={24} color="#06B6D4" />,
            name: 'Diamond Hands',
            desc: 'You have solid fundamentals for long-term wealth building.',
            unlockRequirement: 'Unlock and complete Phase 3 (Wealth Builder).',
            unlocked: false
        }
    ];

    const openBadgeDetails = (badge: any) => {
        setSelectedBadge(badge);
        setModalVisible(true);
    };

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

            {/* Financial Roadmap Progress */}
            <View className="mx-4 mb-6 bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                <View className="flex-row items-center mb-4">
                    <View className="bg-indigo-50 p-3 rounded-full mr-4">
                        <GraduationCap size={28} color="#4F46E5" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-slate-800 font-bold text-lg mb-1">Financial Roadmap Progress</Text>
                        <Text className="text-slate-500 text-sm">
                            Overall completion across all learning modules.
                        </Text>
                    </View>
                </View>

                {/* Progress Bar & Percentage */}
                <View className="mb-2">
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-indigo-600 font-bold text-sm tracking-wide">
                            {userProgressData.percentage}% Completed
                        </Text>
                        <Text className="text-slate-400 font-bold text-sm">
                            {userProgressData.completedCount} / {userProgressData.totalCount} Total Lessons
                        </Text>
                    </View>
                    <Progress.Bar
                        progress={userProgressData.loading ? 0 : userProgressData.percentage / 100}
                        width={null}
                        height={10}
                        color="#4F46E5"
                        unfilledColor="#E0E7FF"
                        borderWidth={0}
                        borderRadius={5}
                    />
                </View>
            </View>

            {/* Badge Collection */}
            <View className="mx-4 mb-8">
                <Text className="text-lg font-bold text-slate-800 mb-4 ml-1">Badge Collection</Text>
                <View className="flex-row flex-wrap justify-between">
                    {badges.map((badge) => (
                        <TouchableOpacity
                            key={badge.id}
                            activeOpacity={0.7}
                            onPress={() => openBadgeDetails(badge)}
                            className={`w-[48%] bg-white p-4 rounded-2xl mb-4 border items-center ${badge.unlocked ? 'border-slate-100 opacity-100 shadow-sm' : 'border-slate-100 opacity-50 bg-slate-50'}`}
                        >
                            <View className={`p-3 rounded-full mb-2 ${badge.unlocked ? 'bg-indigo-50' : 'bg-slate-200'}`}>
                                {badge.icon}
                            </View>
                            <Text className="font-bold text-slate-800 text-center">{badge.name}</Text>

                            {!badge.unlocked && (
                                <View className="absolute top-2 right-2">
                                    <Lock size={12} color="#94A3B8" />
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Badge Details Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white rounded-t-3xl p-6 items-center shadow-lg">
                        <View className="w-12 h-1.5 bg-slate-200 rounded-full mb-6" />

                        {selectedBadge && (
                            <>
                                <View className={`p-6 rounded-full mb-4 ${selectedBadge.unlocked ? 'bg-indigo-50' : 'bg-slate-100'}`}>
                                    {selectedBadge.icon && React.cloneElement(selectedBadge.icon as React.ReactElement, { size: 48, color: selectedBadge.unlocked ? selectedBadge.icon.props.color : '#94A3B8' })}
                                </View>

                                <Text className="text-2xl font-bold text-slate-800 mb-2">{selectedBadge.name}</Text>

                                <View className={`px-3 py-1 rounded-full mb-4 ${selectedBadge.unlocked ? 'bg-green-100' : 'bg-slate-200'}`}>
                                    <Text className={`font-bold text-xs tracking-wider ${selectedBadge.unlocked ? 'text-green-700' : 'text-slate-500'}`}>
                                        {selectedBadge.unlocked ? 'UNLOCKED' : 'LOCKED'}
                                    </Text>
                                </View>

                                <Text className="text-slate-600 text-center mb-6 leading-relaxed">
                                    {selectedBadge.desc}
                                </Text>

                                <View className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                                    <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">How to earn</Text>
                                    <Text className="text-slate-700">{selectedBadge.unlockRequirement}</Text>
                                </View>

                                <TouchableOpacity
                                    className="w-full bg-indigo-600 py-4 rounded-xl items-center"
                                    onPress={() => setModalVisible(false)}
                                    activeOpacity={0.8}
                                >
                                    <Text className="text-white font-bold text-lg">Close</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}
