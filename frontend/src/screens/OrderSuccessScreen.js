import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle } from 'lucide-react-native';
import { theme } from '../theme';

export default function OrderSuccessScreen({ navigation }) {
    return (
        <LinearGradient colors={theme.gradients.dark} style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <CheckCircle size={80} color={theme.colors.success} />
                </View>

                <Text style={styles.title}>Order Placed!</Text>
                <Text style={styles.message}>
                    Your food is being prepared and will be on its way soon.
                </Text>

                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => navigation.navigate('Main', { screen: 'Orders' })}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={theme.gradients.primary}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.buttonGradient}
                    >
                        <Text style={styles.buttonText}>Track Order</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => navigation.navigate('Main', { screen: 'Home' })}
                >
                    <Text style={styles.secondaryButtonText}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
    },
    iconContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
        ...theme.shadows.large,
    },
    title: {
        ...theme.typography.h1,
        marginBottom: theme.spacing.m,
        textAlign: 'center',
    },
    message: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: theme.spacing.xxl,
        maxWidth: 280,
    },
    primaryButton: {
        width: '100%',
        borderRadius: theme.borderRadius.m,
        overflow: 'hidden',
        marginBottom: theme.spacing.m,
        ...theme.shadows.medium,
    },
    buttonGradient: {
        paddingVertical: theme.spacing.m,
        alignItems: 'center',
    },
    buttonText: {
        ...theme.typography.h4,
        color: '#fff',
    },
    secondaryButton: {
        width: '100%',
        paddingVertical: theme.spacing.m,
        alignItems: 'center',
    },
    secondaryButtonText: {
        ...theme.typography.bodyMedium,
        color: theme.colors.textSecondary,
    },
});
