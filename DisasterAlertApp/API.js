import { AsyncStorage } from 'react-native';

export const registerToken = async deviceToken => {
  const existing = await AsyncStorage.getItem('deviceToken');
  if (existing === deviceToken) {
    return;
  }

  const registerUrl =
    'https://imfpush.eu-gb.bluemix.net/imfpush/v1/apps/09df8e33-cc5c-4793-b235-7a39a00787eb/devices';
  fetch(registerUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      clientSecret: '1b368d68-8718-4b4e-97c8-24f624492100',
    },
    body: JSON.stringify({
      createdMode: 'API',
      createdTime: new Date().toISOString(),
      deviceId: 'deviceId_' + deviceToken,
      userId: 'userId_' + deviceToken,
      lastUpdatedTime: new Date().toISOString(),
      platform: 'A',
      token: deviceToken,
    }),
  })
    .then(res => {
      if (!res.ok) {
        alert('Error when registering a device');
      } else {
        return AsyncStorage.setItem('deviceToken', deviceToken);
      }
    })
    .catch(e => {
      console.error(e);
      alert('Error when registering a device: ' + e);
    });
};
