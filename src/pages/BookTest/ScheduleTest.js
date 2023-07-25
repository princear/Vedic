import React, {useState, useEffect, useRef} from 'react';
import assets from '../../../assets';
import MyText from '../../components/MyText';
import LottieView from 'lottie-react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {StyleSheet, TouchableOpacity, View, Pressable} from 'react-native';
import {Modal} from 'react-native';

const scheduleDates = [
  {month: 'Mar', date: 20, day: 'Mon'},
  {month: 'Mar', date: 21, day: 'Tue'},
  {month: 'Mar', date: 22, day: 'Wed'},
  {month: 'Mar', date: 23, day: 'Thu'},
  {month: 'Mar', date: 24, day: 'Fri'},
  {month: 'Mar', date: 25, day: 'Sat'},
  {month: 'Mar', date: 26, day: 'Sun'},
];

const scheduleTimings = [
  '06:00-07:00 AM',
  '07:30-08:30 AM',
  '09:00-10:00 AM',
  '10:30-11:30 AM',
  '12:00-01:00 AM',
  '01:30-02:30 PM',
  '03:00-04:00 PM',
  '04:30-05:30 PM',
];

const ScheduleTest = ({navigation, route}) => {
  const [booked, setBooked] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const animation1 = useRef(null);
  const animation2 = useRef(null);
  useEffect(() => {
    animation1?.current?.play();
    animation2?.current?.play();
  }, [booked, isModalOpen]);

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

  const renderSlotDates = () => {
    return scheduleDates.map((item, idx) => {
      return (
        <Pressable
          key={idx}
          style={[
            styles.col,
            {
              backgroundColor:
                selectedDate === item.date ? '#3259CB' : '#ffffff',
            },
          ]}
          onPress={() => setSelectedDate(item.date)}>
          <MyText
            style={{
              fontSize: 12,
              color: selectedDate === item.date ? '#98ace5' : '#989898',
              fontWeight: '500',
            }}>
            {item.month}
          </MyText>
          <MyText
            style={{
              marginVertical: 6,
              color: selectedDate === item.date ? '#ffffff' : '#323232',
              fontSize: 15,
              fontWeight: '500',
            }}>
            {item.date}
          </MyText>
          <MyText
            style={{
              fontSize: 12,
              color: selectedDate === item.date ? '#98ace5' : '#989898',
              fontWeight: '500',
            }}>
            {item.day}
          </MyText>
        </Pressable>
      );
    });
  };

  const renderSlotTimings = () => {
    return scheduleTimings.map((item, idx) => {
      return (
        <Pressable
          key={idx}
          style={[
            styles.slot_time_container,
            {
              backgroundColor:
                selectedTimeSlot === item ? '#3259CB' : '#FFFFFF',
            },
          ]}
          onPress={() => setSelectedTimeSlot(item)}>
          <MyText
            style={{
              fontSize: 12,
              fontWeight: '500',
              color: selectedTimeSlot === item ? '#FFFFFF' : '#323232',
            }}>
            {item}
          </MyText>
        </Pressable>
      );
    });
  };

  const renderContent = () => {
    return (
      <SafeAreaView
        style={{
          flexGrow: 1,
          paddingTop: 20,
          paddingHorizontal: 20,
          backgroundColor: '#E5E5E5',
        }}>
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
            Date & Time Slot
          </MyText>
        </View>

        <View style={{flex: 1}}>
          <MyText
            style={{
              fontSize: 15,
              color: '#323232',
              fontWeight: '600',
              width: '70%',
              marginBottom: 20,
            }}>
            Select date and time slot according to your availability
          </MyText>

          <View
            elevation={1}
            style={{
              flex: 1,
              backgroundColor: '#ffffff',
              borderRadius: 8,
              paddingVertical: 14,
              paddingHorizontal: 10,
            }}>
            <MyText style={{fontSize: 15, fontWeight: '700', color: '#323232'}}>
              Select Date
            </MyText>

            <View
              style={{
                marginTop: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
              }}>
              {renderSlotDates()}
            </View>
            <MyText
              style={{
                fontSize: 15,
                fontWeight: '700',
                color: '#323232',
                marginTop: 30,
              }}>
              Select Time Slot
            </MyText>

            <View
              style={{
                marginTop: 10,
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              {renderSlotTimings()}
            </View>
          </View>
        </View>
        <View style={{height: 130, justifyContent: 'center'}}>
          <TouchableOpacity
            style={styles.button_blue}
            onPress={() => setBooked(true)}>
            <MyText style={styles.button_blue_text}>Book Slot</MyText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  const renderSuccessScreen = () => {
    return (
      <SafeAreaView
        style={{
          flexGrow: 1,
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            height: 300,
            width: '100%',
          }}>
          <LottieView
            ref={animation1}
            autoplay={true}
            loop={false}
            source={assets.lottieFiles.success}
          />
        </View>
        <MyText
          style={{
            fontSize: 20,
            fontWeight: '700',
            color: '#323232',
            marginBottom: 10,
          }}>
          Congratulations!
        </MyText>
        <MyText
          style={{
            color: '#323232',
            textAlign: 'center',
            marginBottom: 20,
            width: '55%',
          }}>
          Your slot for <MyText style={{fontWeight: '700'}}>25th March</MyText>,
          <MyText style={{fontWeight: '700'}}> 06:00 AM</MyText> has been booked
          successfully.
        </MyText>
        <TouchableOpacity onPress={() => setIsModalOpen(true)}>
          <MyText style={{color: '#3259CB', fontWeight: '500'}}>
            VIEW DETAILS
          </MyText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  };

  return (
    <>
      {booked ? renderSuccessScreen() : renderContent()}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}>
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.9)',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 20,
          }}>
          <View
            style={{
              backgroundColor: '#ffffff',
              flexGrow: 1,
              maxHeight: 400,
              width: '100%',
              borderRadius: 4,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{position: 'absolute', top: 10, right: 12, zIndex: 1}}
              onPress={() => setIsModalOpen(false)}>
              <MaterialIcons name="close" size={20} color="#EA4949" />
            </TouchableOpacity>
            <View
              style={{
                height: 140,
                width: '100%',
              }}>
              <LottieView
                ref={animation2}
                autoplay={true}
                loop={false}
                source={assets.lottieFiles.successCalender}
              />
            </View>
            <MyText style={{color: '#323232', textAlign: 'center'}}>
              Vikalp, we’ve got you
            </MyText>
            <MyText style={{color: '#323232', textAlign: 'center'}}>
              confirmed for your appointment.
            </MyText>
            <View style={{flexDirection: 'row', marginVertical: 12}}>
              <MyText
                style={{color: '#323232', fontSize: 16, fontWeight: '700'}}>
                25th March
              </MyText>
              <MyText style={{marginHorizontal: 8, color: '#a6a6a6'}}>|</MyText>
              <MyText
                style={{color: '#323232', fontSize: 16, fontWeight: '700'}}>
                06:00 AM
              </MyText>
            </View>
            <MyText
              style={{color: '#323232', width: '65%', textAlign: 'center'}}>
              Block D, A-289, Sai Aprtment, Kalkaji, New Delhi, India
            </MyText>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ScheduleTest;

const styles = StyleSheet.create({
  col: {
    backgroundColor: '#ffffff',
    width: 40,
    height: 85,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginBottom: 10,
  },
  slot_time_container: {
    borderWidth: 0.5,
    borderColor: '#747474',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 110,
    paddingVertical: 2,
    marginBottom: 4,
    marginHorizontal: 2,
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
