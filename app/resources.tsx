import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Book, ExternalLink } from 'lucide-react-native';

export default function ResourceScreen() {
    const { type } = useLocalSearchParams(); // 'Books', 'Newsletters', etc.
    const router = useRouter();

    // Mock Data
    const resources = [
        { title: 'Psychology of Money', author: 'Morgan Housel', category: 'Books' },
        { title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', category: 'Books' },
        { title: 'Atomic Habits', author: 'James Clear', category: 'Books' },
        { title: 'Finshots', author: 'Daily Newsletter', category: 'Newsletters' },
        { title: 'Morning Brew', author: 'Daily Newsletter', category: 'Newsletters' },
    ];

    const filtered = resources.filter(r => r.category === type);

    return (
        <ScrollView className="flex-1 bg-white p-6 pt-12">
            <TouchableOpacity onPress={() => router.back()} className="mb-6">
                <ArrowLeft size={24} color="#333" />
            </TouchableOpacity>

            <Text className="text-3xl font-bold text-slate-900 mb-6">{type}</Text>

            {filtered.length > 0 ? filtered.map((item, index) => (
                <TouchableOpacity key={index} className="p-4 bg-slate-50 rounded-xl mb-3 flex-row justify-between items-center">
                    <View>
                        <Text className="text-lg font-bold text-slate-800">{item.title}</Text>
                        <Text className="text-slate-500">{item.author}</Text>
                    </View>
                    <ExternalLink size={20} color="#94A3B8" />
                </TouchableOpacity>
            )) : (
                <Text className="text-slate-400 text-center mt-10">No resources found yet!</Text>
            )}
        </ScrollView>
    );
}
