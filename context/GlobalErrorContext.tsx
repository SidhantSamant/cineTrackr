import { ErrorDialog } from '@/components/UI/ErrorDialog';
import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

interface ErrorConfig {
    title?: string;
    message?: string;
    leftButtonText?: string;
    rightButtonText?: string;
    onLeftButtonPress?: () => void;
    onRightButtonPress?: () => void;
}

interface ErrorContextType {
    showError: (config: ErrorConfig | string) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const GlobalErrorProvider = ({ children }: { children: ReactNode }) => {
    const [visible, setVisible] = useState(false);
    const [config, setConfig] = useState<ErrorConfig>({ message: '' });

    const showError = useCallback((input: ErrorConfig | string) => {
        if (typeof input === 'string') {
            setConfig({ title: 'Error', message: input });
        } else {
            setConfig({
                title: input.title,
                message: input.message,
                leftButtonText: input.leftButtonText,
                rightButtonText: input.rightButtonText,
                onLeftButtonPress: input.onLeftButtonPress,
                onRightButtonPress: input.onRightButtonPress,
            });
        }
        setVisible(true);
    }, []);

    const hideError = () => setVisible(false);

    return (
        <ErrorContext.Provider value={{ showError }}>
            {children}

            <ErrorDialog
                visible={visible}
                title={config.title}
                message={config.message}
                leftButtonText={config.leftButtonText}
                rightButtonText={config.rightButtonText}
                onRightButtonPress={
                    config.onRightButtonPress
                        ? () => {
                              config.onRightButtonPress?.();
                              hideError();
                          }
                        : undefined
                }
                onLeftButtonPress={
                    config.onLeftButtonPress
                        ? () => {
                              config.onLeftButtonPress?.();
                              hideError();
                          }
                        : hideError
                }
            />
        </ErrorContext.Provider>
    );
};

// Custom Hook
export const useGlobalError = () => {
    const context = useContext(ErrorContext);
    if (!context) throw new Error('useGlobalError must be used within GlobalErrorProvider');
    return context;
};
