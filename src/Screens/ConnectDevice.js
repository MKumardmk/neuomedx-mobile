import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import images from '../images';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import  MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Colors from '../styles/Colors';
import fonts from '../styles/fonts';

export default class ConnectDevice extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={{flex:1,backgroundColor:'#fff'}}>  
       <View style={{flexDirection:'row',justifyContent:'space-around',marginVertical:wp(10)}}>
        <TouchableOpacity onPress={()=>this.props.navigation.navigate("bluetoothConnect")} style={styles.container}>
            <FontAwesome name="bluetooth" size={wp(10)} color={Colors.appColor} />
            <Text style={styles.text} >Bluetooth</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>this.props.navigation.navigate("nfcConnect")} style={styles.container}>
            <MaterialCommunityIcons name="nfc" size={wp(10)} color={Colors.appColor} />
            <Text style={styles.text}>NFC</Text>
        </TouchableOpacity>

       </View>
      </View>
    );
  }
}

const styles=StyleSheet.create({
    container:{
        width:wp(40),
        height:wp(35),
        borderWidth:1,
        alignItems:'center',
        justifyContent:'center',
        borderColor:Colors.appColor,
        borderRadius:5
    },
    text:{
        fontSize:wp(5),
        fontFamily:fonts.robotoBold,
        color:Colors.appColor,
        paddingTop:10
    }
})