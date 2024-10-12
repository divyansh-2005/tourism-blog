// src/screens/Blog/CreateBlogScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '@env';

const CreateBlogScreen = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
    const [location, setLocation] = useState(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                return;
            }
            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);
        })();
    }, []);

    const handleImagePick = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert('Permission to access camera roll is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1], // Square aspect ratio
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const getToken = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            return token;
        } catch (error) {
            console.error("Error retrieving token from AsyncStorage:", error);
            return null;
        }
    };

    const handleSubmit = async () => {
        if (!title || !description || !image || !location) {
            Alert.alert('Please fill in all fields, select an image, and ensure location is retrieved!');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('image', {
            uri: image,
            name: 'photo.jpg',
            type: 'image/jpeg',
        });
        formData.append('location', JSON.stringify({
            type: 'Point',
            coordinates: [location.coords.longitude, location.coords.latitude]
        }));

        const token = await getToken();

        if (!token) {
            Alert.alert('User is not authenticated. Please log in.');
            return;
        }

        // console.log('Form Data:', formData);

        try {
            const response = await axios.post(`${BACKEND_URL}/blog`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 201) {
                Alert.alert('Blog post created successfully!');
                setUploadedImageUrl(response.data.imageUrl);
                setTitle('');
                setDescription('');
                setImage(null);
                setLocation(null); // Reset location
            }
        } catch (error) {
            // Log the entire error response for debugging
            console.error('Error details:', error.response ? error.response.data : error.message);

            // Display a user-friendly error message
            if (error.response) {
                // Server responded with a status other than 2xx
                Alert.alert('Error creating blog post', error.response.data.message || 'Please try again later.');
            } else {
                // Network or other errors
                Alert.alert('Error creating blog post', error.message);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Blog Post</Text>
            <Button title="Pick an image from camera roll" onPress={handleImagePick} />
            {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
            <TextInput
                style={styles.input}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                multiline
            />
            <Button title="Submit" onPress={handleSubmit} />
            {uploadedImageUrl && (
                <View style={styles.uploadedImageContainer}>
                    <Text>Image uploaded successfully!</Text>
                    <Image source={{ uri: uploadedImageUrl }} style={styles.uploadedImage} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, marginBottom: 20 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15 },
    imagePreview: { width: 200, height: 200, marginVertical: 10 },
    uploadedImageContainer: { marginTop: 20 },
    uploadedImage: { width: 200, height: 200, marginTop: 10 },
});

export default CreateBlogScreen;
