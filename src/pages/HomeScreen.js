import React, {createContext, useState} from 'react';
import {Box, NativeBaseProvider} from 'native-base';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
//import getTheme from './native-base-theme/components';
//import platform from './native-base-theme/variables/platform';
import ConnectionScreen from './../connection/ConnectionScreen';
import DeviceListScreen from './../device-list/DeviceListScreen';
import HealthScreen from './../pages/HealthScreen.js';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LoginScreen from './LoginScreen.js';
import IntroScreen from './IntroScreen.js';
import OnBoardingScreen from './OnBoardingScreen';
import Questionnaire from './Questionnaire';
import {BluetoothContext, AuthContext, MainContext} from '../context';
import ActivityScreen from './ActivityScreen';
import NutritionScreen from './NutritionScreen';
import NotificationScreen from './NotificationScreen';
import ProfileScreen from './ProfileScreen';
import {TouchableOpacity, View} from 'react-native';
import {
  AddMember,
  CheckZipCode,
  LocateMe,
  MembersList,
  ScheduleTest,
} from './BookTest';
import VirtualProfilesList from './VirtualProfilesList';
import {getActiveEmail, getMasterEmail} from '../utils/user';
import {clearAsyncStorage} from '../utils/asyncStorage';
import {isEmailValid} from '../utils/validations';
import ChooseLanguage from './ChooseLanguage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      device: undefined,
      bluetoothEnabled: true,
      isVirtualProfileModalOpen: false,
      activeEmail: '',
    };
    this.setState = this.setState.bind(this);
  }

  selectDevice = (device, navigation) => {
    console.log('App::selectDevice() called with: ', device);
    this.setState({device}, () => {
      navigation.navigate('ConnectionScreen');
    });
  };

  async checkUserLoggedin() {
    let master_email = await getMasterEmail();
    let active_email = await getActiveEmail();

    if (
      master_email &&
      active_email &&
      isEmailValid(master_email) &&
      isEmailValid(active_email)
    ) {
      this.setState({
        activeEmail: active_email,
        isAuthenticated: true,
      });
    } else {
      clearAsyncStorage();
      this.setState({isAuthenticated: false});
    }
  }

  async componentDidMount() {
    this.checkUserLoggedin();
    console.log(
      'App::componentDidMount adding listeners: onBluetoothEnabled and onBluetoothDistabled',
    );
    console.log(
      'App::componentDidMount alternatively could use onStateChanged',
    );
    this.enabledSubscription = RNBluetoothClassic.onBluetoothEnabled(event =>
      this.onStateChanged(event),
    );
    this.disabledSubscription = RNBluetoothClassic.onBluetoothDisabled(event =>
      this.onStateChanged(event),
    );

    this.checkBluetootEnabled();
  }

  async checkBluetootEnabled() {
    try {
      console.log('App::componentDidMount Checking bluetooth status');
      let enabled = await RNBluetoothClassic.isBluetoothEnabled();

      console.log(`App::componentDidMount Status: ${enabled}`);
      this.setState({bluetoothEnabled: enabled});
    } catch (error) {
      console.log('App::componentDidMount Status Error: ', error);
      this.setState({bluetoothEnabled: false});
    }
  }

  componentWillUnmount() {
    console.log(
      'App:componentWillUnmount removing subscriptions: enabled and distabled',
    );
    console.log(
      'App:componentWillUnmount alternatively could have used stateChanged',
    );
    this.enabledSubscription.remove();
    this.disabledSubscription.remove();
  }

  onStateChanged(stateChangedEvent) {
    console.log(
      'App::onStateChanged event used for onBluetoothEnabled and onBluetoothDisabled',
    );

    this.setState({
      bluetoothEnabled: stateChangedEvent.enabled,
      device: stateChangedEvent.enabled ? this.state.device : undefined,
    });
  }

  tabBarIcon(route, {focused, color, size}) {
    let iconName;
    if (route.name === 'HomeStack') {
      iconName = focused ? 'home-variant' : 'home-outline';
    } else if (route.name === 'ActivityStack') {
      iconName = 'run-fast';
    } else if (route.name === 'NutritionStack') {
      iconName = focused ? 'food-apple' : 'food-apple-outline';
    } else if (route.name === 'Notification') {
      iconName = focused ? 'bell' : 'bell-outline';
    } else if (route.name === 'Profile') {
      iconName = focused ? 'person' : 'person-outline';
      return <Ionicons name={iconName} size={size} color={color} />;
    }
    return (
      <View>
        <MaterialCommunityIcons name={iconName} size={size} color={color} />
      </View>
    );
  }

  HealthStack() {
    return (
      <Stack.Navigator
        initialRouteName="Health"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Health" component={HealthScreen} />
        <Stack.Screen name="DeviceListScreen" component={DeviceListScreen} />
        <Stack.Screen name="ConnectionScreen" component={ConnectionScreen} />
        <Stack.Screen name="OnBoarding" component={OnBoardingScreen} />
        <Stack.Screen
          name="VirtualProfilesList"
          component={VirtualProfilesList}
        />
      </Stack.Navigator>
    );
  }

  ActivityStack() {
    return (
      <Stack.Navigator
        initialRouteName="ActivityScreen"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="ActivityScreen" component={ActivityScreen} />
      </Stack.Navigator>
    );
  }

  NutritionStack() {
    return (
      <Stack.Navigator
        initialRouteName="NutritionScreen"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="NutritionScreen" component={NutritionScreen} />
      </Stack.Navigator>
    );
  }

  NotificationStack() {
    return (
      <Stack.Navigator
        initialRouteName="NotificationScreen"
        screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
        />
      </Stack.Navigator>
    );
  }

  ProfileStack() {
    return (
      <Stack.Navigator
        initialRouteName="ProfileScreen"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="CheckZipCode" component={CheckZipCode} />
        <Stack.Screen name="MembersList" component={MembersList} />
        <Stack.Screen name="AddMember" component={AddMember} />
        <Stack.Screen name="LocateMe" component={LocateMe} />
        <Stack.Screen name="ScheduleTest" component={ScheduleTest} />
        <Stack.Screen name="Questionnaire" component={Questionnaire} />
      </Stack.Navigator>
    );
  }

  tabStack() {
    return (
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({route}) => ({
          headerShown: false,
          //  headerTintColor: '#fff',
          //  headerTitleStyle: {fontWeight: 'bold'},
          tabBarActiveTintColor: '#000000',
          tabBarInactiveTintColor: 'gray',
          tabBarIcon: e => this.tabBarIcon(route, e),
          tabBarStyle: {
            backgroundColor: '#ffffff',
            height: 60,
          },
          tabBarItemStyle: {
            marginBottom: 6,
            borderTopWidth: !true ? 1 : 0,
          },
          defaultNavigationOptions: {
            tabBarVisible: false,
          },
          tabBarButton: props => {
            if (route.name === 'Profile') {
              return (
                <TabBarButton
                  {...props}
                  onLongPress={() =>
                    this.setState({isVirtualProfileModalOpen: true})
                  }
                />
              );
            }
            return <TabBarButton {...props} />;
          },
        })}>
        <Tab.Screen
          name="HomeStack"
          component={this.HealthStack}
          options={{
            tabBarLabel: 'Home',
            title: 'Home',
          }}
        />
        <Tab.Screen
          name="ActivityStack"
          component={this.ActivityStack}
          options={{
            tabBarLabel: 'Activity',
            title: 'Activity',
          }}
        />
        <Tab.Screen
          name="NutritionStack"
          component={this.NutritionStack}
          options={{
            tabBarLabel: 'Nutrition',
            title: 'Nutrition',
          }}
        />
        <Tab.Screen
          name="Notification"
          component={this.NotificationStack}
          options={{
            tabBarLabel: 'Notification',
            title: 'Notification',
          }}
        />
        <Tab.Screen
          name="Profile"
          component={this.ProfileStack}
          options={{
            tabBarLabel: 'Profile',
            title: 'Profile',
          }}
        />
      </Tab.Navigator>
    );
  }

  authStack() {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="IntroScreen" component={IntroScreen} />
        <Stack.Screen name="ChooseLanguage" component={ChooseLanguage} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="OnBoarding" component={OnBoardingScreen} />
      </Stack.Navigator>
    );
  }

  onBack(navigation, screen) {
    navigation.navigate(screen);
  }

  authenticate() {
    this.setState({isAuthenticated: true});
  }

  render() {
    return (
      <MainContext.Provider
        value={{
          isVirtualProfileModalOpen: this.state.isVirtualProfileModalOpen,
          activeEmail: this.state.activeEmail,
          setState: this.setState,
        }}>
        <AuthContext.Provider
          value={{
            isAuthenticated: this.state.isAuthenticated,
            authenticate: this.authenticate,
            setState: this.setState,
          }}>
          <BluetoothContext.Provider
            value={{
              selectDevice: this.selectDevice,
              onBack: this.onBack,
              bluetoothEnabled: this.state.bluetoothEnabled,
              device: this.state.device,
            }}>
            <NativeBaseProvider>
              <NavigationContainer>
                {this.state.isAuthenticated
                  ? this.tabStack()
                  : this.authStack()}
              </NavigationContainer>
            </NativeBaseProvider>
          </BluetoothContext.Provider>
        </AuthContext.Provider>
      </MainContext.Provider>
    );
  }
}

class TabBarButton extends React.Component {
  render() {
    const {accessibilityState, children, onPress, onLongPress} = this.props;
    const focused = accessibilityState.selected;
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          margin: 6,
        }}
        onPress={onPress}
        onLongPress={onLongPress}>
        {children}
      </TouchableOpacity>
    );
  }
}
