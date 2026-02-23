import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Trophy, Medal, Crown } from 'lucide-react-native';

export default function LeaderboardScreen() {
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // Avatar Helper
    const avatarMap: { [key: string]: string } = {
        'Default': '👤', 'Bull': '🐂', 'Bear': '🐻',
        'Rocket': '🚀', 'Diamond': '💎', 'Owl': '🦉'
    };

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            // 1. Get Current User
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setCurrentUserId(user.id);

            // 2. Fetch Top 20 Profiles sorted by XP
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('total_xp', { ascending: false })
                .limit(20);

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item, index }: { item: any, index: number }) => {
        const isMe = item.id === currentUserId;
        const rank = index + 1;

        // Special Styling for Top 3
        let rankIcon = <Text className="font-bold text-slate-500 w-6 text-center">{rank}</Text>;
        let bgColor = isMe ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-100';

        if (rank === 1) {
            rankIcon = <Crown size={24} color="#EAB308" fill="#FEF08A" />;
            if (!isMe) bgColor = 'bg-yellow-50/50 border-yellow-100';
        } else if (rank === 2) {
            rankIcon = <Medal size={24} color="#94A3B8" />;
        } else if (rank === 3) {
            rankIcon = <Medal size={24} color="#B45309" />;
        }

        return (
            <View className={`flex-row items-center p-4 mb-3 rounded-2xl border ${bgColor} shadow-sm`}>
                {/* Rank */}
                <View className="w-10 items-center justify-center mr-2">
                    {rankIcon}
                </View>

                {/* Avatar */}
                <View className="w-12 h-12 bg-slate-100 rounded-full items-center justify-center mr-4 border border-slate-200">
                    <Text className="text-2xl">{avatarMap[item.avatar_id] || '👤'}</Text>
                </View>

                {/* Name & Title */}
                <View className="flex-1">
                    <Text className={`text-base font-bold ${isMe ? 'text-indigo-700' : 'text-slate-800'}`}>
                        {item.full_name || 'Anonymous User'} {isMe && '(You)'}
                    </Text>
                    <Text className="text-xs text-slate-400 font-medium">
                        {item.streak_count > 0 ? `🔥 ${item.streak_count} Day Streak` : 'No active streak'}
                    </Text>
                </View>

                {/* XP Badge */}
                <View className="bg-indigo-100 px-3 py-1 rounded-full">
                    <Text className="text-indigo-700 font-bold text-xs">{item.total_xp} XP</Text>
                </View>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-slate-50">
            {/* Header */}
            <View className="bg-indigo-600 p-6 pt-12 pb-8 rounded-b-3xl shadow-lg">
                <View className="flex-row items-center justify-between mb-4">
                    {/* Removed Back Button since it's a tab now */}
                    <View />
                    <Text className="text-white text-xl font-bold">Wall of Fame</Text>
                    <View className="w-10" />
                </View>

                <View className="items-center">
                    <Trophy size={48} color="#FCD34D" fill="#FCD34D" />
                    <Text className="text-indigo-100 text-center mt-2 font-medium">
                        Compete with the top learners!
                    </Text>
                </View>
            </View>

            {/* List */}
            <FlatList
                data={users}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 20 }}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchLeaderboard} />}
                ListEmptyComponent={
                    <Text className="text-center text-slate-400 mt-10">No users found yet.</Text>
                }
            />
        </View>
    );
}
