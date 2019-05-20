import React, { Component } from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  Alert,
  Image
} from 'react-native';
import {
    Permissions, 
    Location,
} from 'expo';
import MapView, {
    UrlTile,
    Marker,
    Callout,
} from 'react-native-maps';
import { Ionicons} from '@expo/vector-icons';
import Polyline from '@mapbox/polyline';
import { UserLocateBtn } from './UserLocateBtn';
import { FindRouteBtn } from './FindRouteBtn';


//Gets window's Width and height for relative layouting
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

//Temporary storage of data
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
  async _getSyncLocationAsync() {
    let {status} = await Permissions.askAsync(Permissions.LOCATION);
    if(status !== "granted")
        console.log('Permission Denied');
      
    let location = await Location.getCurrentPositionAsync({enabledHighAccuracy: true})

    //current location 
    let currentLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      //zooming preferences
      latitudeDelta: 0.0092,
      longitudeDelta: 0.0002,
    }
    this.setState({region: currentLocation})
  }

  async getDirections() {

    if (this.state.startLoc !== null && this.state.destLoc !== null) {
      console.log(this.state.startLoc, this.state.destLoc )
      try {
        //api for getting coordinates variables must be parsed as lng,lat
        const resp = await fetch(`https://api.openrouteservice.org/v2/directions/foot-walking?api_key=5b3ce3597851110001cf624863d0ee0a042f4aeeaca4dbda263724d9&start=${this.state.startLoc}&end=${this.state.destLoc}`)
        const respJson = await resp.json();
        const points = respJson.features[0].geometry.coordinates;
        const coords = points.map(point => {
          return {
            longitude: point[0],
            latitude: point[1]
          }
        })
        this.setState({ coords })
        this.setState({ startLoc : null })
        this.setState({ destLoc : null })
      } catch(error) {
        console.log('Error: ', error)
      }
    } else {
      this.startLoc == null ? Alert.alert("Please enter starting point") : Alert.alert("Please enter destination point");
    }
  }

  //parses both current location's and destination building's lng and lat
  goHereOption = building => () => {
    if (this.state.region != null) {
      this.setState({ startLoc : `${ this.state.region.longitude },${ this.state.region.latitude }` })
      this.setState({ destLoc : `${ building.coords.longitude },${ building.coords.latitude }` })
      this.getDirections()
    }
  }

  //function for marking the building as start or destination
  markedBuilding = building => () => {
    Alert.alert(
      building.name,
      "Mark this building as",
      [
        //1 for start, 2 for destination
        { text: 'Start', onPress: () => (this.setState({ startLoc : `${ building.coords.longitude },${ building.coords.latitude }` })) },
        { text: 'Destination', onPress: () => (this.setState({ destLoc : `${ building.coords.longitude },${ building.coords.latitude }` })) },
        {
          text: 'Go to here', 
          onPress: (this.goHereOption(building)),   
          style: 'cancel'
        },
        { 
          text: 'Go Back',
          onPress: (this.onMarkerPress(building)), 
          style: 'destructive'
        },
      ]
    );
  }

  //function when the callout is pressed
  onMarkerPress = building => () => {
    Alert.alert(
      building.name,
      "What do you want to do?",
      [
        {text: 'Mark as Start/ Destination', onPress: this.markedBuilding(building)},
        {text: 'Search for rooms', onPress: () => console.log('Searching for rooms!')},
        {
          text: 'Go to here', 
          onPress: this.goHereOption(building),
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
                key = { index }
                coordinate = {{ latitude, longitude }}
                flat = { true }
                onPress = {() => this.setState ({ destination : building })}
              >
              <Callout 
                onPress={this.onMarkerPress (building)}
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

  //this function centers the map to the user's location
  locateUser() {

    //takes time to get the necessary coordinates
    if(this.state.region !== null) {
      const { 
        latitude, 
        longitude,
        latitudeDelta,
        longitudeDelta,
      } = this.state.region
      this.map.animateToRegion({
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta
      })
    } else {
      Alert.alert("Please wait until we pinpoint your location.");
    }
  }

  render = () => {

    const {
      coords,
      destination,
    } = this.state

    return (
      <View style={{flex:1}}>
        <Ionicons
            name = "md-menu"
            color = "#000000"
            size = { 32 }
            style = { styles.menuIcon }
            onPress = { ()=>this.props.navigation.toggleDrawer() }
        />
        <MapView
            initialRegion = { this.state.region }
            provider = { null }
            showsUserLocation ={ true }
            showCompasss = { true }    
            rotateEnabled = { true }
            style = { { flex: 1} }
            ref ={ (map) => { this.map = map } }
        >
          <UrlTile
              urlTemplate = "http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maximumZ={50}
              flipY={false}
          />

          {this.renderMarkers()}
          
          <MapView.Polyline
            strokeWidth={2}
            strokeColor="red"
            coordinates={coords}
          />
          
          <Image
            source={{ uri: destination && destination.img_url }}
            style={{
              flex: 1,
              width: WIDTH * 0.95,
              alignSelf: 'center',
              height: HEIGHT * 0.15,
              position: 'absolute',
              bottom: HEIGHT * 0.65,
            }}
          />
          <UserLocateBtn locateBtn = {() => { this.locateUser() }}/>
          <FindRouteBtn routeBtn = {() => { this.getDirections() }}/>
          
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
    },
    locateIcon: {
      zIndex: 9,
      position: 'absolute',
      bottom: 40,
      right: 20,
  }


    
})