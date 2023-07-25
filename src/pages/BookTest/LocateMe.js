import React, {useState, useEffect} from 'react';
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MyText from '../../components/MyText';
import LocationPin from '../../../assets/location_pin.svg';
import {Flex} from 'native-base';
import Map from '../../components/Map';

const addressSavingOptions = ['Home', 'Office', 'Other'];

const LocateMe = ({navigation, route}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address, setAddress] = useState({
    house: '',
    apartment: '',
    landmark: '',
    addressType: '',
  });

  const [markerLatLng, setMarkerLatLng] = useState({
    latitude: 28.62243758781894,
    longitude: 77.2031226195395,
  });
  const [region, setRegion] = useState({
    latitude: 28.62243758781894,
    longitude: 77.2031226195395,
    latitudeDelta: 0.96,
    longitudeDelta: 0.891,
  });

  const [mapAddress, setMapAddress] = useState({
    locality: '',
    city: '',
    state: '',
    country: '',
    formatted_address: '',
  });

  const getLocality = () => {
    if (mapAddress.locality.trim() === ',') {
      if (mapAddress.city.trim() === ',') {
        return mapAddress.state;
      } else {
        return mapAddress.city;
      }
    } else return mapAddress.locality;
  };

  const handleChange = (k, v) => {
    setAddress({...address, [k]: v});
  };

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

  return (
    <SafeAreaView style={{flexGrow: 1}}>
      <TouchableOpacity
        style={{position: 'absolute', top: 20, left: 20, zIndex: 1}}
        onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" color="#1C1B1F" size={24} />
      </TouchableOpacity>
      <View style={{height: 500}}>
        <Map
          height={500}
          showLocateMeButton={true}
          locateMeButtonText="LOCATE ME"
          hidePlacesAutoComplete={true}
          markerLatLng={markerLatLng}
          setMarkerLatLng={setMarkerLatLng}
          region={region}
          setRegion={setRegion}
          setAddress={setMapAddress}
        />
      </View>

      <View
        style={{
          backgroundColor: '#E5E5E5',
          height: 300,
          paddingHorizontal: 20,
          paddingTop: 20,
          flexGrow: 1,
        }}>
        <View style={{flex: 1}}>
          <MyText style={{color: '#323232', fontWeight: '700', fontSize: 16}}>
            Select Delivery Location
          </MyText>

          <Flex mt={8} direction="row">
            <LocationPin style={{marginRight: 14}} height={30} width={20} />
            <View style={{flex: 1}}>
              <Flex direction="row" justifyContent="space-between">
                <MyText style={{color: '#323232', fontWeight: '700'}}>
                  {getLocality()}
                </MyText>
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    borderColor: '#49454F',
                    borderRadius: 4,
                    paddingVertical: 4,
                    paddingHorizontal: 14,
                    backgroundColor: '#ffffff',
                  }}
                  onPress={() => setIsModalOpen(true)}>
                  <MyText style={{color: '#3259CB', fontWeight: '500'}}>
                    CHANGE
                  </MyText>
                </TouchableOpacity>
              </Flex>
              <MyText
                style={{
                  color: '#323232',
                  fontWeight: '500',
                  width: '68%',
                  minWidth: '68%',
                  maxWidth: '100%',
                }}>
                {mapAddress.formatted_address}
              </MyText>
            </View>
          </Flex>
        </View>
        <View style={{marginBottom: 40}}>
          <TouchableOpacity
            style={styles.button_blue}
            onPress={() => navigation.navigate('ScheduleTest')}>
            <MyText style={styles.button_blue_text}>Confirm Location</MyText>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}>
        <TouchableOpacity
          style={{position: 'absolute', top: 20, left: 20, zIndex: 1}}
          onPress={() => setIsModalOpen(false)}>
          <MaterialIcons name="arrow-back" color="#1C1B1F" size={24} />
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: '#E5E5E5',
            flexGrow: 1,
            paddingTop: 40,
            paddingHorizontal: 20,
          }}>
          <Flex mt={8} mb={5} direction="row">
            <LocationPin style={{marginRight: 14}} height={30} width={20} />
            <View style={{flex: 1}}>
              <Flex direction="row" justifyContent="space-between">
                <MyText style={{color: '#323232', fontWeight: '700'}}>
                  {getLocality()}
                </MyText>
              </Flex>
              <MyText
                style={{color: '#323232', fontWeight: '500', width: '100%'}}>
                {mapAddress.formatted_address}
              </MyText>
            </View>
          </Flex>
          <TextInput
            style={[styles.textInput]}
            placeholder="House/Flat/ Block Number"
            placeholderTextColor="rgba(50, 50, 50, 0.6)"
            value={address.house}
            onChangeText={val => handleChange('house', val)}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Apartment/Road/Area"
            placeholderTextColor="rgba(50, 50, 50, 0.6)"
            value={address.apartment}
            onChangeText={val => handleChange('apartment', val)}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Landmark"
            placeholderTextColor="rgba(50, 50, 50, 0.6)"
            value={address.landmark}
            onChangeText={val => handleChange('landmark', val)}
          />
          <MyText
            style={{
              marginVertical: 20,
              color: '#323232',
              fontSize: 16,
              fontWeight: '700',
            }}>
            Save As
          </MyText>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {addressSavingOptions.map((item, idx) => {
              return (
                <TouchableOpacity
                  key={idx}
                  style={styles.radio_row}
                  onPress={() => handleChange('addressType', item)}>
                  <View style={styles.radio}>
                    {address.addressType === item && (
                      <View style={styles.radio_selected} />
                    )}
                  </View>
                  <MyText style={styles.radio_text}>{item}</MyText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View style={{backgroundColor: '#E5E5E5'}}>
          <View style={{marginBottom: 40, paddingHorizontal: 20}}>
            <TouchableOpacity
              style={styles.button_blue_disabled}
              onPress={() => setIsModalOpen(false)}>
              <MyText style={styles.button_blue_text_disabled}>
                Save & Proceed
              </MyText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default LocateMe;

const styles = StyleSheet.create({
  textInput: {
    marginTop: 20,
    height: 50,
    borderColor: '#49454F',
    borderWidth: 1,
    borderRadius: 4,
    paddingLeft: 14,
    fontFamily: 'Poppins',
    fontSize: 13,
  },
  radio_row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  radio: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderColor: '#4789C7',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radio_selected: {
    backgroundColor: '#4789C7',
    height: '75%',
    width: '75%',
    borderRadius: 20,
  },
  radio_text: {
    fontFamily: 'Poppins',
    fontSize: 15,
    fontWeight: '500',
    color: '#323232',
    marginLeft: 6,
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
