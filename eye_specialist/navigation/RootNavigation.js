import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import BottomTabs from './BottomTabs';
import ResultScreen from '../screens/ResultScreen';
import SymptomCheckScreen from '../screens/SymptomCheckScreen';
import UploadImageScreen from '../screens/UploadImageScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfile from '../screens/EditProfile';
import AppSettings from '../screens/AppSettings';
import HelpCenter from '../screens/HelpCenter';
import EducationScreen from '../screens/EducationScreen';
import CameraScreen from '../screens/CameraScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigation() {
  return (
    <Stack.Navigator initialRouteName="Login" >
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{headerShown: false}}/>
      <Stack.Screen name="Main" component={BottomTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Result" component={ResultScreen} />
      <Stack.Screen name="Symptoms" component={SymptomCheckScreen} options={{ title: 'Symptom Checker' }} />
      <Stack.Screen name="Upload" component={UploadImageScreen}  />
      <Stack.Screen name="Camera" component={CameraScreen} options={{ title: 'Capture Image' }} />
      <Stack.Screen name="Education" component={EducationScreen} options={{ title: 'Eye Education' }} />
      <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'History' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      <Stack.Screen name="EditProfile" component={EditProfile} options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="AppSettings" component={AppSettings} options={{ title: 'App Settings', headerShown: true }} />
      <Stack.Screen name="HelpCenter" component={HelpCenter} options={{ title: 'Help Center' }} />
    </Stack.Navigator>
  );
}
