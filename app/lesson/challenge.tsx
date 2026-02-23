import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Modal, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { X, Trophy, AlertTriangle, Play, HelpCircle, ArrowLeft, RotateCcw } from 'lucide-react-native';
import * as Progress from 'react-native-progress';
import ConfettiCannon from 'react-native-confetti-cannon';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function LessonChallengeScreen() {
    const { id } = useLocalSearchParams(); // Lesson ID
    const router = useRouter();

    const [questions, setQuestions] = useState<any[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [showConfetti, setShowConfetti] = useState(false);

    // Challenge State
    const [isCompleted, setIsCompleted] = useState(false); // Success Modal
    const [isFailed, setIsFailed] = useState(false); // Failure Screen

    useEffect(() => {
        fetchChallengeQuestions();
    }, [id]);

    const fetchChallengeQuestions = async () => {
        try {
            if (!id) return;

            // Fetch ONLY quiz cards or cards with options
            const { data, error } = await supabase
                .from('cards')
                .select('*')
                .eq('lesson_id', id)
                .in('type', ['quiz']) // Or logic if other types have options
                .order('order_index', { ascending: true });

            if (error) throw error;

            // Filter client-side to be safe if types are mixed but have options
            const challengeQuestions = data?.filter(card =>
                card.type === 'quiz' || (card.options && card.options.length > 0)
            ) || [];

            if (challengeQuestions.length === 0) {
                Alert.alert("No Challenge Available", "This lesson doesn't have enough questions for a challenge.");
                router.back();
                return;
            }

            setQuestions(challengeQuestions);
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOptionPress = async (index: number) => {
        if (selectedOption !== null) return; // Prevent double tapping

        setSelectedOption(index);
        const currentQuestion = questions[activeIndex];
        const isCorrect = index === currentQuestion.correct_option;

        // Challenge Logic: ALL OR NOTHING
        if (!isCorrect) {
            // Immediate Failure
            setTimeout(() => {
                setIsFailed(true);
            }, 500);
        } else {
            // Correct - waiting delay before next
            setTimeout(() => {
                nextQuestion();
            }, 800);
        }
    };

    const nextQuestion = () => {
        if (activeIndex < questions.length - 1) {
            setActiveIndex(prev => prev + 1);
            setSelectedOption(null);
        } else {
            // All questions answered correctly!
            finishChallenge();
        }
    };

    const finishChallenge = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase
                    .from('user_progress')
                    .upsert(
                        { user_id: user.id, lesson_id: id, is_completed: true, completed_at: new Date() },
                        { onConflict: 'user_id, lesson_id' }
                    );
            }
            setIsCompleted(true);
            setShowConfetti(true);

        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <View className="flex-1 bg-white justify-center items-center"><Text>Loading Challenge...</Text></View>;

    if (isFailed) {
        return (
            <View className="flex-1 bg-red-50 justify-center items-center p-8">
                <View className="bg-red-100 p-6 rounded-full mb-6">
                    <AlertTriangle size={64} color="#DC2626" />
                </View>
                <Text className="text-3xl font-bold text-slate-800 text-center mb-2">Close Call!</Text>
                <Text className="text-slate-600 text-center text-lg mb-8 leading-relaxed">
                    Review previous topics and try later to master this challenge.
                </Text>

                {/* Removed 'Start Full Lesson' button to prevent backdoor access */}

                <TouchableOpacity
                    onPress={() => router.back()}
                    className="p-4"
                >
                    <Text className="text-slate-500 font-bold text-md">Back to Module</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const activeCard = questions[activeIndex];
    const progress = (activeIndex + 1) / questions.length;

    return (
        <View className="flex-1 bg-indigo-50 pt-12">

            {/* Header */}
            <View className="flex-row items-center px-4 mb-4 justify-between">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <X size={24} color="#475569" />
                </TouchableOpacity>
                <Text className="font-bold text-indigo-900 text-lg tracking-wider">LESSON CHALLENGE</Text>
                <View className="w-8" />
            </View>

            {/* Progress Bar */}
            <View className="mx-6 mb-6">
                <View className="flex-row justify-between mb-2">
                    <Text className="text-xs font-bold text-slate-400 uppercase">Progress</Text>
                    <Text className="text-xs font-bold text-slate-400">{activeIndex + 1} / {questions.length}</Text>
                </View>
                <Progress.Bar
                    progress={progress}
                    width={null}
                    height={8}
                    color="#6366F1"
                    unfilledColor="#E2E8F0"
                    borderWidth={0}
                    borderRadius={4}
                />
            </View>

            <ScrollView contentContainerStyle={{ padding: 24 }}>

                {/* Question Card */}
                <View className="bg-white p-6 rounded-3xl shadow-sm mb-8 min-h-[150px] justify-center">
                    {/* Badge */}
                    <View className="self-start bg-amber-100 px-3 py-1 rounded-full mb-4 flex-row items-center">
                        <Trophy size={12} color="#D97706" />
                        <Text className="text-amber-700 text-xs font-bold uppercase ml-2">
                            Challenge Question
                        </Text>
                    </View>

                    <Text className="text-xl font-bold text-slate-800 text-center leading-8">
                        {activeCard.question /* Pure Database Text */}
                    </Text>
                </View>

                {/* Options */}
                {activeCard.options && activeCard.options.map((option: string, index: number) => {
                    let bgColor = 'bg-white';
                    let borderColor = 'border-slate-200';
                    let textColor = 'text-slate-700';

                    if (selectedOption !== null) {
                        if (index === activeCard.correct_option) {
                            bgColor = 'bg-green-100';
                            borderColor = 'border-green-400';
                            textColor = 'text-green-800';
                        } else if (index === selectedOption) {
                            bgColor = 'bg-red-100';
                            borderColor = 'border-red-400';
                            textColor = 'text-red-800';
                        }
                    }

                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleOptionPress(index)}
                            disabled={selectedOption !== null}
                            className={`p-5 rounded-2xl mb-4 border-2 ${bgColor} ${borderColor} shadow-sm`}
                        >
                            <Text className={`font-bold text-lg ${textColor}`}>{option}</Text>
                        </TouchableOpacity>
                    );
                })}

            </ScrollView>

            {/* SUCCESS MODAL */}
            <Modal
                visible={isCompleted}
                transparent={true}
                animationType="fade"
                onRequestClose={() => router.back()}
            >
                <View className="flex-1 bg-black/80 justify-center items-center">

                    {showConfetti && <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} fadeOut={true} />}

                    <View className="bg-white m-6 p-8 rounded-3xl w-11/12 items-center shadow-2xl">

                        <View className="bg-yellow-100 p-6 rounded-full mb-6">
                            <Trophy size={80} color="#F59E0B" fill="#FDE68A" />
                        </View>

                        <Text className="text-3xl font-extrabold text-slate-800 text-center mb-2">
                            Challenge Crushed!
                        </Text>
                        <Text className="text-slate-500 text-center font-medium mb-8">
                            You proved your skills and skipped ahead.
                        </Text>

                        {/* XP Earned */}
                        <View className="w-full items-center mb-10">
                            <View className="bg-indigo-50 px-12 py-6 rounded-3xl items-center border border-indigo-100 shadow-sm w-full">
                                <Text className="text-indigo-400 font-bold text-xs uppercase tracking-widest mb-2">
                                    XP EARNED
                                </Text>
                                <Text className="text-6xl font-black text-indigo-600">
                                    +60
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="bg-indigo-600 w-full py-4 rounded-2xl shadow-lg shadow-indigo-300"
                        >
                            <Text className="text-white text-center font-bold text-lg tracking-wide">
                                UNLOCK NEXT LESSON
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>

        </View>
    );
}
