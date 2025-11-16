/**
 * Tag People Modal
 * Search and select users to tag in video
 */

import { supabaseService } from '@/services/supabase.service';
import type { User } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface TagPeopleModalProps {
    visible: boolean;
    onClose: () => void;
    selectedUsers: User[];
    onUpdateSelected: (users: User[]) => void;
}

export default function TagPeopleModal({
    visible,
    onClose,
    selectedUsers,
    onUpdateSelected,
}: TagPeopleModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = useCallback(async (query: string) => {
        setSearchQuery(query);

        if (query.trim().length < 2) {
            setSearchResults([]);
            return;
        }

        try {
            setIsSearching(true);
            const users = await supabaseService.users.searchUsers(query);
            setSearchResults(users);
        } catch {
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, []);

    const handleToggleUser = useCallback((user: User) => {
        const isSelected = selectedUsers.some(u => u.id === user.id);
        
        if (isSelected) {
            onUpdateSelected(selectedUsers.filter(u => u.id !== user.id));
        } else {
            onUpdateSelected([...selectedUsers, user]);
        }
    }, [selectedUsers, onUpdateSelected]);

    const handleDone = useCallback(() => {
        onClose();
    }, [onClose]);

    const isUserSelected = useCallback((userId: string) => {
        return selectedUsers.some(u => u.id === userId);
    }, [selectedUsers]);

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <SafeAreaView style={styles.container} edges={['top']}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color="#111" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Tag people</Text>
                    <TouchableOpacity onPress={handleDone}>
                        <Text style={styles.doneButton}>Done</Text>
                    </TouchableOpacity>
                </View>

                {/* Search bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#9CA3AF" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search users..."
                        value={searchQuery}
                        onChangeText={handleSearch}
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                {/* Selected users */}
                {selectedUsers.length > 0 && (
                    <View style={styles.selectedSection}>
                        <Text style={styles.selectedCount}>
                            {selectedUsers.length} {selectedUsers.length === 1 ? 'person' : 'people'} tagged
                        </Text>
                        <FlatList
                            horizontal
                            data={selectedUsers}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View style={styles.selectedChip}>
                                    <Text style={styles.selectedChipText}>{item.username}</Text>
                                    <TouchableOpacity onPress={() => handleToggleUser(item)}>
                                        <Ionicons name="close-circle" size={18} color="#FF3B5C" />
                                    </TouchableOpacity>
                                </View>
                            )}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                )}

                {/* Search results */}
                {isSearching ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#FF3B5C" />
                    </View>
                ) : searchResults.length > 0 ? (
                    <FlatList
                        data={searchResults}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => {
                            const selected = isUserSelected(item.id);
                            return (
                                <TouchableOpacity
                                    style={styles.userItem}
                                    onPress={() => handleToggleUser(item)}
                                >
                                    <Image
                                        source={{ uri: typeof item.profileImage === 'string' ? item.profileImage : '' }}
                                        style={styles.userAvatar}
                                    />
                                    <View style={styles.userInfo}>
                                        <Text style={styles.userName}>{item.username}</Text>
                                        <Text style={styles.userBio} numberOfLines={1}>
                                            {item.fullName}
                                        </Text>
                                    </View>
                                    <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                                        {selected && <Ionicons name="checkmark" size={16} color="#fff" />}
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                    />
                ) : searchQuery.length >= 2 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="person-outline" size={48} color="#D1D5DB" />
                        <Text style={styles.emptyText}>No users found</Text>
                    </View>
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="search-outline" size={48} color="#D1D5DB" />
                        <Text style={styles.emptyText}>Search for people to tag</Text>
                    </View>
                )}
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#111',
    },
    doneButton: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FF3B5C',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        margin: 16,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 15,
        color: '#111',
    },
    selectedSection: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    selectedCount: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    selectedChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEE2E2',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
        gap: 6,
    },
    selectedChipText: {
        fontSize: 14,
        color: '#991B1B',
        fontWeight: '500',
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    userAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F3F4F6',
    },
    userInfo: {
        flex: 1,
        marginLeft: 12,
    },
    userName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111',
        marginBottom: 2,
    },
    userBio: {
        fontSize: 13,
        color: '#6B7280',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxSelected: {
        backgroundColor: '#FF3B5C',
        borderColor: '#FF3B5C',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    emptyText: {
        fontSize: 15,
        color: '#9CA3AF',
        marginTop: 12,
        textAlign: 'center',
    },
});
