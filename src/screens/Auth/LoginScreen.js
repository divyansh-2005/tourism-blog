// src/screens/Auth/LoginScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BACKEND_URL } from '@env';  // Import the backend URL from .env


const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        try {
            // Axios POST request for login
            const response = await axios.post(`${BACKEND_URL}/auth/login`, {
                username,
                password
            });

            // If login is successful, save the token and navigate to HomeScreen
            const { token } = response.data;
            await AsyncStorage.setItem('token', token);
            console.log('====================================');
            console.log('Login successful');
            console.log('====================================');
            navigation.replace('Home');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage('Invalid credentials');
            } else {
                setErrorMessage('Login failed');
                console.log('====================================');
                console.log("loginError:",error);
                console.log('====================================');                
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

            <TextInput 
                style={styles.input} 
                placeholder="Username" 
                value={username} 
                onChangeText={setUsername} 
            />
            <TextInput 
                style={styles.input} 
                placeholder="Password" 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry 
            />

            <Button title="Login" onPress={handleLogin} />
            <Button 
                title="Sign Up" 
                onPress={() => navigation.navigate('Signup')} 
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20},
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, padding: 10, marginBottom: 10, width: '100%' },
    error: { color: 'red', marginBottom: 20, textAlign: 'center' },
});

export default LoginScreen;
