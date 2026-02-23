import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Save, User, UserCheck } from 'lucide-react-native';

export default function EditProfileScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState('Default');

    // 1. Clean Avatar Mapping (Prevents JSX errors)
    const avatarMap: { [key: string]: string } = {
        'Default': '👤',
        'Bull': '🐂',
        'Bear': '🐻',
        'Rocket': '🚀',
        'Diamond': '💎',
        'Owl': '🦉'
    };

    const avatars = Object.keys(avatarMap);

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setFullName(user.user_metadata?.full_name || '');
            setSelectedAvatar(user.user_metadata?.avatar_id || 'Default');
        }
    };

    const handleSave = async () => {
        if (!fullName.trim()) {
            Alert.alert('Error', 'Name cannot be empty');
            return;
        }

        setLoading(true);
        try {
            // Update Auth Metadata
            const { error: authError } = await supabase.auth.updateUser({
                data: { full_name: fullName, avatar_id: selectedAvatar }
            });

            if (authError) throw authError;

            // Update Public Profile Table
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { error: dbError } = await supabase
                    .from('profiles')
                    .update({ full_name: fullName })
                    .eq('id', user.id);

                if (dbError) throw dbError;
            }

            Alert.alert('Success', 'Profile updated!', [
                { text: 'OK', onPress: () => router.back() }
            ]);

        } catch (error: any) {
            Alert.alert('Update Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="p-6 pt-12 border-b border-slate-100 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => router.back()} className="p-2 bg-slate-100 rounded-full">
                    <ArrowLeft size={20} color="#333" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-slate-900">Edit Profile</Text>
                <View className="w-10" />
            </View>

            <ScrollView className="p-6">

                {/* Name Input */}
                <View className="mb-8">
                    <Text className="text-slate-500 font-bold mb-2 uppercase text-xs tracking-wider">Full Name</Text>
                    <View className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex-row items-center">
                        <User size={20} color="#64748B" />
                        <View className="w-3" />
                        <TextInput
                            className="flex-1 text-slate-900 font-medium text-lg"
                            value={fullName}
                            onChangeText={setFullName}
                            placeholder="Enter your name"
                            placeholderTextColor="#94A3B8"
                        />
                    </View>
                </View>

                {/* Avatar Selection */}
                <View className="mb-8">
                    <Text className="text-slate-500 font-bold mb-4 uppercase text-xs tracking-wider">Choose Your Avatar</Text>
                    <View className="flex-row flex-wrap justify-between">
                        {avatars.map((avatar) => (
                            <TouchableOpacity
                                key={avatar}
                                onPress={() => setSelectedAvatar(avatar)}
                                className={`w-[30%] aspect-square mb-4 rounded-2xl items-center justify-center border-2 ${selectedAvatar === avatar ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 bg-slate-50'
                                    }`}
                            >
                                <Text className="text-2xl mb-1">{avatarMap[avatar]}</Text>

                                <Text className={`text-xs font-bold ${selectedAvatar === avatar ? 'text-indigo-600' : 'text-slate-400'
                                    }`}>
                                    {avatar}
                                </Text>

                                {selectedAvatar === avatar && (
                                    <View className="absolute top-1 right-1 bg-indigo-600 rounded-full p-[2px]">
                                        <UserCheck size={8} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    onPress={handleSave}
                    disabled={loading}
                    className={`py-4 rounded-xl flex-row items-center justify-center ${loading ? 'bg-indigo-400' : 'bg-indigo-600'}`}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <View className="flex-row items-center">
                            <Save size={20} color="white" />
                            <View className="w-2" />
                            <Text className="text-white font-bold text-lg">Save Changes</Text>
                        </View>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}
