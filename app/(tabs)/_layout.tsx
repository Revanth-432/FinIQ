import { Tabs } from 'expo-router';
import { Home, BookOpen, User, Calculator, Trophy } from 'lucide-react-native'; // Import Calculator & Trophy Icon

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: '#4F46E5', headerShown: false }}>

            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color }) => <Home size={24} color={color} />,
                }}
            />

            <Tabs.Screen
                name="learn"
                options={{
                    title: 'Learn',
                    tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />,
                }}
            />

            <Tabs.Screen
                name="leaderboard"
                options={{
                    title: 'Leaderboard',
                    tabBarIcon: ({ color }) => <Trophy size={24} color={color} />,
                }}
            />

            {/* 🔥 NEW CALCULATOR TAB */}
            <Tabs.Screen
                name="calculator"
                options={{
                    title: 'Tools',
                    tabBarIcon: ({ color }) => <Calculator size={24} color={color} />,
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <User size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
