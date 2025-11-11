/**
 * Product Detail Screen (Joy Shop)
 * E-commerce product page with purchase options
 */

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProductDetailScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("M");

    // Mock product data
    const product = {
        id: params.productId || "1",
        name: "Premium Wireless Headphones",
        price: 129.99,
        originalPrice: 199.99,
        discount: "35% OFF",
        rating: 4.5,
        reviews: 1234,
        sold: 5678,
        image: require("@/assets/images/home/Perfect-lady.png"),
        seller: {
            name: "Tech Store Official",
            avatar: require("@/assets/images/home/You.png"),
            rating: 4.8,
        },
        description: "Experience premium sound quality with our latest wireless headphones. Features active noise cancellation, 30-hour battery life, and comfortable over-ear design.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "White", "Blue"],
        inStock: true,
    };

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Product Details</Text>
                <TouchableOpacity style={styles.headerButton}>
                    <Ionicons name="share-social-outline" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Product Image */}
                <View style={styles.imageContainer}>
                    <Image source={product.image} style={styles.productImage} resizeMode="cover" />
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>{product.discount}</Text>
                    </View>
                </View>

                {/* Product Info */}
                <View style={styles.infoSection}>
                    <View style={styles.priceRow}>
                        <Text style={styles.price}>${product.price}</Text>
                        <Text style={styles.originalPrice}>${product.originalPrice}</Text>
                    </View>

                    <Text style={styles.productName}>{product.name}</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Ionicons name="star" size={16} color="#FFB800" />
                            <Text style={styles.statText}>{product.rating}</Text>
                        </View>
                        <Text style={styles.separator}>|</Text>
                        <Text style={styles.statText}>{product.reviews} Reviews</Text>
                        <Text style={styles.separator}>|</Text>
                        <Text style={styles.statText}>{product.sold} Sold</Text>
                    </View>
                </View>

                {/* Seller Info */}
                <View style={styles.sellerSection}>
                    <Image source={product.seller.avatar} style={styles.sellerAvatar} />
                    <View style={styles.sellerInfo}>
                        <Text style={styles.sellerName}>{product.seller.name}</Text>
                        <View style={styles.sellerRating}>
                            <Ionicons name="star" size={14} color="#FFB800" />
                            <Text style={styles.sellerRatingText}>{product.seller.rating}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.chatButton}>
                        <Ionicons name="chatbubble-outline" size={20} color="#FF3B5C" />
                    </TouchableOpacity>
                </View>

                {/* Size Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Size</Text>
                    <View style={styles.optionsRow}>
                        {product.sizes.map((size) => (
                            <TouchableOpacity
                                key={size}
                                style={[
                                    styles.optionButton,
                                    selectedSize === size && styles.optionButtonActive,
                                ]}
                                onPress={() => setSelectedSize(size)}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        selectedSize === size && styles.optionTextActive,
                                    ]}
                                >
                                    {size}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>{product.description}</Text>
                </View>
            </ScrollView>

            {/* Bottom Actions */}
            <View style={styles.bottomBar}>
                <View style={styles.quantitySection}>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                        <Ionicons name="remove" size={20} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{quantity}</Text>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => setQuantity(quantity + 1)}
                    >
                        <Ionicons name="add" size={20} color="#000" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.addToCartButton}>
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buyNowButton}>
                    <Text style={styles.buyNowText}>Buy Now</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    headerButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#000",
    },
    imageContainer: {
        width: "100%",
        height: 300,
        backgroundColor: "#f5f5f5",
    },
    productImage: {
        width: "100%",
        height: "100%",
    },
    discountBadge: {
        position: "absolute",
        top: 16,
        left: 16,
        backgroundColor: "#FF3B5C",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    discountText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "700",
    },
    infoSection: {
        padding: 16,
        borderBottomWidth: 8,
        borderBottomColor: "#f5f5f5",
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
        gap: 12,
    },
    price: {
        fontSize: 28,
        fontWeight: "700",
        color: "#FF3B5C",
    },
    originalPrice: {
        fontSize: 18,
        color: "#999",
        textDecorationLine: "line-through",
    },
    productName: {
        fontSize: 18,
        fontWeight: "600",
        color: "#000",
        marginBottom: 12,
    },
    statsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    statItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    statText: {
        fontSize: 14,
        color: "#666",
    },
    separator: {
        color: "#ddd",
    },
    sellerSection: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 8,
        borderBottomColor: "#f5f5f5",
    },
    sellerAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    sellerInfo: {
        flex: 1,
    },
    sellerName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
        marginBottom: 4,
    },
    sellerRating: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    sellerRatingText: {
        fontSize: 13,
        color: "#666",
    },
    chatButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#FFF0F3",
        justifyContent: "center",
        alignItems: "center",
    },
    section: {
        padding: 16,
        borderBottomWidth: 8,
        borderBottomColor: "#f5f5f5",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
        marginBottom: 12,
    },
    optionsRow: {
        flexDirection: "row",
        gap: 12,
    },
    optionButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: "#f5f5f5",
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    optionButtonActive: {
        backgroundColor: "#FFF0F3",
        borderColor: "#FF3B5C",
    },
    optionText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#666",
    },
    optionTextActive: {
        color: "#FF3B5C",
    },
    description: {
        fontSize: 14,
        lineHeight: 22,
        color: "#666",
    },
    bottomBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: "#f0f0f0",
        gap: 12,
        backgroundColor: "#fff",
    },
    quantitySection: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
        padding: 4,
    },
    quantityButton: {
        width: 32,
        height: 32,
        justifyContent: "center",
        alignItems: "center",
    },
    quantityText: {
        fontSize: 16,
        fontWeight: "600",
        paddingHorizontal: 12,
    },
    addToCartButton: {
        flex: 1,
        height: 48,
        backgroundColor: "#FFF0F3",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    addToCartText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#FF3B5C",
    },
    buyNowButton: {
        flex: 1,
        height: 48,
        backgroundColor: "#FF3B5C",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    buyNowText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
    },
});
