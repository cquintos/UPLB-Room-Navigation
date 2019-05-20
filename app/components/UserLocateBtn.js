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

export const UserLocateBtn = function(props) {
    
    //function passed in UPLBMap.js
    const locateBtn = props.locateBtn;

    return(
        <View style={[styles.container, {top: HEIGHT-65}]}>
            <MaterialIcons
                name="my-location"
                size={30}
                onPress={()=>{ locateBtn() }} />
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
        left: WIDTH-70,
        borderRadius: 50,
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOpacity: 1.0,
        shadowOffset:{  width: 3,  height: 3,  },
        justifyContent: 'space-around',
        alignItems: 'center',
    },
})