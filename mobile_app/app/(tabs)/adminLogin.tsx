import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FormData {
  username: string;
  password: string;
}

type Errors = {
  username?: string;
  password?: string;
};

const Login = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState<FormData>({ username: '', password: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({});
    setErrorMessage('');
  };

  const submitLogin = async () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.username,
        password: formData.password,
      }),
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/login/', requestOptions);
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.detail || 'An error occurred during login.');
        return;
      }

      if (data.access && data.refresh) {
        // Save tokens to AsyncStorage
        await AsyncStorage.setItem('access_token', data.access);
        await AsyncStorage.setItem('refresh_token', data.refresh);

        // Update admin mode in AsyncStorage
        await AsyncStorage.setItem('isAdmin', 'true');
        const isAdminValue = await AsyncStorage.getItem('isAdmin');
        console.log('isAdmin stored value:', isAdminValue);

        Alert.alert('Success', 'Logged in successfully');
        //navigation.navigate('/dash'); // Navigate to the admin dashboard
      } else {
        setErrorMessage('Tokens not received. Please try again.');
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  const handleSubmit = () => {
    const validationErrors: Errors = {};
    if (!formData.username) validationErrors.username = 'Email is required';
    if (!formData.password) validationErrors.password = 'Password is required';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      submitLogin();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bubble1}></View>
      <View style={styles.bubble2}></View>
      <View style={styles.bubble3}></View>

      <View style={styles.formContainer}>
        <View style={styles.animationContainer}>
          <LottieView
            source={require('../../assets/images/cloud_outline.json')}
            autoPlay
            loop
            style={{ height: 200 }}
          />
        </View>

        <Text style={styles.label}>
          Email <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.username ? styles.inputError : null]}
          placeholder="example@gmail.com"
          value={formData.username}
          onChangeText={(value) => handleChange('username', value)}
        />
        {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

        <Text style={styles.label}>
          Password <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.password ? styles.inputError : null]}
          placeholder="Password"
          secureTextEntry
          value={formData.password}
          onChangeText={(value) => handleChange('password', value)}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bubble1: {
    position: 'absolute',
    width: 150,
    height: 150,
    backgroundColor: 'rgba(52, 152, 219, 0.05)',
    borderRadius: 75,
    top: '20%',
    left: '10%',
  },
  bubble2: {
    position: 'absolute',
    width: 200,
    height: 200,
    backgroundColor: 'rgba(52, 152, 219, 0.05)',
    borderRadius: 100,
    top: '10%',
    right: '10%',
  },
  bubble3: {
    position: 'absolute',
    width: 120,
    height: 120,
    backgroundColor: 'rgba(52, 152, 219, 0.05)',
    borderRadius: 60,
    bottom: '10%',
    left: '5%',
  },
  formContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  animationContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e508d',
    marginBottom: 8,
  },
  required: {
    color: '#e74c3c',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#d1d8e0',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
