import { StatusBar } from "expo-status-bar";
import { Platform, Text } from "react-native";

import { ScreenContent } from "@/components/ScreenContent";
import { Container } from "@/components/UI/Container";

export default function Modal() {
    return (
        <>
            <Container>
                <Text>Modal Text</Text>
            </Container>
        </>
    );
}
