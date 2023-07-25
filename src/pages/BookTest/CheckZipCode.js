import React, {useEffect, useRef, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LottieView from 'lottie-react-native';
import MyText from '../../components/MyText';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useHeaderHeight} from '@react-navigation/elements';
import assets from '../../../assets';

const CheckZipCode = ({navigation, route}) => {
  const [zipCode, setZipCode] = useState('');
  const [focused, setFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const height = useHeaderHeight();

  const animation = useRef(null);

  useEffect(() => {
    animation?.current?.play();
  }, [submitted, success]);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigation.navigate('MembersList');
      }, 2000);
    }
  }, [success]);

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {display: 'none'},
    });

    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: {backgroundColor: '#ffffff', height: 60},
      });
    };
  }, [navigation, route]);

  const renderSuccessFailure = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={{height: 240, alignItems: 'center'}}>
          <LottieView
            style={{height: '100%'}}
            ref={animation}
            autoplay={true}
            loop={true}
            source={
              success
                ? assets.lottieFiles.confetti
                : assets.lottieFiles.astronaut
            }
          />
          {success && (
            <View
              style={{
                position: 'absolute',
                bottom: 20,
                backgroundColor: '#42F475',
                padding: 8,
                borderRadius: 50,
              }}>
              <MaterialIcons name="check" size={24} color="#ffffff" />
            </View>
          )}
        </View>
        <MyText style={{color: '#3D464E', fontSize: 19, fontWeight: '600'}}>
          {success
            ? 'Yaay! We serve in your area'
            : 'Sorry! We don’t serve in your area'}
        </MyText>
        <MyText style={{color: '#323232', fontSize: 16, marginTop: 6}}>
          {success ? 'Pin code: 110001' : 'But we promise to start soon.'}
        </MyText>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <>
        <View style={{flex: 1}}>
          <View style={{flexDirection: 'row', marginBottom: 30}}>
            <TouchableOpacity
              style={{width: 20}}
              onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" color="#1C1B1F" size={24} />
            </TouchableOpacity>
            <MyText
              style={{
                fontWeight: '700',
                fontSize: 18,
                color: '#323232',
                textAlign: 'center',
                flex: 1,
                marginRight: 22,
              }}>
              Book your Test
            </MyText>
          </View>
          <MyText style={{fontWeight: '500', color: '#323232', width: '80%'}}>
            Enter the zip code to find the availability of our service in your
            area
          </MyText>
          <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Octicons
              name="location"
              size={24}
              color="black"
              style={{marginRight: 10}}
            />
            <TextInput
              style={[
                styles.input,
                {
                  borderWidth: focused ? 2 : 1,
                  borderColor: focused ? '#3460D7' : '#49454F',
                },
              ]}
              placeholder="Enter your Zip code"
              value={zipCode}
              keyboardType="numeric"
              onChangeText={val => setZipCode(val)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </View>
        </View>
        <KeyboardAvoidingView
          enabled
          style={{marginBottom: 20}}
          behavior="padding"
          keyboardVerticalOffset={height + 40}>
          <TouchableOpacity
            style={styles.button_blue}
            onPress={() => {
              setSubmitted(true);
              setSuccess(true);
            }}>
            <MyText style={styles.button_blue_text}>Submit</MyText>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </>
    );
  };

  return (
    <SafeAreaView
      style={{
        flexGrow: 1,
        paddingTop: 20,
        paddingHorizontal: 20,
      }}>
      {!submitted ? renderContent() : renderSuccessFailure()}
    </SafeAreaView>
  );
};

export default CheckZipCode;

const styles = StyleSheet.create({
  input: {
    fontFamily: 'Poppins',
    flex: 1,
    borderRadius: 8,
    marginLeft: 14,
    paddingLeft: 14,
    height: 50,
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
});
