import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const UserPayment = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accountTypes, setAccountTypes] = useState([]);
  const [selectedAccountType, setSelectedAccountType] = useState('checking');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [fee, setFee] = useState('0');
  const [amountWithFee, setAmountWithFee] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigation = useNavigation();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setMessage('');
  };

  useEffect(() => {
    const parsedAmount = parseFloat(amount) || 0;
    const calculatedFee = parsedAmount * 0.02; // Fee is 2% of the entered amount
    setFee(calculatedFee.toFixed(2));
    setAmountWithFee(parsedAmount > 0 ? (parsedAmount + calculatedFee).toFixed(2) : '0.00');
  }, [amount]);

  useEffect(() => {
    const fetchAccountTypes = async () => {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        console.error('No access token found');
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/account/account-types/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setAccountTypes(data);
      } catch (error) {
        console.error('Error fetching account types:', error);
      }
    };

    fetchAccountTypes();
  }, []);

  useEffect(() => {
    const fetchAccountInfo = async () => {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        console.error('No access token found');
        return;
      }

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/account/account-info/${selectedAccountType}/`,
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
        setAccountNumber(data.account_number);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    fetchAccountInfo();
  }, [selectedAccountType]);

  const handleWithdraw = async () => {
    const token = await AsyncStorage.getItem('access_token');
    setIsSubmitting(true);

    if (!token) {
      console.error('No access token found');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/transactions/withdrawal', {
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
        const errorData = await response.json();
        setMessage(errorData.error || 'Payment failed. Please check your amount.');
      } else {
        const data = await response.json();
        setMessage('Payment successful. Redirecting to dashboard.');
        //setTimeout(() => navigation.navigate('UserDashboard'), 2000);
      }
    } catch (error) {
      setMessage('Payment failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bill Payments</Text>
      <View style={styles.detailsContainer}>
        <View style={styles.paymentContainer}>
          <View style={styles.item}>
            <Text style={styles.text}>Payment Method:</Text>
            <Picker
              style={styles.selector}
              selectedValue={selectedAccountType}
              onValueChange={(value) => setSelectedAccountType(value)}
            >
              {accountTypes.map((type) => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          </View>
          <View style={styles.item}>
            <Text style={styles.text}>Enter Amount:</Text>
            <TextInput
              style={styles.input}
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
          <View style={styles.prototypeNote}>
            <Text style={styles.note}>
              NOTE: This feature is a prototype and would typically be
              connected to a third-party service such as a rent portal or other
              billing system.
            </Text>
          </View>
          <TouchableOpacity style={styles.payNowButton} onPress={openModal}>
            <Text style={styles.payNowText}>Pay Now</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.breakdownContainer}>
          <Text style={styles.title}>Breakdown</Text>
          <View style={styles.breakdownItem}>
            <Text style={styles.textLeft}>Maintenance</Text>
            <Text style={styles.textRight}>${amount}</Text>
          </View>
          <View style={styles.breakdownItem}>
            <Text style={styles.textLeft}>Transaction Fee</Text>
            <Text style={styles.textRight}>${fee}</Text>
          </View>
          <View style={styles.line} />
          <View style={styles.breakdownItem}>
            <Text style={styles.textLeft}>Total</Text>
            <Text style={styles.textRight}>${amountWithFee}</Text>
          </View>
        </View>
      </View>
      <Modal visible={isModalOpen} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Payment</Text>
            <Text style={styles.modalText}>
              Are you sure you want to proceed with this payment of ${amountWithFee}?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleWithdraw}
                disabled={isSubmitting}
              >
                <Text style={styles.modalButtonText}>Confirm Payment</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={closeModal}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
            {message && (
              <Text
                style={[
                  message.includes('successful') ? styles.successMessage : styles.errorMessage,
                ]}
              >
                {message}
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UserPayment;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f7f9fc',
      padding: 20,
    },
    title: {
      fontSize: 24,
      color: '#555',
      marginBottom: 20,
      textAlign: 'center', // Center the title
    },
    detailsContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start', // Align items at the top
    },
    paymentContainer: {
      flex: 1,
      marginRight: 10, // Add spacing between payment and breakdown containers
    },
    breakdownContainer: {
      width: '45%', // Adjust width for better balance
      padding: 10,
      backgroundColor: '#f9fbfc',
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#ebeff0',
    },
    item: {
      marginBottom: 15,
    },
    text: {
      fontSize: 16,
      color: '#555',
      marginBottom: 8,
    },
    selector: {
      backgroundColor: '#f9fbfc',
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#ebeff0',
      fontSize: 14,
      padding: 8,
      width: '100%', // Ensure the picker spans the full width
    },
    input: {
      backgroundColor: '#f9fbfc',
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#ebeff0',
      padding: 10,
      fontSize: 14,
      width: '100%', // Ensure the input spans the full width
    },
    prototypeNote: {
      marginVertical: 10,
    },
    note: {
      fontSize: 14,
      color: '#555',
      textAlign: 'center', // Center the note text
    },
    payNowButton: {
      backgroundColor: '#003349',
      borderRadius: 10,
      padding: 15,
      alignItems: 'center',
      marginTop: 20,
    },
    payNowText: {
      color: '#fff',
      fontSize: 16,
    },
    breakdownItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    line: {
      height: 1,
      backgroundColor: '#555',
      marginVertical: 10,
    },
    textLeft: {
      fontSize: 16,
      color: '#555',
    },
    textRight: {
      fontSize: 16,
      color: '#555',
      textAlign: 'right', // Align amounts to the right
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      width: '80%', // Adjust modal width for better responsiveness
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    modalText: {
      fontSize: 16,
      color: '#333',
      marginBottom: 20,
      textAlign: 'center',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
    modalButton: {
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      width: '45%',
    },
    confirmButton: {
      backgroundColor: '#28a745',
    },
    cancelButton: {
      backgroundColor: '#dc3545',
    },
    modalButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: 'bold',
    },
    successMessage: {
      color: '#28a745',
      fontSize: 16,
      marginTop: 10,
      textAlign: 'center',
    },
    errorMessage: {
      color: '#dc3545',
      fontSize: 16,
      marginTop: 10,
      textAlign: 'center',
    },
  });  
