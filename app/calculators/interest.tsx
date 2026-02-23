import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Percent } from 'lucide-react-native';
import Slider from '@react-native-community/slider';

export default function InterestCalculator() {
    const router = useRouter();

    const [principal, setPrincipal] = useState(10000);
    const [rate, setRate] = useState(5);
    const [time, setTime] = useState(2);

    const interest = (principal * rate * time) / 100;
    const totalAmount = principal + interest;

    return (
        <ScrollView className="flex-1 bg-slate-50">
            {/* Header */}
            <View className="bg-green-600 pb-10 pt-12 px-6 rounded-b-[40px] shadow-lg mb-6">
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-full mr-4">
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-2xl font-bold">Interest Calc</Text>
                </View>

                <View className="items-center mt-2">
                    <Text className="text-green-200 text-sm font-bold uppercase tracking-widest mb-1">TOTAL AMOUNT</Text>
                    <Text className="text-white text-5xl font-bold">₹{totalAmount.toLocaleString()}</Text>
                    <Text className="text-green-100 text-sm mt-2">
                        Principal: ₹{principal.toLocaleString()}  •  Interest Earned: +₹{interest.toLocaleString()}
                    </Text>
                </View>
            </View>

            {/* INPUTS */}
            <View className="px-6">
                <View className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">

                    {/* Principal */}
                    <View className="mb-6">
                        <Text className="text-slate-500 font-bold mb-2">Principal Amount (₹)</Text>
                        <Text className="text-2xl font-bold text-slate-800 mb-2">₹{principal.toLocaleString()}</Text>
                        <Slider
                            minimumValue={1000} maximumValue={500000} step={1000}
                            value={principal} onValueChange={setPrincipal}
                            minimumTrackTintColor="#16A34A" thumbTintColor="#16A34A"
                        />
                    </View>

                    {/* Rate */}
                    <View className="mb-6">
                        <Text className="text-slate-500 font-bold mb-2">Interest Rate (% p.a)</Text>
                        <Text className="text-2xl font-bold text-slate-800 mb-2">{rate}%</Text>
                        <Slider
                            minimumValue={1} maximumValue={20} step={0.5}
                            value={rate} onValueChange={setRate}
                            minimumTrackTintColor="#16A34A" thumbTintColor="#16A34A"
                        />
                    </View>

                    {/* Time */}
                    <View className="mb-2">
                        <Text className="text-slate-500 font-bold mb-2">Time Period (Years)</Text>
                        <Text className="text-2xl font-bold text-slate-800 mb-2">{time} Years</Text>
                        <Slider
                            minimumValue={1} maximumValue={30} step={1}
                            value={time} onValueChange={setTime}
                            minimumTrackTintColor="#16A34A" thumbTintColor="#16A34A"
                        />
                    </View>

                </View>
            </View>
        </ScrollView>
    );
}
