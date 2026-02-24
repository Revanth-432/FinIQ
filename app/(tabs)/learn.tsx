import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Modal, TextInput } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Lock, CheckCircle, PlayCircle, BookOpen, Trophy, MessageSquare, X, Coins, Target, Shield, Rocket } from 'lucide-react-native';
import * as Progress from 'react-native-progress';
import { useOverallProgress } from '../../hooks/useOverallProgress';

export default function LearnScreen() {
    const router = useRouter();
    const [modules, setModules] = useState<any[]>([]);
    const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

    // Feedback Modal State
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [feedbackText, setFeedbackText] = useState('');

    // Global Progress
    const userProgressData = useOverallProgress();

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    const fetchData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // 1. Get User Progress
            const { data: progress } = await supabase.from('user_progress').select('lesson_id').eq('user_id', user.id);
            const completedIds = progress?.map((p: any) => p.lesson_id) || [];
            setCompletedLessonIds(completedIds);

            // 2. Get Hierarchy
            const { data: modulesData } = await supabase
                .from('modules')
                .select(`
          id, title, description,
          lessons ( id, title, description, order_index, module_id )
        `)
                .order('order_index', { ascending: true });

            if (modulesData) {
                // Sort lessons inside modules
                modulesData.forEach((m: any) => {
                    if (m.lessons) m.lessons.sort((a: any, b: any) => a.order_index - b.order_index);
                });
                setModules(modulesData);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLessonPress = (lesson: any, previousLessonId: number | null) => {
        const isCompleted = completedLessonIds.includes(lesson.id);
        const isPreviousCompleted = previousLessonId === null || completedLessonIds.includes(previousLessonId);

        if (isCompleted || isPreviousCompleted) {
            // ✅ UNLOCKED
            router.push(`/lesson/${lesson.id}`);
        } else {
            // 🔒 LOCKED
            Alert.alert(
                "Unlock Lesson? 🚀",
                "You can skip the line if you pass a quick challenge!\n\nPass 100% of the quiz to unlock this lesson immediately.",
                [
                    { text: "NO, WAIT", style: "cancel" },
                    {
                        text: "TAKE CHALLENGE",
                        onPress: () => router.push({ pathname: '/lesson/challenge', params: { id: lesson.id } })
                    }
                ]
            );
        }
    };

    const handleFeedbackSubmit = async () => {
        if (feedbackText.trim() === '') return;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                Alert.alert('Error', 'You must be logged in to sync feedback.');
                return;
            }

            const { error } = await supabase
                .from('user_feedback')
                .insert({ user_id: user.id, suggestion: feedbackText });

            if (error) throw error;

            Alert.alert('Thank You!', 'Your suggestion has been sent directly to the team.');
            setFeedbackText('');
            setIsModalVisible(false);
        } catch (error) {
            console.error('Feedback insertion failed:', error);
            Alert.alert('Error', 'Unable to submit suggestion at this time. Please try again.');
        }
    };

    if (loading) return <View className="flex-1 justify-center items-center"><ActivityIndicator size="large" color="#6366F1" /></View>;

    let previousLessonId: number | null = null;
    let cumulativeLessonIndex = 0;

    const pathIcons = [Coins, Target, Shield, Rocket, BookOpen];

    return (
        <>
            <ScrollView
                className="flex-1 bg-[#EAF0F6] pt-16 px-4"
                contentContainerStyle={{ paddingBottom: 120 }}
            >

                {/* Global Progress Bar */}
                <View className="mb-8 bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                    <View className="flex-row justify-between items-end mb-3">
                        <View>
                            <Text className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">ROADMAP PROGRESS</Text>
                            <Text className="text-slate-800 text-lg font-bold">
                                {userProgressData.completedCount} / {userProgressData.totalCount} Lessons Completed
                            </Text>
                        </View>
                        <Trophy size={28} color="#F59E0B" fill="#FEF3C7" />
                    </View>

                    <Progress.Bar
                        progress={userProgressData.loading ? 0 : userProgressData.percentage / 100}
                        width={null}
                        height={12}
                        color="#4F46E5"
                        unfilledColor="#E2E8F0"
                        borderWidth={0}
                        borderRadius={6}
                    />
                </View>

                {/* THE WINDING PATH */}
                <View className="relative w-full items-center mt-4">

                    {/* The Connecting Line */}
                    <View
                        className="absolute top-10 bottom-24 w-4 bg-indigo-100/70 rounded-full"
                        style={{ zIndex: 0 }}
                    />

                    {modules.map((module) => (
                        <View key={module.id} className="w-full items-center mb-10" style={{ zIndex: 1 }}>

                            {/* Module Header Divider */}
                            <View className="bg-indigo-600 px-8 py-3 rounded-full mb-10 shadow-sm border-4 border-[#EAF0F6]">
                                <Text className="text-white font-black text-lg text-center tracking-widest uppercase">{module.title}</Text>
                            </View>

                            {/* ZigZag Lessons */}
                            {module.lessons?.map((lesson: any, index: number) => {
                                const isCompleted = completedLessonIds.includes(lesson.id);
                                const isUnlocked = cumulativeLessonIndex === 0 || (previousLessonId && completedLessonIds.includes(previousLessonId));

                                // Pick an icon
                                const IconComponent = pathIcons[cumulativeLessonIndex % pathIcons.length];

                                // Stagger calculation
                                const cycle = cumulativeLessonIndex % 3;
                                let translateX = 0;
                                if (cycle === 1) translateX = -50;
                                if (cycle === 2) translateX = 50;

                                // Colors and Styles
                                let circleColor = "bg-slate-200";
                                let borderColor = "border-slate-300";
                                let iconColor = "#94A3B8";

                                if (isCompleted) {
                                    circleColor = "bg-amber-400";
                                    borderColor = "border-amber-500";
                                    iconColor = "#FFFFFF";
                                } else if (isUnlocked) {
                                    circleColor = "bg-indigo-500";
                                    borderColor = "border-indigo-600";
                                    iconColor = "#FFFFFF";
                                }

                                const prevIdToPass = previousLessonId;
                                previousLessonId = lesson.id;
                                cumulativeLessonIndex++;

                                return (
                                    <View key={lesson.id} className="items-center mb-10 w-full" style={{ transform: [{ translateX }] }}>
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => handleLessonPress(lesson, prevIdToPass)}
                                            className={`w-24 h-24 rounded-full items-center justify-center border-[5px] ${circleColor} ${borderColor} shadow-md`}
                                            style={isUnlocked ? { shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 } : {}}
                                        >
                                            {isCompleted && (
                                                <View className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                                    <CheckCircle size={20} color="#22C55E" fill="#DCFCE7" />
                                                </View>
                                            )}

                                            {!isUnlocked && !isCompleted && (
                                                <View className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm w-6 h-6 items-center justify-center">
                                                    <Lock size={14} color="#94A3B8" />
                                                </View>
                                            )}

                                            <IconComponent size={36} color={iconColor} strokeWidth={2.5} />
                                        </TouchableOpacity>

                                        {/* Lesson Titles positioned below */}
                                        <View className="items-center mt-3 bg-[#EAF0F6]/80 px-2 rounded-lg" style={{ maxWidth: 160 }}>
                                            <Text className={`font-black text-center text-sm ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                                                {lesson.title}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    ))}
                </View>

                {/* Feedback / Suggestion Banner */}
                <View className="mb-12 mt-6">
                    <TouchableOpacity
                        className="bg-indigo-50 p-4 rounded-2xl flex-row items-center border border-indigo-100"
                        activeOpacity={0.8}
                        onPress={() => setIsModalVisible(true)}
                    >
                        <View className="bg-white p-3 rounded-full mr-4 shadow-sm border border-indigo-50">
                            <MessageSquare size={24} color="#4F46E5" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-base font-bold text-slate-800 mb-1">What should we teach next?</Text>
                            <Text className="text-sm text-slate-500 leading-tight">Suggest a new financial module or scenario.</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Interactive Feedback Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white rounded-t-3xl p-6">
                        {/* Header */}
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'serif' }}>Suggest a Module</Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)} className="bg-slate-100 p-2 rounded-full">
                                <X size={20} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        {/* Input Area */}
                        <TextInput
                            className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-800 text-base mb-6"
                            placeholder="I'd love to learn about..."
                            placeholderTextColor="#94A3B8"
                            multiline={true}
                            numberOfLines={4}
                            style={{ minHeight: 120, textAlignVertical: 'top' }}
                            value={feedbackText}
                            onChangeText={setFeedbackText}
                        />

                        {/* Submit Button */}
                        <TouchableOpacity
                            className={`py-4 rounded-xl items-center ${feedbackText.trim().length > 0 ? 'bg-indigo-600 shadow-md shadow-indigo-200' : 'bg-slate-200'}`}
                            activeOpacity={0.8}
                            onPress={handleFeedbackSubmit}
                            disabled={feedbackText.trim().length === 0}
                        >
                            <Text className={`font-bold text-lg ${feedbackText.trim().length > 0 ? 'text-white' : 'text-slate-400'}`}>
                                Send Suggestion
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
}
