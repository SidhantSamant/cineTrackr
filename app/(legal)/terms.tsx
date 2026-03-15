import { Colors } from '@/constants/Colors';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const termsData = {
    title: 'Terms of Service',
    lastUpdated: 'Last updated: March 2026',
    info: 'Welcome to Cine Trackr. By downloading, accessing, or using this application, you agree to be bound by the following Terms of Service.',
    sections: [
        {
            title: '1. Purpose of the Application',
            text: 'Cine Trackr is a utility application designed to help you organize, track, and discover entertainment content (movies and television series). The application DOES NOT provide streaming, broadcasting, or downloading of copyrighted media content.',
        },
        {
            title: '2. User Accounts',
            text: "To use the tracking features of Cine Trackr, you must create an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. Cine Trackr is provided 'as-is' and is not liable for any loss of data or damage arising from your failure to comply with this security obligation.",
        },
        {
            title: '3. Acceptable Use',
            text: "You agree to use Cine Trackr only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit the use of the application by any third party. You must not use the application to transmit malicious content or attempt to access or compromise other users' information or our Supabase backend.",
        },
        {
            title: '4. TMDb Disclaimer',
            text: 'This product uses the TMDb (The Movie Database) API to provide metadata, posters, and images, but is NOT endorsed, certified, or affiliated with TMDb. All information related to movies and series is the property of TMDb and its respective authors/creators.',
        },
        {
            title: '5. Open Source Software',
            text: 'Cine Trackr is an open-source project licensed under the GNU General Public License v3.0 (GPLv3). By using, modifying, or distributing the source code of this application, you agree to abide by the terms set forth in the GPLv3 license.',
        },
        {
            title: '6. Modification of Terms',
            text: 'We reserve the right to modify or replace these Terms at any time. If we post an update, your continued use of the application will constitute your acceptance of the new terms.',
        },
    ],
};

export default function TermsScreen() {
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
            {/* <Text className="mb-2 text-3xl font-bold text-white">{termsData.title}</Text> */}
            <Text className="mb-6 text-sm text-neutral-500">{termsData.lastUpdated}</Text>

            <Text className="mb-8 text-base leading-6 text-neutral-300">{termsData.info}</Text>

            <View className="gap-6">
                {termsData.sections.map((section, index) => (
                    <View key={index}>
                        <Text className="mb-2 text-lg font-bold text-white">{section.title}</Text>
                        <Text className="text-base leading-6 text-neutral-400">{section.text}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}
