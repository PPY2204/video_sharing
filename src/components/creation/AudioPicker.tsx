import { supabaseService } from '@/services/supabase.service';
import type { Audio } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Track = { id: string; title: string; duration: string; thumbnail: any };

type Props = {
    onClose: () => void;
    onUse: (track: Track) => void;
};

export default function AudioPicker({ onClose, onUse }: Props) {
    const [activeTab, setActiveTab] = useState('for-you');
    const [audioTracks, setAudioTracks] = useState<Audio[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadAudio = async () => {
            try {
                const data = await supabaseService.audio.getAudioTracks();
                setAudioTracks(data);
            } catch (error) {
                setAudioTracks([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadAudio();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>Add audio</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.iconSmall} onPress={() => { }}>
                        <Ionicons name="search" size={18} color="#374151" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconSmall} onPress={onClose}>
                        <Ionicons name="close" size={22} color="#374151" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.tabsRow}>
                {['for-you', 'trending', 'saved'].map(t => (
                    <TouchableOpacity key={t} style={[styles.tab, activeTab === t && styles.tabActive]} onPress={() => setActiveTab(t)}>
                        <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>{t === 'for-you' ? 'For you' : t.charAt(0).toUpperCase() + t.slice(1)}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#FF3B5C" />
                    <Text style={styles.loadingText}>Loading audio tracks...</Text>
                </View>
            ) : (
                <ScrollView style={styles.list}>
                    {audioTracks.map(track => {
                        const coverSource = typeof track.cover === 'string'
                            ? { uri: track.cover }
                            : track.cover;

                        return (
                            <View key={track.id} style={styles.row}>
                                {track.cover && (
                                    <Image source={coverSource} style={styles.thumb} />
                                )}
                                <View style={styles.meta}>
                                    <Text style={styles.trackTitle}>{track.name}</Text>
                                    <Text style={styles.trackDuration}>{track.duration}</Text>
                                    <Text style={styles.trackArtist}>{track.creator}</Text>
                                </View>
                                <TouchableOpacity 
                                    style={styles.useButton} 
                                    onPress={() => onUse({
                                        id: track.id,
                                        title: track.name,
                                        duration: track.duration,
                                        thumbnail: track.cover
                                    })}
                                >
                                    <Text style={styles.useText}>Use</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.moreBtn} onPress={() => { }}>
                                    <Ionicons name="ellipsis-horizontal" size={18} color="#6B7280" />
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', paddingTop: 18, paddingHorizontal: 16 },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    title: { fontSize: 18, fontWeight: '700', color: '#111' },
    headerActions: { flexDirection: 'row', alignItems: 'center' },
    iconSmall: { marginLeft: 12 },
    tabsRow: { flexDirection: 'row', marginTop: 12 },
    tab: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20 },
    tabActive: { backgroundColor: '#FEE2E6' },
    tabText: { color: '#9CA3AF' },
    tabTextActive: { color: '#EC4899', fontWeight: '600' },
    list: { marginTop: 12 },
    loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
    loadingText: { marginTop: 12, fontSize: 14, color: '#6B7280' },
    row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    thumb: { width: 56, height: 56, borderRadius: 8, marginRight: 12 },
    meta: { flex: 1 },
    trackTitle: { fontSize: 14, color: '#111', fontWeight: '600' },
    trackDuration: { fontSize: 12, color: '#6B7280', marginTop: 4 },
    trackArtist: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
    useButton: { borderWidth: 1, borderColor: '#FF3B5C', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, marginRight: 8 },
    useText: { color: '#FF3B5C', fontWeight: '600' },
    moreBtn: { padding: 6 },
});
