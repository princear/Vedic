import React, {useContext, useEffect, useRef, useState} from 'react';
import assets from '../../assets';
import LottieView from 'lottie-react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import {RadialSlider} from 'react-native-radial-slider';
import staticImage from '../../assets/height.png';
import genderImage from '../../assets/gender.png';
import man from '../../assets/man.png';
import woman from '../../assets/woman.png';

import {
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  Modal,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import Map from '../components/Map';
import MyText from '../components/MyText';
import {Pressable} from 'react-native';
import {isEmailValid} from '../utils/validations';
import Boy from '../../assets/boy.svg';
import Girl from '../../assets/girl.svg';
import Statusbar from '../components/Statusbar';
import {AuthContext, MainContext} from '../context';
import {
  getDataFromAsyncStorage,
  storeDataToAsyncStorage,
} from '../utils/asyncStorage';
import {Toast} from 'native-base';
import {getMasterEmail, getUserInfo} from '../utils/user';
import {callPostApi} from '../utils/axios';
import crashlytics from '@react-native-firebase/crashlytics';
import {Dropdown} from 'react-native-element-dropdown';

const placebirths = [
  {label: 'New Delhi', value: 'New Delhi'},
  {label: 'Noida', value: 'Noida'},
  {label: 'Jalandhar', value: 'Jalandhar'},
];
const data = [
  {label: '01', value: '1'},
  {label: '02', value: '2'},
  {label: '03', value: '3'},
  {label: '04', value: '4'},
  {label: '05', value: '5'},
  {label: '06', value: '6'},
  {label: '07', value: '7'},
  {label: '08', value: '8'},
  {label: '09', value: '9'},
  {label: '10', value: '10'},
  {label: '11', value: '11'},
  {label: '12', value: '12'},
  {label: '13', value: '13'},
  {label: '14', value: '14'},
  {label: '15', value: '15'},
  {label: '16', value: '16'},
  {label: '17', value: '17'},
  {label: '18', value: '18'},
  {label: '19', value: '19'},
  {label: '20', value: '20'},
  {label: '21', value: '21'},
  {label: '22', value: '22'},
  {label: '23', value: '23'},
  {label: '24', value: '24'},
  {label: '25', value: '25'},
  {label: '26', value: '26'},
  {label: '27', value: '27'},
  {label: '28', value: '28'},
  {label: '29', value: '29'},
  {label: '30', value: '30'},
  {label: '31', value: '31'},
];

const OnBoardingScreen = ({navigation, route}) => {
  const [onBoardingStep, setOnBoardingStep] = useState(1);
  const [onBoardingDetails, setOnBoardingDetails] = useState({
    first_name: '',
    last_name: '',
    email: '',
    dob: '',
    tob: '', // 24 hrs format
    pob: {
      latitude: 28.62243758781894,
      longitude: 77.2031226195395,
    },
    gender: '',
    height: {
      unit: 'ft/in',
      value: '5.7',
    },
    weight: {
      unit: 'kg',
      value: '70',
    },
    master_user_id: '',
  });

  const [timeOfBirth, setTimeOfBirth] = useState(new Date());
  const [dateOfBirth, setDateOfBirth] = useState(new Date());

  const [markerLatLng, setMarkerLatLng] = useState({
    latitude: 28.62243758781894,
    longitude: 77.2031226195395,
  });
  const [region, setRegion] = useState({
    latitude: 28.62243758781894,
    longitude: 77.2031226195395,
    latitudeDelta: 0.92,
    longitudeDelta: 0.851,
  });

  const [address, setAddress] = useState({
    city: '',
    state: '',
    country: '',
  });

  const [showStatusBar, setShowStatusBar] = useState(true);
  const [changeActiveEmail, setChangeActiveEmail] = useState(true);
  const [partialDetails, setPartialDetails] = useState(false);

  const getPhoneNumber = async () => {
    return await getDataFromAsyncStorage('phone_number');
  };
  useEffect(() => {
    if (route?.params?.showStatusBar != undefined) {
      setShowStatusBar(route?.params?.showStatusBar);
    }
    if (route?.params?.changeActiveEmail != undefined) {
      setChangeActiveEmail(route?.params?.changeActiveEmail);
    }
    if (route?.params?.partialDetails != undefined) {
      setPartialDetails(route?.params?.partialDetails);
    }
  }, [route]);

  useEffect(() => {
    if (changeActiveEmail) {
      getPhoneNumber().then(phone => {
        setOnBoardingDetails(prevState => ({
          ...prevState,
          phone_number: `${phone}`,
        }));
      });
    }
    if (!changeActiveEmail) {
      getMasterEmail().then(email => {
        setOnBoardingDetails(prevState => ({
          ...prevState,
          master_user_id: `${email}`,
        }));
      });
    } else {
      setOnBoardingDetails({
        ...onBoardingDetails,
        master_user_id: onBoardingDetails.email,
      });
    }
  }, [onBoardingStep]);

  // useEffect(() => {
  //   navigation.getParent()?.setOptions({
  //     tabBarStyle: {display: 'none'},
  //   });

  //   return () => {
  //     navigation.getParent()?.setOptions({
  //       tabBarStyle: {backgroundColor: '#ffffff', height: 60},
  //     });
  //   };
  // }, [navigation, route]);

  const renderOnBoadingSteps = () => {
    if (onBoardingStep == 1)
      return (
        // <Step3
        //   onBoardingStep={onBoardingStep}
        //   setOnBoardingStep={setOnBoardingStep}
        //   onBoardingDetails={onBoardingDetails}
        //   setOnBoardingDetails={setOnBoardingDetails}
        // />
        <Step1
          route={route}
          onBoardingStep={onBoardingStep}
          setOnBoardingStep={setOnBoardingStep}
          onBoardingDetails={onBoardingDetails}
          setOnBoardingDetails={setOnBoardingDetails}
          partialDetails={partialDetails}
          navigation={navigation}
        />
      );
    else if (onBoardingStep == 2)
      return (
        <Step3
          onBoardingStep={onBoardingStep}
          setOnBoardingStep={setOnBoardingStep}
          onBoardingDetails={onBoardingDetails}
          setOnBoardingDetails={setOnBoardingDetails}
        />
      );
    else if (onBoardingStep == 3)
      return (
        <Step2
          onBoardingDetails={onBoardingDetails}
          setOnBoardingDetails={setOnBoardingDetails}
          onBoardingStep={onBoardingStep}
          setOnBoardingStep={setOnBoardingStep}
          timeOfBirth={timeOfBirth}
          setTimeOfBirth={setTimeOfBirth}
          dateOfBirth={dateOfBirth}
          setDateOfBirth={setDateOfBirth}
          markerLatLng={markerLatLng}
          setMarkerLatLng={setMarkerLatLng}
          region={region}
          setRegion={setRegion}
          address={address}
          setAddress={setAddress}
        />
        // <Step3
        //   onBoardingStep={onBoardingStep}
        //   setOnBoardingStep={setOnBoardingStep}
        //   onBoardingDetails={onBoardingDetails}
        //   setOnBoardingDetails={setOnBoardingDetails}
        // />
      );
    else if (onBoardingStep == 4)
      return (
        <Step4
          changeActiveEmail={changeActiveEmail}
          onBoardingStep={onBoardingStep}
          setOnBoardingStep={setOnBoardingStep}
          onBoardingDetails={onBoardingDetails}
          setOnBoardingDetails={setOnBoardingDetails}
        />
      );
    else
      return (
        <Step5
          navigation={navigation}
          changeActiveEmail={changeActiveEmail}
          onBoardingStep={onBoardingStep}
          setOnBoardingStep={setOnBoardingStep}
          onBoardingDetails={onBoardingDetails}
          setOnBoardingDetails={setOnBoardingDetails}
        />
      );
  };

  return (
    <SafeAreaView style={styles.container}>
      {showStatusBar && onBoardingStep < 5 && (
        <View style={{marginBottom: 30}}>
          <Statusbar numberOfBars={5} completedBars={onBoardingStep + 1} />
        </View>
      )}
      {onBoardingStep > 1 && onBoardingStep < 5 && (
        <TouchableOpacity
          onPress={() => setOnBoardingStep(onBoardingStep - 1)}
          style={styles.arrow_back}>
          <MaterialIcons name="arrow-back" color="#1C1B1F" size={22} />
        </TouchableOpacity>
      )}
      {renderOnBoadingSteps()}
    </SafeAreaView>
  );
};

const Step1 = props => {
  const {
    setOnBoardingStep,
    onBoardingDetails,
    setOnBoardingDetails,
    partialDetails,
    navigation,
  } = props;
  const mainContext = useContext(MainContext);
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState(null);
  const ref_last_name = useRef();
  const ref_email = useRef();
  const [loading, setLoading] = useState(false);

  const handleChange = (k, v) => {
    setOnBoardingDetails({...onBoardingDetails, [k]: v});
  };

  function debounce(func, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  const delayedGetUserInfo = debounce(async () => {
    try {
      const res = await getUserInfo(onBoardingDetails?.email);
      if (res.status === 200) {
        setError('Email already exist');
        setDisabled(true);
      } else {
        setDisabled(false);
        setError(false);
      }
    } catch (error) {
      console.log('Error:', error.response.data.message);
    }
  }, 700);

  const postDetails = async () => {
    setLoading(true);
    try {
      const master_email = await getMasterEmail();

      const data = {
        first_name: onBoardingDetails.first_name.trim(),
        last_name: onBoardingDetails.last_name.trim(),
        email: onBoardingDetails.email.trim(),
        master_user_id: master_email,
      };

      if (master_email == null) {
        data['master_user_id'] = `masteruser+${
          data.first_name + data.last_name
        }@gmail.com`;
      }

      console.log(data);

      const url = `/v1/api/add-user-health-info`;
      const res = await callPostApi(url, data);

      if (res.status === 200) {
        storeDataToAsyncStorage('active_email', data.email).then(() => {
          mainContext.setState({activeEmail: data.email});
          navigation.navigate('Health');
          setLoading(false);
        });
      } else {
        console.log('Error', res.data);
        Toast.show({
          description: error.response.data.message,
          duration: 2000,
        });
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      crashlytics().recordError(error);
      let errorMessage = 'An error occurred.';
      if (error.response && error.response.data && error.response.data.errors) {
        const errorFields = Object.keys(error.response.data.errors);
        if (errorFields.length > 0) {
          errorMessage = `Error: ${error.response.data.errors[errorFields[0]]}
           Message: ${error.response.data.message}
          `;
        }
      }

      Toast.show({
        description: errorMessage,
        duration: 2000,
      });
    }
  };

  useEffect(() => {
    if (onBoardingDetails?.email !== '') {
      if (!isEmailValid(onBoardingDetails?.email)) {
        setError('Please provide a valid email');
      } else {
        setError(false);
        delayedGetUserInfo();
      }
    } else {
      setError(false);
    }

    if (
      onBoardingDetails?.first_name === '' ||
      onBoardingDetails?.last_name === '' ||
      onBoardingDetails?.email === '' ||
      isEmailValid(onBoardingDetails?.email) === false
    ) {
      setDisabled(true);
    } else setDisabled(false);
  }, [onBoardingDetails]);

  return (
    <>
      <View style={{flex: 1}}>
        <MyText style={styles.heading}>Enter your details</MyText>
        <View style={styles.inputContainer}>
          <MaterialIcons name="person-outline" size={26} color="#1C1B1F" />
          <TextInput
            style={styles.textField}
            placeholder="First name"
            value={onBoardingDetails.first_name}
            onChangeText={val => handleChange('first_name', val)}
            returnKeyType={'next'}
            onSubmitEditing={() => {
              ref_last_name?.current?.focus();
            }}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            ref={ref_last_name}
            style={styles.textField}
            placeholder="Last name"
            value={onBoardingDetails.last_name}
            onChangeText={val => handleChange('last_name', val)}
            returnKeyType={'next'}
            onSubmitEditing={() => {
              ref_email?.current?.focus();
            }}
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="email-outline"
            size={24}
            color="black"
          />
          <TextInput
            ref={ref_email}
            style={styles.textField}
            placeholder="E mail-id"
            value={onBoardingDetails.email}
            onChangeText={val => handleChange('email', val)}
          />
          {error && (
            <MyText
              style={{
                position: 'absolute',
                left: 40,
                bottom: -22,
                color: '#F94F41',
                fontSize: 12,
              }}>
              {error}
            </MyText>
          )}
        </View>
      </View>

      <View>
        <TouchableOpacity
          style={disabled ? styles.button_blue_disabled : styles.button_blue}
          onPress={() => {
            if (!disabled) {
              if (partialDetails) {
                postDetails();
              } else {
                setOnBoardingStep(2);
              }
            }
          }}>
          <MyText
            style={
              disabled
                ? styles.button_blue_text_disabled
                : styles.button_blue_text
            }>
            {loading ? (
              <>
                <ActivityIndicator size="large" color="#3460D7" />
              </>
            ) : (
              <MyText style={styles.button_blue_text}>Continue</MyText>
            )}
          </MyText>
        </TouchableOpacity>
      </View>
    </>
  );
};

const Step2 = props => {
  const {
    onBoardingStep,
    setOnBoardingStep,
    timeOfBirth,
    setTimeOfBirth,
    dateOfBirth,
    setDateOfBirth,
    markerLatLng,
    setMarkerLatLng,
    region,
    setRegion,
    onBoardingDetails,
    setOnBoardingDetails,
    address,
    setAddress,
  } = props;
  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const months = [
    {label: 'Jan', value: '1'},
    {label: 'Feb', value: '2'},
    {label: 'Mar', value: '3'},
    {label: 'Apr', value: '4'},
    {label: 'May', value: '5'},
    {label: 'Jun', value: '6'},
    {label: 'Jul', value: '7'},
    {label: 'Aug', value: '8'},
    {label: 'Sep', value: '9'},
    {label: 'Oct', value: '10'},
    {label: 'Nov', value: '11'},
    {label: 'Dec', value: '12'},
  ];

  const year = [
    {label: '1988', value: '1'},
    {label: '1989', value: '2'},
    {label: '1990', value: '3'},
    {label: '1991', value: '4'},
    {label: '1992', value: '5'},
    {label: '1993', value: '6'},
    {label: '1994', value: '7'},
    {label: '1995', value: '8'},
    {label: '1996', value: '9'},
    {label: '1997', value: '10'},
    {label: '1998', value: '11'},
    {label: '1999', value: '12'},
  ];

  const Hours = [
    {label: '01', value: '1'},
    {label: '02', value: '2'},
    {label: '03', value: '3'},
    {label: '04', value: '4'},
    {label: '05', value: '5'},
    {label: '06', value: '6'},
    {label: '07', value: '7'},
    {label: '08', value: '8'},
    {label: '09', value: '9'},
    {label: '10', value: '10'},
    {label: '11', value: '11'},
    {label: '12', value: '12'},
    {label: '13', value: '13'},
    {label: '14', value: '14'},
    {label: '15', value: '15'},
    {label: '16', value: '16'},
    {label: '17', value: '17'},
    {label: '18', value: '18'},
    {label: '19', value: '19'},
    {label: '20', value: '20'},
    {label: '21', value: '21'},
    {label: '22', value: '22'},
    {label: '23', value: '23'},
    {label: '24', value: '24'},
  ];

  const minutes = [
    {label: '01', value: '1'},
    {label: '02', value: '2'},
    {label: '03', value: '3'},
    {label: '04', value: '4'},
    {label: '05', value: '5'},
    {label: '06', value: '6'},
    {label: '07', value: '7'},
    {label: '08', value: '8'},
    {label: '09', value: '9'},
    {label: '10', value: '10'},
    {label: '11', value: '11'},
    {label: '12', value: '12'},
    {label: '13', value: '13'},
    {label: '14', value: '14'},
    {label: '15', value: '15'},
    {label: '16', value: '16'},
    {label: '17', value: '17'},
    {label: '18', value: '18'},
    {label: '19', value: '19'},
    {label: '20', value: '20'},
    {label: '21', value: '21'},
    {label: '22', value: '22'},
    {label: '23', value: '23'},
    {label: '24', value: '24'},
    {label: '25', value: '25'},
    {label: '26', value: '26'},
    {label: '27', value: '27'},
    {label: '28', value: '28'},
    {label: '29', value: '29'},
    {label: '30', value: '30'},
    {label: '31', value: '31'},
    {label: '32', value: '32'},
    {label: '33', value: '33'},
    {label: '34', value: '34'},
    {label: '35', value: '35'},
    {label: '36', value: '36'},
    {label: '37', value: '37'},
    {label: '38', value: '38'},
    {label: '39', value: '39'},
    {label: '40', value: '40'},
    {label: '41', value: '41'},
    {label: '42', value: '42'},
    {label: '43', value: '43'},
    {label: '44', value: '44'},
    {label: '45', value: '45'},
    {label: '46', value: '46'},
    {label: '47', value: '47'},
    {label: '48', value: '48'},
    {label: '49', value: '49'},
    {label: '50', value: '50'},
    {label: '51', value: '51'},
    {label: '52', value: '52'},
    {label: '53', value: '53'},
    {label: '54', value: '54'},
    {label: '55', value: '55'},
    {label: '56', value: '56'},
    {label: '57', value: '57'},
    {label: '58', value: '58'},
    {label: '59', value: '59'},
    {label: '60', value: '60'},
  ];

  const ampm = [
    {label: 'Am', value: '1'},
    {label: 'PM', value: '2'},
  ];

  const [isCalenderModalOpen, setIsCalenderModalOpen] = useState(false);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [day, setday] = useState(null);
  const [month, setMonth] = useState(null);
  const [years, setYear] = useState(null);
  const [placebirth, setPlaceBirth] = useState(null);
  const [hour, setHour] = useState(null);
  const [minute, setMinute] = useState(null);
  const [ampmval, setAMPMVal] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  useEffect(() => {
    if (false) {
      setDisabled(true);
    } else setDisabled(false);
  }, [onBoardingDetails]);

  return (
    <>
      <View style={{flex: 1}}>
        <MyText style={styles.heading}>Enter your details</MyText>
        <View style={{flexDirection: 'row'}}>
          <MaterialIcons name="redeem" size={24} color="black" />
          <View style={{width: '95%', flexDirection: 'row'}}>
            <Dropdown
              style={[styles.textField1, isFocus && {borderColor: 'blue'}]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              // itemContainerStyle={{
              //   borderLeftWidth: 1,

              //   borderRightWidth: 1,
              //   borderColor: '#49454F',
              // }}
              itemTextStyle={{fontSize: 14, height: 18}}
              data={data}
              // search
              maxHeight={200}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Day' : '...'}
              // searchPlaceholder="Search..."
              value={day}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setday(item.value);
                setIsFocus(false);
              }}
              // renderLeftIcon={() => (
              //   <MaterialIcons name="date-range" size={24} color="black" />
              // )}
            />
            {/* <TextInput
              style={styles.textField}
              value={dateOfBirth}
              onChangeText={e => setDateOfBirth(e)}
              placeholder="Date of birth"
              onBlur={() => setIsCalenderModalOpen(false)}
              onFocus={() => setIsCalenderModalOpen(true)}
            /> */}
            <MyText style={{marginLeft: 20, marginBottom: 20}}>
              {/* dd/mm/yyyy */}
            </MyText>
            {/* <TouchableOpacity
              onPress={() => setIsCalenderModalOpen(true)}
              style={{position: 'absolute', top: 11, right: 25}}>
              <MaterialIcons name="date-range" size={24} color="black" />
            </TouchableOpacity> */}
            <Dropdown
              style={[styles.textField2, isFocus && {borderColor: 'blue'}]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={months}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Month' : '...'}
              searchPlaceholder="Search..."
              value={month}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setMonth(item.value);
                setIsFocus(false);
              }}
              // renderLeftIcon={() => (
              //   <MaterialIcons name="date-range" size={24} color="black" />
              // )}
            />
            {/* <TextInput
              style={styles.textField}
              value={dateOfBirth}
              onChangeText={e => setDateOfBirth(e)}
              placeholder="Date of birth"
              onBlur={() => setIsCalenderModalOpen(false)}
              onFocus={() => setIsCalenderModalOpen(true)}
            /> */}
            <MyText style={{marginLeft: 20, marginBottom: 20}}>
              {/* dd/mm/yyyy */}
            </MyText>
            {/* <TouchableOpacity
              onPress={() => setIsCalenderModalOpen(true)}
              style={{position: 'absolute', top: 11, right: 25}}>
              <MaterialIcons name="date-range" size={24} color="black" />
            </TouchableOpacity> */}
            <Dropdown
              style={[styles.textField2, isFocus && {borderColor: 'blue'}]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={year}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Year' : '...'}
              searchPlaceholder="Search..."
              value={years}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setYear(item.value);
                setIsFocus(false);
              }}
              // renderLeftIcon={() => (
              //   <MaterialIcons name="date-range" size={24} color="black" />
              // )}
            />
            {/* <TextInput
              style={styles.textField}
              value={dateOfBirth}
              onChangeText={e => setDateOfBirth(e)}
              placeholder="Date of birth"
              onBlur={() => setIsCalenderModalOpen(false)}
              onFocus={() => setIsCalenderModalOpen(true)}
            /> */}
            <MyText style={{marginLeft: 20, marginBottom: 20}}>
              {/* dd/mm/yyyy */}
            </MyText>
            {/* <TouchableOpacity
              onPress={() => setIsCalenderModalOpen(true)}
              style={{position: 'absolute', top: 11, right: 25}}>
              <MaterialIcons name="date-range" size={24} color="black" />
            </TouchableOpacity> */}
          </View>
        </View>
        <View style={{flexDirection: 'row', marginTop: 20}}>
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={26}
            color="black"
          />
          <View style={{width: '95%'}}>
            <Dropdown
              style={[styles.textField, isFocus && {borderColor: 'blue'}]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={placebirths}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Place of birth' : '...'}
              searchPlaceholder="Search..."
              value={placebirth}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setPlaceBirth(item.value);
                setIsFocus(false);
              }}
            />
            {/* <TextInput
              style={styles.textField}
              placeholder="Place of birth"
              value={`${address.city}${address.state}${address.country}`}
              onBlur={() => setIsMapModalOpen(false)}
              onFocus={() => setIsMapModalOpen(true)}
            />
            <MyText style={{marginLeft: 20, marginBottom: 20}}>
              Enter the place where you were born.
            </MyText>
            <TouchableOpacity
              onPress={() => setIsMapModalOpen(true)}
              style={{position: 'absolute', top: 11, right: 25}}>
              <Ionicons name="md-pin-sharp" size={24} color="black" />
            </TouchableOpacity> */}
          </View>
        </View>
        <View style={{flexDirection: 'row', marginTop: 20}}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={26}
            color="black"
          />

          <View style={{width: '95%', flexDirection: 'row'}}>
            <Dropdown
              style={[styles.textField1, isFocus && {borderColor: 'blue'}]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={Hours}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Hours' : '...'}
              searchPlaceholder="Search..."
              value={hour}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setHour(item.value);
                setIsFocus(false);
              }}
              // renderLeftIcon={() => (
              //   <MaterialIcons name="date-range" size={24} color="black" />
              // )}
            />
            {/* <TextInput
              style={styles.textField}
              value={dateOfBirth}
              onChangeText={e => setDateOfBirth(e)}
              placeholder="Date of birth"
              onBlur={() => setIsCalenderModalOpen(false)}
              onFocus={() => setIsCalenderModalOpen(true)}
            /> */}
            <MyText style={{marginLeft: 20, marginBottom: 20}}>
              {/* dd/mm/yyyy */}
            </MyText>
            {/* <TouchableOpacity
              onPress={() => setIsCalenderModalOpen(true)}
              style={{position: 'absolute', top: 11, right: 25}}>
              <MaterialIcons name="date-range" size={24} color="black" />
            </TouchableOpacity> */}
            <Dropdown
              style={[styles.textField2, isFocus && {borderColor: 'blue'}]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={minutes}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Minutes' : '...'}
              searchPlaceholder="Search..."
              value={minute}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setMinute(item.value);
                setIsFocus(false);
              }}
              // renderLeftIcon={() => (
              //   <MaterialIcons name="date-range" size={24} color="black" />
              // )}
            />
            {/* <TextInput
              style={styles.textField}
              value={dateOfBirth}
              onChangeText={e => setDateOfBirth(e)}
              placeholder="Date of birth"
              onBlur={() => setIsCalenderModalOpen(false)}
              onFocus={() => setIsCalenderModalOpen(true)}
            /> */}
            <MyText style={{marginLeft: 20, marginBottom: 20}}>
              {/* dd/mm/yyyy */}
            </MyText>
            {/* <TouchableOpacity
              onPress={() => setIsCalenderModalOpen(true)}
              style={{position: 'absolute', top: 11, right: 25}}>
              <MaterialIcons name="date-range" size={24} color="black" />
            </TouchableOpacity> */}
            <Dropdown
              style={[styles.textField2, isFocus && {borderColor: 'blue'}]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={ampm}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'AM' : '...'}
              searchPlaceholder="Search..."
              value={ampmval}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setAMPMVal(item.value);
                setIsFocus(false);
              }}
              // renderLeftIcon={() => (
              //   <MaterialIcons name="date-range" size={24} color="black" />
              // )}
            />
            {/* <TextInput
              style={styles.textField}
              value={dateOfBirth}
              onChangeText={e => setDateOfBirth(e)}
              placeholder="Date of birth"
              onBlur={() => setIsCalenderModalOpen(false)}
              onFocus={() => setIsCalenderModalOpen(true)}
            /> */}
            <MyText style={{marginLeft: 20, marginBottom: 20}}>
              {/* dd/mm/yyyy */}
            </MyText>
            {/* <TouchableOpacity
              onPress={() => setIsCalenderModalOpen(true)}
              style={{position: 'absolute', top: 11, right: 25}}>
              <MaterialIcons name="date-range" size={24} color="black" />
            </TouchableOpacity> */}
          </View>
          {/* <TextInput
              value={timeOfBirth}
              onChangeText={val => setTimeOfBirth(val)}
              style={styles.textField}
              placeholder="Time of birth"
              onBlur={() => setIsTimeModalOpen(false)}
              onFocus={() => setIsTimeModalOpen(true)}
            />
            <MyText style={{marginLeft: 20}}>
              Enter if you are sure of the time.
            </MyText>
            <MyText style={{marginLeft: 20, marginBottom: 20}}>
              Note: Ask your parents.
            </MyText> */}
        </View>
      </View>
      <View>
        <TouchableOpacity
          style={disabled ? styles.button_blue_disabled : styles.button_blue}
          onPress={() => {
            setOnBoardingDetails({
              ...onBoardingDetails,
              dob: dateOfBirth,
              tob: timeOfBirth,
              pob: {
                latitude: markerLatLng.latitude,
                longitude: markerLatLng.longitude,
              },
            });
            // setOnBoardingStep(3);
            setOnBoardingStep(5);
          }}>
          <MyText
            style={
              disabled
                ? styles.button_blue_text_disabled
                : styles.button_blue_text
            }>
            Continue
          </MyText>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isCalenderModalOpen}
        onRequestClose={() => setIsCalenderModalOpen(false)}>
        <View style={{flex: 1, backgroundColor: '#00000099'}}>
          <View style={styles.modal_content}>
            <CalendarPicker
              weekdays={weekdays}
              months={months}
              previousComponent={
                <MaterialIcons name="chevron-left" size={28} color="black" />
              }
              nextComponent={
                <MaterialIcons name="chevron-right" size={28} color="black" />
              }
              selectedDayColor="#3460D7"
              selectedDayTextColor="#ffffff"
              todayTextStyle="#000000"
              value={dateOfBirth}
              onDateChange={event => {
                let date = moment(event).format('DD/MM/YYYY');
                setDateOfBirth(date);
              }}
            />
            <View
              style={{
                marginTop: 20,
                paddingHorizontal: 30,
                justifyContent: 'flex-end',
                flexDirection: 'row',
              }}>
              <TouchableOpacity onPress={() => setIsCalenderModalOpen(false)}>
                <MyText style={{color: '#3460D7', fontWeight: '500'}}>
                  Cancel
                </MyText>
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginLeft: 40}}
                onPress={() => setIsCalenderModalOpen(false)}>
                <MyText style={{color: '#3460D7', fontWeight: '500'}}>
                  Ok
                </MyText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {isTimeModalOpen && (
        <RNDateTimePicker
          display="clock"
          mode="time"
          positiveButton={{label: 'Done'}}
          value={new Date()}
          onChange={(event, date) => {
            setTimeOfBirth(`${date.getHours()}:${date.getMinutes()}`);
            setIsTimeModalOpen(false);
          }}
        />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isMapModalOpen}
        onRequestClose={() => setIsMapModalOpen(false)}>
        <View style={{flex: 1, backgroundColor: '#00000099'}}>
          <View
            style={[
              styles.modal_content,
              {height: 600, paddingTop: 0, overflow: 'hidden'},
            ]}>
            <Map
              height={600}
              markerLatLng={markerLatLng}
              setMarkerLatLng={setMarkerLatLng}
              region={region}
              setRegion={setRegion}
              setAddress={setAddress}
            />
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 12,
                right: 16,
                backgroundColor: '#3460D7',
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 16,
              }}
              onPress={() => setIsMapModalOpen(false)}>
              {/* <Ionicons name="close" size={24} color="black" /> */}
              <MyText style={{color: '#ffffff'}}> Done</MyText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const Step3 = props => {
  const {
    onBoardingDetails,
    setOnBoardingDetails,
    onBoardingStep,
    setOnBoardingStep,
    changeActiveEmail,
  } = props;

  const [unit, setUnit] = useState({
    height: 'ft/in',
    weight: 'kg',
  });

  const [heightInteger, setHeightInteger] = useState(5);
  const [heightDecimal, setHeightDecimal] = useState(7);
  const [weight, setWeight] = useState(60);
  const [loading, setLoading] = useState(false);
  const len = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const postOnBoardingDetails = async () => {
    setLoading(true);
    setOnBoardingDetails({
      ...onBoardingDetails,
      height: {
        unit: unit.height,
        value: `${heightInteger}.${heightDecimal}`,
      },
      weight: {unit: unit.weight, value: weight},
    });

    if (!changeActiveEmail) delete onBoardingDetails.phone_number;

    console.warn(onBoardingDetails);
    const firebase_token = await getDataFromAsyncStorage('token');
    try {
      const url = `/v1/api/add-user-health-info`;
      const res = await callPostApi(url, onBoardingDetails);
      console.log('onBOardingRes', res.data);

      if (res.status === 200 && changeActiveEmail) {
        storeDataToAsyncStorage('active_email', onBoardingDetails.email);
        storeDataToAsyncStorage('master_email', onBoardingDetails.email);
      }

      setOnBoardingStep(5);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('Error', error.response.data);
      Toast.show({
        description: 'Something went wrong',
        duration: 2000,
      }).finally(() => {
        setLoading(false);
      });
    }
  };

  const windowDimensions = Dimensions.get('window');
  const animation_male = useRef(null);
  const animation_female = useRef(null);

  useEffect(() => {
    animation_male?.current?.play();
    animation_female?.current?.play();
  }, []);

  return (
    <>
      <View style={{flex: 1}}>
        <MyText style={styles.heading}>
          Hello {onBoardingDetails.first_name},
        </MyText>
        <MyText style={styles.subHeading}>
          We need a few more details to serve your healthcare better
        </MyText>

        <View
          style={{
            marginTop: 16,
            flexDirection: 'row',
          }}>
          <Image
            source={staticImage}
            resizeMode="contain"
            style={{
              height: 20,
            }}
          />
          <View style={styles.heightinputContainer}>
            <MyText style={{marginLeft: 20, marginBottom: 20}}>Height</MyText>
            <TextInput
              style={styles.heightField}
              placeholder="00"
              value={heightInteger}
              onValueChange={val => setHeightInteger(val)}
              //  onChangeText={val => handleChange('first_name', val)}
              // returnKeyType={'next'}
              keyboardType="numeric"
              // onSubmitEditing={() => {
              //   ref_last_name?.current?.focus();
              // }}
            />
          </View>
          <View style={styles.heightinputContainer}>
            <MyText style={{marginLeft: 20, marginBottom: 20}}>FEET</MyText>
          </View>

          <View style={styles.heightinputContainer}>
            <MyText style={{marginLeft: 20, marginBottom: 20}}>Weight</MyText>
            <TextInput
              style={styles.heightField}
              placeholder="00"
              value={weight}
              onChange={wt => setWeight(wt)}
              // returnKeyType={'next'}
              keyboardType="numeric"
              // onSubmitEditing={() => {
              //   ref_last_name?.current?.focus();
              // }}
            />
          </View>
          <View style={styles.heightinputContainer}>
            <MyText style={{marginLeft: 20, marginBottom: 20}}>KG</MyText>
          </View>
        </View>

        <View
          style={{
            marginTop: 16,
            flexDirection: 'row',
          }}>
          <Image
            source={genderImage}
            resizeMode="contain"
            style={{
              // width: 20,
              //position: 'absolute',
              //right: 30,
              //bottom: 20,
              height: 20,
              // alignSelf: 'center',
            }}
          />
          <View style={styles.heightinputContainer}>
            <MyText style={{marginLeft: 20, marginBottom: 20}}>Gender</MyText>
          </View>
        </View>

        <View
          style={{
            marginTop: 16,
            flexDirection: 'row',
            //   justifyContent: 'space-between',
          }}>
          <Pressable
            style={[
              styles.box_outside,
              {
                marginRight: 8,
                borderColor:
                  onBoardingDetails.gender == 'male' ? '#3460D7' : '#6750A40D',
              },
            ]}
            onPress={() =>
              setOnBoardingDetails({...onBoardingDetails, gender: 'male'})
            }>
            <View style={styles.box_inside}>
              <Image
                source={man}
                resizeMode="cover"
                style={{
                  width: 70,

                  height: 70,
                }}
              />
              <MyText style={styles.gender_text}>Male</MyText>
            </View>
          </Pressable>
          <Pressable
            onPress={() =>
              setOnBoardingDetails({...onBoardingDetails, gender: 'female'})
            }
            style={[
              styles.box_outside,
              {
                marginLeft: 8,
                borderColor:
                  onBoardingDetails.gender == 'female'
                    ? '#3460D7'
                    : '#6750A40D',
              },
            ]}>
            <View style={styles.box_inside}>
              <Image
                source={woman}
                resizeMode="cover"
                style={{
                  width: 70,

                  height: 70,
                }}
              />
              <MyText style={styles.gender_text}>Female</MyText>
            </View>
          </Pressable>
        </View>

        {/* <View
          style={{
            marginTop: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Pressable
            style={[
              styles.box_outside,
              {
                marginRight: 8,
                borderColor:
                  onBoardingDetails.gender == 'male' ? '#3460D7' : '#6750A40D',
              },
            ]}
            onPress={() =>
              setOnBoardingDetails({...onBoardingDetails, gender: 'male'})
            }>
            <View style={styles.box_inside}>
              <Image
                source={man}
                resizeMode="cover"
                style={{
                  width: 100,

                  height: 100,
                  alignSelf: 'center',
                }}
              />
              {/* <LottieView
                style={styles.gender_animation}
                ref={animation_male}
                autoplay={true}
                loop={true}
                source={assets.lottieFiles.male}
              /> 
              <MyText style={styles.gender_text}>Male</MyText>
            </View>
          </Pressable>

          <Pressable
            onPress={() =>
              setOnBoardingDetails({...onBoardingDetails, gender: 'female'})
            }
            style={[
              styles.box_outside,
              {
                marginLeft: 8,
                borderColor:
                  onBoardingDetails.gender == 'female'
                    ? '#3460D7'
                    : '#6750A40D',
              },
            ]}>
            <View style={styles.box_inside}>
              <Image
                source={woman}
                resizeMode="cover"
                style={{
                  width: 100,

                  height: 100,
                  alignSelf: 'center',
                }}
              />
              {/* <LottieView
                style={styles.gender_animation}
                ref={animation_female}
                autoplay={true}
                loop={true}
                source={assets.lottieFiles.female}
              /> 
              <MyText style={styles.gender_text}>Female</MyText>
            </View>
          </Pressable>
        </View> */}
        {/* <View style={{alignItems: 'center', marginTop: 22}}>
          <MyText
            style={{
              paddingHorizontal: 30,
              textAlign: 'center',
              fontWeight: '500',
              width: '98%',
              letterSpacing: 1,
            }}>
            To give you customized experience we need to know your gender.
          </MyText>
        </View> */}
      </View>

      <TouchableOpacity
        style={
          onBoardingDetails.gender === ''
            ? styles.button_blue_disabled
            : styles.button_blue
        }
        onPress={() => onBoardingDetails.gender !== '' && setOnBoardingStep(3)}>
        <MyText
          style={
            onBoardingDetails.gender === ''
              ? styles.button_blue_text_disabled
              : styles.button_blue_text
          }>
          Continue
        </MyText>
      </TouchableOpacity>
    </>
  );
};

const Step4 = props => {
  const {
    changeActiveEmail,
    onBoardingStep,
    setOnBoardingStep,
    onBoardingDetails,
    setOnBoardingDetails,
  } = props;

  const [unit, setUnit] = useState({
    height: 'ft/in',
    weight: 'kg',
  });

  const [heightInteger, setHeightInteger] = useState(5);
  const [heightDecimal, setHeightDecimal] = useState(7);
  const [weight, setWeight] = useState(60);
  const [loading, setLoading] = useState(false);
  const len = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  console.log(unit, 'unitttttttttttttttttt');

  const postOnBoardingDetails = async () => {
    setLoading(true);
    setOnBoardingDetails({
      ...onBoardingDetails,
      height: {
        unit: unit.height,
        value: `${heightInteger}.${heightDecimal}`,
      },
      weight: {unit: unit.weight, value: weight},
    });

    if (!changeActiveEmail) delete onBoardingDetails.phone_number;

    console.warn(onBoardingDetails);
    const firebase_token = await getDataFromAsyncStorage('token');
    try {
      const url = `/v1/api/add-user-health-info`;
      const res = await callPostApi(url, onBoardingDetails);
      console.log('onBOardingRes', res.data);

      if (res.status === 200 && changeActiveEmail) {
        storeDataToAsyncStorage('active_email', onBoardingDetails.email);
        storeDataToAsyncStorage('master_email', onBoardingDetails.email);
      }

      setOnBoardingStep(5);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('Error', error.response.data);
      Toast.show({
        description: 'Something went wrong',
        duration: 2000,
      }).finally(() => {
        setLoading(false);
      });
    }
  };

  return (
    <>
      <View style={{flex: 1}}>
        <MyText style={styles.heading}>Hello Vikalp,</MyText>
        <MyText style={styles.subHeading}>
          We need your height and weight.
        </MyText>

        <View style={{alignItems: 'center'}}>
          <TextInput
            style={styles.tab_text}
            keyboardType="numeric"
            placeholder="-"
            value={`${heightInteger}.${heightDecimal}`}
            editable={false}
            selectTextOnFocus={false}
          />
          <View
            style={{
              backgroundColor: '#DCDCDC',
              flexDirection: 'row',
              borderRadius: 16,
            }}>
            <TouchableOpacity
              onPress={() => setUnit({...unit, height: 'ft/in'})}
              style={[
                styles.tab,
                {
                  backgroundColor:
                    unit.height == 'ft/in' ? '#FF8B8B' : '#DCDCDC',
                },
              ]}>
              <MyText
                style={{textAlign: 'center', color: '#323232', fontSize: 12}}>
                Ft/in
              </MyText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setUnit({...unit, height: 'cm'})}
              style={[
                styles.tab,
                {
                  backgroundColor: unit.height == 'cm' ? '#FF8B8B' : '#DCDCDC',
                },
              ]}>
              <MyText
                style={{textAlign: 'center', color: '#323232', fontSize: 12}}>
                Cm
              </MyText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.slider_container}>
          <View style={styles.slider_left_contianer}>
            <Slider
              style={styles.slider_left}
              step={1}
              minimumValue={0}
              maximumValue={12}
              value={heightInteger}
              onValueChange={val => setHeightInteger(val)}
              thumbTintColor="#FF8B8B"
              minimumTrackTintColor="#DCDCDC"
              maximumTrackTintColor="#DCDCDC"
            />

            {len.map((item, idx) => (
              <>
                <View
                  key={Math.random() * idx}
                  style={[styles.dash_sm_left, {left: 26.5 + idx * 22}]}
                />
                <View
                  key={idx}
                  style={[styles.dash_left, {left: 15.5 + idx * 22}]}
                />
              </>
            ))}
          </View>
          <View>
            {onBoardingDetails.gender == 'male' ? (
              <Boy width={200} height={240} />
            ) : (
              <Girl
                style={{
                  width: 100,
                  height: 250,
                }}
              />
            )}
          </View>
          <View style={styles.slider_right_container}>
            <Slider
              style={styles.slider_right}
              step={1}
              minimumValue={0}
              maximumValue={12}
              thumbTintColor="#FF8B8B"
              minimumTrackTintColor="#DCDCDC"
              maximumTrackTintColor="#DCDCDC"
              value={heightDecimal}
              onValueChange={val => setHeightDecimal(val)}
            />
            {len.map((_, idx) => (
              <>
                <View
                  key={idx}
                  style={[styles.dash_right, {left: 15.5 + idx * 22}]}
                />
                <View
                  key={Math.random() + idx + Math.random()}
                  style={[styles.dash_sm_right, {left: 26.5 + idx * 22}]}
                />
              </>
            ))}
          </View>
        </View>
      </View>

      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          paddingTop: 20,
          height: 160,
        }}>
        <RadialSlider
          isHideLines={true}
          isHideMarkerLine={true}
          isHideButtons={true}
          isHideCenterContent={true}
          isHideTailText={true}
          sliderTrackColor="#D9D9D9"
          sliderWidth={16}
          thumbRadius={12}
          thumbColor="#FF8B8B"
          thumbBorderWidth={2}
          //  linearGradient={{offset: '0%', color: '#ffaca6'}}
          value={weight}
          min={0}
          max={200}
          radius={80}
          markerCircleColor="#FF8B8B"
          onChange={wt => setWeight(wt)}
        />

        <View style={{alignItems: 'center', position: 'absolute', bottom: 20}}>
          <TextInput
            style={styles.tab_text}
            keyboardType="numeric"
            placeholder="-"
            value={`${weight}`}
            editable={false}
            selectTextOnFocus={false}
          />
          <View
            style={{
              backgroundColor: '#DCDCDC',
              flexDirection: 'row',
              borderRadius: 16,
            }}>
            <TouchableOpacity
              onPress={() => setUnit({...unit, weight: 'kg'})}
              style={[
                styles.tab,
                {
                  backgroundColor: unit.weight == 'kg' ? '#FF8B8B' : '#DCDCDC',
                },
              ]}>
              <MyText
                style={{textAlign: 'center', color: '#323232', fontSize: 12}}>
                Kg
              </MyText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setUnit({...unit, weight: 'lbs'})}
              style={[
                styles.tab,
                {
                  backgroundColor: unit.weight == 'lbs' ? '#FF8B8B' : '#DCDCDC',
                },
              ]}>
              <MyText
                style={{textAlign: 'center', color: '#323232', fontSize: 12}}>
                Lbs
              </MyText>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={loading ? styles.button_blue_disabled : styles.button_blue}
        onPress={async () => {
          postOnBoardingDetails();
        }}>
        {loading ? (
          <>
            <ActivityIndicator size="large" color="#3460D7" />
          </>
        ) : (
          <MyText style={styles.button_blue_text}>Done</MyText>
        )}
      </TouchableOpacity>
    </>
  );
};

const Step5 = props => {
  const {
    navigation,
    changeActiveEmail,
    onBoardingStep,
    setOnBoardingStep,
    onBoardingDetails,
    setOnBoardingDetails,
  } = props;
  const authContext = useContext(AuthContext);

  const animation = useRef();

  useEffect(() => {
    animation?.current?.play();
  }, []);

  return (
    <>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <View>
          <LottieView
            source={assets.lottieFiles.rollingCheck}
            style={{width: 200}}
            ref={animation}
            autoplay={false}
            loop={false}
          />
        </View>
        <MyText
          style={{
            fontSize: 20,
            color: '#323232',
            fontWeight: '700',
            marginBottom: 6,
          }}>
          Great!
        </MyText>
        <MyText
          style={{
            fontSize: 18,
            color: '#323232',
            fontWeight: '500',
            width: 240,
            textAlign: 'center',
          }}>
          We are happy to welcome you onboard.
        </MyText>
      </View>
      <TouchableOpacity
        style={[styles.button_blue]}
        // onPress={() => {
        //   setOnBoardingStep(1);
        //   if (!changeActiveEmail) navigation.navigate('VirtualProfilesList');
        //   authContext?.authenticate();
        // }}
      >
        <MyText style={styles.button_blue_text}>Continue</MyText>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  modal_content: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#ffffff',
    width: '100%',
    height: 450,
    paddingTop: 40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  dash_left: {
    width: 1,
    height: 20,
    backgroundColor: '#D9D9D9',
    position: 'absolute',
    top: 18,
  },
  dash_sm_left: {
    width: 1,
    height: 12,
    backgroundColor: '#D9D9D9',
    position: 'absolute',
    top: 18,
  },
  dash_right: {
    width: 1,
    height: 20,
    backgroundColor: '#D9D9D9',
    position: 'absolute',
    left: 37.5,
    bottom: 18,
  },
  dash_sm_right: {
    width: 1,
    height: 12,
    backgroundColor: '#d9d9d9',
    position: 'absolute',
    bottom: 18,
  },
  arrow_back: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  slider_container: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'relative',
    height: 300,
  },
  selectedTextStyle: {
    color: '#323232',
    fontSize: 14,
  },
  inputSearchStyle: {
    color: '#323232',
  },
  iconStyle: {},
  placeholderStyle: {
    color: '#323232',
    fontSize: 14,
  },
  slider_left_contianer: {
    transform: [{rotate: '-90deg'}],
    position: 'absolute',
    left: -120,
  },
  slider_left: {
    width: 300,
    backgroundColor: '#D9D9D9',
  },
  slider_right_container: {
    transform: [{rotate: '-90deg'}],
    position: 'absolute',
    right: -120,
  },
  slider_right: {
    width: 300,
    backgroundColor: '#D9D9D9',
  },
  tab: {
    paddingVertical: 4,
    borderRadius: 16,
    width: 45,
  },
  tab_text: {
    alignItems: 'center',
    textAlign: 'center',
    height: 40,
    fontSize: 16,
    fontWeight: '500',
    marginRight: 10,
    color: '#323232',
  },
  box_outside: {
    //flexGrow: 1,
    //alignItems: 'center',
    //width: 170,
    // height: 190,
    borderWidth: 1,
    borderRadius: 14,
    borderColor: '#6750A40D',
    // backgroundColor:
    //   'background: linear-gradient(0deg, rgba(103, 80, 164, 0.05), rgba(103, 80, 164, 0.05)), #FFFFFF',
  },
  box_inside: {
    // height: '90%',
    // width: '98%',
    // backgroundColor: '#ffffff',
    borderRadius: 14,
    marginTop: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gender_animation: {
    position: 'absolute',
    width: 200,
  },
  gender_text: {
    // position: 'absolute',
    // bottom: -10,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    color: '#323232',
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#323232',
  },
  subHeading: {
    color: '#323232',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  container: {
    backgroundColor: '#f2f2f2',
    height: '100%',
    paddingTop: 55,
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
  inputContainer: {
    height: 45,
    flexDirection: 'row',
    marginBottom: 30,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  heightinputContainer: {
    marginBottom: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  textField1: {
    borderColor: '#49454F',
    borderWidth: 1,
    borderRadius: 8,

    marginLeft: 14,
    paddingLeft: 10,
    height: 52,
    width: 95,
  },
  heightField: {
    borderColor: '#49454F',
    borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginLeft: 14,
    textAlign: 'center',
    paddingLeft: 10,
    height: 52,
    width: 95,
  },
  textField2: {
    borderColor: '#49454F',
    borderWidth: 1,
    borderRadius: 5,
    //  marginLeft: 14,
    paddingLeft: 10,
    height: 52,
    width: 95,
  },
  textField: {
    borderColor: '#49454F',
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 14,
    paddingLeft: 10,
    width: '90%',
    height: 60,
  },
});

export default OnBoardingScreen;
