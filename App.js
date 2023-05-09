
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import HomeScreen from './screens/HomeScreen';
import { store } from './store';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MapScreen from './screens/MapScreen';
import LandingScreen from './screens/LandingScreen';
import SignnInScreen from './screens/SignInScreen';
import MechanicScreen from './screens/MechanicScreen';
import UserScreen from './screens/UserScreen';
import ServiceRequestScreen from './screens/ServiceRequestScreen';
import { LogBox } from 'react-native';



//Set up REDUX

export default function App() {
  LogBox.ignoreLogs(['AsyncStorage has been extracted']);
    const Stack = createStackNavigator();

  return (
    <Provider store={store}>
      <NavigationContainer>
      <SafeAreaProvider>
          

        <Stack.Navigator>
        <Stack.Screen name="LandingScreen" component={LandingScreen}
          options={{
            headerShown: false
          }}
          />
          <Stack.Screen name="signInScreen" component={SignnInScreen} options={{
            headerShown: false,
          }}/>
          <Stack.Screen name="HomeScreen" component={HomeScreen}
          options={{
            headerShown: false,
          }}/>
          <Stack.Screen name="MapScreen" component={MapScreen}
          options={{
            headerShown: false,
          }}/>
          <Stack.Screen name="MechanicScreen" component={MechanicScreen}
          options={{
            headerShown: false,
          }}
          />
          <Stack.Screen name="UserScreen" component={UserScreen}
          options={{
            headerShown: false,
          }}
          />
          <Stack.Screen name="ServiceRequestScreen" component={ServiceRequestScreen}
          options={{
            headerShown: false,
          }}
          />
          
        </Stack.Navigator>
          
      </SafeAreaProvider>
      </NavigationContainer>

    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
