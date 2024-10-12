// src/screens/Blog/BlogDetailScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BlogDetailScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Blog Detail</Text>
            {/* Display blog details here */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, marginBottom: 20 },
});

export default BlogDetailScreen;
