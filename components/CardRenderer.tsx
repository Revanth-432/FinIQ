import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Brain, Quote, XCircle, CheckCircle } from 'lucide-react-native';

interface CardRendererProps {
    card: any;
    selectedOption: string | null;
    onOptionSelect: (optionId: string) => void;
}

export default function CardRenderer({ card, selectedOption, onOptionSelect }: CardRendererProps) {

    // 1. HOOK CARD (Redesigned for Premium Look)
    if (card.type === 'hook') {
        return (
            <View className="flex-1 bg-slate-900 justify-center p-8">
                {/* Decorative Quote Icon in Background */}
                <View className="absolute top-20 left-8 opacity-10">
                    <Quote size={120} color="white" />
                </View>

                <View>
                    <Text className="text-indigo-400 font-bold tracking-widest uppercase mb-6">
                        Think About This
                    </Text>
                    <Text className="text-3xl font-medium text-white leading-tight">
                        {card.question || card.content}
                    </Text>
                    <View className="h-1 w-20 bg-indigo-500 mt-8 rounded-full" />
                </View>
            </View>
        );
    }

    // 2. QUIZ & INTERACTION (Improved Feedback)
    if (card.type === 'quiz' || card.type === 'interaction') {
        const options = card.metadata?.options || [];
        const correctAnswer = card.metadata?.correct_id || card.metadata?.answer;
        const questionText = card.question || card.content;

        // Check if user is currently WRONG
        const isWrong = selectedOption && selectedOption !== correctAnswer;

        return (
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="p-6 bg-slate-50">
                <Text className="text-2xl font-bold text-slate-900 mb-10 text-center leading-8">
                    {questionText}
                </Text>

                <View className="space-y-3">
                    {options.map((option: any, index: number) => {
                        const optionId = option.id || option;
                        const optionText = option.text || option;

                        const isSelected = selectedOption === optionId;
                        const isCorrect = optionId === correctAnswer;

                        // Styles
                        let bgStyle = "bg-white border-slate-200 shadow-sm";
                        let textStyle = "text-slate-700";
                        let borderStyle = "border-b-4 border-slate-200"; // 3D effect button

                        if (isSelected) {
                            if (isCorrect) {
                                bgStyle = "bg-green-100 border-green-500";
                                textStyle = "text-green-800 font-bold";
                                borderStyle = "border-b-4 border-green-600";
                            } else {
                                bgStyle = "bg-red-50 border-red-500";
                                textStyle = "text-red-800 font-bold";
                                borderStyle = "border-b-4 border-red-600";
                            }
                        }

                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => onOptionSelect(optionId)}
                                // Allow changing answer ONLY if they haven't got it right yet
                                disabled={selectedOption === correctAnswer}
                                className={`p-5 rounded-2xl border flex-row items-center justify-between mb-2 ${bgStyle} ${borderStyle}`}
                                activeOpacity={0.7}
                            >
                                <Text className={`text-lg flex-1 ${textStyle}`}>{optionText}</Text>

                                {isSelected && isCorrect && <CheckCircle size={24} color="#166534" />}
                                {isSelected && !isCorrect && <XCircle size={24} color="#991b1b" />}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Improved "Wrong Answer" Feedback */}
                {isWrong && (
                    <View className="mt-8 p-4 bg-red-50 rounded-xl border border-red-100 items-center">
                        <Text className="text-red-600 font-bold text-lg mb-1">Not quite!</Text>
                        <Text className="text-red-500 text-sm">Tap another option to try again.</Text>
                    </View>
                )}
            </ScrollView>
        );
    }

    // 3. REWARD CARD (Confetti Placeholder) - Keeping as fallback if ever used directly
    if (card.type === 'reward') {
        return (
            <View className="flex-1 justify-center items-center bg-indigo-600 p-8">
                <View className="bg-white/20 p-10 rounded-full mb-6">
                    <CheckCircle size={64} color="white" />
                </View>
                <Text className="text-4xl font-extrabold text-white text-center mb-2">
                    Lesson Complete!
                </Text>
                <Text className="text-indigo-100 text-xl font-medium text-center">
                    +30 XP Earned
                </Text>
            </View>
        );
    }

    // 4. DEFAULT CONCEPT (Clean)
    return (
        <View className="flex-1 bg-white p-8 justify-center items-center">
            <View className="w-20 h-20 bg-indigo-50 rounded-3xl items-center justify-center mb-8 shadow-sm rotate-3">
                <Brain size={40} color="#4F46E5" />
            </View>
            <Text className="text-2xl font-semibold text-slate-800 text-center leading-relaxed">
                {card.question || card.content}
            </Text>
        </View>
    );
}
