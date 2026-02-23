import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Mail, Lock } from 'lucide-react-native';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function signInWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            Alert.alert(error.message);
            setLoading(false);
        } else {
            // Success is handled by the root layout redirect, but we can also manually replace to be safe/instant
            // router.replace('/(tabs)'); 
            // Actually, let the root layout handle it to avoid race conditions or double nav
            setLoading(false);
        }
    }

    return (
        <View className="flex-1 justify-center bg-white p-8">
            <View className="mb-10">
                <Text className="text-4xl font-extrabold text-indigo-600 mb-2">Welcome Back</Text>
                <Text className="text-slate-500 text-lg">Sign in to continue learning</Text>
            </View>

            <View className="space-y-4">
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

                <TouchableOpacity onPress={() => {/* Forgot Password logic could go here */ }}>
                    <Text className="text-right text-indigo-500 font-medium mt-2">Forgot Password?</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                onPress={signInWithEmail}
                disabled={loading}
                className={`mt-8 py-5 rounded-2xl flex-row justify-center items-center shadow-md shadow-indigo-200 ${loading ? 'bg-indigo-400' : 'bg-indigo-600'
                    }`}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white font-bold text-lg">Sign In</Text>
                )}
            </TouchableOpacity>

            <View className="flex-row justify-center mt-8">
                <Text className="text-slate-500 text-base">Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                    <Text className="text-indigo-600 font-bold text-base">Create Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
