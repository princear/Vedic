import React, {useEffect, useRef} from 'react';
import LottieView from 'lottie-react-native';
import MyText from '../components/MyText';
import assets from '../../assets';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';

const ActivityScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.arrow_back}
        onPress={() => navigation.navigate('Health')}>
        <MaterialIcons name="arrow-back" color="#1C1B1F" size={24} />
      </TouchableOpacity>
      {true ? <EmptyScreen /> : <Text>Activities</Text>}
    </SafeAreaView>
  );
};

const EmptyScreen = () => {
  const animation = useRef();
  useEffect(() => {
    animation?.current?.play();
  }, []);

  return (
    <View style={styles.empty_screen}>
      <View style={{height: 300, width: '100%'}}>
        <LottieView
          ref={animation}
          autoplay={true}
          loop={true}
          source={assets.lottieFiles.sleepingPanda}
        />
      </View>
      <MyText style={styles.empty_heading}>No activities, yet!</MyText>
      <MyText style={styles.empty_subheading}>
        There are no activity recorded.
      </MyText>
      <MyText style={styles.empty_subheading}>
        Sometimes it’s okay to rest for a while..
      </MyText>
    </View>
  );
};

export default ActivityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
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
