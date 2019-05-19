import React, { Component } from 'react';
import { Platform, Dimensions, StyleSheet, View, Text, TouchableOpacity} from 'react-native';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default class MenuDrawer extends Component {
    navLink(nav, text) {
        return (
            <TouchableOpacity style={{height: 50}} onPress={()=> this.props.navigation.navigate(nav)}>
                <Text style={styles.link}>{text}</Text>
            </TouchableOpacity>


        )

    }

    render() {
      return (
        <View style={styles.container}>
            <View style={styles.topLink}>
                <Text style={{paddingTop: 40, color:'white'}}>MENU DRAWER</Text>
            </View>
            <View style={styles.botLink}>
                {this.navLink('UPLBMap', 'UPLBMap')}
                {this.navLink('Database', 'Rooms')}
            </View>
        </View>
      );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'grey',
    },
    link: {
        flex: 3,
        fontSize: 20,
        padding: 6,
        paddingLeft: 14,
        margin: 5,
        textAlign: 'left',
    },
    topLink: {
        height: 100,
        backgroundColor: 'black',

    },
    botLink: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 10,
        paddingBottom: 450,
    }
});
  