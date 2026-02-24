import React, { useEffect, useState, useRef } from 'react';
import {
    View, Text, TouchableOpacity, ScrollView, Alert, Dimensions,
    Modal, SafeAreaView, Animated, Image, PanResponder
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { X, Play, HelpCircle, RotateCcw, ArrowLeft, Trophy, CheckCircle2, Lightbulb } from 'lucide-react-native';
import * as Progress from 'react-native-progress';
import ConfettiCannon from 'react-native-confetti-cannon';
import * as Haptics from 'expo-haptics';
import Slider from '@react-native-community/slider';
import { useBadgeContext } from '../../context/BadgeContext';
import { evaluateBadges } from '../../utils/badgeEngine';
import { playCorrectSound, playIncorrectSound, playSuccessSound } from '../../utils/sensoryEngine';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 120;

export default function LessonScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [cards, setCards] = useState<any[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    // Common State
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [nextLessonId, setNextLessonId] = useState<number | null>(null);

    // Slider State
    const [sliderValue, setSliderValue] = useState<number>(0);
    const [isSliderSubmitted, setIsSliderSubmitted] = useState(false);

    // Swipe State
    const [swipeDeck, setSwipeDeck] = useState<any[]>([]);
    const pan = useRef(new Animated.ValueXY()).current;

    // Animations
    const floatAnim = useRef(new Animated.Value(0)).current;

    const { queueBadgeUnlock } = useBadgeContext();

    useEffect(() => {
        setLoading(true);
        setCards([]);
        setActiveIndex(0);
        resetInteractionState();
        setIsCompleted(false);
        setNextLessonId(null);
        fetchCards();
        fetchNextLesson();

        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, { toValue: -8, duration: 1500, useNativeDriver: true }),
                Animated.timing(floatAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
            ])
        ).start();
    }, [id, floatAnim]);

    useEffect(() => {
        // When active index changes, reset interaction states and prepare new card data
        resetInteractionState();
        if (cards.length > 0 && cards[activeIndex]) {
            const currentCard = cards[activeIndex];
            if (currentCard.type === 'swipe_game' && currentCard.options) {
                // Initialize Swipe Deck
                // Options array looks like: ["Item1:right", "Item2:left"]
                const parsedDeck = currentCard.options.map((opt: string, i: number) => {
                    const [text, correctDirection] = opt.split(':');
                    return { id: i, text, correctDirection };
                });
                setSwipeDeck(parsedDeck);
                pan.setValue({ x: 0, y: 0 });
            } else if (currentCard.type === 'slider_game' && currentCard.options) {
                // Init slider to middle
                const min = parseInt(currentCard.options[0], 10) || 0;
                const max = parseInt(currentCard.options[1], 10) || 100;
                setSliderValue(Math.floor((min + max) / 2));
            }
        }
    }, [activeIndex, cards]);

    const fetchCards = async () => {
        try {
            if (!id) return;
            const { data, error } = await supabase
                .from('cards')
                .select('*')
                .eq('lesson_id', id)
                .order('order_index', { ascending: true });

            if (error) throw error;
            if (data && data.length > 0) setCards(data);
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchNextLesson = async () => {
        try {
            if (!id) return;
            const { data: currentLesson, error: currError } = await supabase
                .from('lessons')
                .select('module_id, order_index')
                .eq('id', id)
                .single();
            if (currError || !currentLesson) return;

            const { data: nextLesson } = await supabase
                .from('lessons')
                .select('id')
                .eq('module_id', currentLesson.module_id)
                .gt('order_index', currentLesson.order_index)
                .order('order_index', { ascending: true })
                .limit(1)
                .single();
            if (nextLesson) setNextLessonId(nextLesson.id);
        } catch (error) {
            console.log('Error fetching next lesson:', error);
        }
    };

    const resetInteractionState = () => {
        setSelectedOption(null);
        setIsCorrect(null);
        setShowConfetti(false);
        setIsSliderSubmitted(false);
    };

    // --- INTERACTION HANDLERS ---

    // 1. Quiz / Interactive Story Options
    const handleOptionPress = (index: number) => {
        if (selectedOption !== null) return;
        const currentCard = cards[activeIndex];
        setSelectedOption(index);

        let correct = false;
        if (currentCard.correct_option_index !== undefined && currentCard.correct_option_index !== null) {
            correct = index === Number(currentCard.correct_option_index);
        }

        setIsCorrect(correct);
        if (correct) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            playCorrectSound();
            triggerSuccess();
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            playIncorrectSound();
        }
    };

    // 2. Slider Submission
    const handleSliderSubmit = () => {
        const currentCard = cards[activeIndex];
        const targetValue = parseInt(currentCard.options[2], 10);
        // Allow a small margin of error (e.g., 10%)
        const maxVal = parseInt(currentCard.options[1], 10);
        const margin = Math.max(1, Math.floor(maxVal * 0.1));

        const correct = Math.abs(sliderValue - targetValue) <= margin;

        setIsSliderSubmitted(true);
        setIsCorrect(correct);

        if (correct) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            playCorrectSound();
            triggerSuccess();
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            playIncorrectSound();
        }
    };

    // 3. Swipe Game Logics (PanResponder)
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
        onPanResponderRelease: (e, gesture) => {
            const currentItem = swipeDeck[0];
            if (!currentItem) return;

            let forceX = 0;
            let forceY = 0;
            let direction = '';

            if (gesture.dx > SWIPE_THRESHOLD) { direction = 'right'; forceX = SCREEN_WIDTH; }
            else if (gesture.dx < -SWIPE_THRESHOLD) { direction = 'left'; forceX = -SCREEN_WIDTH; }

            if (direction !== '') {
                // Determine if swipe was correct
                const isSwipeCorrect = direction === currentItem.correctDirection;

                if (isSwipeCorrect) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    // Fly off screen
                    Animated.timing(pan, {
                        toValue: { x: forceX, y: forceY },
                        duration: 250,
                        useNativeDriver: false // Layout animation
                    }).start(() => {
                        pan.setValue({ x: 0, y: 0 }); // reset for next card early
                        setSwipeDeck(prev => prev.slice(1));
                        if (swipeDeck.length === 1) {
                            playCorrectSound();
                            triggerSuccess(); // Deck empty
                        }
                    });
                } else {
                    // Incorrect swipe! Bounce back
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                    playIncorrectSound();
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        friction: 4,
                        useNativeDriver: false
                    }).start();
                }
            } else {
                // Didn't swipe far enough, spring back
                Animated.spring(pan, {
                    toValue: { x: 0, y: 0 },
                    friction: 4,
                    useNativeDriver: false
                }).start();
            }
        }
    });


    // --- NAVIGATION ---

    const triggerSuccess = () => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
    }

    const nextCard = () => {
        if (activeIndex < cards.length - 1) setActiveIndex(prev => prev + 1);
        else finishLesson();
    };

    const handlePreviousCard = () => {
        if (activeIndex > 0) setActiveIndex(prev => prev - 1);
    };

    const handleRetry = () => {
        resetInteractionState();
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

                try {
                    const { count: lessonsCount } = await supabase.from('user_progress').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_completed', true);
                    const { data: profile } = await supabase.from('profiles').select('streak_count').eq('id', user.id).single();
                    const { data: progressData } = await supabase.from('user_progress').select('lesson_id').eq('user_id', user.id).eq('is_completed', true);
                    const completedLessonIds = progressData?.map(p => p.lesson_id) || [];

                    evaluateBadges('LESSON_COMPLETE', { completedLessonsCount: lessonsCount || 1, streakCount: profile?.streak_count || 1, completedLessonIds, completedModuleIds: [] }, queueBadgeUnlock, []);
                } catch (e) { console.error("Badge Evaluation Error", e); }
            }
            setIsCompleted(true);
            playSuccessSound();
        } catch (error) {
            console.error(error);
        }
    };

    const handleContinueToNext = () => {
        if (nextLessonId) router.replace({ pathname: '/lesson/[id]', params: { id: nextLessonId } });
        else router.back();
    };

    // --- RENDER HELPERS ---

    const renderFinChat = (contentStr: string) => {
        const cleanText = contentStr.replace('🪙 Fin:', '').trim();
        return (
            <View className="flex-row items-end mb-8 mt-4 pl-1 pr-4">
                <Animated.View style={{ transform: [{ translateY: floatAnim }] }} className="w-16 h-16 bg-yellow-400 rounded-full items-center justify-center mr-3 mb-1 border-4 border-yellow-200 shadow-md overflow-hidden relative">
                    <View className="absolute inset-0 bg-amber-500 opacity-20 rounded-full" />
                    <Text style={{ fontSize: 32, fontWeight: '900', color: '#78350f' }}>₹</Text>
                </Animated.View>
                <View className="flex-1 bg-white p-5 rounded-3xl rounded-bl-sm shadow-md shadow-slate-200 border border-slate-100">
                    <Text className="text-lg font-bold text-slate-800 leading-7">
                        {cleanText}
                    </Text>
                </View>
            </View>
        );
    };

    const isNextEnabled = () => {
        if (!cards[activeIndex]) return false;
        const currentCard = cards[activeIndex];
        switch (currentCard.type) {
            case 'chat_reveal': return true;
            case 'interactive_story':
            case 'quiz': return selectedOption !== null;
            case 'swipe_game': return swipeDeck.length === 0;
            case 'slider_game': return isCorrect === true;
            case 'reward': return true;
            default: return true;
        }
    }


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

    return (
        <SafeAreaView className="flex-1 bg-indigo-50 flex-col pt-8">

            {showConfetti && <ConfettiCannon count={100} origin={{ x: -10, y: 0 }} fadeOut={true} />}

            {/* Header (Hide if Reward Card) */}
            {activeCard.type !== 'reward' && (
                <View className="flex-row items-center px-4 mb-4">
                    <TouchableOpacity onPress={() => router.back()} className="p-2">
                        <X size={24} color="#475569" />
                    </TouchableOpacity>
                    <View className="flex-1 mx-4">
                        <Progress.Bar progress={progress} width={null} height={8} color="#6366F1" unfilledColor="#E2E8F0" borderWidth={0} borderRadius={4} />
                    </View>
                </View>
            )}

            <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingBottom: 40, flexGrow: 1, justifyContent: 'center' }}>

                {/* --- SWITCHBOARD RENDERING --- */}

                {activeCard.type === 'reward' && (
                    <View className="flex-1 items-center justify-center py-10">
                        <View className="bg-yellow-100 p-8 rounded-full mb-8 shadow-xl shadow-yellow-200 border-4 border-yellow-300">
                            <Trophy size={100} color="#D97706" fill="#FDE68A" />
                        </View>
                        <Text className="text-4xl font-black text-slate-800 text-center mb-4">Lesson Complete!</Text>
                        <Text className="text-xl text-slate-600 font-medium text-center mb-10">You've mastered this concept.</Text>

                        <View className="bg-white px-12 py-6 rounded-3xl items-center border border-slate-100 shadow-lg w-full mb-4 focus:scale-105 transition-all">
                            <Text className="text-slate-400 font-bold text-sm uppercase tracking-widest mb-2">XP EARNED</Text>
                            <Text className="text-6xl font-black text-indigo-600">+{activeCard.xp_reward || 50}</Text>
                        </View>
                    </View>
                )}


                {activeCard.type !== 'reward' && (
                    <>
                        {/* Dynamic Illustration */}
                        {activeCard.image_url && (
                            <View className="w-full mb-6 items-center justify-center">
                                <Image source={{ uri: activeCard.image_url }} style={{ width: '100%', height: 200 }} resizeMode="contain" />
                            </View>
                        )}

                        {/* Fin Mascot or Text Banner */}
                        {activeCard.content?.startsWith('🪙 Fin:') ?
                            renderFinChat(activeCard.content) :
                            <View className="bg-white p-6 rounded-3xl shadow-sm mb-8 justify-center">
                                <Text className="text-xl font-bold text-slate-800 text-center leading-8">{activeCard.content}</Text>
                            </View>
                        }

                        {/* =========================================================
                            UI: QUIZ / INTERACTIVE STORY
                        ========================================================= */}
                        {(activeCard.type === 'quiz' || activeCard.type === 'interactive_story') && activeCard.options?.map((option: string, index: number) => {
                            let bgColor = 'bg-white'; let borderColor = 'border-slate-200'; let textColor = 'text-slate-700';
                            if (selectedOption !== null) {
                                const isThisOptionCorrect = activeCard.correct_option_index !== undefined ? index === Number(activeCard.correct_option_index) : false;
                                if (index === selectedOption) {
                                    if (isThisOptionCorrect) { bgColor = 'bg-green-500'; borderColor = 'border-green-600'; textColor = 'text-white'; }
                                    else { bgColor = 'bg-red-500'; borderColor = 'border-red-600'; textColor = 'text-white'; }
                                } else if (isThisOptionCorrect) {
                                    bgColor = 'bg-green-500'; borderColor = 'border-green-600'; textColor = 'text-white';
                                }
                            }
                            return (
                                <TouchableOpacity key={index} onPress={() => handleOptionPress(index)} disabled={selectedOption !== null}
                                    className={`p-6 rounded-3xl mb-4 border-b-4 ${bgColor} ${borderColor} shadow-sm active:opacity-80`}>
                                    <Text className={`font-extrabold text-xl text-center ${textColor}`}>{option}</Text>
                                </TouchableOpacity>
                            );
                        })}

                        {/* Inline Feedback / Explanation for Quiz/Story */}
                        {(activeCard.type === 'quiz' || activeCard.type === 'interactive_story') && selectedOption !== null && (
                            <View>
                                {activeCard.explanation ? (
                                    <View className={`p-5 rounded-3xl mt-2 border flex-row items-center ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                                        <View className="mr-3">
                                            {isCorrect ? <CheckCircle2 size={24} color="#16A34A" /> : <Lightbulb size={24} color="#EA580C" />}
                                        </View>
                                        <View className="flex-1">
                                            <Text className={`font-bold text-lg mb-1 ${isCorrect ? 'text-green-800' : 'text-orange-800'}`}>
                                                {isCorrect ? 'Explanation' : 'Here is why'}
                                            </Text>
                                            <Text className={`text-base leading-6 ${isCorrect ? 'text-green-800' : 'text-orange-800'}`}>
                                                {activeCard.explanation}
                                            </Text>
                                        </View>
                                    </View>
                                ) : (
                                    /* Fallback if no explanation exists */
                                    !isCorrect ? (
                                        <View className="bg-red-50 p-5 rounded-3xl mt-2 border border-red-100 flex-row items-center">
                                            <Text className="text-red-800 font-bold text-lg text-center flex-1">Keep an eye on the green option.</Text>
                                        </View>
                                    ) : null
                                )}
                            </View>
                        )}


                        {/* =========================================================
                            UI: SLIDER GAME
                        ========================================================= */}
                        {activeCard.type === 'slider_game' && activeCard.options && (
                            <View className="bg-white p-8 rounded-3xl shadow-sm items-center border border-slate-100">
                                <Text className="text-6xl font-black text-indigo-600 mb-6">{sliderValue}</Text>
                                <Slider
                                    style={{ width: '100%', height: 40, marginBottom: 20 }}
                                    minimumValue={parseInt(activeCard.options[0], 10)}
                                    maximumValue={parseInt(activeCard.options[1], 10)}
                                    step={1}
                                    value={sliderValue}
                                    onValueChange={setSliderValue}
                                    minimumTrackTintColor="#4F46E5"
                                    maximumTrackTintColor="#E2E8F0"
                                    thumbTintColor="#4F46E5"
                                    disabled={isSliderSubmitted}
                                />
                                <View className="flex-row justify-between w-full px-2 mb-8">
                                    <Text className="text-slate-400 font-bold">{activeCard.options[0]}</Text>
                                    <Text className="text-slate-400 font-bold">{activeCard.options[1]}</Text>
                                </View>

                                {!isSliderSubmitted ? (
                                    <TouchableOpacity onPress={handleSliderSubmit} className="bg-indigo-600 w-full py-4 rounded-2xl shadow-md active:bg-indigo-700">
                                        <Text className="text-white text-center font-bold text-lg">Submit Guess</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <View className={`w-full py-4 rounded-2xl ${isCorrect ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'}`}>
                                        <Text className={`text-center font-bold text-lg ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                                            {isCorrect ? 'Perfect Guess!' : `Close! Correct answer is ~${activeCard.options[2]}`}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        )}


                        {/* =========================================================
                            UI: SWIPE GAME
                        ========================================================= */}
                        {activeCard.type === 'swipe_game' && (
                            <View className="flex-1 min-h-[300px] justify-center items-center relative z-10">
                                {swipeDeck.length > 0 ? (
                                    <>
                                        {/* Background Hint Text */}
                                        <View className="absolute inset-0 flex-row justify-between items-center px-4 -z-10 opacity-30 mt-10">
                                            <View className="items-center"><ArrowLeft size={40} color="#EF4444" /><Text className="text-red-500 font-black mt-2">LEFT</Text></View>
                                            <View className="items-center"><Play size={40} color="#10B981" rotation={0} /><Text className="text-green-500 font-black mt-2">RIGHT</Text></View>
                                        </View>

                                        {/* Interactive Deck */}
                                        {swipeDeck.map((item, i) => {
                                            if (i !== 0) {
                                                // Background cards
                                                return (
                                                    <View key={item.id} className="absolute bg-white w-full aspect-square max-w-[300px] rounded-3xl shadow-md border border-slate-200 items-center justify-center p-6"
                                                        style={{ transform: [{ scale: 1 - (i * 0.05) }, { translateY: i * 15 }], zIndex: 10 - i }}>
                                                        <Text className="text-2xl font-bold text-slate-800 text-center">{item.text}</Text>
                                                    </View>
                                                )
                                            }
                                            // Top Active Card
                                            return (
                                                <Animated.View key={item.id} {...panResponder.panHandlers}
                                                    className="absolute bg-white w-full aspect-square max-w-[300px] rounded-3xl shadow-xl shadow-slate-300 border border-slate-100 items-center justify-center p-6"
                                                    style={{
                                                        transform: [{ translateX: pan.x }, { translateY: pan.y },
                                                        { rotate: pan.x.interpolate({ inputRange: [-200, 0, 200], outputRange: ['-10deg', '0deg', '10deg'] }) }], zIndex: 100
                                                    }}>
                                                    <Text className="text-2xl pt-2 font-bold text-slate-800 text-center">{item.text}</Text>
                                                </Animated.View>
                                            )
                                        })}
                                    </>
                                ) : (
                                    <View className="bg-green-100 p-8 rounded-full border-4 border-green-200 items-center">
                                        <CheckCircle2 size={64} color="#16A34A" />
                                        <Text className="text-green-800 font-bold text-lg mt-4">Sorted Perfectly!</Text>
                                    </View>
                                )}
                            </View>
                        )}
                    </>
                )}
            </ScrollView>

            {/* FIXED FOOTER ACTIONS */}
            <View className="p-6 bg-white border-t border-slate-200 shadow-2xl flex-row items-center justify-between z-50">
                {activeIndex > 0 && activeCard.type !== 'reward' && (
                    <TouchableOpacity onPress={handlePreviousCard} className="p-4 flex-row items-center justify-center mr-3 rounded-2xl">
                        <ArrowLeft size={20} color="#64748B" />
                        <Text className="text-slate-500 font-bold ml-2 text-lg">Back</Text>
                    </TouchableOpacity>
                )}

                <View className="flex-1">
                    {/* General Continue Logic (Managed by isNextEnabled()) */}
                    {isNextEnabled() ? (
                        <TouchableOpacity onPress={activeCard.type === 'reward' ? finishLesson : nextCard} className="bg-indigo-600 p-4 rounded-2xl items-center shadow-lg shadow-indigo-300 active:bg-indigo-700">
                            <Text className="text-white font-bold text-lg">{activeCard.type === 'reward' ? 'Complete Lesson' : 'Continue'}</Text>
                        </TouchableOpacity>
                    ) : (
                        <View>
                            {/* IF FAILED explicitly on Slider -> Show Try Again */}
                            {activeCard.type === 'slider_game' && isSliderSubmitted && !isCorrect ? (
                                <TouchableOpacity onPress={handleRetry} className="bg-indigo-600 p-4 rounded-2xl flex-row items-center justify-center shadow-lg shadow-indigo-300 active:bg-indigo-700">
                                    <RotateCcw size={18} color="white" />
                                    <Text className="text-white font-bold ml-2 text-lg">Try Again</Text>
                                </TouchableOpacity>
                            ) : (
                                /* Disabled State while interacting (e.g., swiping, dragging slider, unselected quiz) */
                                <TouchableOpacity disabled={true} className="bg-slate-200 p-4 rounded-2xl items-center border border-slate-300">
                                    <Text className="text-slate-400 font-bold text-lg">Interact to Continue</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
            </View>

            {/* SUCCESS MODAL (End of module routing) */}
            <Modal visible={isCompleted} transparent={true} animationType="fade" onRequestClose={() => router.back()}>
                <View className="flex-1 bg-black/80 justify-center items-center">
                    <View className="bg-white m-6 p-8 rounded-3xl w-11/12 items-center shadow-2xl">
                        <View className="bg-indigo-100 p-6 rounded-full mb-6">
                            <Trophy size={60} color="#4F46E5" />
                        </View>
                        <Text className="text-3xl font-extrabold text-slate-800 text-center mb-8">Lesson Cleared!</Text>

                        <TouchableOpacity onPress={handleContinueToNext} className="bg-indigo-600 w-full py-4 rounded-2xl shadow-lg shadow-indigo-300 active:bg-indigo-700 mb-4">
                            <Text className="text-white text-center font-bold text-lg tracking-wide">{nextLessonId ? 'GO TO NEXT LESSON' : 'FINISH MODULE'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.back()} className="w-full py-3">
                            <Text className="text-slate-500 text-center font-bold text-md tracking-wide uppercase">Back to Menu</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
