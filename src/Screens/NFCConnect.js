import React, { Component } from 'react';
import { View, Text, StatusBar, SafeAreaView, Switch, TouchableOpacity, Modal, Pressable } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Colors from '../styles/Colors';
import fonts from '../styles/fonts';

class NFCConnect extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isnfcEnabled:false,
        modalVisible:false
    };
  }

  render() {
    return (
        <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{ backgroundColor: '#FFF', flex: 1 }}>
         
          <View style={{ height: hp(10), backgroundColor: Colors.whiteBlueBackground, alignItems: 'center', paddingVertical: hp(2), flexDirection: 'row', paddingHorizontal: wp(5) }}>
            <View style={{ width: '98%', height: hp(7), flexDirection: 'row', alignItems: 'center', alignSelf: 'center', backgroundColor: '#FFF', borderRadius: wp(1) }}>
              <View style={{ width: '15%', alignItems: 'center' }}>
                <MaterialCommunityIcons name="nfc" size={wp(8)} color={Colors.appColor} />
              </View>
              <View style={{ width: '65%' }}>
                <Text style={{ color: Colors.blueAccent, fontFamily: fonts.roboto, fontSize: wp(3.5) }} >NFC</Text>
              </View>
              <View style={{ width: '20%',alignItems:'flex-end',paddingRight:wp(2) }}>
                <Switch
                  style={{ paddingVertical: hp(0.3), justifyContent: 'flex-end', maxWidth: '30%', paddingHorizontal: wp(2) }}
                  trackColor={{ false: "#767577", true: Colors.successGreen }}
                  thumbColor={this.state.isnfcEnabled ? "#F4f3f4" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={(val) => this.setState({isnfcEnabled:val})}
                  value={this.state.isnfcEnabled}
                />
              </View>
            </View>
          </View>
          <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <TouchableOpacity onPress={()=>{this.setState({modalVisible:true})}} style={{backgroundColor:Colors.appColor,width:wp(40),height:wp(40),justifyContent:'center',alignItems:'center',borderRadius:wp(20)}}>
                <MaterialCommunityIcons color={Colors.white} name="scan-helper" size={wp(15)} />
                <Text style={{marginTop:hp(0.5),color:Colors.white,fontSize:wp(4),textAlign:'center',}}>NFC Scan</Text>
            </TouchableOpacity>
          </View>
          <Modal
          animationType="slide"
          transparent={true}
          onRequestClose={() => { this.setState({ modalVisible: false }) }}
          visible={this.state.modalVisible}>
          <View
            style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'rgba(52,52,52,0.5)' }}>
            <Pressable
              onPress={() => { this.setState({ modalVisible: false,}) }}
              style={{ zIndex: -1, width: '100%', height: '100%' }} >

            </Pressable>
            <View style={{ zIndex: 1, paddingTop: hp(2), paddingBottom: hp(1), maxHeight: '90%', width: '100%', paddingHorizontal: '5%', borderTopLeftRadius: wp(3), borderTopRightRadius: wp(3), backgroundColor: '#FAFAFA' }}>
              <View style={{ justifyContent: 'center', paddingVertical: hp(1) }}>
                <Text style={{ textAlign: 'center', color: Colors.blueAccent,fontSize:wp(5),fontFamily:fonts.robotoBold }}>Ready to Scan</Text>
              </View>
              
              <View style={{marginVertical:hp(2)}}>
              <TouchableOpacity onPress={()=>{this.setState({modalVisible:false})}} style={{alignSelf:'center',borderColor:Colors.appColor,borderWidth:2,width:wp(25),height:wp(25),justifyContent:'center',alignItems:'center',borderRadius:wp(15)}}>
                <MaterialCommunityIcons color={Colors.appColor} name="cellphone-iphone" size={wp(15)} />
            </TouchableOpacity>  
            
             <Text style={{marginTop:hp(1.5),color:'#96A6AF',textAlign:'center',fontSize:wp(4)}}>Hold your device near the NFC tag.</Text>
              </View>

              
            <View style={{ marginTop: hp(1),marginBottom:hp(1) }}>
            <TouchableOpacity onPress={() => this.setState({ modalVisible: false })} style={{ width: '95%', alignSelf: 'center', marginTop: hp(1), borderRadius: 5, backgroundColor: Colors.appColor, height: hp(6), justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#FFF', textAlign: 'center',fontSize:wp(4) }}>Cancel</Text>
            </TouchableOpacity>
            </View>
               
              
            </View>
          </View>
        </Modal>
        </SafeAreaView>
        </>
    );
  }
}

export default NFCConnect;
