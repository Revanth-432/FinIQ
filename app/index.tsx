
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
    console.log('Index route rendering');
    return (
        <View className="flex-1 justify-center items-center bg-white">
            <ActivityIndicator size="large" color="#4F46E5" />
        </View>
    );
}
