import React, {useEffect} from 'react';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {requestLocationPermission} from '../utils/permissions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {GOOGLE_MAP_API_KEY} from '@env';
import MyText from './MyText';

const Map = props => {
  const {
    height,
    markerLatLng,
    setMarkerLatLng,
    region,
    setRegion,
    setAddress,
    hidePlacesAutoComplete = false,
    showLocateMeButton,
    locateMeButtonStyles,
    locateMeButtonText,
  } = props;
  const {width} = Dimensions.get('window');

  const getCurrentLocation = () => {
    requestLocationPermission();
    Geolocation.getCurrentPosition(
      position => {
        // latitude: 28.679079,
        // longitude: 77.06971,
        setMarkerLatLng({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setRegion({
          ...region,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const getAddress = () => {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?key=${GOOGLE_MAP_API_KEY}&address=` +
        `${markerLatLng.latitude}` +
        ',' +
        `${markerLatLng.longitude}`,
    )
      .then(res => res.json())
      .then(response => {
        const formatted_address = response.results[0].formatted_address;
        const locality = getLocality(response) + ', ';
        const city = getCityName(response) + ', ';
        const state = getStateName(response) + ' ';
        const country = getCountryName(response);

        setAddress({locality, city, state, country, formatted_address});
      });
  };

  const getLocality = data => {
    const localityComponent = data.results[0].address_components.find(
      component => {
        return component.types.includes('sublocality_level_1');
      },
    );
    const locality = localityComponent ? localityComponent.long_name : '';
    return locality;
    //  console.warn(cityComponent);
  };

  const getCityName = data => {
    const cityComponent = data.results[0].address_components.find(component => {
      return component.types.includes('locality');
    });
    const city = cityComponent ? cityComponent.long_name : '';
    return city;
  };

  const getStateName = data => {
    const stateComponent = data.results[0].address_components.find(
      component => {
        return component.types.includes('administrative_area_level_1');
      },
    );
    const state = stateComponent ? stateComponent.long_name : '';

    return state;
  };

  const getCountryName = data => {
    const countryComponent = data.results[0].address_components.find(
      component => {
        return component.types.includes('country');
      },
    );

    const country = countryComponent ? countryComponent.long_name : '';

    return country;
  };

  useEffect(() => {
    getAddress();
  }, []);

  return (
    <View style={styles.map_container}>
      {!hidePlacesAutoComplete && (
        <>
          <TouchableOpacity
            onPress={getCurrentLocation}
            style={{position: 'absolute', bottom: 53, right: 30, zIndex: 100}}>
            <MaterialIcons name="my-location" size={20} color="#3460D7" />
          </TouchableOpacity>
          <GooglePlacesAutocomplete
            styles={{
              container: styles.search_container,
              textInput: styles.text_input,
            }}
            fetchDetails={true}
            placeholder="Search"
            onPress={(data, details = null) => {
              setMarkerLatLng({
                latitude: details?.geometry?.location?.lat,
                longitude: details?.geometry?.location?.lng,
              });
              setRegion({
                ...region,
                latitude: details?.geometry?.location?.lat,
                longitude: details?.geometry?.location?.lng,
              });
            }}
            query={{
              key: GOOGLE_MAP_API_KEY,
              language: 'en',
            }}
          />
        </>
      )}
      <MaterialIcons
        name="location-pin"
        size={50}
        color="#DC1D23"
        style={{position: 'absolute', top: '42.5%', zIndex: 1}}
      />
      <MapView
        style={{height, width, zIndex: -1}}
        region={region}
        onRegionChange={e => {
          setMarkerLatLng({
            latitude: e.latitude,
            longitude: e.longitude,
          });
        }}
        onRegionChangeComplete={() => {
          getAddress();
        }}>
        {/* <Marker coordinate={markerLatLng} /> */}
      </MapView>

      {showLocateMeButton && (
        <TouchableOpacity
          style={
            locateMeButtonStyles ? locateMeButtonStyles : styles.locateMeButton
          }
          onPress={getCurrentLocation}>
          <MaterialIcons name="my-location" size={20} color="#3460D7" />
          <MyText style={styles.locateMeButtonText}>
            {locateMeButtonText}
          </MyText>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({
  map_container: {
    alignItems: 'center',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  search_container: {
    position: 'absolute',
    bottom: 30,
    width: '94%',
    padding: 8,
    paddingBottom: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000000',
    elevation: 12,
    zIndex: 10,
  },
  text_input: {
    borderWidth: 1,
    borderColor: '#dfdfdf',
    paddingRight: 40,
    zIndex: 10,
  },
  locateMeButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    position: 'absolute',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 40,
    bottom: 10,
  },
  locateMeButtonText: {
    color: '#3259CB',
    marginLeft: 6,
    fontSize: 15,
    fontWeight: '700',
  },
});
