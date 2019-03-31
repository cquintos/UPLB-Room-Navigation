import React, { Component } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import {MapView, Permissions, Location} from 'expo';
import Menu from './app/components/Menu'

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      region: null,
    }
    this._getSyncLocationAsync();
  }
  _getSyncLocationAsync = async () => {
    let {status} = await Permissions.askAsync(Permissions.LOCATION);
      if(status !== "granted")
        console.log('Permission Denied');
      
    let location = await Location.getCurrentPositionAsync({enabledHighAccuracy: true})
    let region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.045,
      longitudeDelta: 0.045,
    }
    this.setState({region: region})
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          initialRegion= {this.state.region}
          showsUserLocation={true}
          showCompasss= {true}    
          rotateEnabled= {false}
          style= {{flex: 1}}

        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

