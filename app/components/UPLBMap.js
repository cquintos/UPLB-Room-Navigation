import React, { Component } from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  Alert
} from 'react-native';
import {
    Permissions, 
    Location,
} from 'expo';
import MapView, {
    UrlTile,
    Marker,
    Callout
} from 'react-native-maps';
import { Ionicons} from '@expo/vector-icons';
import Polyline from '@mapbox/polyline';
const { width, height } = Dimensions.get('screen')
const buildings = require('./buildings.json')


export default  class UPLBMap extends React.Component {

  constructor(props) {
    super(props);

    //initialize current location to null
    this.state = {
        region: null,
        buildings: buildings,
        startLoc: null,
        destLoc: null
    }
    this._getSyncLocationAsync();
  }

  //gets the user location
  _getSyncLocationAsync = async () => {
    let {status} = await Permissions.askAsync(Permissions.LOCATION);
    if(status !== "granted")
        console.log('Permission Denied');
      
    let location = await Location.getCurrentPositionAsync({enabledHighAccuracy: true})

    //current location
    let currentLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0092,
      longitudeDelta: 0.0092,
    }
    this.setState({region: currentLocation})
  }

  async getDirections(startLoc, destLoc) {
    try {
      const resp = await fetch(`https://api.openrouteservice.org/v2/directions/foot-walking?api_key=5b3ce3597851110001cf624863d0ee0a042f4aeeaca4dbda263724d9&start=${startLoc}&end=${destLoc}`)
      const respJson = await resp.json();
      const points = respJson.features[0].geometry.coordinates;
      const coords = points.map(point => {
        return {
          longitude: point[0],
          latitude: point[1]
        }
      })
      this.setState({ coords })
    } catch(error) {
      console.log('Error: ', error)
    }
  }

  goHereOption (building) {  
    if(this.state.region != null) {
      const startLoc = `${this.state.region.longitude},${this.state.region.latitude}`
      const destLoc = `${building.coords.longitude},${building.coords.latitude}`
      this.getDirections(startLoc, destLoc)
    }
  }

  markedBuilding (building) {
    Alert.alert(
      building.name,
      "Mark this building as",
      [
        //1 for start, 2 for destination
        {text: 'Start', onPress: (this.goHereOption(building))},
        {text: 'Destination', onPress: (this.goHereOption(building))},
        {
          text: 'Go to here', 
          onPress: (this.goHereOption(building)),   
          style: 'cancel'
        },
        { text: 'Go Back',
          onPress: (this.onMarkerPress(building)), 
          style: 'destructive'
        },
      ]
    );
  }

  onMarkerPress (building) {
    Alert.alert(
      building.name,
      "What do you want to do?",
      [
        {text: 'Mark as Start/ Destination', onPress: () => {this.markedBuilding(building)}},
        {text: 'Search for rooms', onPress: () => console.log('Searching for rooms!')},
        {
          text: 'Go to here', 
          onPress: () => {this.goHereOption(building)},
          style: 'cancel'
        },
        { text: 'Cancel', 
          style: 'destructive'
        },
      ]
    );
  }
  
  renderMarkers = () => {
    const { buildings } = this.state
    return (
      <View>
        {
          buildings.map((building, index) => {
            const {
              coords: { latitude, longitude }
            } = building;
            return (
              <Marker 
                key={index}
                coordinate={{ latitude, longitude }}
              >
              <Callout 
                onPress={()=>{this.onMarkerPress (building)}}
              >
                <Text>
                  {building.name}
                </Text>
              </ Callout>
              </Marker>
            )
          })
        }
      </View>
    )
  }

  render() {
    const {
      coords,
    } = this.state

    return (
      <View style={{flex:1}}>
        <Ionicons
            name="md-menu"
            color="#000000"
            size={32}
            style={styles.menuIcon}
            onPress={()=>this.props.navigation.toggleDrawer()}
        />
        <MapView
            initialRegion= {this.state.region}
            provider={null}
            showsUserLocation={true}
            showCompasss= {true}    
            rotateEnabled= {false}
            style= {{flex: 1}}
        >
          <UrlTile
              urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maximumZ={19}
              flipY={false}
          />
          {this.renderMarkers()}
          <MapView.Polyline
            strokeWidth={3}
            strokeColor="red"
            coordinates={coords}
          />
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    menuIcon: {
        zIndex: 9,
        position: 'absolute',
        top: 40,
        left: 20,
    }
})