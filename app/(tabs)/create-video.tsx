import React, { useState } from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AudioScreen from '../../components/CreateFlow/AudioScreen';
import CameraScreen from '../../components/CreateFlow/CameraScreen';

// Mock data
const audioTracks = [
    { id: "1", title: "Beautiful lady", duration: "00:30", thumbnail: require("@/assets/images/search/container-40.png") },
    { id: "2", title: "Nice day", duration: "00:30", thumbnail: require("@/assets/images/search/container-41.png") },
    { id: "3", title: "Sunny", duration: "00:30", thumbnail: require("@/assets/images/search/container-43.png") },
    { id: "4", title: "Flowers", duration: "00:30", thumbnail: require("@/assets/images/search/container-44.png") },
    { id: "5", title: "Morning coffee", duration: "00:30", thumbnail: require("@/assets/images/search/container-45.png") },
];

const filters = [
    { id: "1", name: "Film", thumbnail: require("@/assets/images/search/container-40.png") },
    { id: "2", name: "Black white", thumbnail: require("@/assets/images/search/container-41.png") },
    { id: "3", name: "Natural", thumbnail: require("@/assets/images/search/avatar-13.png") },
    { id: "4", name: "Art", thumbnail: require("@/assets/images/search/container-43.png") },
    { id: "5", name: "Vintage", thumbnail: require("@/assets/images/search/container-44.png") },
    { id: "6", name: "Spring", thumbnail: require("@/assets/images/search/container-45.png") },
    { id: "7", name: "Baby", thumbnail: require("@/assets/images/search/avatar-14.png") },
    { id: "8", name: "Contrast", thumbnail: require("@/assets/images/search/container-38.png") },
];

export default function CreateVideo() {
    const [currentScreen, setCurrentScreen] = useState<"camera" | "post" | "filter" | "audio">("camera");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [hashtag, setHashtag] = useState("Happy moments");
    const [taggedPeople, setTaggedPeople] = useState(3);
    const [commentsEnabled, setCommentsEnabled] = useState(true);
    const [postToFacebook, setPostToFacebook] = useState(true);
    const [postToTwitter, setPostToTwitter] = useState(false);
    const [postToInstagram, setPostToInstagram] = useState(true);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [audioModalVisible, setAudioModalVisible] = useState(false);
    const [activeFilterTab, setActiveFilterTab] = useState("for-you");


    const { width, height } = Dimensions.get('window');

    return (
        <SafeAreaView style={styles.container}>
            {currentScreen === 'camera' ? (
                    <CameraScreen
                        onOpenAudio={() => setCurrentScreen('audio')}
                        onOpenFilter={() => setCurrentScreen('filter')}
                        onClose={() => setCurrentScreen('post')}
                    />
                ) : currentScreen === 'audio' ? (
                    <AudioScreen
                        onClose={() => setCurrentScreen('camera')}
                        onUse={(track) => {
                            // TODO: save selected track to state or store
                            setCurrentScreen('camera');
                        }}
                    />
                ) : (
                // fallback: existing post form
                <ScrollView style={styles.formContainer}>
                    {/* Keep existing post UI when not in camera mode */}
                    <View style={styles.formInner}>
                        <Image source={require("@/assets/images/home/Perfect-lady.png")} style={styles.coverImage} resizeMode="cover" />
                        <TouchableOpacity style={{marginTop:12}} onPress={() => {}}>
                            <Text style={{color:'#FF3B5C', fontWeight:'600'}}>Change cover photo</Text>
                        </TouchableOpacity>
                        {/* Minimal form fields (title/description) left as before for brevity */}
                        <View style={{marginTop:16}}>
                            <Text style={{color:'#374151', fontWeight:'600', marginBottom:8}}>Title</Text>
                            <TextInput style={styles.input} placeholder="Input title" value={title} onChangeText={setTitle} />
                        </View>
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    flexFill: { flex: 1 },
    cameraPreview: { flex: 1, justifyContent: 'space-between' },
    safeTop: { position: 'absolute', top: 0, left: 0, right: 0 },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8 },
    iconButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.35)' },
    addAudioButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#fff' },
    addAudioText: { marginLeft: 8, color: '#111', fontWeight: '600' },
    rightControls: { position: 'absolute', right: 12, top: 100, justifyContent: 'flex-start', alignItems: 'center' },
    rightControlItem: { marginBottom: 22, alignItems: 'center' },
    rightControlLabel: { color: '#fff', fontSize: 11, marginTop: 6 },
    bottomRow: { position: 'absolute', left: 0, right: 0, bottom: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 24 },
    sideButton: { alignItems: 'center' },
    sideLabel: { color: '#fff', fontSize: 12, marginTop: 6 },
    recordButton: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#FF5A66', borderWidth: 8, borderColor: 'rgba(255,255,255,0.12)' },
    formContainer: { flex: 1, backgroundColor: '#fff' },
    formInner: { padding: 16, alignItems: 'center' },
    coverImage: { width: 192, height: 256, borderRadius: 16 },
    input: { backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, color: '#111' },
    /* audio modal */
    audioModalContainer: { flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingTop: 18, paddingHorizontal: 16 },
    audioHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    audioHeaderTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
    audioHeaderActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    iconSmall: { marginLeft: 12 },
    audioTabsRow: { flexDirection: 'row', marginTop: 12, gap: 12 },
    audioTab: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: 'transparent' },
    audioTabActive: { backgroundColor: '#FEE2E6' },
    audioTabText: { color: '#9CA3AF' },
    audioTabTextActive: { color: '#EC4899', fontWeight: '600' },
    audioList: { marginTop: 12 },
    audioRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    audioThumb: { width: 56, height: 56, borderRadius: 8, marginRight: 12 },
    audioMeta: { flex: 1 },
    audioTitle: { fontSize: 14, color: '#111', fontWeight: '600' },
    audioDuration: { fontSize: 12, color: '#6B7280', marginTop: 4 },
    useButton: { borderWidth: 1, borderColor: '#FF3B5C', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, marginRight: 8 },
    useButtonText: { color: '#FF3B5C', fontWeight: '600' },
    moreButton: { padding: 6 },
});
