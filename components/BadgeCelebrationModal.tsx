import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { useBadgeContext } from '../context/BadgeContext';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Trophy, Flame, BookOpen, Zap, Shield, GraduationCap } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

const iconMap: Record<string, any> = {
    'rookie': Trophy,
    'survivor': Flame,
    'offer-hacker': BookOpen,
    'tax-ninja': Zap,
    'scam-shield': Shield,
    'diamond-hands': GraduationCap
};

export default function BadgeCelebrationModal() {
    const { unlockedBadgesQueue, shiftBadgeQueue } = useBadgeContext();

    useEffect(() => {
        if (unlockedBadgesQueue.length > 0) {
            // Trigger haptic feedback when modal opens
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    }, [unlockedBadgesQueue.length]);

    if (unlockedBadgesQueue.length === 0) return null;

    const currentBadge = unlockedBadgesQueue[0];
    const IconComponent = iconMap[currentBadge.id] || Trophy;

    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={unlockedBadgesQueue.length > 0}
            onRequestClose={shiftBadgeQueue}
        >
            <View className="flex-1 bg-black/80 justify-center items-center px-6">
                <ConfettiCannon
                    count={200}
                    origin={{ x: width / 2, y: 0 }}
                    autoStart={true}
                    fadeOut={true}
                    fallSpeed={3000}
                    colors={['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']}
                />

                <View className="bg-white items-center p-8 rounded-[40px] w-full max-w-sm shadow-2xl border-4 border-indigo-100">
                    <Text className="text-3xl font-extrabold text-indigo-600 mb-6 tracking-wider text-center uppercase">
                        Badge Unlocked!
                    </Text>

                    <View className="w-40 h-40 rounded-full bg-indigo-50 border-8 border-indigo-100 items-center justify-center shadow-lg mb-6">
                        <IconComponent size={80} color={currentBadge.iconColor || "#4F46E5"} />
                    </View>

                    <Text className="text-3xl font-bold text-slate-800 text-center mb-2" style={{ fontFamily: 'serif' }}>
                        {currentBadge.name}
                    </Text>

                    <Text className="text-slate-500 text-center leading-relaxed mb-8 px-2">
                        {currentBadge.desc}
                    </Text>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={shiftBadgeQueue}
                        className="w-full bg-indigo-600 py-4 mx-4 rounded-2xl shadow-md items-center shadow-indigo-200"
                    >
                        <Text className="text-white font-bold text-lg uppercase tracking-widest">Awesome!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
