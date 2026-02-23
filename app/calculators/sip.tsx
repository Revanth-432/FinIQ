import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import Slider from '@react-native-community/slider';

export default function SIPCalculator() {
    const router = useRouter();

    const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
    const [rate, setRate] = useState(12);
    const [years, setYears] = useState(10);

    // SIP Formula: P * [ (1+i)^n - 1 ] * (1+i) / i
    // i = rate / 100 / 12
    // n = years * 12
    const i = rate / 100 / 12;
    const n = years * 12;
    const investedAmount = monthlyInvestment * n;

    const estimatedReturn = (monthlyInvestment * (((Math.pow(1 + i, n) - 1) / i) * (1 + i))) - investedAmount;
    const totalValue = investedAmount + estimatedReturn;

    return (
        <ScrollView className="flex-1 bg-slate-50">
            {/* Header */}
            <View className="bg-indigo-600 pb-10 pt-12 px-6 rounded-b-[40px] shadow-lg mb-6">
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-full mr-4">
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-2xl font-bold">SIP Calculator</Text>
                </View>

                <View className="items-center mt-2">
                    <Text className="text-indigo-200 text-sm font-bold uppercase tracking-widest mb-1">EXPECTED MATURITY</Text>
                    <Text className="text-white text-5xl font-bold">₹{Math.round(totalValue).toLocaleString()}</Text>
                    <Text className="text-indigo-100 text-sm mt-2">
                        Invested: ₹{investedAmount.toLocaleString()}  •  Returns: +₹{Math.round(estimatedReturn).toLocaleString()}
                    </Text>
                </View>
            </View>

            {/* INPUTS */}
            <View className="px-6">
                <View className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">

                    {/* Monthly Investment */}
                    <View className="mb-6">
                        <Text className="text-slate-500 font-bold mb-2">Monthly Investment (₹)</Text>
                        <Text className="text-2xl font-bold text-slate-800 mb-2">₹{monthlyInvestment.toLocaleString()}</Text>
                        <Slider
                            minimumValue={500} maximumValue={100000} step={500}
                            value={monthlyInvestment} onValueChange={setMonthlyInvestment}
                            minimumTrackTintColor="#4F46E5" thumbTintColor="#4F46E5"
                        />
                    </View>

                    {/* Rate */}
                    <View className="mb-6">
                        <Text className="text-slate-500 font-bold mb-2">Expected Return Rate (% p.a)</Text>
                        <Text className="text-2xl font-bold text-slate-800 mb-2">{rate}%</Text>
                        <Slider
                            minimumValue={1} maximumValue={30} step={0.5}
                            value={rate} onValueChange={setRate}
                            minimumTrackTintColor="#4F46E5" thumbTintColor="#4F46E5"
                        />
                    </View>

                    {/* Time */}
                    <View className="mb-2">
                        <Text className="text-slate-500 font-bold mb-2">Time Period (Years)</Text>
                        <Text className="text-2xl font-bold text-slate-800 mb-2">{years} Years</Text>
                        <Slider
                            minimumValue={1} maximumValue={30} step={1}
                            value={years} onValueChange={setYears}
                            minimumTrackTintColor="#4F46E5" thumbTintColor="#4F46E5"
                        />
                    </View>

                </View>
            </View>
        </ScrollView>
    );
}
