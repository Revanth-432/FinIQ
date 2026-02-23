import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { X, CheckCircle, AlertCircle } from 'lucide-react-native';
import * as Progress from 'react-native-progress';
import ConfettiCannon from 'react-native-confetti-cannon';

export default function TestOutScreen() {
    const { moduleId } = useLocalSearchParams();
    const router = useRouter();

    const [questions, setQuestions] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [completed, setCompleted] = useState(false);
    const [passed, setPassed] = useState(false);

    useEffect(() => {
        fetchTestQuestions();
    }, [moduleId]);

    const fetchTestQuestions = async () => {
        try {
            // 1. Get all Lesson IDs for this module
            const { data: lessons } = await supabase
                .from('lessons')
                .select('id')
                .eq('module_id', moduleId);

            if (!lessons || lessons.length === 0) return;
            const lessonIds = lessons.map(l => l.id);

            // 2. Get 5 Random Quiz Cards from these lessons
            const { data: cards } = await supabase
                .from('cards')
                .select('*')
                .in('lesson_id', lessonIds)
                .eq('type', 'quiz')
                .limit(20); // Fetch more to shuffle

            if (cards) {
                // Shuffle and pick 5
                const shuffled = cards.sort(() => 0.5 - Math.random()).slice(0, 5);
                setQuestions(shuffled);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (optionIndex: number) => {
        const isCorrect = optionIndex === questions[currentIndex].correct_option;
        if (isCorrect) setScore(score + 1);

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            finishTest(score + (isCorrect ? 1 : 0));
        }
    };

    const finishTest = async (finalScore: number) => {
        const percentage = (finalScore / questions.length) * 100;
        const isPass = percentage >= 60; // Pass if 60% or more
        setCompleted(true);
        setPassed(isPass);

        if (isPass) {
            await unlockModule();
        }
    };

    const unlockModule = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get all lessons in this module
            const { data: lessons } = await supabase.from('lessons').select('id').eq('module_id', moduleId);

            if (lessons) {
                // Prepare bulk insert data
                const updates = lessons.map(l => ({
                    user_id: user.id,
                    lesson_id: l.id,
                    is_completed: true,
                    completed_at: new Date()
                }));

                // Upsert (Insert or Update)
                await supabase.from('user_progress').upsert(updates, { onConflict: 'user_id, lesson_id' });
            }
        } catch (error) {
            console.error("Error unlocking module:", error);
        }
    };

    if (loading) return <View className="flex-1 justify-center items-center"><ActivityIndicator size="large" color="#4F46E5" /></View>;
    if (questions.length === 0) return <View className="flex-1 justify-center items-center"><Text>No questions available for this test.</Text></View>;

    // RESULT SCREEN
    if (completed) {
        return (
            <View className="flex-1 bg-white items-center justify-center p-6">
                {passed && <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} />}

                <View className={`w-24 h-24 rounded-full items-center justify-center mb-6 ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
                    {passed ? <CheckCircle size={48} color="#16A34A" /> : <AlertCircle size={48} color="#DC2626" />}
                </View>

                <Text className="text-3xl font-bold text-slate-800 mb-2">{passed ? "Test Passed!" : "Test Failed"}</Text>
                <Text className="text-slate-500 text-center mb-8">
                    {passed
                        ? "Incredible! You've proven your skills. The entire module is now unlocked."
                        : "Don't worry. Review the lessons and try again later!"}
                </Text>

                <Text className="text-xl font-bold mb-8">Score: {Math.round((score / questions.length) * 100)}%</Text>

                <TouchableOpacity onPress={() => router.back()} className="bg-indigo-600 px-8 py-4 rounded-full w-full">
                    <Text className="text-white text-center font-bold text-lg">Continue</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // QUIZ SCREEN
    const progress = (currentIndex + 1) / questions.length;
    const activeQ = questions[currentIndex];

    return (
        <View className="flex-1 bg-indigo-50 pt-12 px-6">
            {/* Header */}
            <View className="flex-row items-center mb-8">
                <TouchableOpacity onPress={() => router.back()}><X size={24} color="#64748B" /></TouchableOpacity>
                <View className="flex-1 mx-4">
                    <Progress.Bar progress={progress} width={null} color="#4F46E5" unfilledColor="#E2E8F0" borderWidth={0} height={6} />
                </View>
                <Text className="font-bold text-indigo-600">{currentIndex + 1}/{questions.length}</Text>
            </View>

            <Text className="text-sm font-bold text-indigo-500 uppercase mb-2">Test-Out Mode</Text>
            <Text className="text-2xl font-bold text-slate-800 mb-8">{activeQ.question}</Text>

            {activeQ.options.map((opt: string, idx: number) => (
                <TouchableOpacity
                    key={idx}
                    onPress={() => handleAnswer(idx)}
                    className="bg-white p-5 rounded-2xl mb-4 border border-slate-200 shadow-sm active:bg-indigo-50 active:border-indigo-200"
                >
                    <Text className="text-slate-700 font-semibold text-lg">{opt}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}
