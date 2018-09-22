/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  PushNotificationIOS,
} from 'react-native';
import { registerToken } from './API';
import MapView from 'react-native-maps';

export default class App extends Component {
  state = { isLoaded: false };

  componentDidMount() {
    navigator.geolocation.watchPosition(
      data => {
        const { isLoaded } = this.state;
        const pos = {
          latitude: data.coords.latitude,
          longitude: data.coords.longitude,
        };
        if (!isLoaded) {
          this.setState({
            isLoaded: true,
            region: {
              latitude: data.coords.latitude,
              longitude: data.coords.longitude,
              latitudeDelta: 0.0922 / 2,
              longitudeDelta: 0.0421 / 2,
            },
            pos,
          });
        } else {
          this.setState({
            pos,
          });
        }
        // alert(JSON.stringify(prop));
      },
      e => {
        alert('Cannot get coordinates : ' + e);
      }
    );
  }

  onRegionChange = region => {
    this.setState({ region });
  };

  render() {
    // if (this.state.isLoaded) {
    //   alert(JSON.stringify(this.state.region));
    // }
    return (
      <View style={styles.container}>
        {this.state.isLoaded && (
          <MapView style={styles.map} region={this.state.region}>
            <MapView.Marker.Animated
              ref={marker => {
                this.marker = marker;
              }}
              image={require('./img/user.png')}
              coordinate={this.state.pos}
            />

            <MapView.Circle
              title="aa"
              fillColor="#00000022"
              center={{
                latitude: 54.469963,
                longitude: 18.510879,
              }}
              strokeColor="#00000022"
              strokeWidth={1}
              radius={700}
              geodesic
              zIndex={1}
            />

            <MapView.Circle
              title="aa"
              fillColor="#ff000055"
              center={{
                latitude: 54.469963,
                longitude: 18.510879,
              }}
              strokeColor="#ff000055"
              strokeWidth={1}
              radius={300}
              geodesic
              zIndex={2}
            />
            <MapView.Marker
              coordinate={{
                latitude: 54.469963,
                longitude: 18.510879,
              }}
              opacity={1}
              image={require('./img/info.png')}
              ref={ref => (this.m1 = ref)}
            >
              <MapView.Callout>
                <View>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                  </Text>
                </View>
              </MapView.Callout>
            </MapView.Marker>
          </MapView>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

PushNotificationIOS.requestPermissions(['alert', 'badge', 'sound']);

PushNotificationIOS.addEventListener('register', async deviceToken => {
  await registerToken(deviceToken);
});

PushNotificationIOS.getInitialNotification().then(notification => {
  if (!notification) {
    return;
  }
  alert(JSON.stringify(notification, null, 2));
});

PushNotificationIOS.addEventListener('notification', notification => {
  const body = notification.getMessage().body;
  const params = JSON.parse(notification.getData().payload);
  alert(params.testSetting);
  notification.finish(PushNotificationIOS.FetchResult.NoData);
});

PushNotificationIOS.addEventListener('registrationError', ret => {
  alert('Cannot register push notifications: ' + JSON.stringify(ret));
});
