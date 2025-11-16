/**
 * Privacy Settings Modal
 * Select who can watch the video
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export type PrivacyOption = 'public' | 'friends' | 'private';

interface PrivacyOptionItem {
    id: PrivacyOption;
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
}

const PRIVACY_OPTIONS: PrivacyOptionItem[] = [
    {
        id: 'public',
        title: 'Public',
        description: 'Everyone can watch your video',
        icon: 'globe-outline',
    },
    {
        id: 'friends',
        title: 'Friends',
        description: 'Only your friends can watch',
        icon: 'people-outline',
    },
    {
        id: 'private',
        title: 'Only me',
        description: 'Only you can watch',
        icon: 'lock-closed-outline',
    },
];

interface PrivacySettingsModalProps {
    visible: boolean;
    onClose: () => void;
    selectedPrivacy: PrivacyOption;
    onSelect: (privacy: PrivacyOption) => void;
}

export default function PrivacySettingsModal({
    visible,
    onClose,
    selectedPrivacy,
    onSelect,
}: PrivacySettingsModalProps) {
    const [tempSelected, setTempSelected] = useState<PrivacyOption>(selectedPrivacy);

    const handleSelect = useCallback((privacy: PrivacyOption) => {
        setTempSelected(privacy);
    }, []);

    const handleDone = useCallback(() => {
        onSelect(tempSelected);
        onClose();
    }, [tempSelected, onSelect, onClose]);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={onClose}
                />
                <SafeAreaView style={styles.container} edges={['bottom']}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.handle} />
                        <Text style={styles.title}>Who can watch this video</Text>
                    </View>

                    {/* Options */}
                    <View style={styles.optionsContainer}>
                        {PRIVACY_OPTIONS.map((option) => {
                            const isSelected = tempSelected === option.id;
                            return (
                                <TouchableOpacity
                                    key={option.id}
                                    style={[styles.option, isSelected && styles.optionSelected]}
                                    onPress={() => handleSelect(option.id)}
                                    activeOpacity={0.7}
                                >
                                    <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
                                        <Ionicons
                                            name={option.icon}
                                            size={24}
                                            color={isSelected ? '#FF3B5C' : '#6B7280'}
                                        />
                                    </View>
                                    <View style={styles.optionContent}>
                                        <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
                                            {option.title}
                                        </Text>
                                        <Text style={styles.optionDescription}>{option.description}</Text>
                                    </View>
                                    {isSelected && (
                                        <Ionicons name="checkmark-circle" size={24} color="#FF3B5C" />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Action buttons */}
                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.buttonCancel} onPress={onClose}>
                            <Text style={styles.buttonCancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonDone} onPress={handleDone}>
                            <Text style={styles.buttonDoneText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    backdrop: {
        flex: 1,
    },
    container: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 16,
    },
    header: {
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#D1D5DB',
        borderRadius: 2,
        marginBottom: 16,
    },
    title: {
        fontSize: 17,
        fontWeight: '600',
        color: '#111',
    },
    optionsContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginVertical: 4,
        backgroundColor: '#F9FAFB',
    },
    optionSelected: {
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FF3B5C',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    iconContainerSelected: {
        backgroundColor: '#FEE2E2',
    },
    optionContent: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111',
        marginBottom: 4,
    },
    optionTitleSelected: {
        color: '#DC2626',
    },
    optionDescription: {
        fontSize: 13,
        color: '#6B7280',
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    buttonCancel: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
    },
    buttonCancelText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    buttonDone: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        backgroundColor: '#FF3B5C',
        alignItems: 'center',
    },
    buttonDoneText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});
