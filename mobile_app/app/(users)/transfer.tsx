import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const UserTransfer = () => {
  const [sourceAccountNumber, setSourceAccountNumber] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [amount, setAmount] = useState('');
  const [destinationAccountNumber, setDestinationAccountNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchSourceAccountNumber = async () => {
      try {
        const accountNumber = await AsyncStorage.getItem('currentAccountNumber');
        setSourceAccountNumber(accountNumber || 'Unavailable');
      } catch (error) {
        console.error('Failed to load source account number:', error);
        setSourceAccountNumber('Unavailable');
      }
    };

    fetchSourceAccountNumber();
  }, []);

  const handleTransfer = async () => {
    setIsSubmitting(true);
    const token = await AsyncStorage.getItem('access_token');

    if (!token) {
      console.error('No access token found');
      setError('User not authenticated.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/transactions/internal-transfer/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            source_account_number: sourceAccountNumber,
            destination_account_number: destinationAccountNumber,
            amount: parseFloat(amount),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error details:', errorData);
        setError(errorData.error || 'Transfer failed.');
      } else {
        const data = await response.json();
        console.log(data);
        setMessage('Transfer successful!');
        setError('');
        setDestinationAccountNumber('');
        setAmount('');
        //navigation.navigate('UserDashboard');
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      setError('Transfer failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transfer Funds</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.text}>
          Source Account: {sourceAccountNumber || 'Loading...'}
        </Text>
        <View style={styles.inputGroup}>
          <Text style={styles.text}>Destination Account Number:</Text>
          <TextInput
            style={styles.inputBox}
            value={destinationAccountNumber}
            keyboardType="numeric"
            onChangeText={(value) => {
              if (/^\d*$/.test(value)) {
                setDestinationAccountNumber(value);
              }
            }}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.text}>Amount:</Text>
          <TextInput
            style={styles.inputBox}
            value={amount}
            placeholder="Amount"
            keyboardType="numeric"
            onChangeText={(value) => {
              if (/^\d*\.?\d{0,2}$/.test(value)) {
                setAmount(value);
              }
            }}
          />
        </View>
        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleTransfer}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? 'Submitting...' : 'Transfer Now'}
          </Text>
        </TouchableOpacity>
        {message ? <Text style={styles.successMessage}>{message}</Text> : null}
        {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
      </View>
    </View>
  );
};

export default UserTransfer;

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
    color: '#555',
    marginBottom: 20,
  },
  detailsContainer: {
    width: '100%',
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  inputBox: {
    width: '100%',
    padding: 10,
    borderWidth: 2,
    borderColor: '#ebeff0',
    borderRadius: 10,
    fontSize: 14,
    color: '#555',
    backgroundColor: '#f7f9fc',
  },
  button: {
    width: '100%',
    padding: 12,
    backgroundColor: '#003349',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#a0c8e6',
  },
  buttonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  successMessage: {
    marginTop: 15,
    fontSize: 16,
    color: '#2ecc71',
  },
  errorMessage: {
    marginTop: 15,
    fontSize: 16,
    color: '#e74c3c',
  },
});
