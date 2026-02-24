import { Stack, useRouter, useSegments, usePathname, useGlobalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import "../global.css";
import { BadgeProvider } from '../context/BadgeContext';
import PostHog, { PostHogProvider } from 'posthog-react-native';

export const posthog = new PostHog('phc_CfRbIG8t050xis15mLcdCa9lIJuMQC1rQHGkcskBSxy', { host: 'https://us.i.posthog.com' });

export default function RootLayout() {
    const [session, setSession] = useState<Session | null>(null);
    const [initialized, setInitialized] = useState(false);
    const router = useRouter();
    const segments = useSegments();
    const pathname = usePathname();
    const params = useGlobalSearchParams();

    // PostHog Screen Tracking
    useEffect(() => {
        if (pathname) {
            posthog.screen(pathname, params);
        }
    }, [pathname, params]);

    useEffect(() => {
        // 1. Get Initial Session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setInitialized(true);
        });

        // 2. Listen for Auth Changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (!initialized) return;

        // Check if we are currently in the (auth) group
        const inAuthGroup = segments[0] === '(auth)';

        if (session && inAuthGroup) {
            // If logged in and in auth group, go to tabs
            router.replace('/(tabs)/dashboard');
        } else if (!session && !inAuthGroup) {
            // If NOT logged in and NOT in auth group, go to login
            router.replace('/(auth)/login');
        }
    }, [session, initialized, segments]);

    console.log('RootLayout rendering. Initialized:', initialized, 'Session:', !!session);

    if (!initialized) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#4F46E5" />
            </View>
        );
    }

    return (
        <PostHogProvider client={posthog}>
            <BadgeProvider>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                    <Stack.Screen name="module/[id]" options={{ title: 'Module' }} />
                    <Stack.Screen name="lesson/[id]" options={{ title: 'Lesson', presentation: 'modal' }} />
                </Stack>
            </BadgeProvider>
        </PostHogProvider>
    );
}
