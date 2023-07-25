/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {useState, useEffect} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  ImageBackground,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {NativeBaseProvider, Box, Center} from 'native-base';
import AppBar from './src/components/AppBar.js';
import AppFooter from './src/components/AppFooter.js';
import SampleList from './src/components/FlatList.js';
import HomeScreen from './src/pages/HomeScreen.js';
import staticImage from './assets/Logo.png';
import SplashBackImage from './assets/HomeBack.png';
import OnBoardingScreen from './src/pages/OnBoardingScreen.js';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */
const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  const [align, setAlign] = useState('center');
  const [alignsecond, setAlignsecond] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    let myTimeout = setTimeout(() => {
      setAlign('flex-start'), setAlignsecond(true);
    }, 3000);
    return () => clearTimeout(myTimeout);
  }, []);

  return !alignsecond ? (
    <View style={[styles.container, {justifyContent: align}]}>
      <ImageBackground
        source={SplashBackImage}
        resizeMode="cover"
        style={styles.image}>
        <Image
          source={staticImage}
          resizeMode="contain"
          style={{width: 250, height: 250, alignSelf: 'center'}}
        />
      </ImageBackground>
      {/* <Text
        style={{
          fontSize: 16,
          fontWeight: '700',
          color: '#ffffff',
          letterSpacing: 3,
          marginTop: -40,
        }}>
        MAD MACHINES
      </Text> */}
    </View>
  ) : (
    <HomeScreen />
    // <OnBoardingScreen />
  );

  return (
    <NativeBaseProvider>
      <Center>
        <AppBar />
      </Center>
      <SampleList />
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  image: {
    flex: 1,
    width: 500,
    justifyContent: 'center',
  },
  highlight: {
    fontWeight: '700',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#090909',
  },
});

export default App;
