import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, LogOut } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';

export default function ProfileScreen() {
    const { user, logout } = useAuth();

    return (
        <LinearGradient colors={theme.gradients.dark} style={styles.container}>
            <View style={styles.content}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <User size={48} color={theme.colors.primary} />
                    </View>
                </View>

                <View style={styles.infoCard}>
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Name</Text>
                        <Text style={styles.value}>{user?.name}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>Email</Text>
                        <Text style={styles.value}>{user?.email}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={logout}
                    activeOpacity={0.8}
                >
                    <View style={styles.logoutContent}>
                        <LogOut size={20} color={theme.colors.error} />
                        <Text style={styles.logoutText}>Logout</Text>
                    </View>
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
        padding: theme.spacing.l,
    },
    avatarContainer: {
        alignItems: 'center',
        marginTop: theme.spacing.xxl,
        marginBottom: theme.spacing.xl,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.medium,
    },
    infoCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.l,
        padding: theme.spacing.l,
        marginBottom: theme.spacing.xl,
        ...theme.shadows.medium,
    },
    infoItem: {
        paddingVertical: theme.spacing.m,
    },
    label: {
        ...theme.typography.caption,
        marginBottom: theme.spacing.xs,
    },
    value: {
        ...theme.typography.h4,
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border,
    },
    logoutButton: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.m,
        padding: theme.spacing.m,
        borderWidth: 1,
        borderColor: theme.colors.error,
        ...theme.shadows.small,
    },
    logoutContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.s,
    },
    logoutText: {
        ...theme.typography.bodyBold,
        color: theme.colors.error,
    },
});
