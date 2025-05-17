import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { KDS_SCREEN, kdsFontSize, KDS_TOUCH } from '../../constants/Screen';
import styles from './Header.styles';

type Props = {
    onMenuPress: () => void;
    showFullDateTime?: boolean;
};

const Header: React.FC<Props> = ({ onMenuPress, showFullDateTime = true }) => {
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            setCurrentDate(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }));
        };

        updateTime();
        const timer = setInterval(updateTime, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <View style={styles.header}>
            <TouchableOpacity 
                onPress={onMenuPress}
                hitSlop={KDS_TOUCH.hitSlop}
                style={styles.menuButton}
            >
                <Feather 
                    name="menu" 
                    size={kdsFontSize(24)} 
                    color="#fff" 
                />
            </TouchableOpacity>

            <Image
                source={require('../../assets/gardenbaylogo2.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            {showFullDateTime && (
                <View style={styles.timeContainer}>
                    <View style={styles.timeRow}>
                        <Feather 
                            name="calendar" 
                            size={kdsFontSize(16)} 
                            color="#fff" 
                            style={styles.icon} 
                        />
                        <Text style={styles.timeText}>{currentDate}</Text>
                    </View>
                    <View style={styles.timeRow}>
                        <Feather 
                            name="clock" 
                            size={kdsFontSize(16)} 
                            color="#fff" 
                            style={styles.icon} 
                        />
                        <Text style={styles.timeText}>{currentTime}</Text>
                    </View>
                </View>
            )}
        </View>
    );
};

export default Header;