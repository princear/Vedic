import React from 'react';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import {Text, HStack, Icon, Box, IconButton, Toast} from 'native-base';
import {
  FlatList,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Buffer} from 'buffer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {BluetoothContext} from '../context';
import {getDataFromAsyncStorage} from '../utils/asyncStorage';
import {callPostApi} from '../utils/axios';
import BackgroundTimer from 'react-native-background-timer';
import MyText from '../components/MyText';
import {SafeAreaProvider} from 'react-native-safe-area-context';

export default class ConnectionScreen extends React.Component {
  static contextType = BluetoothContext;
  constructor(props) {
    super(props);

    this.state = {
      text: undefined,
      data: [],
      polling: false,
      connection: false,
      isRunning: false,
      intervalId: null,
      connectionOptions: {
        DELIMITER: '9',
      },
      dataReceived: 0
    };
  }

  startService() {
    const id = BackgroundTimer.setInterval(() => {
      this.initializeRead();
    }, 0);
    console.log('Started service with interval ID:', id);
    this.setState({isRunning: true, intervalId: id});
  }

  stopService() {
    console.log('Stopping service with interval ID:', this.state.intervalId);
    this.uninitializeRead();
    BackgroundTimer.clearInterval(this.state.intervalId);
    this.setState({isRunning: false, intervalId: null});
  }

  /**
   * Removes the current subscriptions and disconnects the specified
   * device.  It could be possible to maintain the connection across
   * the application, but for now the connection is within the context
   * of this screen.
   */
  async componentWillUnmount() {
    if (this.state.connection) {
      try {
        await this.context.state.device.disconnect();
      } catch (error) {
        // Unable to disconnect from device
      }
    }

    this.uninitializeRead();
  }

  /**
   * Attempts to connect to the provided device.  Once a connection is
   * made the screen will either start listening or polling for
   * data based on the configuration.
   */
  componentDidMount() {
    setTimeout(() => this.connect(), 0);
  }

  async connect() {
    try {
      let connection = await this.context.device.isConnected();
      if (!connection) {
        this.addData({
          data: `Attempting connection to ${this.context.device.address}`,
          timestamp: new Date(),
          type: 'error',
        });

        console.log(this.state.connectionOptions);
        connection = await this.context.device.connect();

        this.addData({
          data: 'Connection successful',
          timestamp: new Date(),
          type: 'info',
        });
      } else {
        this.addData({
          data: `Connected to ${this.context.device.address}`,
          timestamp: new Date(),
          type: 'error',
        });
      }

      this.setState({connection});
      this.initializeRead();
    } catch (error) {
      this.addData({
        data: `Connection failed: ${error.message}`,
        timestamp: new Date(),
        type: 'error',
      });
    }
  }

  async disconnect(disconnected) {
    try {
      if (!disconnected) {
        disconnected = await this.context.device.disconnect();
      }

      this.addData({
        data: 'Disconnected',
        timestamp: new Date(),
        type: 'info',
      });

      this.setState({connection: !disconnected});
    } catch (error) {
      this.addData({
        data: `Disconnect failed: ${error.message}`,
        timestamp: new Date(),
        type: 'error',
      });
    }

    // Clear the reads, so that they don't get duplicated
    this.uninitializeRead();
  }

  initializeRead() {
    this.disconnectSubscription = RNBluetoothClassic.onDeviceDisconnected(() =>
      this.disconnect(true),
    );

    if (this.state.polling) {
      this.readInterval = setInterval(() => this.performRead(), 5000);
    } else {
      this.readSubscription = this.context.device.onDataReceived(data =>
        this.onReceivedData(data),
      );
    }
  }

  /**
   * Clear the reading functionality.
   */
  uninitializeRead() {
    if (this.readInterval) {
      clearInterval(this.readInterval);
    }
    if (this.readSubscription) {
      this.readSubscription.remove();
    }
  }

  async getToken() {
    return await getDataFromAsyncStorage('token');
  }

  async postMetricData(data) {
    let user_id = await getDataFromAsyncStorage('active_email');
    const _data = {pulses: data, user_id: user_id};
    try {
      const url = `/v1/api/pulse-data`;
      const res = await callPostApi(url, _data);
      console.log('Data pushed successfully!', res);
    } catch (error) {
      Toast.show({
        description: JSON.stringify(error),
        duration: 5000,
      });
    }
    //  fetch('https://madmachines.datasyndicate.in/v1/api/pulse-data', {
    //    method: 'POST',
    //    body: json_data,
    //    headers: {
    //      Accept: 'application/json',
    //      'Content-Type': 'application/json',
    //      Authorization: 'Bearer ' + TOKEN,
    //    },
    //  })
    //    .then(resp => {})
    //    .catch(error => {});
  }

  async performRead() {
    try {
      console.log('Polling for available messages');
      let available = await this.context.device.available();
      console.log(`There is data available [${available}], attempting read`);
      if (available > 0) {
        let metricData = [];
        for (let i = 0; i < available; i++) {
          console.log(`reading ${i}th time`);
          let data = await this.context.device.read();
          let amount = data.match(/[+-]?\d+(\.\d+)?/g);
          let metric_amount = 0;
          if (amount && amount.length > 0) {
            metric_amount = parseFloat(amount[0]);
          }
          metricData.push({
            metric_name: 'kaf',
            amount: metric_amount,
            timestamp: new Date().getTime(),
          });
          console.log(`Read data ${data}`);
          console.log(data);
          this.onReceivedData({data});
        }

        this.postMetricData(metricData);
      }
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Handles the ReadEvent by adding a timestamp and applying it to
   * list of received data.
   *
   * @param {ReadEvent} event
   */
  async onReceivedData(event) {
    try {
      const metrics = JSON.parse(event?.data.split(':')[1]);
      const event_ts = event?.timestamp
            ? new Date(event?.timestamp).getTime()
            : new Date().getTime();
      let amount = event?.data?.match(/[+-]?\d+(\.\d+)?/g);
      let metric_amount = 0;
      if (amount && amount?.length > 0) {
        metric_amount = parseFloat(amount[0]);
      }
      let metric_data = [
        {
          metric_name: 'vat',
          amount: parseFloat(metrics[0]),
          timestamp: event_ts,
        },
        {
          metric_name: 'pit',
          amount: parseFloat(metrics[1]),
          timestamp: event_ts,
        },
        {
          metric_name: 'kaf',
          amount: parseFloat(metrics[2]),
          timestamp: event_ts,
        },
      ];
      this.setState({dataReceived: this.state.dataReceived + 1});
      // this.addData({
      //   ...event,
      //   data: 'received',
      //   timestamp: new Date(),
      //   type: 'receive',
      // });
      this.postMetricData(metric_data);
    } catch (err) {
      console.log(err);
    }
  }

  async addData(message) {
    this.setState({data: [message, ...this.state.data]});
  }

  /**
   * Attempts to send data to the connected Device.  The input text is
   * padded with a NEWLINE (which is required for most commands)
   */

  async sendData() {
    try {
      console.log(`Attempting to send data ${this.state.text}`);
      let message = this.state.text + '\r';
      await RNBluetoothClassic.writeToDevice(
        this.context.device.address,
        message,
      );

      this.addData({
        timestamp: new Date(),
        data: this.state.text,
        type: 'sent',
      });

      let data = Buffer.alloc(10, 0xef);
      await this.context.device.write(data);

      this.addData({
        timestamp: new Date(),
        data: `Byte array: ${data.toString()}`,
        type: 'sent',
      });

      this.setState({text: undefined});
    } catch (error) {
      console.log(error);
    }
  }

  async toggleConnection() {
    if (this.state.connection) {
      this.disconnect();
    } else {
      this.connect();
    }
  }

  render() {
    let toggleIcon = this.state.connection ? 'toggle-on' : 'toggle-off';

    return (
      <SafeAreaProvider style={{paddingBottom: 0}}>
        <HStack
          bg="violet.800"
          px="1"
          py="3"
          justifyContent="space-between"
          alignItems="center"
          w="100%"
          h="10%">
          <IconButton
            onPress={() =>
              this.context?.onBack(this.props.navigation, 'DeviceListScreen')
            }
            icon={
              <Icon
                size="24px"
                as={MaterialIcons}
                name="arrow-back"
                color="white"
              />
            }
          />

          <Box>
            <Text color="white" fontSize="16" fontWeight="bold">
              {this.context?.device?.name}
            </Text>
            <Text color="white" fontSize="16" fontWeight="bold">
              {this.context?.device?.address}
            </Text>
          </Box>
          <IconButton
            onPress={() => this.toggleConnection()}
            icon={
              <Icon
                size="24px"
                as={MaterialIcons}
                name={toggleIcon}
                color="white"
              />
            }
          />
        </HStack>
        {/* <View
          style={{
            paddingTop: 15,
            flexDirection: 'row',
            alignItems: 'space-between',
            justifyContent: 'space-between',
            paddingHorizontal: 12,
            backgroundColor: '#ffffff',
          }}>
          <TouchableOpacity
            style={styles.button_blue}
            onPress={() => !this.state.isRunning && this.startService()}>
            <MyText style={{color: '#FFFFFF'}}>Start</MyText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button_blue}
            onPress={() => this.state.isRunning && this.stopService()}>
            <MyText style={{color: '#FFFFFF'}}>Stop</MyText>
          </TouchableOpacity>
        </View> */}

        <HStack bg="white" w="100%" style={{flex: 1}}>
          <FlatList
            style={styles.connectionScreenOutput}
            contentContainerStyle={{justifyContent: 'flex-end'}}
            inverted
            ref="scannedDataList"
            data={this.state.data}
            keyExtractor={item => item.timestamp.toISOString()}
            renderItem={({item}) => (
              <View
                id={item.timestamp.toISOString()}
                flexDirection={'row'}
                justifyContent={'flex-start'}>
                <Text>{item.timestamp.toISOString()}</Text>
                <Text>{item.type === 'sent' ? ' < ' : ' > '}</Text>
                <Text flexShrink={1}>{item.data.trim()}</Text>
              </View>
            )}
          />
        </HStack>
        <HStack bg="white" w="100%" style={{flex: 1}}>
          <Text>Total data received: {this.state.dataReceived}</Text>
        </HStack>
        <HStack bg="white" h="8%" w="100%">
          <InputArea
            text={this.state.text}
            onChangeText={text => this.setState({text})}
            onSend={() => this.sendData()}
            disabled={!this.state.connection}
          />
        </HStack>
      </SafeAreaProvider>
    );
  }
}

const InputArea = ({text, onChangeText, onSend, disabled}) => {
  let style = disabled ? styles.inputArea : styles.inputAreaConnected;
  return (
    <View style={style}>
      <TextInput
        style={styles.inputAreaTextInput}
        placeholder={'Command/Text'}
        value={text}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        onSubmitEditing={onSend}
        returnKeyType="send"
        disabled={disabled}
      />
      <TouchableOpacity
        style={styles.inputAreaSendButton}
        onPress={onSend}
        disabled={disabled}>
        <Text>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * TextInput and Button for sending
 */
const styles = StyleSheet.create({
  connectionScreenWrapper: {
    flex: 1,
  },
  connectionScreenOutput: {
    flex: 1,
    paddingHorizontal: 8,
  },
  inputArea: {
    flexDirection: 'row',
    alignContent: 'stretch',
    backgroundColor: '#ccc',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  inputAreaConnected: {
    flexDirection: 'row',
    alignContent: 'stretch',
    backgroundColor: '#90EE90',
    width: '100%',
  },
  inputAreaTextInput: {
    flex: 1,
    height: 40,
  },
  inputAreaSendButton: {
    justifyContent: 'center',
    flexShrink: 1,
    padding: 10,
    color: 'white',
    backgroundColor: '#39B5E0',
  },
  button_blue: {
    height: 40,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 50,
    backgroundColor: '#3460D7',
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 20,
  },
});
