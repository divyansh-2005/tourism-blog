// src/screens/Auth/SignupScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BACKEND_URL } from '@env';  // Import the backend URL from .env



const SignupScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSignup = async () => {
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        try {
            // Axios POST request for signup
            const response = await axios.post(`${BACKEND_URL}/auth/signup`, {
                username,
                password
            });

            // If signup is successful, save the token and navigate to HomeScreen
            const { token } = response.data;
            await AsyncStorage.setItem('token', token);
            console.log('====================================');
            console.log('Signup successful');
            console.log('====================================');
            navigation.replace('Home');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage('User already exists');
            } 
            else if(error.response.status === 504){
                setErrorMessage('Server is down');
            }
            else {
                setErrorMessage('Signup failed');
                console.log('====================================');
                console.log("signupError:",error);
                console.log('====================================');                
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>

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
            <TextInput 
                style={styles.input} 
                placeholder="Confirm Password" 
                value={confirmPassword} 
                onChangeText={setConfirmPassword} 
                secureTextEntry 
            />

            <Button title="Sign Up" onPress={handleSignup} />
            <Button 
                title="Already have an account? Login" 
                onPress={() => navigation.navigate('Login')} 
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

export default SignupScreen;
