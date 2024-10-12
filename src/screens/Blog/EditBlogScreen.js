// src/screens/Blog/EditBlogScreen.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '@env'; // Adjust based on your env setup

const EditBlogScreen = ({ route, navigation }) => {
  const { blogId } = route.params; // Get blog ID from route parameters
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${BACKEND_URL}/blog/${blogId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { title, description, imageUrl } = response.data;
        setTitle(title);
        setDescription(description);
        setImage(imageUrl);
      } catch (error) {
        Alert.alert('Error fetching blog details', error.message);
        console.error('Error fetching blog details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [blogId]);

  const handleImagePicker = async () => {
    // Request permission to access media library
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

  const handleUpdateBlog = async () => {
    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (image) {
      formData.append('image', {
        uri: image,
        type: 'image/jpeg', // Adjust this based on your image type
        name: 'photo.jpg', // Change the name as needed
      });
    }

    try {
      await axios.put(`${BACKEND_URL}/blog/${blogId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      Alert.alert('Blog updated successfully');
      navigation.goBack(); // Navigate back after successful update
    } catch (error) {
      Alert.alert('Error updating blog', error.message);
      console.error('Error updating blog:', error);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>; // Placeholder while loading
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Blog Post</Text>
      <Image source={{ uri: image }} style={styles.image} />
      <Button title="Change Image" onPress={handleImagePicker} />
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
      <Button title="Update Blog" onPress={handleUpdateBlog} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  image: {
    width: '100%',
    height: 200, // Height can be adjusted as needed
    borderRadius: 5,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
  },
});

export default EditBlogScreen;
