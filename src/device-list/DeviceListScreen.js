import React from 'react';
import {Button, Toast, Center, Flex} from 'native-base';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {View, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {
  requestAccessFineLocationPermission,
  requestBluetoothPermission,
  requestBluetoothScanPermission,
} from '../utils/permissions';
import {BluetoothContext} from '../context';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import assets from '../../assets';
import MyText from '../components/MyText';
import {Linking} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import RotatingIcon from '../components/RotatingIcon';

export default class DeviceListScreen extends React.Component {
  static contextType = BluetoothContext;
  constructor(props) {
    super(props);

    this.state = {
      devices: [],
      accepting: false,
      discovering: false,
      showSplashScreen: true,
      isRotating: false,
    };
    this.animation = React.createRef();
  }

  componentDidMount() {
    this.props.navigation.getParent()?.setOptions({
      tabBarStyle: {display: 'none'},
    });

    setTimeout(() => {
      this.setState({showSplashScreen: false});
    }, 1700);
    this.animation?.current?.play();

    this.getBondedDevices();
    requestBluetoothScanPermission();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.showSplashScreen === false) {
      this.props.navigation.getParent()?.setOptions({
        tabBarStyle: {backgroundColor: '#ffffff', height: 60},
      });
    }
  }

  componentWillUnmount() {
    if (this.state.accepting) {
      this.cancelAcceptConnections(false);
    }

    if (this.state.discovering) {
      this.cancelDiscovery(false);
    }

    this.props.navigation.getParent()?.setOptions({
      tabBarStyle: {backgroundColor: '#ffffff', height: 60},
    });
  }

  getBondedDevices = async unloading => {
    console.log('DeviceListScreen::getBondedDevices');
    let granted = await requestBluetoothPermission();

    if (!granted) {
      throw new Error('Bluetooth Access was not granted');
    }

    try {
      let bonded = await RNBluetoothClassic.getBondedDevices();
      console.log('DeviceListScreen::getBondedDevices found', bonded);

      if (!unloading) {
        this.setState({devices: bonded});
      }
    } catch (error) {
      this.setState({devices: []});

      Toast.show({
        description: error.message,
        duration: 5000,
      });
    }
  };

  acceptConnections = async () => {
    if (this.state.accepting) {
      Toast.show({
        description: 'Already accepting connections',
        duration: 5000,
      });

      return;
    }

    this.setState({accepting: true});

    try {
      let device = await RNBluetoothClassic.accept({delimiter: '\r'});
      if (device) {
        this.context.selectDevice(device);
      }
    } catch (error) {
      // If we're not in an accepting state, then chances are we actually
      // requested the cancellation.  This could be managed on the native
      // side but for now this gives more options.
      if (!this.state.accepting) {
        Toast.show({
          description: 'Attempt to accept connection failed.',
          duration: 5000,
        });
      }
    } finally {
      this.setState({accepting: false});
    }
  };

  cancelAcceptConnections = async () => {
    if (!this.state.accepting) {
      return;
    }

    try {
      let cancelled = await RNBluetoothClassic.cancelAccept();
      this.setState({accepting: !cancelled});
    } catch (error) {
      Toast.show({
        description: 'Unable to cancel accept connection',
        duration: 2000,
      });
    }
  };

  startDiscovery = async () => {
    this.setState({isRotating: true});
    try {
      let granted = await requestAccessFineLocationPermission();

      if (!granted) {
        throw new Error('Access fine location was not granted');
      }

      this.setState({discovering: true});

      let devices = [...this.state.devices];

      try {
        let unpaired = await RNBluetoothClassic.startDiscovery();

        let index = devices.findIndex(d => !d.bonded);
        if (index >= 0) {
          devices.splice(index, devices.length - index, ...unpaired);
        } else {
          devices.push(...unpaired);
        }

        Toast.show({
          description: `Found ${unpaired.length} unpaired devices.`,
          duration: 2000,
        });
      } finally {
        this.setState({devices, discovering: false});
        this.setState({isRotating: false});
      }
    } catch (err) {
      Toast.show({
        description: err.message,
        duration: 2000,
      });
    }
  };

  cancelDiscovery = async () => {
    try {
    } catch (error) {
      Toast.show({
        description:
          'Error occurred while attempting to cancel discover devices',
        duration: 2000,
      });
    }
  };

  requestEnabled = async () => {
    try {
    } catch (error) {
      Toast.show({
        description: `Error occurred while enabling bluetooth: ${error.message}`,
        duration: 2000,
      });
    }
  };

  renderSplashScreen = () => {
    return (
      <SafeAreaProvider
        style={{
          backgroundColor: '#3259CB',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={{height: 240, alignItems: 'center'}}>
          <LottieView
            style={{height: '100%'}}
            ref={this.animation}
            autoplay={true}
            loop={true}
            source={assets.lottieFiles.bluetoothCircles}
          />
        </View>
      </SafeAreaProvider>
    );
  };

  renderDeviceList = () => {
    return (
      <SafeAreaProvider>
        <View
          style={{
            height: 60,
            backgroundColor: '#3259CB',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            paddingHorizontal: 20,
          }}>
          <MyText
            style={{
              color: '#ffffff',
              fontSize: 18,
              fontWeight: '700',
            }}>
            Nearby Devices
          </MyText>
          {/* <TouchableOpacity onPress={() => this.startDiscovery()}>
            <FontAwesome
              name="refresh"
              size={16}
              color="#ffffff"
              style={{marginRight: 6}}
            />
          </TouchableOpacity> */}
          <RotatingIcon
            isRotating={this.state.isRotating}
            onPress={this.startDiscovery}
          />
        </View>
        <View>
          {this.context.bluetoothEnabled ? (
            <DeviceList
              devices={this.state.devices}
              onPress={this.context.selectDevice}
              navigation={this.props.navigation}
            />
          ) : (
            <View style={{paddingVertical: 10}}>
              <Center>
                <MyText
                  style={{color: '#323232', fontSize: 16, letterSpacing: -0.5}}>
                  Please enable Bluetooth to use this feature.
                </MyText>
                <Button
                  backgroundColor={'#3460D7'}
                  borderRadius={30}
                  width={130}
                  style={{marginTop: 14}}
                  onPress={() => {
                    Linking.sendIntent('android.settings.BLUETOOTH_SETTINGS');
                  }}>
                  <MyText style={{color: '#ffffff', fontSize: 12}}>
                    Enable Bluetooth
                  </MyText>
                </Button>
              </Center>
            </View>
          )}
        </View>
      </SafeAreaProvider>
    );
  };

  render() {
    return (
      <>
        {this.state.showSplashScreen
          ? this.renderSplashScreen()
          : this.renderDeviceList()}
      </>
    );
  }
}

export const DeviceList = ({devices, onPress, onLongPress, navigation}) => {
  const renderItem = ({item}) => {
    return (
      <DeviceListItem
        device={item}
        onPress={() => onPress(item, navigation)}
        onLongPress={onLongPress}
      />
    );
  };

  return (
    <FlatList
      data={devices}
      renderItem={renderItem}
      keyExtractor={item => item.address}
    />
  );
};

const DeviceListItem = ({device, onPress, onLongPress}) => {
  let bgColor = device.connected ? '#0f0' : '#000';
  let icon = device.bonded ? 'ios-bluetooth' : 'ios-cellular';

  return (
    <View style={styles.deviceListItem}>
      <Flex flexDirection="row" justifyContent="space-between" flexGrow={1}>
        <MyText style={{color: '#323232', fontWeight: '400'}}>
          {device.name}
        </MyText>

        <TouchableOpacity
          onPress={() => onPress(device)}
          onLongPress={() => onLongPress(device)}>
          <MyText
            style={{color: '#3460D7', fontWeight: '500', letterSpacing: 0.3}}>
            CONNECT
          </MyText>
        </TouchableOpacity>
      </Flex>
    </View>
  );
};

const styles = StyleSheet.create({
  deviceListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 60,
    borderBottomWidth: 0.5,
    borderBottomColor: '#A6A6A6',
  },
  deviceListItemIcon: {
    paddingVertical: 8,
    paddingRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
