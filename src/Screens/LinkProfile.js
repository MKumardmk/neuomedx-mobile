import React, { Component } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { heightPercentageToDP as hp,widthPercentageToDP as wp } from 'react-native-responsive-screen';
import images from '../images';
import Colors from '../styles/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign'
import fonts from '../styles/fonts';

class LinkProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  goHome() {
    this.props.navigation.navigate('homeScreen')
  }

  render() {
    return (
      <View style={{flex:1,backgroundColor:Colors.appColor}}>
          <ImageBackground source={images.splashBackground} style={{flex:1,justifyContent:'center'}}>
            <View style={{width:'90%',alignSelf:'center',padding: hp(2),backgroundColor:'#FFF',borderRadius:wp(2),borderWidth:1,borderColor:Colors.appColor}}>
            <View style={{padding: wp(3),justifyContent:'center',alignItems:'center'}}>
                <Image style={{width:wp(50),height:wp(50),resizeMode:'contain'}} source={images.splashBackground} />
            </View>
            <View style={{ marginTop: hp(3.5), width: '100%', alignSelf: 'center', alignItems: 'center' }}>
            <Text style={{  color: Colors.appColor, fontSize: wp(6.5),fontFamily:fonts.robotoBold }} >Associate Successfully</Text>
          <Text style={{ marginTop: hp(2),color: '#96A6AF',textAlign:'center', fontSize: wp(4),fontFamily:fonts.roboto }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</Text>
            </View>

            <View style={{ marginTop: hp(3.5), width: '90%', alignSelf: 'center', alignItems: 'center' }}>
          <Text style={{ color: Colors.blueText, fontSize: wp(4.5),fontFamily:fonts.roboto }}>Name: Rajesh Kumar</Text>
          <Text style={{ color: Colors.blueText, fontSize: wp(4.5),fontFamily:fonts.roboto }} >Emp.ID: AS2021001</Text>
          <Text style={{ marginTop: hp(2), color: Colors.appColor, fontSize: wp(5.5),fontFamily:fonts.robotoBold }} >Profile ID: DX202156R1</Text>
        </View>

        <TouchableOpacity onPress={()=>{}} style={styles.ButtonOrange}>
                <View style={{width:'85%',alignItems:'center',justifyContent:'center'}}>
                <Text style={{color:'#fff',textAlign:'center',fontFamily:fonts.roboto,fontSize:wp(4),marginLeft:wp(6)}}>Start new test</Text>
                </View>
                <View style={{width:'15%',alignItems:'flex-end'}}>
               <AntDesign name='arrowright' color={Colors.white} size={wp(5)} style={{ marginRight: wp(4) }} />
               </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.goHome()}
          style={{ marginTop: hp(1), flexDirection: 'row', paddingVertical: hp(1), borderRadius: wp(2), width: '100%', alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: fonts.roboto, fontSize: wp(4), color: Colors.appColor,textDecorationLine:'underline',marginLeft:wp(7) }}>Back to home</Text>
          {/* <AntDesign name='arrowright' color={Colors.appColor} size={wp(8)} style={{ marginLeft: wp(5) }} /> */}
        </TouchableOpacity>

            </View>
          </ImageBackground>
      </View>
    );
  }
}
const styles = StyleSheet.create({
    ButtonOrange: {
        width:'95%',
        height:hp(6),
        alignSelf:'center',
        flexDirection:'row',
        backgroundColor:'#66BDAB',
        borderRadius:wp(2),
        alignItems:'center',
        marginBottom:hp(1.5),
        marginVertical:hp(1),
        marginTop:hp(2)
      }
})
export default LinkProfile;
