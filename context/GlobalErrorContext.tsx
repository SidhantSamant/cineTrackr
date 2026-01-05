import { DialogType, ErrorDialog } from '@/components/UI/ErrorDialog';
import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

interface DialogConfig {
    title?: string;
    message?: string;
    leftButtonText?: string;
    rightButtonText?: string;
    onLeftButtonPress?: () => void;
    onRightButtonPress?: () => void;
}

interface DialogContextType {
    showError: (config: DialogConfig | string) => void;
    showWarning: (config: DialogConfig | string) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const GlobalErrorProvider = ({ children }: { children: ReactNode }) => {
    const [visible, setVisible] = useState(false);
    const [type, setType] = useState<DialogType>('error');
    const [config, setConfig] = useState<DialogConfig>({ message: '' });

    const showDialog = useCallback((input: DialogConfig | string, dialogType: DialogType) => {
        if (typeof input === 'string') {
            const defaultTitle = dialogType === 'error' ? 'Error' : 'Warning';
            setConfig({ title: defaultTitle, message: input });
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
        setType(dialogType);
        setVisible(true);
    }, []);

    const showError = useCallback(
        (input: DialogConfig | string) => {
            showDialog(input, 'error');
        },
        [showDialog],
    );

    const showWarning = useCallback(
        (input: DialogConfig | string) => {
            showDialog(input, 'warning');
        },
        [showDialog],
    );

    const hideDialog = () => setVisible(false);

    return (
        <DialogContext.Provider value={{ showError, showWarning }}>
            {children}

            <ErrorDialog
                visible={visible}
                type={type}
                title={config.title}
                message={config.message}
                leftButtonText={config.leftButtonText}
                rightButtonText={config.rightButtonText}
                onRightButtonPress={
                    config.onRightButtonPress
                        ? () => {
                              config.onRightButtonPress?.();
                              hideDialog();
                          }
                        : undefined
                }
                onLeftButtonPress={
                    config.onLeftButtonPress
                        ? () => {
                              config.onLeftButtonPress?.();
                              hideDialog();
                          }
                        : hideDialog
                }
            />
        </DialogContext.Provider>
    );
};

// Custom Hook
export const useGlobalError = () => {
    const context = useContext(DialogContext);
    if (!context) throw new Error('useGlobalError must be used within GlobalErrorProvider');
    return context;
};
