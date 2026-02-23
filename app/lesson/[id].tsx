import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Dimensions, Modal, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { X, Play, HelpCircle, RotateCcw, ArrowLeft, Trophy } from 'lucide-react-native';
import * as Progress from 'react-native-progress';
import ConfettiCannon from 'react-native-confetti-cannon';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function LessonScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [cards, setCards] = useState<any[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);
    const [showConfetti, setShowConfetti] = useState(false);

    // New State for Success Modal
    const [isCompleted, setIsCompleted] = useState(false);

    // Next Lesson Logic
    const [nextLessonId, setNextLessonId] = useState<number | null>(null);

    useEffect(() => {
        // Reset state when ID changes (new lesson loaded)
        setLoading(true);
        setCards([]);
        setActiveIndex(0);
        setSelectedOption(null);
        setIsCorrect(null);
        setIsCompleted(false);
        setShowConfetti(false);
        setNextLessonId(null);

        fetchCards();
        fetchNextLesson();
    }, [id]);

    const fetchCards = async () => {
        try {
            if (!id) return;

            const { data, error } = await supabase
                .from('cards')
                .select('*')
                .eq('lesson_id', id)
                .order('order_index', { ascending: true }); // Changed to order_index for safety

            if (error) throw error;

            if (data && data.length > 0) {
                setCards(data);
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchNextLesson = async () => {
        try {
            if (!id) return;

            // 1. Get current lesson details (module_id, order_index)
            const { data: currentLesson, error: currError } = await supabase
                .from('lessons')
                .select('module_id, order_index')
                .eq('id', id)
                .single();

            if (currError || !currentLesson) return;

            // 2. Find the immediate next lesson in the same module
            const { data: nextLesson, error: nextError } = await supabase
                .from('lessons')
                .select('id')
                .eq('module_id', currentLesson.module_id)
                .gt('order_index', currentLesson.order_index)
                .order('order_index', { ascending: true })
                .limit(1)
                .single();

            if (nextLesson) {
                setNextLessonId(nextLesson.id);
            }
        } catch (error) {
            console.log('Error fetching next lesson:', error);
        }
    };

    const handleOptionPress = (index: number) => {
        if (selectedOption !== null) return; // Prevent changing answer once selected

        setSelectedOption(index);
        const currentCard = cards[activeIndex];
        const selectedValue = currentCard.options ? currentCard.options[index] : null;

        // Validation: Prefer 'correct_answer' string comparison, fallback to 'correct_option' index
        let correct = false;
        if (currentCard.correct_answer && selectedValue) {
            correct = selectedValue === currentCard.correct_answer;
        } else if (currentCard.correct_option !== undefined) {
            correct = index === currentCard.correct_option;
        }

        setIsCorrect(correct);

        if (correct) {
            setShowConfetti(true);
            // Stop confetti after 2 seconds
            setTimeout(() => setShowConfetti(false), 2000);
        }
    };

    const handleRetry = () => {
        // Reset selection so they can try again
        setSelectedOption(null);
        setIsCorrect(null);
    };

    const handleReview = () => {
        // Go back to previous card
        if (activeIndex > 0) {
            setActiveIndex(prev => prev - 1);
            setSelectedOption(null);
            setIsCorrect(null);
        } else {
            Alert.alert("Start of Lesson", "This is the first card.");
        }
    };

    const nextCard = () => {
        if (activeIndex < cards.length - 1) {
            setActiveIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsCorrect(null);
        } else {
            // Last card finished
            finishLesson();
        }
    };

    const finishLesson = async () => {
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
            // Instead of Alert, show Modal
            setIsCompleted(true);

        } catch (error) {
            console.error(error);
        }
    };

    const handleContinueToNext = () => {
        if (nextLessonId) {
            // Replace current screen with next lesson to avoid stack buildup
            router.replace({ pathname: '/lesson/[id]', params: { id: nextLessonId } });
        } else {
            // No next lesson (End of Module) -> Go back
            router.back();
        }
    };

    if (loading) return <View className="flex-1 bg-white justify-center items-center"><Text>Loading...</Text></View>;

    if (cards.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center items-center p-6">
                <Text className="text-xl font-bold text-slate-800 mb-2">No Content Found 😕</Text>
                <TouchableOpacity onPress={() => router.back()} className="bg-indigo-600 px-6 py-3 rounded-full mt-4">
                    <Text className="text-white font-bold">Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const activeCard = cards[activeIndex];
    const progress = (activeIndex + 1) / cards.length;
    // Determine if generic quiz structure (options exists) or specific type
    const isQuiz = activeCard.type === 'quiz' || (activeCard.options && activeCard.options.length > 0);

    return (
        <SafeAreaView className="flex-1 bg-indigo-50 flex-col pt-8">

            {/* Confetti for Correct Answers (In-Lesson) */}
            {showConfetti && <ConfettiCannon count={100} origin={{ x: -10, y: 0 }} fadeOut={true} />}

            {/* Header */}
            <View className="flex-row items-center px-4 mb-4">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <X size={24} color="#475569" />
                </TouchableOpacity>
                <View className="flex-1 mx-4">
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
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>

                {/* Badge */}
                <View className={`self-start px-3 py-1 rounded-full mb-4 flex-row items-center ${activeCard.type === 'quiz' ? 'bg-indigo-100' : 'bg-green-100'}`}>
                    {activeCard.type === 'quiz' ? (
                        <HelpCircle size={12} color="#4F46E5" />
                    ) : (
                        <Play size={12} color="#15803d" />
                    )}
                    <Text className={`text-xs font-bold uppercase ml-2 ${activeCard.type === 'quiz' ? 'text-indigo-700' : 'text-green-700'}`}>
                        {activeCard.type === 'quiz' ? 'Quiz' : 'Learn'}
                    </Text>
                </View>

                {/* Question / Content -- PRESERVING card.question as requested */}
                <View className="bg-white p-6 rounded-3xl shadow-sm mb-8 min-h-[150px] justify-center">
                    <Text className="text-xl font-bold text-slate-800 text-center leading-8">
                        {activeCard.question || activeCard.content /* Fallback to content if question empty, just in case */}
                    </Text>
                </View>

                {/* Options (Quiz Mode) */}
                {isQuiz && activeCard.options && activeCard.options.map((option: string, index: number) => {
                    let bgColor = 'bg-white';
                    let borderColor = 'border-slate-200';
                    let textColor = 'text-slate-700';

                    if (selectedOption !== null) {
                        // Check against correct_answer if available, otherwise fallback to correct_option index
                        const isThisOptionCorrect = activeCard.correct_answer
                            ? option === activeCard.correct_answer
                            : index === activeCard.correct_option;

                        // If this specific option is the correct one, always turn green (to show correct answer if they got it wrong)
                        if (isThisOptionCorrect) {
                            bgColor = 'bg-green-100';
                            borderColor = 'border-green-400';
                            textColor = 'text-green-800';
                        }
                        // If this was the selected option and it's WRONG, turn red
                        else if (index === selectedOption && !isThisOptionCorrect) {
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

                {/* Inline Feedback for Wrong Answer */}
                {isQuiz && selectedOption !== null && !isCorrect && (
                    <View className="bg-red-50 p-4 rounded-2xl mt-4 border border-red-100">
                        <Text className="text-red-800 font-bold text-lg mb-2 text-center">Oops! That's not right.</Text>
                        <Text className="text-slate-600 text-center">
                            The correct answer is highlighted in green.
                        </Text>
                    </View>
                )}

                {/* Inline Feedback for Correct Answer */}
                {isQuiz && selectedOption !== null && isCorrect && (
                    <View className="bg-green-50 p-4 rounded-2xl mt-4 border border-green-100">
                        <Text className="text-green-800 font-bold text-lg text-center">Correct! 🎉</Text>
                    </View>
                )}

            </ScrollView>

            {/* FIXED FOOTER ACTIONS */}
            <View className="p-6 bg-white border-t border-slate-200 shadow-2xl">
                {/* Case 1: Hook Card (Just Info) -> Show Continue Immediately */}
                {!isQuiz && (
                    <TouchableOpacity
                        onPress={nextCard}
                        className="bg-indigo-600 p-4 rounded-2xl items-center shadow-lg shadow-indigo-200"
                    >
                        <Text className="text-white font-bold text-lg">Got it, Next!</Text>
                    </TouchableOpacity>
                )}

                {/* Case 2: Quiz Card */}
                {isQuiz && (
                    <View>
                        {/* No selection yet -> Disabled Continue Button */}
                        {selectedOption === null && (
                            <TouchableOpacity
                                disabled={true}
                                className="bg-slate-300 p-4 rounded-2xl items-center"
                            >
                                <Text className="text-slate-500 font-bold text-lg">Continue</Text>
                            </TouchableOpacity>
                        )}

                        {/* CORRECT ANSWER -> Show Continue */}
                        {selectedOption !== null && isCorrect && (
                            <TouchableOpacity
                                onPress={nextCard}
                                className="bg-green-600 p-4 rounded-2xl items-center shadow-lg shadow-green-200"
                            >
                                <Text className="text-white font-bold text-lg">Continue</Text>
                            </TouchableOpacity>
                        )}

                        {/* WRONG ANSWER -> Show Try Again / Review */}
                        {selectedOption !== null && !isCorrect && (
                            <View className="flex-row justify-between">
                                {/* Button 1: Review Previous Card */}
                                <TouchableOpacity
                                    onPress={handleReview}
                                    className="flex-1 bg-white border border-slate-200 p-4 rounded-2xl flex-row items-center justify-center mr-2 shadow-sm"
                                >
                                    <ArrowLeft size={18} color="#64748B" />
                                    <Text className="text-slate-600 font-bold ml-2">Review</Text>
                                </TouchableOpacity>

                                {/* Button 2: Try Again */}
                                <TouchableOpacity
                                    onPress={handleRetry}
                                    className="flex-1 bg-indigo-600 p-4 rounded-2xl flex-row items-center justify-center ml-2 shadow-lg shadow-indigo-200"
                                >
                                    <RotateCcw size={18} color="white" />
                                    <Text className="text-white font-bold ml-2">Try Again</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
            </View>

            {/* SUCCESS MODAL */}
            <Modal
                visible={isCompleted}
                transparent={true}
                animationType="fade"
                onRequestClose={() => router.back()} // Android Back Button
            >
                <View className="flex-1 bg-black/80 justify-center items-center">

                    {/* Confetti inside Modal */}
                    <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} fadeOut={true} />

                    <View className="bg-white m-6 p-8 rounded-3xl w-11/12 items-center shadow-2xl">

                        {/* Trophy Icon */}
                        <View className="bg-yellow-100 p-6 rounded-full mb-6">
                            <Trophy size={80} color="#F59E0B" fill="#FDE68A" />
                        </View>

                        <Text className="text-3xl font-extrabold text-slate-800 text-center mb-2">
                            Lesson Complete!
                        </Text>
                        <Text className="text-slate-500 text-center font-medium mb-8">
                            Great job mastering this topic.
                        </Text>

                        {/* XP Earned - Centered & Large */}
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

                        {/* Continue Button */}
                        <TouchableOpacity
                            onPress={handleContinueToNext}
                            className="bg-indigo-600 w-full py-4 rounded-2xl shadow-lg shadow-indigo-300 active:bg-indigo-700 mb-4"
                        >
                            <Text className="text-white text-center font-bold text-lg tracking-wide">
                                {nextLessonId ? 'CONTINUE TO NEXT LESSON' : 'FINISH MODULE'}
                            </Text>
                        </TouchableOpacity>

                        {/* Secondary Button: BACK TO MODULES */}
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-full py-3"
                        >
                            <Text className="text-slate-500 text-center font-bold text-md tracking-wide uppercase">
                                Back to Modules
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
}
