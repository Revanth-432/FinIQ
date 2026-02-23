import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { TrendingUp, Percent, CreditCard, DollarSign } from 'lucide-react-native';

export default function CalculatorHub() {
    const router = useRouter();

    const tools = [
        {
            id: 'sip',
            title: 'SIP Calculator',
            desc: 'Calculate wealth creation via Mutual Funds.',
            icon: <TrendingUp size={32} color="#4F46E5" />,
            bg: 'bg-indigo-50',
            route: '/calculators/sip'
        },
        {
            id: 'interest',
            title: 'Interest Calculator',
            desc: 'Simple Interest on loans or savings.',
            icon: <Percent size={32} color="#16A34A" />,
            bg: 'bg-green-50',
            route: '/calculators/interest'
        },
        {
            id: 'emi',
            title: 'EMI Calculator',
            desc: 'Plan your loan repayments easily.',
            icon: <CreditCard size={32} color="#D97706" />,
            bg: 'bg-yellow-50',
            route: '/calculators/emi' // We can build this later
        },
        {
            id: 'inflation',
            title: 'Inflation Check',
            desc: 'See the future value of your money.',
            icon: <DollarSign size={32} color="#DC2626" />,
            bg: 'bg-red-50',
            route: '/calculators/inflation' // We can build this later
        }
    ];

    return (
        <ScrollView className="flex-1 bg-white pt-16 px-6">
            <Text className="text-3xl font-bold text-slate-800 mb-2">Financial Tools</Text>
            <Text className="text-slate-500 mb-8">Plan your future with these smart calculators.</Text>

            <View className="flex-row flex-wrap justify-between">
                {tools.map((tool) => (
                    <TouchableOpacity
                        key={tool.id}
                        onPress={() => tool.route.includes('emi') || tool.route.includes('inflation') ? alert("Coming Soon!") : router.push(tool.route)}
                        className="w-[48%] bg-white border border-slate-100 p-5 rounded-3xl mb-4 shadow-sm items-start justify-between h-48"
                    >
                        <View className={`p-4 rounded-2xl mb-4 ${tool.bg}`}>
                            {tool.icon}
                        </View>
                        <View>
                            <Text className="text-slate-800 font-bold text-lg leading-6 mb-1">{tool.title}</Text>
                            <Text className="text-slate-400 text-xs">{tool.desc}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}
