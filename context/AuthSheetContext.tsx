import AuthBottomSheet, { AuthBottomSheetRef } from '@/components/AuthBottomSheet';
import { createContext, useContext, useRef } from 'react';

interface AuthSheetContextType {
    presentLogin: () => void;
    presentSignup: () => void;
}

const AuthSheetContext = createContext<AuthSheetContextType>({
    presentLogin: () => {},
    presentSignup: () => {},
});

export const useAuthSheet = () => useContext(AuthSheetContext);

export function AuthSheetProvider({ children }: { children: React.ReactNode }) {
    const sheetRef = useRef<AuthBottomSheetRef>(null);

    const presentLogin = () => {
        sheetRef.current?.present('login');
    };

    const presentSignup = () => {
        sheetRef.current?.present('signup');
    };

    return (
        <AuthSheetContext.Provider value={{ presentLogin, presentSignup }}>
            {children}
            <AuthBottomSheet ref={sheetRef} />
        </AuthSheetContext.Provider>
    );
}
