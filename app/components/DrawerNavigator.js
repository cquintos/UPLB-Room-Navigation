import React, { Component } from 'react';
import { Platform, Dimensions } from 'react-native';
import { createDrawerNavigator, createAppContainer } from 'react-navigation';

import UPLBMap from './UPLBMap'
import Rooms from './Rooms'
import MenuDrawer from './MenuDrawer'

const WIDTH = Dimensions.get('window').width;
const DrawerConfig = {
  drawerWidth: WIDTH*0.6,
  contentComponent: ({ navigation }) => {
    return(<MenuDrawer navigation={navigation} />)
  }
}
const DrawerNavigator = createDrawerNavigator(
  {
    UPLBMap: {
      screen: UPLBMap
    },
    Database: {
      screen: Rooms
    }
  },
  DrawerConfig
)

export default createAppContainer (DrawerNavigator);
