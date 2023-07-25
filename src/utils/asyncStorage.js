import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeDataToAsyncStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error('AsyncStorage store error:', error);
    throw error;
  }
};

export const getDataFromAsyncStorage = async key => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data;
  } catch (error) {
    console.error('AsyncStorage get error:', error);
    throw error;
  }
};

export const removeDataFromAsyncStorage = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log('AsyncStorage remove error', e);
  }
};

export const clearAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    console.log('AsyncStorage clear error', e);
  }
};
