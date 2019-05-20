import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

//Gets window's Width and height for relative layouting
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export const FindRouteBtn = function(props) {
    
    //function passed in UPLBMap.js
    const routeBtn = props.routeBtn;

    return(
        <View style={[styles.container, {top: HEIGHT-65}]}>
            <MaterialIcons
                name="navigation"
                color="maroon"
                size={30}
                onPress={()=>{ routeBtn() }} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        zIndex: 9,
        position: 'absolute',
        width: 45,
        height: 45,
        backgroundColor: 'white',
        left: WIDTH/2-20,
        borderRadius: 50,
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOpacity: 1.0,
        shadowOffset:{  width: 3,  height: 3,  },
        justifyContent: 'space-around',
        alignItems: 'center',
    },
})