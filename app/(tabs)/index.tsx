import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, Linking } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Trophy, BookOpen, Play, Star, Lightbulb, TrendingUp, Book, Calendar } from 'lucide-react-native';
import { checkAndUpdatestreak } from '../../lib/streak';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import Storage
import * as Progress from 'react-native-progress';
import { useOverallProgress } from '../../hooks/useOverallProgress';

// Define Types
interface ActiveModuleState {
    moduleTitle: string;
    lessonTitle: string;
    lessonId: number;
    description: string;
}

interface WordOfTheDay {
    term: string;
    definition: string;
}

export default function DashboardScreen() {
    const router = useRouter();

    // State
    const [userName, setUserName] = useState('Friend');
    const [userXP, setUserXP] = useState(0);
    const [streak, setStreak] = useState(0);
    const [dailyWord, setDailyWord] = useState<WordOfTheDay | null>(null);

    // Global Progress Hook
    const userProgressData = useOverallProgress();

    // New State for Dashboard Content
    const [newsletters, setNewsletters] = useState<any[]>([]);


    const [refreshing, setRefreshing] = useState(false);

    const BG_COLOR = '#EAF0F6';

    useFocusEffect(
        useCallback(() => {
            fetchDashboardData();
        }, [])
    );

    const fetchDashboardData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            setUserName(user.user_metadata?.full_name?.split(' ')[0] || 'Friend');

            // 1. Streak & XP
            const currentStreak = await checkAndUpdatestreak(user.id);
            setStreak(currentStreak);

            const { data: profile } = await supabase.from('profiles').select('total_xp')
                .eq('id', user.id).single();
            if (profile) setUserXP(profile.total_xp || 0);

            // 2. WORD OF THE DAY
            await fetchDailyWord();

            // 4. FETCH NEWSLETTERS (New)
            const { data: newslettersData } = await supabase.from('newsletters').select('*').limit(5);
            if (newslettersData) setNewsletters(newslettersData);



        } catch (error) {
            console.error(error);
        }
    };

    const fetchDailyWord = async () => {
        try {
            const today = new Date().toISOString().split('T')[0]; // Get "2023-10-27"
            const storedData = await AsyncStorage.getItem('word_of_the_day');

            let shouldFetchNew = true;

            // Check if we already have a word for TODAY
            if (storedData) {
                const parsed = JSON.parse(storedData);
                if (parsed.date === today) {
                    setDailyWord(parsed.word);
                    shouldFetchNew = false;
                }
            }

            // If no word for today, fetch a random one from DB
            if (shouldFetchNew) {
                const { data: words } = await supabase.from('financial_terms').select('*');
                if (words && words.length > 0) {
                    // Pick Random
                    const randomIndex = Math.floor(Math.random() * words.length);
                    const newWord = words[randomIndex];

                    // Save to Storage
                    await AsyncStorage.setItem('word_of_the_day', JSON.stringify({
                        date: today,
                        word: newWord
                    }));

                    setDailyWord(newWord);
                }
            }
        } catch (e) {
            console.log("Word error", e);
        }
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchDashboardData().then(() => setRefreshing(false));
    }, []);

    const handleContinue = () => {
        if (userProgressData.firstUncompletedLessonId) {
            router.push(`/lesson/${userProgressData.firstUncompletedLessonId}`);
        } else {
            router.push('/(tabs)/learn');
        }
    };

    return (
        <ScrollView
            className="flex-1"
            style={{ backgroundColor: BG_COLOR }}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            {/* Header */}
            <View className="pt-16 px-6 flex-row justify-between items-center mb-8">
                <TouchableOpacity
                    className="flex-row items-center"
                    onPress={() => router.push('/profile')}
                    activeOpacity={0.7}
                >
                    <View className="w-12 h-12 bg-white rounded-full items-center justify-center border-2 border-white shadow-sm mr-3">
                        <Text className="text-2xl">😎</Text>
                    </View>
                    <View>
                        <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider">Welcome Back,</Text>
                        <Text className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'serif' }}>{userName}</Text>
                    </View>
                </TouchableOpacity>

                {/* Stats */}
                <View className="flex-row space-x-2">
                    <View className="bg-white px-3 py-2 rounded-full flex-row items-center shadow-sm">
                        <Text className="text-orange-500 font-bold mr-1">🔥</Text>
                        <Text className="font-bold text-slate-700">{streak}</Text>
                    </View>
                    <View className="bg-white px-3 py-2 rounded-full flex-row items-center shadow-sm">
                        <View className="bg-yellow-400 rounded-full p-1 mr-1">
                            <Star size={10} color="white" fill="white" />
                        </View>
                        <Text className="font-bold text-slate-700">{userXP}</Text>
                    </View>
                </View>
            </View>

            {/* Continue Learning Setup */}
            <View className="px-6 mb-6">
                <Text className="text-slate-800 text-lg font-bold mb-4" style={{ fontFamily: 'serif' }}>Continue Learning</Text>

                {userProgressData.firstUncompletedLessonId ? (
                    <View className="bg-indigo-600 rounded-[30px] p-6 shadow-md shadow-indigo-200">
                        {/* Top tag */}
                        <View className="bg-indigo-500/50 self-start px-3 py-1 rounded-full mb-4">
                            <Text className="text-indigo-100 text-xs font-bold uppercase tracking-wider">CONTINUE MODULE</Text>
                        </View>

                        {/* Title and Button row */}
                        <View className="flex-row justify-between items-center mb-4">
                            <View className="flex-1 pr-4">
                                <Text className="text-white text-xl font-bold mb-1" style={{ fontFamily: 'serif' }}>
                                    {userProgressData.nextModuleTitle || 'Financial Foundation'}
                                </Text>
                                <Text className="text-indigo-200 text-sm" numberOfLines={1}>
                                    Next: {userProgressData.nextLessonTitle || 'Keep going!'}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={handleContinue}
                                className="w-14 h-14 bg-white rounded-full items-center justify-center shadow-lg"
                                activeOpacity={0.9}
                            >
                                <Play size={24} color="#4F46E5" fill="#4F46E5" style={{ marginLeft: 4 }} />
                            </TouchableOpacity>
                        </View>

                        {/* Module Progress */}
                        <View>
                            <View className="flex-row justify-between mb-2">
                                <Text className="text-indigo-200 text-xs font-bold">Module Progress</Text>
                                <Text className="text-white font-bold text-xs">{userProgressData.nextModuleCompletedCount} / {userProgressData.nextModuleTotalCount}</Text>
                            </View>
                            <Progress.Bar
                                progress={userProgressData.nextModuleTotalCount > 0 ? userProgressData.nextModuleCompletedCount / userProgressData.nextModuleTotalCount : 0}
                                width={null}
                                height={6}
                                color="#FFFFFF"
                                unfilledColor="rgba(255,255,255,0.2)"
                                borderWidth={0}
                            />
                        </View>
                    </View>
                ) : (
                    <View className="bg-green-600 rounded-[30px] p-6 shadow-md shadow-green-200 flex-row items-center justify-between">
                        <View className="flex-1 pr-4">
                            <View className="bg-green-500/50 self-start px-3 py-1 rounded-full mb-2">
                                <Text className="text-green-100 text-xs font-bold uppercase tracking-wider">ALL COMPLETE</Text>
                            </View>
                            <Text className="text-white text-xl font-bold mb-1" style={{ fontFamily: 'serif' }}>
                                You've mastered all modules!
                            </Text>
                            <Text className="text-green-100 text-sm">
                                Replay your favorites or check back for new content.
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={handleContinue}
                            className="w-14 h-14 bg-white rounded-full items-center justify-center shadow-lg"
                            activeOpacity={0.9}
                        >
                            <Play size={24} color="#16A34A" fill="#16A34A" style={{ marginLeft: 4 }} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* 💡 WORD OF THE DAY (Sticky) */}
            {dailyWord && (
                <View className="px-6 mb-8">
                    <View className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                        <View className="flex-row items-center mb-3">
                            <Lightbulb size={20} color="#F59E0B" fill="#FEF3C7" />
                            <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest ml-2">WORD OF THE DAY</Text>
                        </View>
                        <Text className="text-xl font-bold text-slate-800 mb-2">{dailyWord.term}</Text>
                        <Text className="text-slate-500 leading-5">{dailyWord.definition}</Text>
                    </View>
                </View>
            )}

            {/* 📰 TOP NEWSLETTERS */}
            {newsletters.length > 0 && (
                <View className="mb-8 pl-6">
                    <Text className="text-slate-800 text-lg font-bold mb-4" style={{ fontFamily: 'serif' }}>Top Newsletters</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible">
                        {newsletters.map((newsletter, index) => (
                            <View key={newsletter.id} className={`bg-white p-4 rounded-2xl w-64 shadow-sm border border-slate-100 ${index === newsletters.length - 1 ? 'mr-6' : 'mr-4'}`}>
                                <View className="flex-row items-center mb-3">
                                    <View className="w-10 h-10 bg-slate-100 rounded-full mr-3 items-center justify-center">
                                        {/* Placeholder Icon if no image */}
                                        <Text className="text-xl">📩</Text>
                                    </View>
                                    <Text className="flex-1 font-bold text-slate-800 leading-tight" numberOfLines={2}>{newsletter.title}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => Linking.openURL(newsletter.subscribe_url)}
                                    className="bg-indigo-50 py-2 rounded-xl items-center"
                                >
                                    <Text className="text-indigo-600 font-bold text-xs uppercase tracking-wide">Subscribe</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}



            {/* Discover Grid - NOW WITH 4 ITEMS */}
            <View className="px-6 mb-8">
                <Text className="text-slate-800 text-lg font-bold mb-4" style={{ fontFamily: 'serif' }}>Discover</Text>
                <View className="flex-row flex-wrap justify-between">
                    {/* 5. Events (NEW) */}
                    <TouchableOpacity onPress={() => router.push('/events')} className="w-[48%] bg-white p-5 rounded-3xl mb-4 shadow-sm items-start justify-between h-40">
                        <View className="bg-orange-50 p-3 rounded-2xl"><Calendar size={24} color="#EA580C" /></View>
                        <View>
                            <Text className="text-slate-800 font-bold text-lg">Events</Text>
                            <Text className="text-slate-400 text-xs">Finance meetups</Text>
                        </View>
                    </TouchableOpacity>



                    {/* 2. Scenarios */}
                    <TouchableOpacity onPress={() => router.push('/scenarios')} className="w-[48%] bg-white p-5 rounded-3xl mb-4 shadow-sm items-start justify-between h-40">
                        <View className="bg-pink-100 p-3 rounded-2xl"><BookOpen size={24} color="#DB2777" /></View>
                        <View><Text className="text-slate-800 font-bold text-lg">Scenarios</Text><Text className="text-slate-400 text-xs">Roleplay & Learn</Text></View>
                    </TouchableOpacity>

                    {/* 3. Library (NEW) */}
                    <TouchableOpacity onPress={() => router.push('/books')} className="w-[48%] bg-white p-5 rounded-3xl mb-4 shadow-sm items-start justify-between h-40">
                        <View className="bg-cyan-100 p-3 rounded-2xl"><Book size={24} color="#0891B2" /></View>
                        <View><Text className="text-slate-800 font-bold text-lg">Library</Text><Text className="text-slate-400 text-xs">Must-read books</Text></View>
                    </TouchableOpacity>

                    {/* 4. Calculators (Resized) */}
                    <TouchableOpacity onPress={() => router.push('/calculator')} className="w-[48%] bg-white p-5 rounded-3xl mb-4 shadow-sm items-start justify-between h-40">
                        <View className="bg-green-100 p-3 rounded-2xl"><TrendingUp size={24} color="#16A34A" /></View>
                        <View>
                            <Text className="text-slate-800 font-bold text-lg">Tools</Text>
                            <Text className="text-slate-400 text-xs">Calculators</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

        </ScrollView>
    );
}
