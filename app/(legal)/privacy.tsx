import { Colors } from '@/constants/Colors';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const privacyData = {
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: March 2026',
    info: 'At Cine Trackr, we value and respect your privacy. This Privacy Policy describes how we collect, use, and protect your personal information when you use our mobile application.',
    sections: [
        {
            title: '1. Information we collect',
            text: "We collect information you provide directly to us when you create an account, such as your email address and password. We also collect data about your use of the application, specifically the movies and television series you add to your 'Watching', 'Completed', and 'Plan to Watch' lists.",
        },
        {
            title: '2. Use of information',
            text: "We use your personal information solely to provide and improve Cine Trackr's core functionality. This includes authenticating your account securely and syncing your watch history across your devices so you never lose your progress.",
        },
        {
            title: '3. Storage and Protection',
            text: 'All personal information (including account credentials and your movie lists) is securely stored using Supabase, a secure backend-as-a-service platform. Your passwords are encrypted by Supabase using industry-standard protocols and are never visible or accessible to us.',
        },
        {
            title: '4. Third-Party Services',
            text: 'Cine Trackr uses the TMDb (The Movie Database) Application Programming Interface (API) to obtain information about movies, series, and related images. We do not share your personal information with TMDb. Your use of the information provided by TMDb is subject to their own terms and privacy policies.',
        },
        {
            title: '5. App Updates',
            text: 'To ensure you have the best and most secure experience, Cine Trackr periodically checks our database for the latest version of the app. If a mandatory security or feature update is required, the app will prompt you to download the latest version from our official GitHub repository.',
        },
        {
            title: '6. User Rights',
            text: 'You have complete control over your data. You can request the deletion of your account and all associated information (including your watchlists) at any time by contacting the developer or utilizing the in-app account management tools.',
        },
        {
            title: '7. Changes to this policy',
            text: 'We may update this Privacy Policy occasionally to reflect changes in our practices. We will notify you of any material updates within the application.',
        },
    ],
};

export default function PrivacyScreen() {
    const insets = useSafeAreaInsets();

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: Colors.background }}
            contentContainerStyle={{
                paddingBottom: insets.bottom + 24,
                paddingHorizontal: 16,
                paddingTop: 24,
            }}
            showsVerticalScrollIndicator={false}>
            {/* <Text className="mb-2 text-3xl font-bold text-white">{privacyData.title}</Text> */}
            <Text className="mb-6 text-sm text-neutral-500">{privacyData.lastUpdated}</Text>

            <Text className="mb-8 text-base leading-6 text-neutral-300">{privacyData.info}</Text>

            <View className="gap-6">
                {privacyData.sections.map((section, index) => (
                    <View key={index}>
                        <Text className="mb-2 text-lg font-bold text-white">{section.title}</Text>
                        <Text className="text-base leading-6 text-neutral-400">{section.text}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}
