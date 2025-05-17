import { Audio, AVPlaybackStatus } from 'expo-av';
import { useEffect, useState } from 'react';

type SoundType = 'new_order' | 'priority' | 'ready';

const soundFiles = {
  new_order: require('../assets/sounds/new-order.m4a'),
  priority: require('../assets/sounds/priority-alert.m4a'),
  ready: require('../assets/sounds/order-ready.m4a')
};

export const useSound = () => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Preload sounds and set audio mode
  useEffect(() => {
    const setupAudio = async () => {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });
    };

    setupAudio();

    return () => {
      sound?.unloadAsync();
    };
  }, []);

  const playSound = async (type: SoundType) => {
    try {
      // Unload previous sound if exists
      if (sound) {
        await sound.unloadAsync();
      }

      // Create and play new sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        soundFiles[type],
        { shouldPlay: true }
      );
      
      setSound(newSound);

      // Add proper type checking for playback status
      newSound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
        if (!status.isLoaded) {
          // Handle error case if needed
          if (status.error) {
            console.error('Playback error:', status.error);
          }
          return;
        }

        // Type-safe check for playback completion
        if (status.didJustFinish) {
          newSound.unloadAsync();
        }
      });

    } catch (error) {
      console.error('Sound playback failed:', error);
    }
  };

  return { playSound };
};