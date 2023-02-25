import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import { heightPercentageToDP as hp ,widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Colors from '../styles/Colors';
import fonts from '../styles/fonts';

class TestVisiter extends Component {
  constructor(props) {
    super(props);
    this.state = {
        name:"",
        mobileNo:""
    };
  }

  startTest(){
    this.props.navigation.navigate('testing')
  }

  render() {
    return (
      <View style={{flex:1,paddingHorizontal:'3%'}}>
          <TextInput style={[styles.TextInputView,{marginTop:20}]}  
                 dense={true}              
                 label="Email"
                 mode='outlined'
                 theme={{ colors: { text: Colors.blackText ,primary: Colors.appColor,placeholder:Colors.placeHolderBGColor } }}
                 ref={(input) => { this.name = input; }}
                 onSubmitEditing={() => { this.mobileNo.focus()}}
                 onChangeText={(value)=>{this.setState({name:value})}} 
                 returnKeyType={"next"}
                 value={this.state.name}
                />   
                <TextInput style={[styles.TextInputView,{marginTop:10}]}  
                 dense={true}              
                 label="Mobile number"
                 mode='outlined'
                 keyboardType={'decimal-pad'}
                 maxLength={10}
                 theme={{ colors: { text: Colors.blackText, primary: Colors.appColor,placeholder:Colors.placeHolderBGColor } }}
                 ref={(input) => { this.mobileNo = input; }}
                 onSubmitEditing={() => { this.startTest()}}
                 onChangeText={(value)=>{this.setState({mobileNo:value})}} 
                 returnKeyType={"next"}
                 value={this.state.mobileNo}
                />   
       <TouchableOpacity onPress={()=>this.startTest()} style={{ marginTop: hp(4), paddingVertical: hp(1),height:hp(6),justifyContent:'center', borderRadius: wp(1), width: '95%', backgroundColor: Colors.appColor, alignSelf: 'center', alignItems: 'center' }}>
              <Text style={{ fontFamily: fonts.robotoBold, fontSize: wp(4), color: Colors.whiteBackground }}>START A NEW TEST</Text>
            </TouchableOpacity>
      </View>
    );
  }
}
const styles=StyleSheet.create({
    MainContainer:{
        flex:1,
        backgroundColor:'#fff',
        // margin:20,
        paddingHorizontal:wp(4),
        alignItems:'center',
        justifyContent:'center'
      },
      TextInputView:{       
        borderColor:'grey',
        alignSelf:'center',
        backgroundColor:'#F5F6FA',
        width:'100%',    
        height:hp(6.5),    
        fontSize:wp(4),
        fontFamily:fonts.roboto
        },
    TextInputMainView:{
        width:'100%',
        marginBottom:hp(1)
    },
  
})
export default TestVisiter;
