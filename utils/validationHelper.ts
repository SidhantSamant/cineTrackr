interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export const validate = {
    email: (email: string): ValidationResult => {
        if (!email.trim()) {
            return { isValid: false, error: 'Email cannot be empty' };
        }
        // Email Regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { isValid: false, error: 'Please enter a valid email address' };
        }
        return { isValid: true };
    },

    password: (password: string): ValidationResult => {
        if (!password) {
            return { isValid: false, error: 'Password cannot be empty' };
        }
        if (password.length < 6) {
            return { isValid: false, error: 'Password must be at least 6 characters' };
        }
        return { isValid: true };
    },

    match: (value1: string, value2: string, label: string = 'Passwords'): ValidationResult => {
        if (value1 !== value2) {
            return { isValid: false, error: `${label} do not match` };
        }
        return { isValid: true };
    },
};
