import React from 'react';
import {Box, NativeBaseProvider} from 'native-base';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
//import getTheme from './native-base-theme/components';
//import platform from './native-base-theme/variables/platform';
import ConnectionScreen from './../connection/ConnectionScreen';
import DeviceListScreen from './../device-list/DeviceListScreen';
import HealthScreen from './../pages/HealthScreen.js';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      device: undefined,
      bluetoothEnabled: true,
    };
  }

  /**
   * Sets the current device to the application state.  This is super basic
   * and should be updated to allow for things like:
   * - multiple devices
   * - more advanced state management (redux)
   * - etc
   *
   * @param device the BluetoothDevice selected or connected
   */
  selectDevice = device => {
    console.log('App::selectDevice() called with: ', device);
    this.setState({device});
  };

  /**
   * On mount:
   *
   * - setup the connect and disconnect listeners
   * - determine if bluetooth is enabled (may be redundant with listener)
   */
  async componentDidMount() {
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

  /**
   * Performs check on bluetooth being enabled.  This removes the `setState()`
   * from `componentDidMount()` and clears up lint issues.
   */
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

  /**
   * Clear subscriptions
   */
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

  /**
   * Handle state change events.
   *
   * @param stateChangedEvent event sent from Native side during state change
   */
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
    if (route.name === 'HealthStack') {
      iconName = focused ? 'heart-circle' : 'heart-circle-outline';
    } else if (route.name === 'FitnessStack') {
      iconName = 'meditation';
    } else if (route.name === 'ManageStack') {
      iconName = 'watch-variant';
    }
    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
  }

  renderHealthScreen() {
    return (
      <DeviceListScreen
        bluetoothEnabled={this.state.bluetoothEnabled}
        selectDevice={this.selectDevice}
      />
    );
  }

  renderSettingsScreen() {
    return (
      <ConnectionScreen
        device={this.state.device}
        onBack={() => this.setState({device: undefined})}
      />
    );
  }

  HealthStack() {
    return (
      <Stack.Navigator
        initialRouteName="Health"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Health" component={HealthScreen} />
      </Stack.Navigator>
    );
  }

  ManageStack() {
    return (
      <Stack.Navigator
        initialRouteName="Manage"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Manage" component={HealthScreen} />
      </Stack.Navigator>
    );
  }

  render() {
    return (
      <NativeBaseProvider>
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName="Feed"
            screenOptions={({route}) => ({
              headerStyle: {backgroundColor: '#5c9405'},
              headerTintColor: '#fff',
              headerTitleStyle: {fontWeight: 'bold'},
              tabBarActiveTintColor: '#5c9405',
              tabBarInactiveTintColor: 'gray',
              tabBarIcon: props => this.tabBarIcon(route, props),
            })}>
            <Tab.Screen
              name="HealthStack"
              component={this.HealthStack}
              options={{
                tabBarLabel: 'Health',
                title: 'Health',
              }}
            />
            <Tab.Screen
              name="FitnessStack"
              component={this.HealthStack}
              options={{
                tabBarLabel: 'Fitness',
                title: 'Fitness',
              }}
            />
            <Tab.Screen
              name="ManageStack"
              component={this.ManageStack}
              options={{
                tabBarLabel: 'Manage',
                title: 'Manage',
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    );
    return (
      <NativeBaseProvider>
        <Box>
          {!this.state.device ? (
            <DeviceListScreen
              bluetoothEnabled={this.state.bluetoothEnabled}
              selectDevice={this.selectDevice}
            />
          ) : (
            <ConnectionScreen
              device={this.state.device}
              onBack={() => this.setState({device: undefined})}
            />
          )}
        </Box>
      </NativeBaseProvider>
    );
  }
}
