import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { auth } from '../configs/firebaseConfig';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      console.log('login error, missing fields');
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    console.log('login attempt with', email, password);

    setIsLoading(true);
   try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    console.log('Login success:', userCredential.user);

    navigation.replace('Main');
  } catch (error) {
    console.error('Login error:', error);
    
    let message = 'Something went wrong. Please try again.';
    if (error.code === 'auth/user-not-found') {
      message = 'No user found with this email.';
    } else if (error.code === 'auth/wrong-password') {
      message = 'Incorrect password.';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Invalid email format.';
    }

    Alert.alert('Login Failed', message);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eye Specialist</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

    <View style={styles.passwordContainer}>
      <TextInput
        style={styles.passwordInput}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!passwordVisible}
      />
       <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
    <Text style={styles.toggleText}>
      {passwordVisible ? 'Hide' : 'Show'}
    </Text>
  </TouchableOpacity>
    </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.linkText}>
          Don't have an account? Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a73e8',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  passwordContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 8,
  paddingHorizontal: 10,
  marginBottom: 15,
},
passwordInput: {
  flex: 1,
  height: 50,
  fontSize: 16,
},
toggleText: {
  color: '#1a73e8',
  fontWeight: '500',
  marginLeft: 10,
},
  button: {
    backgroundColor: '#1a73e8',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkText: {
    color: '#1a73e8',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
});