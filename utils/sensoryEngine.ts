import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

// 1. Force audio to play even if the physical phone is on Silent/Vibrate mode
const configureAudio = async () => {
    try {
        await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            playThroughEarpieceAndroid: false,
        });
    } catch (error) {
        console.error('Failed to configure audio mode:', error);
    }
};

configureAudio();

// 2. Load the exact local assets you just added
const SOUNDS = {
    correct: require('../assets/sounds/correct.mp3'),
    incorrect: require('../assets/sounds/incorrect.mp3'),
    success: require('../assets/sounds/success.mp3'),
};

// 3. The Playback Functions (Exported to use in your LessonScreen)
export const playCorrectSound = async (isMuted = false) => {
    // Haptics fire immediately, even if muted
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isMuted) return;

    try {
        const { sound } = await Audio.Sound.createAsync(SOUNDS.correct);
        await sound.playAsync();

        // Cleanup: Unload from memory after playing so the app doesn't crash over time
        sound.setOnPlaybackStatusUpdate((status) => {
            if (status && 'didJustFinish' in status && status.didJustFinish) {
                sound.unloadAsync();
            }
        });
    } catch (error) {
        console.error('Error playing correct sound:', error);
    }
};

export const playIncorrectSound = async (isMuted = false) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (isMuted) return;

    try {
        const { sound } = await Audio.Sound.createAsync(SOUNDS.incorrect);
        await sound.playAsync();

        sound.setOnPlaybackStatusUpdate((status) => {
            if (status && 'didJustFinish' in status && status.didJustFinish) {
                sound.unloadAsync();
            }
        });
    } catch (error) {
        console.error('Error playing incorrect sound:', error);
    }
};

export const playSuccessSound = async (isMuted = false) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (isMuted) return;

    try {
        const { sound } = await Audio.Sound.createAsync(SOUNDS.success);
        await sound.playAsync();

        sound.setOnPlaybackStatusUpdate((status) => {
            if (status && 'didJustFinish' in status && status.didJustFinish) {
                sound.unloadAsync();
            }
        });
    } catch (error) {
        console.error('Error playing success sound:', error);
    }
};
