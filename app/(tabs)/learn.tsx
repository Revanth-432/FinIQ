import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { ChevronDown, ChevronUp, Lock, CheckCircle, PlayCircle, BookOpen, Trophy } from 'lucide-react-native';

export default function LearnScreen() {
    const router = useRouter();
    const [modules, setModules] = useState<any[]>([]);
    const [expandedModule, setExpandedModule] = useState<number | null>(1);
    const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

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

    const toggleModule = (id: number) => {
        setExpandedModule(expandedModule === id ? null : id);
    };

    if (loading) return <View className="flex-1 justify-center items-center"><ActivityIndicator size="large" color="#6366F1" /></View>;

    return (
        <ScrollView className="flex-1 bg-[#EAF0F6] pt-16 px-4">
            <Text className="text-3xl font-bold text-slate-800 mb-6" style={{ fontFamily: 'serif' }}>My Learning Path</Text>

            {modules.map((module) => (
                <View key={module.id} className="mb-4 bg-white rounded-3xl overflow-hidden shadow-sm">
                    {/* Accordion Header */}
                    <TouchableOpacity
                        onPress={() => toggleModule(module.id)}
                        className="p-5 flex-row justify-between items-center bg-white"
                        activeOpacity={0.7}
                    >
                        <View className="flex-row items-center flex-1">
                            <View className="w-10 h-10 bg-indigo-100 rounded-full items-center justify-center mr-4">
                                <BookOpen size={20} color="#4F46E5" />
                            </View>
                            <View>
                                <Text className="text-lg font-bold text-slate-800">{module.title}</Text>
                                <Text className="text-xs text-slate-500">{module.lessons?.length || 0} Lessons</Text>
                            </View>
                        </View>
                        {expandedModule === module.id ? <ChevronUp size={20} color="#94A3B8" /> : <ChevronDown size={20} color="#94A3B8" />}
                    </TouchableOpacity>

                    {/* Lessons List */}
                    {expandedModule === module.id && (
                        <View className="bg-slate-50 px-4 pb-4 pt-2">
                            {module.lessons?.map((lesson: any, index: number) => {
                                const isCompleted = completedLessonIds.includes(lesson.id);
                                const previousLesson = index > 0 ? module.lessons[index - 1] : null;
                                const isUnlocked = index === 0 || (previousLesson && completedLessonIds.includes(previousLesson.id));

                                return (
                                    <View key={lesson.id} className={`p-4 mt-2 rounded-2xl border ${isUnlocked ? 'bg-white border-indigo-100' : 'bg-slate-100 border-transparent'}`}>
                                        <TouchableOpacity
                                            onPress={() => handleLessonPress(lesson, previousLesson?.id || null)}
                                            className="flex-row items-center"
                                        >
                                            <View className="flex-1">
                                                <Text className={`font-bold text-base ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                                                    {lesson.title}
                                                </Text>
                                                <Text className="text-xs text-slate-400 mt-1 mb-2">{lesson.description}</Text>
                                            </View>

                                            {isCompleted ? (
                                                <CheckCircle size={24} color="#22C55E" fill="#DCFCE7" />
                                            ) : isUnlocked ? (
                                                <PlayCircle size={24} color="#4F46E5" fill="#E0E7FF" />
                                            ) : (
                                                <Lock size={20} color="#94A3B8" />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </View>
                    )}
                </View>
            ))}
            <View className="h-24" />
        </ScrollView>
    );
}
