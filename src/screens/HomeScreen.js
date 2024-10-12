// src/screens/HomeScreen.js

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to the Tourism Blogging App!</Text>

            <View style={styles.buttonContainer}>
                <Button 
                    title="Go to Blog List" 
                    onPress={() => navigation.navigate('Blog List')} 
                />
            </View>

            <View style={styles.buttonContainer}>
                <Button 
                    title="Go to Profile" 
                    onPress={() => navigation.navigate('Profile')} 
                />
            </View>

            <View style={styles.buttonContainer}>
                <Button 
                    title="Create New Blog" 
                    onPress={() => navigation.navigate('Create Blog')} 
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, marginBottom: 20 },
    buttonContainer: { marginTop: 15, width: '80%' },
});

export default HomeScreen;
