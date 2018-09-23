/**
 * Provides functions for connecting with API services.
 */
import { AsyncStorage } from 'react-native';

// for easy testing in localhost
const IS_LOCAL = false;

// Url for bluemix API
const BASE_API_URL = IS_LOCAL
  ? 'https://cad07e05.ngrok.io'
  : 'https://disaster-api.eu-gb.mybluemix.net';

// Client secreted from "Push notification" service
const CLIENT_SECRET = '1b368d68-8718-4b4e-97c8-24f624492100';

// Application id from "Push notification" service
const APP_ID = '09df8e33-cc5c-4793-b235-7a39a00787eb';

/**
 * Get from cache or generate and use userId.
 */
const getUserId = async () => {
  const existing = await AsyncStorage.getItem('userId');
  if (existing) {
    return existing;
  }
  const { userId } = await fetch(`${BASE_API_URL}/api/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => res.json());
  await AsyncStorage.setItem('userId', userId);
  return userId;
};

/**
 * Register token with API.
 */
export const registerToken = async deviceToken => {
  const existing = await AsyncStorage.getItem('deviceToken');
  if (existing === deviceToken) {
    return;
  }

  try {
    const userId = await getUserId();
    const registerUrl = `https://imfpush.eu-gb.bluemix.net/imfpush/v1/apps/${APP_ID}/devices`;
    const res = await fetch(registerUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        clientSecret: CLIENT_SECRET,
      },
      body: JSON.stringify({
        createdMode: 'API',
        createdTime: new Date().toISOString(),
        deviceId: userId,
        userId: userId,
        lastUpdatedTime: new Date().toISOString(),
        platform: 'A',
        token: deviceToken,
      }),
    });
    if (!res.ok) {
      throw new Error('Error when registering a device');
    }
    await AsyncStorage.setItem('deviceToken', deviceToken);
  } catch (e) {
    alert('Error when registering a device: ' + e);
  }
};

/**
 * Update current coordinates.
 */
export const updatePosition = async (longitude, latitude) => {
  const userId = await AsyncStorage.getItem('userId');
  if (!userId) {
    throw new Error('not registered!');
  }
  await fetch(`${BASE_API_URL}/api/position`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      longitude,
      latitude,
    }),
  });
};

export const search = async (longitude, latitude) => {
  const userId = await AsyncStorage.getItem('userId');
  if (!userId) {
    throw new Error('not registered!');
  }
  return await fetch(
    `${BASE_API_URL}/api/search?longitude=${longitude}&latitude=${latitude}`,
    {
      method: 'GET',
    }
  ).then(res => res.json());
};
