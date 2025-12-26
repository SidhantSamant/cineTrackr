import { Colors } from './Colors';
import { DarkTheme, Theme } from '@react-navigation/native';

export const MyDarkTheme: Theme = {
    ...DarkTheme,
    dark: true,
    colors: {
        ...DarkTheme.colors,
        background: Colors.background,
        card: Colors.background,
        primary: Colors.primary,
        text: Colors.text,
        border: '#262626',
        notification: Colors.primary,
    },
};
