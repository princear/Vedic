import React, {useState, useEffect, useRef, useContext} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  Text,
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

const LoginScreen = ({navigation}) => {
  const animation = useRef(null);
  const inputRef = useRef(null);

  const [step, setStep] = useState(1);
  const [isAnimationHidden, setIsAnimationHidden] = useState(false);

  //   const [phone, setPhone] = useState('8445666963');
  const [phone, setPhone] = useState('');
  const [confirmation, setConfirmation] = useState();
  const [alreadyOnBoarded, setAlreadyOnBoarded] = useState(false);

  useEffect(() => {
    animation?.current?.play();
  }, [step]);

  const renderSteps = () => {
    if (step == 1) {
      return (
        <Step1
          setStep={setStep}
          phone={phone}
          setPhone={setPhone}
          inputRef={inputRef}
          animation={animation}
          isAnimationHidden={isAnimationHidden}
          setIsAnimationHidden={setIsAnimationHidden}
          setConfirmation={setConfirmation}
          setAlreadyOnBoarded={setAlreadyOnBoarded}
        />
      );
    } else if (step == 2) {
      return (
        <Step2
          setStep={setStep}
          phone={phone}
          animation={animation}
          isAnimationHidden={isAnimationHidden}
          setIsAnimationHidden={setIsAnimationHidden}
          confirmation={confirmation}
          navigation={navigation}
          alreadyOnBoarded={alreadyOnBoarded}
        />
      );
    }
  };

  return <SafeAreaView>{renderSteps()}</SafeAreaView>;
};

const Step1 = props => {
  const {
    inputRef,
    animation,
    isAnimationHidden,
    setIsAnimationHidden,
    setStep,
    phone,
    setPhone,
    setConfirmation,
    setAlreadyOnBoarded,
  } = props;

  const [loading, setLoading] = useState(false);

  const handleSignin = async () => {
    if (phone.length == 10) {
      setLoading(true);
      try {
        const url = `/v1/api/get-user-info?phone_number=${phone}`;
        callGetApi(url)
          .then(res => {
            if (res.status === 200) {
              storeDataToAsyncStorage('active_email', res.data.email);
              storeDataToAsyncStorage('master_email', res.data.email);
              setAlreadyOnBoarded(true);
            }
          })
          .catch(err => {
            setAlreadyOnBoarded(false);
            console.log('get user info error', err);
          });
        const res = await auth().signInWithPhoneNumber(`+91 ${phone}`);
        setConfirmation(res);
        setStep(2);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
        <View>
          {/* <View style={{marginTop: 10, marginBottom: 30}}>
            <Statusbar
              numberOfBars={5}
              partiallyCompleted={1}
              completedBars={0}
            />
          </View> */}
          <Text style={styles.heading}>Login</Text>
        </View>
        <View
          style={{
            height: 350,
            width: '100%',
            display: isAnimationHidden ? 'none' : 'flex',
          }}>
          <LottieView
            ref={animation}
            autoplay={true}
            loop={true}
            source={assets.lottieFiles.usingMobile}
          />
        </View>

        <MyText style={styles.infoText}>
          You’ll receive a 4 digit OTP to verify next
        </MyText>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View ref={inputRef} style={styles.input_small}>
            <MyText>+91</MyText>
          </View>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Phone number"
            onBlur={() => setIsAnimationHidden(false)}
            onFocus={() => setIsAnimationHidden(true)}
            value={phone}
            onChangeText={val => setPhone(val)}
          />
        </View>

        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          <MyText style={styles.terms}>By continuing, you agree to our </MyText>
          <MyText style={styles.link}>Terms & conditions </MyText>
          <MyText style={styles.terms}>and </MyText>
          <MyText style={styles.link}>Privacy policy.</MyText>
        </View>
      </View>
      <View>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <TouchableOpacity
            style={
              phone.length == 10
                ? styles.button_blue
                : styles.button_blue_disabled
            }
            onPress={handleSignin}>
            <MyText
              style={
                phone.length == 10
                  ? styles.button_blue_text
                  : styles.button_blue_text_disabled
              }>
              Get OTP
            </MyText>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const Step2 = props => {
  const {
    animation,
    isAnimationHidden,
    setIsAnimationHidden,
    setStep,
    phone,
    confirmation,
    navigation,
    alreadyOnBoarded,
  } = props;

  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const interval = setInterval(() => {
    if (timer > 0) {
      setTimer(timer - 1);
    }

    if (timer === 0) {
      clearInterval(interval);
    }
  }, 1000);

  useEffect(() => {
    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsAnimationHidden(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsAnimationHidden(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  async function confirmCode() {
    try {
      setLoading(true);
      const res = await confirmation.confirm(otp);
      const user = res.user;
      const firebaseToken = await user.getIdToken();
      // console.log('user:', user);
      // console.log('Firebase token:', firebaseToken);
      storeDataToAsyncStorage('token', firebaseToken);
      storeDataToAsyncStorage('phone_number', phone);

      if (alreadyOnBoarded) {
        //  authContext?.authenticate();
        navigation.navigate('OnBoarding');
      } else {
        navigation.navigate('OnBoarding');
      }
      setError('');
    } catch (error) {
      setError('Invalid OTP');
      console.log('Invalid code.', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
        {/* <View style={{marginTop: 10, marginBottom: 30}}>
          <Statusbar numberOfBars={5} completedBars={1} />
        </View> */}
        <MyText style={styles.heading}>OTP Verification</MyText>
        <MyText style={styles.subHeading}>Code is sent to +91 {phone}</MyText>

        <View
          style={{
            height: 350,
            width: '100%',
            display: isAnimationHidden ? 'none' : 'flex',
          }}>
          <LottieView
            ref={animation}
            autoplay={true}
            loop={true}
            source={assets.lottieFiles.sms}
          />
        </View>
        <View style={{alignItems: 'center'}}>
          <View style={{width: '100%', marginLeft: 10}}>
            {error != '' && (
              <MyText style={{fontSize: 12, color: 'red', fontWeight: '600'}}>
                {error}
              </MyText>
            )}
          </View>

          <OTPInputView
            autoFocusOnLoad={false}
            code={otp}
            onCodeChanged={e => setOtp(e)}
            pinCount={6}
            style={{width: '98%', height: 60}}
            codeInputFieldStyle={{borderColor: '#49454F', color: '#323232'}}
            codeInputHighlightStyle={{borderColor: '#3460D7'}}
          />
          {timer == 0 ? (
            <TouchableOpacity onPress={() => setTimer(30)}>
              <MyText
                style={{marginTop: 10, fontWeight: '500', color: '#3460D7'}}>
                Resend OTP in 50 seconds
              </MyText>
            </TouchableOpacity>
          ) : (
            <MyText
              style={{marginTop: 10, fontWeight: '500', color: '#828282'}}>
              RESEND OTP IN {timer} SECONDS
            </MyText>
          )}
        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            flex: 1,
            borderRadius: 50,
            borderWidth: 1,
            marginRight: 10,
          }}
          onPress={() => !loading && setStep(1)}>
          <MyText style={{color: '#3460D7', textAlign: 'center'}}>
            Edit number
          </MyText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            otp.length < 6 || loading
              ? styles.button_blue_disabled
              : styles.button_blue,
            {flex: 1},
          ]}
          onPress={() => !loading && confirmCode()}>
          {loading ? (
            <ActivityIndicator color="#3460D7" />
          ) : (
            <MyText
              style={
                otp.length == 6
                  ? styles.button_blue_text
                  : styles.button_blue_text_disabled
              }>
              Verify
            </MyText>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,

    marginBottom: 30,
    fontFamily: 'Poppins-Bold',
    color: '#323232',
  },
  subHeading: {
    color: '#323232',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 6,
  },
  terms: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: '#000000',
    marginTop: 6,
  },
  link: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: '#3460D7',
    marginTop: 6,
  },
  infoText: {
    fontSize: 16,
    color: '#363636',
    marginTop: 14,
    marginBottom: 30,
    fontFamily: 'Poppins-Medium',
    width: 289,
  },
  input_small: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
    borderColor: '#3460D7',
    borderRadius: 4,
    cursor: 'none',
  },
  input: {
    padding: 10,
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#3460D7',
    borderRadius: 4,
  },
  container: {
    backgroundColor: '#f2f2f2',
    height: '100%',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  button_blue: {
    height: 40,
    width: '100%',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 50,
    backgroundColor: '#3460D7',
    justifyContent: 'center',
  },
  button_blue_disabled: {
    height: 40,
    width: '100%',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 50,
    backgroundColor: 'rgba(28, 27, 31, 0.12);',
    justifyContent: 'center',
  },
  button_blue_text: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  button_blue_text_disabled: {
    color: '#1C1B1F',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  edit_btn: {
    border: '1px',
    height: 10,
    width: 40,
  },
  inputContainer: {
    height: 45,
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'flex-end',
  },
  textField: {
    borderColor: '#49454F',
    borderWidth: 1,
    borderRadius: 8,
    marginLeft: 20,
    paddingLeft: 10,
    width: '90%',
  },
});

export default LoginScreen;
