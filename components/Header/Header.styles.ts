import { StyleSheet } from 'react-native';
import { KDS_SCREEN, KDS_TOUCH, kdsFontSize } from '../../constants/Screen';

export default StyleSheet.create({
    header: {
        height: KDS_SCREEN.height * 0.08, // 8% of screen height
        backgroundColor: '#2c454c',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: KDS_SCREEN.width * 0.02, // 2% of screen width
        borderBottomWidth: 2,
        borderBottomColor: '#3a5e66'
    },
    menuButton: {
        padding: KDS_TOUCH.padding * 0.5
    },
    logo: {
        width: KDS_SCREEN.width * 0.15, // 15% of screen width
        height: KDS_SCREEN.height * 0.06, // 6% of screen height
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: KDS_SCREEN.width * 0.015, // 1.5% of screen width
    },
    icon: {
        marginRight: KDS_SCREEN.width * 0.005, // 0.5% of screen width
    },
    timeText: {
        color: '#fff',
        fontSize: kdsFontSize(14),
        fontWeight: '500'
    },
});