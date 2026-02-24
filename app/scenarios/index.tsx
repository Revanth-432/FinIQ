import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Gamepad2, Coins } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ScenariosList() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [scenarios, setScenarios] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchScenarios();
    }, []);

    const fetchScenarios = async () => {
        const { data } = await supabase.from('scenarios').select('*');
        if (data) setScenarios(data);
        setLoading(false);
    };

    if (loading) return <View className="flex-1 justify-center items-center"><ActivityIndicator size="large" color="#4F46E5" /></View>;

    return (
        <View className="flex-1 bg-slate-50">
            <ScrollView
                className="flex-1 px-6 pt-12"
                contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
            >
                <TouchableOpacity onPress={() => router.back()} className="mb-6">
                    <ArrowLeft size={24} color="#334155" />
                </TouchableOpacity>

                <Text className="text-3xl font-bold text-slate-800 mb-2">Real-Life Scenarios</Text>
                <Text className="text-slate-500 mb-8">Test your decision making skills in simulated financial situations.</Text>

                {scenarios.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => router.push(`/scenarios/${item.id}`)}
                        className="bg-white p-6 rounded-3xl mb-4 shadow-sm border border-slate-100"
                    >
                        <View className="flex-row justify-between items-start mb-2">
                            <View className="bg-indigo-100 p-3 rounded-2xl">
                                <Gamepad2 size={24} color="#4F46E5" />
                            </View>
                            <View className="bg-green-100 px-3 py-1 rounded-full">
                                <Text className="text-green-700 font-bold text-xs">{item.difficulty}</Text>
                            </View>
                        </View>

                        <Text className="text-xl font-bold text-slate-800 mb-1">{item.title}</Text>
                        <Text className="text-slate-500 text-sm mb-4">{item.description}</Text>

                        <View className="flex-row items-center space-x-4">
                            <View className="flex-row items-center">
                                <Coins size={14} color="#CA8A04" />
                                <Text className="text-slate-600 text-xs ml-1">Start: ₹{item.initial_cash.toLocaleString()}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}
