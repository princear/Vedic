import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, TouchableOpacity} from 'react-native';
import {Image, StyleSheet, View, Text} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import assets from '../../assets';
import LottieView from 'lottie-react-native';
import Carousel from 'react-native-reanimated-carousel';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import MyText from '../components/MyText';
import staticImage from '../../assets/FruitsBottle-removebg.png';

const data = [
  {
    heading: 'The Health Connoisseur',
    subHeading:
      'We help by recommending you better ways to lead a healthy life.',
  },
  {
    heading: 'Understand your Body’s Language',
    subHeading:
      'Know different metrics of your body with the help of a designed questionnaire.',
  },
  {
    heading: 'Easy Solution to your Problems',
    subHeading:
      'We will help you diagnose any unfriendly exceptions within your system.',
  },
];

const IntroScreen = ({navigation}) => {
  const width = Dimensions.get('window').width;
  const animation = useRef(null);
  const basePath = '../../assets/';
  const [introStep, setIntroStep] = useState(0);

  useEffect(() => {
    animation?.current?.play();
  }, [introStep]);

  const renderAnimation = index => {
    animation?.current?.play();
    if (index == 0) {
      return (
        <View
          style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            height: 300,
            width: '100%',
          }}>
          <LottieView
            ref={animation}
            autoplay={true}
            loop={true}
            source={assets.lottieFiles.yoga}
          />
          <LottieView
            ref={animation}
            autoplay={true}
            loop={true}
            source={assets.lottieFiles.Fruits}
            style={{
              width: 100,
              position: 'absolute',
              right: 12,
              bottom: 8,
              height: 100,

              alignSelf: 'center',
            }}
          />
          {/* <Image
            source={staticImage}
            resizeMode="cover"
            style={{
              width: 100,
              position: 'absolute',
              right: 30,
              bottom: 20,
              height: 100,
              alignSelf: 'center',
            }}
          /> */}
        </View>
      );
    } else if (index == 1) {
      return (
        <View
          style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            height: 260,
            width: '100%',
          }}>
          <LottieView
            ref={animation}
            autoplay={true}
            loop={true}
            source={assets.lottieFiles.getThingsDone}
          />
        </View>
      );
    } else if (index == 2) {
      return (
        <View style={{position: 'absolute', height: 300, width: '100%'}}>
          <LottieView
            ref={animation}
            autoplay={true}
            loop={true}
            source={assets.lottieFiles.search}
          />
        </View>
      );
    }
  };

  return (
    <View style={{height: '100%', alignItems: 'center'}}>
      {/* {introStep > 1 && (
        <TouchableOpacity
          onPress={() => {
            setIntroStep(introStep - 1);
            console.warn('TAPPED');
          }}>
          <MaterialIcons name="arrow-back" style={styles.arrow_back} />
        </TouchableOpacity>
      )} */}
      <GestureHandlerRootView>
        <Carousel
          loop={false}
          autoPlay={false}
          width={width}
          data={data}
          scrollAnimationDuration={200}
          onSnapToItem={index => {
            setIntroStep(index);
            animation?.current?.play();
          }}
          renderItem={({index, item}) => {
            return (
              <>
                <View style={styles.imageContainer}>
                  <Image
                    style={styles.cloud}
                    source={require(basePath + 'bg-blue.png')}
                  />
                  {renderAnimation(index)}
                </View>
                <View style={styles.content}>
                  <View style={styles.alignCenter}>
                    <Text style={styles.title}>{data[index].heading}</Text>
                    <MyText style={styles.subtitle}>
                      {data[index].subHeading}
                    </MyText>
                  </View>
                </View>
              </>
            );
          }}
        />
      </GestureHandlerRootView>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',

          position: 'absolute',
          bottom: 160,
        }}>
        {[1, 2, 3].map((_, i) => {
          return (
            <View
              key={i}
              style={
                introStep == i
                  ? styles.active__bluedot
                  : styles.inactive__bluedot
              }
            />
          );
        })}
      </View>
      <View
        style={[
          styles.footer_container,
          {justifyContent: introStep == 3 ? 'flex-end' : 'space-between'},
        ]}>
        {introStep < 3 && (
          <TouchableOpacity
            //  onPress={() => navigation.navigate('Login')}
            onPress={() => navigation.navigate('ChooseLanguage')}>
            <Text
              style={{
                fontSize: 14,
                color: '#000000',
                fontFamily: 'Poppins-Light',
              }}>
              Skip
            </Text>
          </TouchableOpacity>
        )}

        {introStep < 2 && (
          <TouchableOpacity onPress={() => setIntroStep(introStep + 1)}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: '#000000',
                  fontSize: 14,

                  fontFamily: 'Poppins-Regular',
                }}>
                Next
              </Text>
              <Entypo
                name="chevron-thin-right"
                style={{
                  fontSize: 20,
                  marginLeft: 10,
                  color: '#1C1B1F',
                }}
              />
            </View>
          </TouchableOpacity>
        )}
        {introStep == 2 && (
          <TouchableOpacity
            style={styles.button_blue}
            // onPress={() => navigation.navigate('Login')}>
            onPress={() => navigation.navigate('ChooseLanguage')}>
            <Text style={styles.button_blue_text}>Get Started</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
    marginVertical: 50,
  },
  arrow_back: {
    fontSize: 20,
    color: '#1C1B1F',
    position: 'absolute',
    top: 26,
    left: 20,
  },
  cloud: {
    width: '100%',
    height: 330,
  },
  yoga: {
    position: 'absolute',
  },
  alignCenter: {alignItems: 'center'},
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    //  fontWeight: '700',
    textAlign: 'center',
    color: '#323232',
    marginBottom: 14,
    width: 296,

    fontFamily: 'Poppins-Bold',
  },
  subtitle: {
    fontSize: 16,

    textAlign: 'center',
    width: 248,
    color: '#323232',
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
  footer_container: {
    position: 'absolute',
    width: '100%',
    height: 30,
    bottom: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  button_blue: {
    height: 40,
    width: 130,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 50,
    backgroundColor: '#3460D7',
    justifyContent: 'center',
  },
  button_blue_text: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
});

export default IntroScreen;
