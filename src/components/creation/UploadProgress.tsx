/**
 * UploadProgress Component
 * Shows upload progress for media files
 */

import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface UploadProgressProps {
    progress: number; // 0-100
    fileName?: string;
    onCancel?: () => void;
}

export default function UploadProgress({ progress, fileName }: UploadProgressProps) {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#FF3B5C" />
            <Text style={styles.title}>Uploading...</Text>
            {fileName && <Text style={styles.fileName}>{fileName}</Text>}
            <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.percentage}>{Math.round(progress)}%</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 24,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginTop: 16,
    },
    fileName: {
        fontSize: 14,
        color: '#D1D5DB',
        marginTop: 8,
    },
    progressBar: {
        width: '100%',
        height: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 4,
        marginTop: 16,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#FF3B5C',
        borderRadius: 4,
    },
    percentage: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginTop: 8,
    },
});
