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

const Withdraw = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
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

  const handleWithdraw = async () => {
    const token = await AsyncStorage.getItem('access_token');
    setIsSubmitting(true);
    if (!token) {
      Alert.alert('Error', 'No access token found');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/transactions/withdrawal',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            account_number: accountNumber,
            amount: parseFloat(amount),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(
          errorData.error || 'Withdrawal failed. Please check your amount.'
        );
      } else {
        const data = await response.json();
        Alert.alert('Success', data.message || 'Withdrawal successful');
        setAmount('');
        //navigation.navigate('UserDashboard');
      }
    } catch (error) {
      setMessage('Withdrawal failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Withdraw Funds</Text>

      <TextInput
        style={styles.input}
        placeholder="Account Number"
        value={accountNumber}
        editable={false}
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
        onKeyPress={(e) => {
          if (
            ['e', 'E', '+', '-', '.'].includes(e.nativeEvent.key) &&
            amount === ''
          ) {
            e.preventDefault();
          }
        }}
      />
      <TouchableOpacity
        style={[styles.button, isSubmitting && styles.buttonDisabled]}
        onPress={handleWithdraw}
        disabled={isSubmitting}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? 'Submitting...' : 'Submit Withdrawal'}
        </Text>
      </TouchableOpacity>

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

export default Withdraw;

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
  message: {
    marginTop: 10,
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
  },
});
