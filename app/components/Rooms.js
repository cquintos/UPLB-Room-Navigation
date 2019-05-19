import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';

import { Ionicons} from '@expo/vector-icons'

export default class Rooms extends Component {

  render() {
    return (
      <View style={styles.container}>
       <Ionicons
            name="md-menu"
            color="#000000"
            size={32}
            style={styles.menuIcon}
            onPress={()=>this.props.navigation.toggleDrawer()}
        />
        <Text style={styles.text}>ROOMS HERE</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 32,
  },
  menuIcon: {
    zIndex: 9,
    position: 'absolute',
    top: 40,
    left: 20,
  } 
});

