import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Text,
  TextInput,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import assets from '../../assets';
import LottieView from 'lottie-react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import auth from '@react-native-firebase/auth';
import MyText from '../components/MyText';
import Statusbar from '../components/Statusbar';
import {storeDataToAsyncStorage} from '../utils/asyncStorage';
import {callGetApi} from '../utils/axios';
import {AuthContext} from '../context';
import staticImage from '../../assets/Language.png';

const ChooseLanguage = ({navigation}) => {
  return (
    <View style={styles.Container}>
      <View
        style={{
          marginTop: 100,
          marginBottom: 100,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={staticImage}
          resizeMode="contain"
          style={{
            height: 100,
            width: 100,
          }}
        />
      </View>
      <Text
        style={{
          fontFamily: 'Poppins-SemiBold',
          textAlign: 'center',
          fontSize: 18,
          height: 100,

          color: '#363636',
        }}>
        Choose your preferred language
      </Text>
      <TouchableOpacity style={styles.White_blue}>
        <MyText style={styles.button_white_text}>English</MyText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.White_blue}>
        <MyText style={styles.button_white_text}>Hindi</MyText>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button_blue}
        onPress={() => navigation.navigate('Login')}>
        <MyText style={styles.button_blue_text}>Get Started</MyText>
      </TouchableOpacity>
    </View>
  );
};

export default ChooseLanguage;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  button_blue: {
    height: 40,
    width: '90%',
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 10,

    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 50,
    alignSelf: 'center',
    backgroundColor: '#3460D7',
    justifyContent: 'center',
  },
  White_blue: {
    height: 48,
    width: '90%',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'center',
    borderWidth: 1,
    marginBottom: 16,
    borderColor: '#49454F',
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  button_blue_text: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  button_white_text: {
    color: '#363636',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    fontWeight: '500',
  },
});
