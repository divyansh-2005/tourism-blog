// src/screens/Blog/BlogListScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, ActivityIndicator, Alert, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode'; // Correct import for jwt-decode
import { BACKEND_URL } from '@env'; // Adjust this based on your env setup

const BlogListScreen = ({ navigation }) => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedIndex, setExpandedIndex] = useState(null); // Track expanded blog index
    const [userId, setUserId] = useState(null); // Store user ID

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (token) {
                    const decodedToken = jwtDecode(token); // Decode token to get user ID
                    setUserId(decodedToken.id); // Adjust this based on your token structure
                }
                
                const response = await axios.get(`${BACKEND_URL}/blog`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBlogs(response.data);
            } catch (error) {
                Alert.alert('Error fetching blogs', error.message);
                console.error('Error fetching blogs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index); // Toggle expanded index
    };

    const handleDelete = async (id) => {
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`${BACKEND_URL}/blog/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBlogs(blogs.filter(blog => blog._id !== id)); // Remove the deleted blog from the state
            Alert.alert('Blog deleted successfully');
        } catch (error) {
            Alert.alert('Error deleting blog', error.message);
            console.error('Error deleting blog:', error);
        }
    };

    const renderBlogItem = ({ item, index }) => {
        const isUserBlog = item.user === userId; // Check if the blog belongs to the logged-in user

        return (
            <TouchableOpacity
                style={[styles.blogItem, isUserBlog && styles.userBlog]} // Apply userBlog style if it belongs to the user
                onPress={() => toggleExpand(index)}
            >
                <Image source={{ uri: item.imageUrl }} style={styles.blogImage} />
                <Text style={styles.blogTitle}>{item.title}</Text>
                {expandedIndex === index && (
                    <View style={styles.expandedContent}>
                        <Text>{item.description}</Text>
                        <Text style={styles.locationText}>
                            Location: {item.location.coordinates.join(', ')}
                        </Text>
                        {isUserBlog && (
                            <View style={styles.buttonContainer}>
                                <Button 
                                    title="Edit" 
                                    onPress={() => navigation.navigate('Edit Blog', { blogId: item._id })} 
                                />
                                <Button 
                                    title="Delete" 
                                    onPress={() => handleDelete(item._id)} 
                                    color="red" 
                                />
                            </View>
                        )}
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Blog List</Text>
            <Button title="Create New Blog" onPress={() => navigation.navigate('Create Blog')} />
            <FlatList
                data={blogs}
                renderItem={renderBlogItem}
                keyExtractor={(item) => item._id}
                numColumns={2} // Display two items per row
                columnWrapperStyle={styles.row} // Apply styles to each row
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
    row: { justifyContent: 'space-between' }, // Space between columns
    blogItem: {
        flex: 1, // Allow each item to take up equal space
        margin: 5,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
        elevation: 2, // Shadow effect on Android
    },
    userBlog: {
        borderColor: 'green', // Change border color for user blogs
        borderWidth: 2, // Make the border thicker for visibility
    },
    blogImage: {
        width: '100%',
        height: 150,
        borderRadius: 5,
    },
    blogTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 5 },
    expandedContent: { marginTop: 5 },
    locationText: { fontStyle: 'italic', marginTop: 5 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
});

export default BlogListScreen;
