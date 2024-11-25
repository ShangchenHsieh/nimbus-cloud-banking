import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const Deposit = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [checkNum, setCheckNum] = useState('');
  const [checkImage, setCheckImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAccountNumber = async () => {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        console.error('No access token found');
        return;
      }

      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const id = decodedToken.user_id;

        const response = await fetch(
          `http://127.0.0.1:8000/account/account-number/${id}/`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setAccountNumber(data.account_number[0]);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchAccountNumber();
  }, []);

  const handleDeposit = async () => {
    const token = await AsyncStorage.getItem('access_token');
    setIsSubmitting(true);
    if (!token) {
      Alert.alert('Error', 'No access token found');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/transactions/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          account_number: accountNumber,
          amount: parseFloat(amount),
        }),
      });

      if (!response.ok) {
        setMessage('Please enter a valid amount.');
        setIsSubmitting(false);
      } else {
        const data = await response.json();
        console.log(data);
        Alert.alert('Success', 'Deposit submitted successfully');
        setAmount('');
        setCheckNum('');
        //navigation.navigate('UserDashboard');
      }
    } catch (error) {
      setMessage('Deposit failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      setCheckImage(result.assets[0].uri);
    } else {
      setMessage('Image upload canceled or failed.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deposit Funds</Text>

      <TextInput
        style={styles.input}
        placeholder="Account Number"
        value={accountNumber}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Check Number"
        keyboardType="numeric"
        value={checkNum}
        onChangeText={(value) => {
          if (/^\d*$/.test(value)) {
            setCheckNum(value);
          }
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={(value) => {
          if (/^\d*\.?\d{0,2}$/.test(value)) {
            setAmount(value);
          }
        }}
      />
      <TouchableOpacity
        style={[styles.button, isSubmitting && styles.buttonDisabled]}
        onPress={handleDeposit}
        disabled={isSubmitting}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? 'Submitting...' : 'Submit Deposit'}
        </Text>
      </TouchableOpacity>

      <View style={styles.fileUpload}>
        <TouchableOpacity onPress={handleImageUpload}>
          <Text style={styles.uploadLabel}>Upload Check Image</Text>
        </TouchableOpacity>
      </View>

      {checkImage && (
        <View style={styles.imagePreview}>
          <Text style={styles.previewTitle}>Check Image Preview:</Text>
          <Image source={{ uri: checkImage }} style={styles.previewImage} />
        </View>
      )}

      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

export default Deposit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#003349',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '90%',
    padding: 12,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#ebeff0',
    borderRadius: 8,
    backgroundColor: '#f7f9fc',
    color: '#555',
    fontSize: 16,
  },
  button: {
    width: '90%',
    padding: 12,
    backgroundColor: '#007bbd',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#a0c8e6',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  fileUpload: {
    marginTop: 20,
    alignItems: 'center',
  },
  uploadLabel: {
    fontSize: 16,
    color: '#555',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f7f9fc',
    borderWidth: 2,
    borderColor: '#ebeff0',
  },
  imagePreview: {
    marginTop: 20,
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#003349',
  },
  previewImage: {
    width: 300,
    height: 200,
    borderRadius: 8,
  },
  message: {
    marginTop: 10,
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
  },
});
