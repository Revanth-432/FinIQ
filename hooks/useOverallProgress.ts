import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useFocusEffect } from 'expo-router';

interface ProgressData {
    completedCount: number;
    totalCount: number;
    percentage: number;
    firstUncompletedLessonId: number | null;
    nextLessonTitle: string | null;
    nextModuleTitle: string | null;
    nextModuleCompletedCount: number;
    nextModuleTotalCount: number;
    loading: boolean;
}

export function useOverallProgress() {
    const [data, setData] = useState<ProgressData>({
        completedCount: 0,
        totalCount: 0,
        percentage: 0,
        firstUncompletedLessonId: null,
        nextLessonTitle: null,
        nextModuleTitle: null,
        nextModuleCompletedCount: 0,
        nextModuleTotalCount: 0,
        loading: true,
    });

    const fetchProgress = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setData(prev => ({ ...prev, loading: false }));
                return;
            }

            // 1. Fetch total lessons available
            const { count: totalCount, error: totalError } = await supabase
                .from('lessons')
                .select('*', { count: 'exact', head: true });

            if (totalError) throw totalError;

            // 2. Fetch user's completed lessons count
            const { data: completedLessons, error: completedError } = await supabase
                .from('user_progress')
                .select('lesson_id')
                .eq('user_id', user.id)
                .eq('is_completed', true);

            if (completedError) throw completedError;

            const completedCount = completedLessons?.length || 0;
            const total = totalCount || 0;

            // Calculate Percentage (int boundary limit 100)
            const percentage = total === 0 ? 0 : Math.min(100, Math.round((completedCount / total) * 100));

            // 3. Find the first uncompleted lesson
            // We pull all lessons ordered logically, then find the first one not in the completed stack
            const completedSet = new Set(completedLessons?.map(p => p.lesson_id));

            const { data: allLessons, error: lessonsError } = await supabase
                .from('lessons')
                .select('id, module_id, order_index, title, modules(title)')
                .order('module_id', { ascending: true })
                .order('order_index', { ascending: true });

            if (lessonsError) throw lessonsError;

            let firstUncompletedId = null;
            let nextLessonTitle = null;
            let nextModuleTitle = null;
            let nextModuleCompletedCount = 0;
            let nextModuleTotalCount = 0;

            if (allLessons) {
                const firstUnfinished = allLessons.find(lesson => !completedSet.has(lesson.id));
                if (firstUnfinished) {
                    firstUncompletedId = firstUnfinished.id;
                    nextLessonTitle = firstUnfinished.title;

                    // Supabase returns foreign joins as objects
                    nextModuleTitle = (firstUnfinished.modules as any)?.title || 'Next Module';

                    // Calculate next module progress
                    const moduleLessons = allLessons.filter(l => l.module_id === firstUnfinished.module_id);
                    nextModuleTotalCount = moduleLessons.length;
                    nextModuleCompletedCount = moduleLessons.filter(l => completedSet.has(l.id)).length;
                }
            }

            setData({
                completedCount,
                totalCount: total,
                percentage,
                firstUncompletedLessonId: firstUncompletedId,
                nextLessonTitle,
                nextModuleTitle,
                nextModuleCompletedCount,
                nextModuleTotalCount,
                loading: false,
            });

        } catch (error) {
            console.error('Error fetching global progress:', error);
            setData(prev => ({ ...prev, loading: false }));
        }
    };

    // We use useFocusEffect to refresh whenever the user tab switches back to Dashboard/Learn/Profile
    useFocusEffect(
        useCallback(() => {
            setData(prev => ({ ...prev, loading: true }));
            fetchProgress();
        }, [])
    );

    return data;
}
