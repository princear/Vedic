import DeviceInfo from 'react-native-device-info';

export const getDeviceInfo = async () => {
  const device = {};

  try {
    device.deviceId = DeviceInfo.getDeviceId();
    device.deviceType = DeviceInfo.getDeviceType();
    device.deviceName = await DeviceInfo.getDeviceName();
    device.uniqueId = await DeviceInfo.getUniqueId();
    device.manufacturer = await DeviceInfo.getManufacturer();
    device.androidId = await DeviceInfo.getAndroidId();
  } catch (error) {
    console.error('Error retrieving device info:', error);
  }

  return device;
};
