import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, MapPin, Ticket } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';

const EventsScreen = () => {
    const router = useRouter();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            // Fetch events from Supabase
            // Fallback to 'events' table if 'fin_events' fails
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .gte('date', new Date().toISOString()) // Only future events
                .order('date', { ascending: true });

            if (data && data.length > 0) {
                setEvents(data);
            } else {
                // Fallback Mock Data if DB is empty
                setEvents([
                    { id: 'e1', title: 'FinTech World Summit', date: new Date().toISOString(), location: 'CYBER CITY, GURUGRAM', banner_url: null, ticket_url: 'https://example.com' },
                    { id: 'e2', title: 'Personal Finance Masterclass', date: new Date(Date.now() + 86400000 * 5).toISOString(), location: 'VIRTUAL EVENT', is_free: true, ticket_url: 'https://example.com' },
                    { id: 'e3', title: 'Startups & Coffee Meetup', date: new Date(Date.now() + 86400000 * 12).toISOString(), location: 'BANGALORE, IND', ticket_url: 'https://example.com' }
                ]);
            }
        } catch (error) {
            console.log('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View className="bg-white px-6 pt-12 pb-4 flex-row items-center border-b border-slate-100 shadow-sm z-10">
                <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2 bg-slate-50 rounded-full">
                    <ArrowLeft size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-slate-800" style={{ fontFamily: 'serif' }}>Financial Events</Text>
            </View>

            <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 40 }}>
                {loading ? (
                    <Text className="text-center text-slate-400 mt-10">Loading events...</Text>
                ) : (
                    events.map((event) => (
                        <View key={event.id} className="bg-white rounded-3xl p-5 mb-5 shadow-sm border border-slate-100">
                            {/* Location Badge */}
                            <View className="flex-row items-center mb-3">
                                <View className="bg-indigo-50 self-start px-3 py-1 rounded-full flex-row items-center border border-indigo-100">
                                    <MapPin size={12} color="#4F46E5" style={{ marginRight: 4 }} />
                                    <Text className="text-indigo-600 text-[10px] font-bold uppercase tracking-wider">
                                        {event.location || 'VIRTUAL'}
                                    </Text>
                                </View>
                            </View>

                            {/* Date */}
                            <View className="flex-row items-center mb-2">
                                <Calendar size={14} color="#94A3B8" className="mr-2" />
                                <Text className="text-slate-500 text-xs font-bold uppercase tracking-wide">
                                    {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                </Text>
                            </View>

                            {/* Title */}
                            <Text className="text-xl font-bold text-slate-800 mb-6 leading-tight">
                                {event.title}
                            </Text>

                            {/* Action Button */}
                            <TouchableOpacity
                                onPress={() => Linking.openURL(event.ticket_url || '#')}
                                className={`w-full py-4 rounded-2xl items-center flex-row justify-center shadow-sm ${event.is_free ? 'bg-emerald-50 border border-emerald-100' : 'bg-slate-900'}`}
                            >
                                <Ticket size={18} color={event.is_free ? '#059669' : 'white'} style={{ marginRight: 8 }} />
                                <Text className={`font-bold text-sm tracking-widest ${event.is_free ? 'text-emerald-700' : 'text-white'}`}>
                                    {event.is_free ? 'REGISTER FOR FREE' : 'BOOK TICKET'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}

                {/* Bottom Spacer */}
                <View className="h-10" />
            </ScrollView>
        </SafeAreaView>
    );
};

export default EventsScreen;
