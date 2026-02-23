import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, Linking, Alert, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, ShoppingBag, MapPin, X, ExternalLink, ArrowDownCircle } from 'lucide-react-native';

export default function BooksScreen() {
    const router = useRouter();
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'ALL' | 'FREE' | 'PAID'>('ALL'); // Filter State

    // State for the Modal
    const [selectedBook, setSelectedBook] = useState<any>(null);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const { data } = await supabase.from('books').select('*');
            if (data) setBooks(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleBuy = (url: string | null) => {
        if (url) {
            Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
        } else {
            Alert.alert(
                "Not Available Online",
                "This edition is currently out of stock online. Please check your local bookstore! 🏪",
                [{ text: "OK" }]
            );
        }
    };

    // Filter Logic
    const filteredBooks = books.filter(book => {
        if (filter === 'ALL') return true;
        return book.price_type === filter;
    });

    if (loading) return <View className="flex-1 justify-center items-center"><ActivityIndicator size="large" color="#4F46E5" /></View>;

    return (
        <View className="flex-1 bg-slate-50">

            {/* Header */}
            <View className="pt-12 px-6 pb-6 bg-indigo-600 z-10 rounded-b-[30px] shadow-lg">
                <View className="flex-row items-center mb-2">
                    <TouchableOpacity onPress={() => router.back()} className="bg-white/20 p-2 rounded-full mr-4">
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-2xl font-bold">Financial Library</Text>
                </View>
                <Text className="text-indigo-200 ml-12">Curated reads to boost your financial IQ.</Text>
            </View>

            {/* Filter Pills */}
            <View className="px-6 mt-4">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                    {['ALL', 'FREE', 'PAID'].map((type) => (
                        <TouchableOpacity
                            key={type}
                            onPress={() => setFilter(type as any)}
                            className={`px-6 py-2 rounded-full mr-3 ${filter === type ? 'bg-indigo-600' : 'bg-slate-200'}`}
                        >
                            <Text className={`font-bold ${filter === type ? 'text-white' : 'text-slate-500'}`}>
                                {type}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Book List (Clean View) */}
            <ScrollView className="flex-1 px-6 pt-4" contentContainerStyle={{ paddingBottom: 40 }}>
                {filteredBooks.map((book) => (
                    <TouchableOpacity
                        key={book.id}
                        onPress={() => setSelectedBook(book)} // OPEN MODAL
                        activeOpacity={0.7}
                        className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-slate-100 flex-row items-center"
                    >
                        <Image
                            source={{ uri: book.image_url || 'https://via.placeholder.com/150' }}
                            className="w-16 h-24 rounded-lg bg-slate-200 mr-4"
                            resizeMode="cover"
                        />
                        <View className="flex-1">
                            <View className="flex-row mb-1">
                                <View className="bg-indigo-50 self-start px-2 py-1 rounded-md mr-2">
                                    <Text className="text-indigo-600 text-[10px] font-bold uppercase">{book.category}</Text>
                                </View>
                                {book.price_type === 'FREE' && (
                                    <View className="bg-green-100 self-start px-2 py-1 rounded-md">
                                        <Text className="text-green-800 text-[10px] font-bold uppercase">FREE</Text>
                                    </View>
                                )}
                                {book.price_type === 'PAID' && (
                                    <View className="bg-orange-100 self-start px-2 py-1 rounded-md">
                                        <Text className="text-orange-800 text-[10px] font-bold uppercase">PAID</Text>
                                    </View>
                                )}
                            </View>
                            <Text className="text-lg font-bold text-slate-800 leading-tight mb-1">{book.title}</Text>
                            <Text className="text-slate-500 text-xs font-bold">by {book.author}</Text>
                        </View>
                        <View className="bg-slate-50 p-2 rounded-full">
                            <ExternalLink size={16} color="#94A3B8" />
                        </View>
                    </TouchableOpacity>
                ))}
                <View className="h-6" />
            </ScrollView>

            {/* 🟢 THE MODAL POPUP */}
            <Modal
                visible={!!selectedBook}
                transparent
                animationType="fade"
                onRequestClose={() => setSelectedBook(null)}
            >
                <View className="flex-1 bg-black/60 justify-center items-center p-6">
                    <View className="bg-white w-full max-h-[80%] rounded-[30px] p-6 shadow-2xl overflow-hidden relative">

                        {/* Close Button */}
                        <TouchableOpacity
                            onPress={() => setSelectedBook(null)}
                            className="absolute top-4 right-4 bg-slate-100 p-2 rounded-full z-10"
                        >
                            <X size={20} color="#64748B" />
                        </TouchableOpacity>

                        {selectedBook && (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {/* Large Cover Image */}
                                <View className="items-center mb-6 mt-2">
                                    <Image
                                        source={{ uri: selectedBook.image_url || 'https://via.placeholder.com/150' }}
                                        className="w-32 h-48 rounded-xl shadow-lg bg-slate-200"
                                        resizeMode="cover"
                                    />
                                </View>

                                {/* Title & Author */}
                                <Text className="text-2xl font-bold text-slate-800 text-center mb-1 leading-8">
                                    {selectedBook.title}
                                </Text>
                                <Text className="text-indigo-600 font-bold text-center mb-6">
                                    by {selectedBook.author}
                                </Text>

                                {/* Description */}
                                <Text className="text-slate-600 leading-6 text-base mb-8">
                                    {selectedBook.description}
                                </Text>

                                {/* Action Button */}
                                <TouchableOpacity
                                    onPress={() => handleBuy(selectedBook.buy_url)}
                                    className={`flex-row items-center justify-center py-4 rounded-2xl mb-2 ${selectedBook.buy_url ? 'bg-indigo-600' : 'bg-slate-800'}`}
                                >
                                    {selectedBook.buy_url ? (
                                        <>
                                            <ShoppingBag size={20} color="white" style={{ marginRight: 8 }} />
                                            <Text className="text-white font-bold text-lg">Get this Book</Text>
                                        </>
                                    ) : (
                                        <>
                                            <MapPin size={20} color="white" style={{ marginRight: 8 }} />
                                            <Text className="text-white font-bold text-lg">Check Local Store</Text>
                                        </>
                                    )}
                                </TouchableOpacity>

                                <Text className="text-center text-slate-400 text-xs mt-2">
                                    {selectedBook.buy_url ? "Redirects to external store" : "Not available online"}
                                </Text>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>

        </View>
    );
}
