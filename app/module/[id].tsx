import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { PlayCircle, CheckCircle, Lock, Clock } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { Lesson } from '../../types/schema';

export default function ModuleDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [moduleTitle, setModuleTitle] = useState('');

    // useFocusEffect runs every time you navigate TO this screen
    useFocusEffect(
        useCallback(() => {
            fetchModuleDetails();
        }, [id])
    );

    const fetchModuleDetails = async () => {
        try {
            setLoading(true);

            // 1. Get Module Info
            const { data: moduleData, error: moduleError } = await supabase
                .from('modules')
                .select('title')
                .eq('id', id)
                .single();

            if (moduleData) setModuleTitle(moduleData.title);

            // 2. Get Lessons
            const { data: lessonsData, error: lessonsError } = await supabase
                .from('lessons')
                .select('*')
                .eq('module_id', id)
                .order('order_index', { ascending: true });

            if (lessonsError) throw lessonsError;
            setLessons(lessonsData || []);

            // 3. Get User Progress (Which lessons are done?)
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data: progressData } = await supabase
                    .from('user_progress')
                    .select('lesson_id')
                    .eq('user_id', user.id)
                    .eq('is_completed', true);

                const completedIds = progressData?.map(p => p.lesson_id) || [];
                setCompletedLessonIds(completedIds);
            }

        } catch (error) {
            console.error('Error fetching module details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color="#4F46E5" />
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="p-6">
                <Text className="text-3xl font-bold text-slate-900 mb-2">{moduleTitle}</Text>
                <Text className="text-slate-500 mb-8">{lessons.length} Lessons</Text>

                <View className="space-y-4">
                    {lessons.map((lesson, index) => {
                        const isCompleted = completedLessonIds.includes(lesson.id);
                        // Lock logic: First lesson is always unlocked. Others need previous one done.
                        // Simplified logic: If index 0, unlocked. If index > 0, check if previous lesson is completed.
                        // Note: This assumes lessons are sorted by order_index.
                        const previousLessonId = index > 0 ? lessons[index - 1].id : null;
                        const isLocked = index > 0 && previousLessonId && !completedLessonIds.includes(previousLessonId);

                        return (
                            <TouchableOpacity
                                key={lesson.id}
                                disabled={isLocked}
                                onPress={() => router.push(`/lesson/${lesson.id}`)}
                                className={`flex-row items-center p-4 rounded-xl border-2 ${isLocked
                                    ? 'bg-gray-100 border-gray-200 opacity-60'
                                    : isCompleted
                                        ? 'bg-green-50 border-green-200'
                                        : 'bg-white border-slate-100'
                                    }`}
                            >
                                {/* Icon Logic */}
                                <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${isCompleted ? 'bg-green-100' : isLocked ? 'bg-gray-200' : 'bg-blue-100'
                                    }`}>
                                    {isCompleted ? (
                                        <CheckCircle size={24} color="green" />
                                    ) : isLocked ? (
                                        <Lock size={20} color="gray" />
                                    ) : (
                                        <PlayCircle size={24} color="#4F46E5" />
                                    )}
                                </View>

                                <View className="flex-1">
                                    <Text className={`text-lg font-bold ${isCompleted ? 'text-green-800' : 'text-slate-800'}`}>
                                        {lesson.title}
                                    </Text>
                                    <View className="flex-row items-center mt-1">
                                        <Clock size={14} color="#94A3B8" />
                                        <Text className="text-slate-400 text-xs ml-1">{lesson.duration} min</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        </ScrollView>
    );
}
