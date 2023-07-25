import React, {useEffect, useState} from 'react';
import moment from 'moment';
import MyText from '../../components/MyText';
import {CheckIcon, Select} from 'native-base';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CalendarPicker from 'react-native-calendar-picker';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import TwoPeople from '../../../assets/twoPeople.svg';
import ThreePeople from '../../../assets/threePeople.svg';
import Gender from '../../../assets/gender.svg';

const genders = [
  {label: 'Male', value: 'male'},
  {label: 'Female', value: 'female'},
];

const AddMember = ({navigation, route}) => {
  const [memberDetails, setMemberDetails] = useState({
    name: '',
    relation: '',
    age: '',
    gender: '',
    dob: '',
    mobile: '',
    email: '',
  });
  const [gender, setGender] = useState();
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isCalenderModalOpen, setIsCalenderModalOpen] = useState(false);
  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

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

  const Required = () => {
    return (
      <View style={{position: 'absolute', bottom: -14, left: 42}}>
        <MyText style={{color: '#49454F', fontSize: 10}}>**required</MyText>
      </View>
    );
  };

  const handleChange = (k, v) => {
    setMemberDetails({...memberDetails, [k]: v});
  };

  return (
    <SafeAreaView
      style={{
        flexGrow: 1,
        paddingTop: 20,
        paddingHorizontal: 20,
      }}>
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
            Add Member
          </MyText>
        </View>

        <View style={{flex: 1}}>
          <ScrollView>
            <View style={{flexDirection: 'row', marginBottom: 30}}>
              <MaterialIcons name="person-outline" size={24} color="#1c1b1f" />
              <TextInput
                style={styles.input}
                placeholder="Enter name"
                onChangeText={val => handleChange('name', val)}
              />
              <Required />
            </View>

            <View style={{flexDirection: 'row', marginBottom: 30}}>
              <TwoPeople height={30} width={20} />
              <TextInput
                style={styles.input}
                placeholder="Enter your relation"
                onChangeText={val => handleChange('relation', val)}
              />
              <Required />
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 30,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '45%',
                  justifyContent: 'center',
                }}>
                <ThreePeople width={20} height={20} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter age"
                  onChangeText={val => handleChange('age', val)}
                />
                <Required />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  width: '45%',
                  justifyContent: 'flex-end',
                }}>
                <Gender height={30} width={18} style={{marginRight: 16}} />
                <Select
                  borderColor={'#49454F'}
                  borderRadius={8}
                  minWidth={140}
                  height={50}
                  placeholder="Select Gender"
                  selectedValue={gender}
                  onValueChange={itemValue => {
                    setGender(itemValue);
                  }}
                  _selectedItem={{
                    bg: 'teal.600',
                    endIcon: <CheckIcon size={5} />,
                  }}
                  mt={1}>
                  {genders.map(item => {
                    return (
                      <Select.Item
                        key={item.value}
                        label={item.label}
                        value={item.value}
                      />
                    );
                  })}
                </Select>
                <Required />
              </View>
            </View>

            <View style={{flexDirection: 'row', marginBottom: 30}}>
              <MaterialCommunityIcons
                name="wallet-giftcard"
                size={24}
                color="#1c1b1f"
              />
              <TextInput
                style={styles.input}
                value={dateOfBirth}
                placeholder="Date of birth (dd/mm/yyyy)"
                onBlur={() => setIsCalenderModalOpen(false)}
                onFocus={() => setIsCalenderModalOpen(true)}
                onChangeText={() => setIsCalenderModalOpen(true)}
              />
              <TouchableOpacity
                style={{position: 'absolute', top: 11, right: 12}}
                onPress={() => setIsCalenderModalOpen(true)}>
                <MaterialIcons name="date-range" size={24} color="black" />
              </TouchableOpacity>
              <Required />
            </View>

            <View style={{flexDirection: 'row', marginBottom: 30}}>
              <MaterialCommunityIcons
                name="phone-outline"
                size={24}
                color="#1c1b1f"
              />
              <TextInput
                style={styles.input}
                placeholder="Enter contact number"
                onChangeText={val => handleChange('mobile', val)}
              />
            </View>
            <View style={{flexDirection: 'row', marginBottom: 30}}>
              <Ionicons name="at-sharp" size={24} color="#1C1B1F" />
              <TextInput
                style={styles.input}
                placeholder="Enter email"
                onChangeText={val => handleChange('email', val)}
              />
            </View>
          </ScrollView>
        </View>
      </View>
      <View style={{marginVertical: 20}}>
        <TouchableOpacity
          style={styles.button_blue}
          onPress={() => {
            setMemberDetails({
              ...memberDetails,
              dob: dateOfBirth,
              gender: gender,
            });
            navigation.navigate('MembersList');
          }}>
          <MyText style={styles.button_blue_text}>Add Member</MyText>
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
    </SafeAreaView>
  );
};

export default AddMember;

const styles = StyleSheet.create({
  input: {
    fontFamily: 'Poppins',
    flex: 1,
    borderRadius: 8,
    marginLeft: 14,
    paddingLeft: 14,
    height: 50,
    borderWidth: 1,
    borderColor: '#49454F',
  },
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
