/**
 * Filter Picker Component
 * Bottom sheet for selecting video filters
 * Displays filter previews with For you/Trending/Saved tabs
 */

import { CACHE_KEYS, cacheService } from '@/services/cache.service';
import { supabaseService } from '@/services/supabase.service';
import type { Filter } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    onClose: () => void;
    onSelectFilter: (filter: Filter) => void;
};

export default function FilterPicker({ onClose, onSelectFilter }: Props) {
    const [activeTab, setActiveTab] = useState<'for-you' | 'trending' | 'saved'>('for-you');
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
    const [filters, setFilters] = useState<Filter[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadFilters = useCallback(async () => {
        try {
            setIsLoading(true);
            
            const cacheKey = `${CACHE_KEYS.FILTERS}_${activeTab}`;
            const cached = await cacheService.get<Filter[]>(cacheKey);
            
            if (cached) {
                setFilters(cached);
                setIsLoading(false);
                return;
            }

            const data = await supabaseService.filters.getFilters(activeTab);
            setFilters(data);
            
            await cacheService.set(cacheKey, data);
        } catch {
            setFilters([]);
        } finally {
            setIsLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        loadFilters();
    }, [loadFilters]);

    const handleSelectFilter = useCallback((filter: Filter) => {
        setSelectedFilter(filter.id);
        onSelectFilter(filter);
    }, [onSelectFilter]);

    const handleNoFilter = useCallback(() => {
        setSelectedFilter(null);
        onSelectFilter({ id: 'none', name: 'None' });
    }, [onSelectFilter]);

    const renderedFilters = useMemo(() => (
        filters.map((filter) => {
            const thumbnailSource = typeof filter.thumbnail === 'string'
                ? { uri: filter.thumbnail }
                : filter.thumbnail;

            return (
                <TouchableOpacity
                    key={filter.id}
                    style={styles.filterItem}
                    onPress={() => handleSelectFilter(filter)}
                >
                    <View style={[
                        styles.filterPreview,
                        selectedFilter === filter.id && styles.filterPreviewSelected
                    ]}>
                        {filter.thumbnail ? (
                            <Image source={thumbnailSource} style={styles.filterImage} />
                        ) : (
                            <View style={styles.placeholderFilter}>
                                <Ionicons name="color-filter-outline" size={32} color="#9CA3AF" />
                            </View>
                        )}
                    </View>
                    <Text style={styles.filterName}>{filter.name}</Text>
                </TouchableOpacity>
            );
        })
    ), [filters, selectedFilter, handleSelectFilter]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Add filter</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#111" />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'for-you' && styles.tabActive]}
                    onPress={() => setActiveTab('for-you')}
                >
                    <Text style={[styles.tabText, activeTab === 'for-you' && styles.tabTextActive]}>
                        For you
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'trending' && styles.tabActive]}
                    onPress={() => setActiveTab('trending')}
                >
                    <Text style={[styles.tabText, activeTab === 'trending' && styles.tabTextActive]}>
                        Trending
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'saved' && styles.tabActive]}
                    onPress={() => setActiveTab('saved')}
                >
                    <Text style={[styles.tabText, activeTab === 'saved' && styles.tabTextActive]}>
                        Saved
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Filters Grid */}
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FF3B5C" />
                    <Text style={styles.loadingText}>Loading filters...</Text>
                </View>
            ) : (
                <ScrollView style={styles.filtersContainer} showsVerticalScrollIndicator={false}>
                    <View style={styles.filtersGrid}>
                        <TouchableOpacity 
                            style={styles.filterItem}
                            onPress={handleNoFilter}
                        >
                            <View style={[styles.filterPreview, styles.noFilterPreview]}>
                                <Ionicons name="close-circle-outline" size={32} color="#9CA3AF" />
                            </View>
                            <Text style={styles.filterName}>None</Text>
                        </TouchableOpacity>

                        {renderedFilters}
                    </View>
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111',
    },
    closeButton: {
        padding: 4,
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 16,
        gap: 12,
    },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'transparent',
    },
    tabActive: {
        backgroundColor: '#FF3B5C',
    },
    tabText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    tabTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    filtersContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    filtersGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        paddingBottom: 20,
    },
    filterItem: {
        width: '30%',
        alignItems: 'center',
    },
    filterPreview: {
        width: '100%',
        aspectRatio: 0.75,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 8,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    noFilterPreview: {
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
    },
    filterPreviewSelected: {
        borderWidth: 3,
        borderColor: '#FF3B5C',
    },
    filterImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    filterName: {
        fontSize: 12,
        color: '#374151',
        fontWeight: '500',
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#6B7280',
    },
    placeholderFilter: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
});
