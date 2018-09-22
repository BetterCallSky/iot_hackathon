import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  PushNotificationIOS,
  AsyncStorage,
} from 'react-native';
import { registerToken, search, updatePosition } from './API';
import MapView from 'react-native-maps';

const ERROR_DISTANCE = 200;
const WARNING_DISTANCE = ERROR_DISTANCE * 3;

function distance(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// function distance(lat1, lon1, lat2, lon2) {
//   var p = 0.017453292519943295; // Math.PI / 180
//   var c = Math.cos;
//   var a =
//     0.5 -
//     c((lat2 - lat1) * p) / 2 +
//     (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

//   return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
// }

export default class App extends Component {
  state = { isLoaded: false, devices: {}, msg: null };

  async componentDidMount() {
    // await AsyncStorage.clear();
    PushNotificationIOS.requestPermissions(['alert', 'badge', 'sound']);

    PushNotificationIOS.addEventListener('register', async deviceToken => {
      await registerToken(deviceToken);
      this.watchCoords();
    });

    PushNotificationIOS.getInitialNotification().then(notification => {
      if (!notification) {
        return;
      }
      // alert(JSON.stringify(notification, null, 2));
    });

    PushNotificationIOS.addEventListener('notification', notification => {
      const body = notification.getMessage().body;
      const params = JSON.parse(notification.getData().payload);
      // alert(body);
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    });

    PushNotificationIOS.addEventListener('registrationError', ret => {
      alert('Cannot register push notifications: ' + JSON.stringify(ret));
    });
  }

  watchCoords = () => {
    navigator.geolocation.watchPosition(
      data => {
        this.handleCoords(data.coords.longitude, data.coords.latitude);
      },
      e => {
        alert('Cannot get coordinates : ' + e);
      }
    );
    setTimeout(() => {
      const pos = this.state.pos;
      this.handleCoords(18.50667, 54.473965);
      setTimeout(() => {
        setTimeout(() => {
          this.handleCoords(pos.longitude, pos.latitude);
        }, 3000);
        this.handleCoords(18.510879, 54.469963);
      }, 3000);
    }, 3000);
  };

  handleCoords = (longitude, latitude) => {
    const { isLoaded } = this.state;
    const pos = {
      latitude,
      longitude,
    };
    updatePosition(longitude, latitude);
    if (!isLoaded) {
      search(longitude, latitude).then(devices => {
        const existing = { ...this.state.devices };
        devices.forEach(item => {
          existing[item.id] = item;
        });
        this.setState({ devices: existing });
      });
      this.setState({
        isLoaded: true,
        region: {
          latitude: latitude,
          longitude: longitude,
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
  };

  onRegionChange = region => {
    this.setState({ region });
  };

  renderDevices() {
    const devices = Object.values(this.state.devices);

    return devices.map(device => {
      const loc = {
        longitude: device.location.coordinates[0],
        latitude: device.location.coordinates[1],
      };
      return (
        <React.Fragment key={device.id}>
          <MapView.Circle
            fillColor="#ff000055"
            center={loc}
            strokeColor="#ff000055"
            strokeWidth={1}
            radius={ERROR_DISTANCE}
            geodesic
            zIndex={2}
          />
          <MapView.Circle
            fillColor="#00000022"
            center={loc}
            strokeColor="#00000022"
            strokeWidth={1}
            radius={WARNING_DISTANCE}
            geodesic
            zIndex={1}
          />
          <MapView.Marker coordinate={loc}>
            <View>
              <Text>🔥</Text>
            </View>
          </MapView.Marker>
        </React.Fragment>
      );
    });
  }

  renderWarning() {
    const devices = Object.values(this.state.devices);
    const { latitude, longitude } = this.state.pos;
    let isError = false;
    let isWarning = false;
    for (const device of devices) {
      const d =
        distance(
          latitude,
          longitude,
          device.location.coordinates[1],
          device.location.coordinates[0]
        ) * 1000;
      if (d <= ERROR_DISTANCE) {
        isError = true;
        break;
      }
      if (d <= WARNING_DISTANCE) {
        isWarning = true;
      }
    }
    if (!isError && !isWarning) {
      return;
    }
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 100,
          backgroundColor: isError ? '#dd2c00' : '#faaf40',
          zIndex: 123,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 30,
        }}
      >
        <Text
          style={{
            width: '100%',
            textAlign: 'center',
            color: '#ffffff',
            fontSize: 18,
          }}
        >
          {isError
            ? 'You entered a critical zone.'
            : 'You entered a warning zone.'}
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.isLoaded && this.renderWarning()}
        {this.state.isLoaded && (
          <MapView style={styles.map} region={this.state.region}>
            <MapView.Marker.Animated
              ref={marker => {
                this.marker = marker;
              }}
              image={require('./img/user.png')}
              coordinate={this.state.pos}
            />
            {this.renderDevices()}
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
});
