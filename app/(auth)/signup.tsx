import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Mail, Lock, User } from 'lucide-react-native';

export default function SignupScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);

    async function signUpWithEmail() {
        setLoading(true);

        // 1. Sign Up
        const { data: { session }, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        if (error) {
            Alert.alert(error.message);
            setLoading(false);
            return;
        }

        // 2. Handle Session
        if (!session) {
            Alert.alert('Check your email', 'Please check your inbox for email verification!');
            setLoading(false);
        } else {
            // Session exists (auto-confirmed or disabled email confirm), Layout will redirect
            setLoading(false);
        }
    }

    return (
        <View className="flex-1 justify-center bg-white p-8">
            <View className="mb-10">
                <Text className="text-3xl font-extrabold text-slate-800 mb-2">Create Account</Text>
                <Text className="text-slate-500 text-lg">Start your financial journey today</Text>
            </View>

            <View className="space-y-4">
                {/* Name Input */}
                <View className="flex-row items-center bg-slate-100 rounded-xl p-4 border border-slate-200">
                    <User color="#64748b" size={20} className="mr-3" />
                    <TextInput
                        placeholder="Full Name"
                        value={fullName}
                        onChangeText={setFullName}
                        className="flex-1 text-slate-800 text-base font-medium"
                        placeholderTextColor="#94a3b8"
                    />
                </View>

                {/* Email Input */}
                <View className="flex-row items-center bg-slate-100 rounded-xl p-4 border border-slate-200">
                    <Mail color="#64748b" size={20} className="mr-3" />
                    <TextInput
                        placeholder="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        className="flex-1 text-slate-800 text-base font-medium"
                        placeholderTextColor="#94a3b8"
                    />
                </View>

                {/* Password Input */}
                <View className="flex-row items-center bg-slate-100 rounded-xl p-4 border border-slate-200">
                    <Lock color="#64748b" size={20} className="mr-3" />
                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                        className="flex-1 text-slate-800 text-base font-medium"
                        placeholderTextColor="#94a3b8"
                    />
                </View>
            </View>

            <TouchableOpacity
                onPress={signUpWithEmail}
                disabled={loading}
                className={`mt-8 py-5 rounded-2xl flex-row justify-center items-center shadow-md shadow-indigo-200 ${loading ? 'bg-indigo-400' : 'bg-indigo-600'
                    }`}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white font-bold text-lg">Sign Up</Text>
                )}
            </TouchableOpacity>

            <View className="flex-row justify-center mt-8">
                <Text className="text-slate-500 text-base">Already have an account? </Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text className="text-indigo-600 font-bold text-base">Sign In</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
