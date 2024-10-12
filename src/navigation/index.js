// src/navigation/index.js

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage'; // To manage auth token

import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import BlogListScreen from '../screens/Blog/BlogListScreen';
import BlogDetailScreen from '../screens/Blog/BlogDetailScreen';
import CreateBlogScreen from '../screens/Blog/CreateBlogScreen';
import EditBlogScreen from '../screens/Blog/EditBlogScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check if the user is authenticated when the app starts
    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                setIsAuthenticated(true);
            }
        };
        checkAuthStatus();
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={isAuthenticated ? 'Home' : 'Login'}>
                {/* Authentication Screens */}
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Signup" component={SignupScreen} />
                <Stack.Screen name="Forgot Password" component={ForgotPasswordScreen} />

                {/* Protected Screens */}
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Blog List" component={BlogListScreen} />
                <Stack.Screen name="Blog Detail" component={BlogDetailScreen} />
                <Stack.Screen name="Create Blog" component={CreateBlogScreen} />
                <Stack.Screen name="Edit Blog" component={EditBlogScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
