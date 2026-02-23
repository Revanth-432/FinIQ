import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { X, Smile, Wallet, ArrowRight } from 'lucide-react-native';

export default function ScenarioGame() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [events, setEvents] = useState<any[]>([]);
    const [currentEventIndex, setCurrentEventIndex] = useState(0);
    const [choices, setChoices] = useState<any[]>([]);

    // Game Stats
    const [cash, setCash] = useState(0);
    const [joy, setJoy] = useState(50);
    const [loading, setLoading] = useState(true);

    // Feedback Popup
    const [feedbackData, setFeedbackData] = useState<any>(null);

    useEffect(() => {
        startGame();
    }, [id]);

    const startGame = async () => {
        try {
            // 1. Get Scenario Info (Initial Cash)
            const { data: scenario } = await supabase.from('scenarios').select('*').eq('id', id).single();
            if (scenario) {
                setCash(scenario.initial_cash);
                setJoy(scenario.initial_joy);
            }

            // 2. Get All Events
            const { data: eventData } = await supabase
                .from('scenario_events')
                .select(`*, scenario_choices(*)`) // Fetch choices nested inside events
                .eq('scenario_id', id)
                .order('order_index', { ascending: true });

            if (eventData) {
                setEvents(eventData);
                setChoices(eventData[0].scenario_choices);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChoice = (choice: any) => {
        // 1. Update Stats
        setCash(prev => prev + choice.impact_cash);
        setJoy(prev => Math.min(100, Math.max(0, prev + choice.impact_joy))); // Cap joy between 0-100

        // 2. Show Feedback
        setFeedbackData({
            text: choice.feedback,
            cashChange: choice.impact_cash,
            joyChange: choice.impact_joy
        });
    };

    const nextEvent = () => {
        setFeedbackData(null);
        if (currentEventIndex < events.length - 1) {
            const nextIndex = currentEventIndex + 1;
            setCurrentEventIndex(nextIndex);
            setChoices(events[nextIndex].scenario_choices);
        } else {
            finishGame();
        }
    };

    const finishGame = () => {
        Alert.alert("🎉 Month Survived!", `Final Balance: ₹${cash}\nHappiness: ${joy}/100`, [
            { text: "Awesome", onPress: () => router.back() }
        ]);
    };

    if (loading) return <View className="flex-1 bg-white justify-center items-center"><Text>Loading...</Text></View>;

    const currentEvent = events[currentEventIndex];

    return (
        <View className="flex-1 bg-slate-900 pt-12">

            {/* 1. TOP STATS BAR */}
            <View className="flex-row justify-between px-6 mb-8">
                <View className="bg-white/10 px-4 py-2 rounded-full flex-row items-center border border-white/20">
                    <Wallet size={18} color="#4ADE80" />
                    <Text className="text-white font-bold ml-2 text-lg">₹{cash.toLocaleString()}</Text>
                </View>
                <View className="bg-white/10 px-4 py-2 rounded-full flex-row items-center border border-white/20">
                    <Smile size={18} color="#FACC15" />
                    <Text className="text-white font-bold ml-2 text-lg">{joy}%</Text>
                </View>
            </View>

            {/* 2. MAIN SCENARIO CARD */}
            <View className="flex-1 bg-white rounded-t-[40px] p-8 shadow-2xl items-center">
                <View className="w-16 h-1 bg-slate-200 rounded-full mb-8" />

                <Text className="text-6xl mb-6">{currentEvent.image_url}</Text>

                <Text className="text-2xl font-bold text-slate-800 text-center mb-4 leading-8">
                    {currentEvent.text}
                </Text>

                <View className="flex-1 justify-end w-full space-y-4 mb-8">
                    {choices.map((choice: any, index: number) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleChoice(choice)}
                            className="bg-slate-50 border-2 border-slate-200 p-5 rounded-2xl active:bg-indigo-50 active:border-indigo-500"
                        >
                            <Text className="text-lg font-bold text-slate-700 text-center">{choice.text}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* 3. FEEDBACK MODAL (Shows result of choice) */}
            <Modal visible={!!feedbackData} transparent animationType="fade">
                <View className="flex-1 bg-black/60 justify-center items-center p-6">
                    <View className="bg-white w-full rounded-3xl p-6 items-center">
                        <Text className="text-4xl mb-4">
                            {feedbackData?.joyChange > 0 ? '😎' : '😬'}
                        </Text>
                        <Text className="text-xl font-bold text-slate-800 text-center mb-2">
                            {feedbackData?.text}
                        </Text>

                        <View className="flex-row space-x-4 mb-6">
                            {feedbackData?.cashChange !== 0 && (
                                <Text className={`font-bold ${feedbackData?.cashChange > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    {feedbackData?.cashChange > 0 ? '+' : ''}₹{feedbackData?.cashChange}
                                </Text>
                            )}
                            {feedbackData?.joyChange !== 0 && (
                                <Text className={`font-bold ${feedbackData?.joyChange > 0 ? 'text-yellow-600' : 'text-slate-400'}`}>
                                    {feedbackData?.joyChange > 0 ? '+' : ''}{feedbackData?.joyChange}% Joy
                                </Text>
                            )}
                        </View>

                        <TouchableOpacity onPress={nextEvent} className="bg-indigo-600 px-8 py-4 rounded-full w-full">
                            <Text className="text-white text-center font-bold text-lg">Next Event</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    );
}
