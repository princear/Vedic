import React, {useEffect} from 'react';
import MyText from '../components/MyText';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {StyleSheet, TouchableOpacity} from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';

const ProfileScreen = ({navigation}) => {
  useEffect(() => {
    crashlytics().log('Profile Screen mounted');
    return () => {
      crashlytics().log('Profile Screen unMounted');
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.arrow_back}
        onPress={() => navigation.navigate('Health')}>
        <MaterialIcons name="arrow-back" color="#1C1B1F" size={24} />
      </TouchableOpacity>
      <MyText style={{marginTop: 20}}>Profile Page</MyText>
      <TouchableOpacity
        onPress={() => navigation.navigate('CheckZipCode')}
        style={{
          marginTop: 10,
          backgroundColor: '#3259CB',
          width: 100,
          padding: 8,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <MyText style={{color: '#ffffff'}}>Book a test</MyText>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Questionnaire')}
        style={{
          marginTop: 10,
          backgroundColor: '#3259CB',
          width: 120,
          padding: 8,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <MyText style={{color: '#ffffff'}}>Questionnaire</MyText>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'red',
    height: 300,
    width: '100%',
  },
  modalBottomContainer: {
    borderTopWidth: 0.5,
    borderTopColor: '#818181',

    position: 'absolute',
    bottom: 0,
    height: 65,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',

    flexDirection: 'row',
  },
  active__bluedot: {
    width: 12,
    height: 8,
    backgroundColor: '#3460D7',
    borderRadius: 4,
    marginRight: 4,
  },
  inactive__bluedot: {
    width: 8,
    height: 8,
    backgroundColor: '#bfbfbf',
    borderRadius: 4,
    marginRight: 4,
  },
  arrow_back: {
    width: 30,
    position: 'absolute',
    top: 20,
    left: 20,
  },
  empty_screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  empty_heading: {
    fontWeight: '700',
    fontSize: 18,
    color: '#323232',
    marginTop: -20,
    marginBottom: 10,
  },
  empty_subheading: {
    fontWeight: '300',
    fontSize: 14,
    color: '#323232',
    textAlign: 'center',
    width: '70%',
  },
});
