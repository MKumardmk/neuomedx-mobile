import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp,widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { TextInput } from 'react-native-paper';
import Colors from '../styles/Colors';
import {Snackbar} from 'react-native-paper'
import { baseurl } from '../Baseurl';
import {connect} from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage';
import fonts from '../styles/fonts';
import AntDesign from 'react-native-vector-icons/AntDesign';

var interval=null

class VerifyCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
        userEmail:null,
        UserOTP:null,
        responseCode0:null,
        responseCode1:null,
        responseCode2:null,
        responseCode3:null,
        minutes:1,
        seconds:60,
        otp:null,
        snackBarVisible:false,
        timeoutSnackbar:false,
        iseditable:false
    };
  }
 //verification-code-api
  componentDidMount(){
   this.getmethod()
  }

   resend(){
     if(this.state.minutes==0 && this.state.seconds==0){
       this.setState({minutes:1,seconds:60})
       this.getVerificationCode()
     }
   }

   async getmethod(){
     await AsyncStorage.getItem('@email').then((value) => {
        if(value!=null){
         this.setState({userEmail:value})
         console.log(this.props.authToken)
        }
      })    
  }

  getVerificationCode(){
    this.setState({showTimer:true,iseditable:true})
    interval= setInterval(()=>{
      if(this.state.seconds==0){
          if(this.state.seconds>=0 && this.state.minutes==0){
              this.setState({minutes:0,seconds:0,timeoutSnackbar:true,responseCode0:null,responseCode1:null,responseCode2:null,responseCode3:null,iseditable:false})
              clearInterval(interval)
          }else{
          this.setState({minutes:0,seconds:60})
          }
      }
      if(this.state.seconds>0){
          this.setState({seconds:this.state.seconds-1})
      }},1000)

    fetch(baseurl+"verification-code-api",{
      method: 'GET',
      headers: {
          Accept:'application/json',
          'Authorization': `Bearer ${this.props.authToken}`
      }
    })
    .then((response)=>response.json())
    .then((responseJson)=>{
      console.log(responseJson)
      if(responseJson.success==true){
        this.setState({otp:responseJson.data.otp_code})
        console.log(this.state.otp)
      }
    })
  }

  componentWillUnmount(){
    console.log( "verify unmount")
  }

  async setResponsecode(value,focusvalue,index){
    if(index==0){
      await this.setState({responseCode0:value})
    }else if(index==1){
      await this.setState({responseCode1:value})
    }else if(index==2){
      await this.setState({responseCode2:value})
    }else if(index==3){
      await this.setState({responseCode3:value})
      await this.setState({UserOTP:this.state.responseCode0+this.state.responseCode1+this.state.responseCode2+this.state.responseCode3})
      if(this.state.UserOTP==this.state.otp && this.state.otp!=null){
        this.setState({showTimer:false,minutes:0,iseditable:false,seconds:0,responseCode0:null,responseCode1:null,responseCode2:null,responseCode3:null})
        clearInterval(interval)
        this.props.navigation.navigate("menus")
      }else{
        this.setState({UserOTP:null,iseditable:true,snackBarVisible:true,responseCode0:null,responseCode1:null,responseCode2:null,responseCode3:null})
        this.res0.focus()
      }
    }
    if(index<=2){
        if(value.toString().length==1){
            focusvalue.focus()                                     
        }
    }else{
      console.log("above")
      if(this.state.UserOTP==this.state.otp && this.state.otp!=null){
        this.props.navigation.navigate("menus")
      }
      // else{
      //   this.setState({UserOTP:null,snackBarVisible:true,responseCode0:null,responseCode1:null,responseCode2:null,responseCode3:null})     
      //   this.res0.focus()
      // }
       
    }
  }



  render() {
    return (
        <View style={{flex:1,padding:wp(8),backgroundColor:'#fff'}}> 
            
             <View style={{width:'100%'}}>
             {
               this.state.showTimer? 
               <Text style={{fontSize:wp(3.8),color:'grey',textAlign:'center'}}>Check your email address, we have sent you the code at <Text style={{color:Colors.appColor}}> {this.state.userEmail} </Text> </Text>
               :
               <Text style={{fontSize:wp(3.8),color:'grey',textAlign:'center'}}>Click get verification button, get OTP code through your email.</Text>
             }
             </View>

            <View style={{ width:'100%',flexDirection:'row',justifyContent:'space-around',marginVertical:hp(3)}}>
                <TextInput 
                    style={{ borderColor:'grey',alignSelf:'center',backgroundColor:'#F5F6FA',width:'15%',textAlign:'center',fontSize:15}}                
                    dense={true}
                    value={this.state.responseCode0}
                    editable={this.state.iseditable}
                    mode='outlined'
                    placeholder="*"
                    theme={{ colors: { text: '#000', primary: "#66BDAB",placeholder:'#CBC9D9' } }}
                    ref={(input) => { this.res0 = input; }}
                    onSubmitEditing={() => { this.res1.focus()}}
                    onChangeText={(value)=>{
                        this.setResponsecode(value,this.res1,0)
                    }} 
                    returnKeyType={"next"}
                    keyboardType="phone-pad"
                    maxLength={1}
                    /> 

                <TextInput 
                    style={{ borderColor:'grey',alignSelf:'center',backgroundColor:'#F5F6FA',width:'15%',textAlign:'center',fontSize:15}}                
                    dense={true}
                    value={this.state.responseCode1}
                    editable={this.state.iseditable}
                    mode='outlined'
                    placeholder="*"
                    theme={{ colors: { text: '#000', primary: "#66BDAB",placeholder:'#CBC9D9' } }}
                    ref={(input) => { this.res1 = input; }}
                    onSubmitEditing={() => { this.res2.focus()}}
                    onChangeText={(value)=>{
                            this.setResponsecode(value,this.res2,1)
                    }} 
                    keyboardType="phone-pad"
                    returnKeyType={"next"}
                    maxLength={1}
                    /> 

                <TextInput 
                    style={{ borderColor:'grey',alignSelf:'center',backgroundColor:'#F5F6FA',width:'15%',textAlign:'center',fontSize:15}}                
                    dense={true}
                    value={this.state.responseCode2}
                    editable={this.state.iseditable}
                    mode='outlined'
                    placeholder="*"
                    theme={{ colors: { text: '#000', primary: "#66BDAB",placeholder:'#CBC9D9' } }}
                    ref={(input) => { this.res2 = input; }}
                    onSubmitEditing={() => { this.res3.focus()}}
                    onChangeText={(value)=>{
                        this.setResponsecode(value,this.res3,2)
                    }} 
                    keyboardType="phone-pad"
                    returnKeyType={"next"}
                    maxLength={1}
                    /> 

                <TextInput 
                    style={{ borderColor:'grey',alignSelf:'center',backgroundColor:'#F5F6FA',width:'15%',textAlign:'center',fontSize:15}}                
                    dense={true}
                    value={this.state.responseCode3}
                    editable={this.state.iseditable}
                    mode='outlined'
                    placeholder="*"
                    theme={{ colors: { text: '#000', primary: "#66BDAB",placeholder:'#CBC9D9' } }}
                    ref={(input) => { this.res3 = input; }}
                    onSubmitEditing={() => {}}
                    onChangeText={(value)=>{
                        this.setResponsecode(value,this.res4,3)
                    }} 
                    keyboardType="phone-pad"
                    returnKeyType={"next"}
                    maxLength={1}
                    /> 
            </View>

            {/* <View style={{flexDirection:'row',justifyContent:'space-between',}}> */}
                {/* <Text>Don't receive the code?</Text> */}
                {/* <Text/> */}
                {/* <View> */}
                    {/* <TouchableOpacity onPress={()=>this.resend()}>
                        <Text style={{color:Colors.appColor,fontWeight:'bold'}}>Resend</Text>
                    </TouchableOpacity> */}
                    {/* <Text>0{this.state.minutes} : {this.state.seconds} </Text> */}
                {/* </View> */}
            {/* </View> */}

            {
              this.state.showTimer?
                <View style={{flexDirection:'row',paddingVertical:hp(1)}}>
                <View style={{width:'75%'}}>
                <Text style={{textAlign:'left',fontSize:wp(3.5),color:'grey',fontFamily:fonts.roboto}}> Didn’t receive the code? </Text>
                </View>
                <View style={{width:'25%'}}>
                  <TouchableOpacity onPress={()=>{this.state.minutes==0 && this.state.seconds==0? this.resend() : {} }} style={{padding: wp(2),justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:this.state.minutes==0 && this.state.seconds==0?Colors.appColor:"lightgrey",fontFamily:fonts.robotoBold}}>Resend</Text>
                  </TouchableOpacity>
                 <Text style={{textAlign:'center',fontSize:wp(3),color:'grey',fontFamily:fonts.robotoBold}}>(0{this.state.minutes} : {this.state.seconds} )</Text>
                </View>
                </View>               
                :
                null
            }
             {
              this.state.showTimer?            
            <TouchableOpacity onPress={()=>this.setResponsecode(this.state.responseCode3,this.res4,3)} style={styles.ButtonOrange}>
            <View style={{width:'85%',alignItems:'center',justifyContent:'center'}}>
            <Text style={{color:'#fff',textAlign:'center',fontFamily:fonts.robotoBold,fontSize:wp(4),marginLeft:wp(6)}}>Verifiy code</Text>
            </View>
            <View style={{width:'15%',alignItems:'flex-end'}}>
           {/* <AntDesign name='arrowright' color={Colors.white} size={wp(5)} style={{ marginRight: wp(4) }} /> */}
           </View>
          </TouchableOpacity>
            :
            <TouchableOpacity onPress={()=>this.getVerificationCode()} style={styles.ButtonOrange}>
                <View style={{width:'85%',alignItems:'center',justifyContent:'center'}}>
                <Text style={{color:'#fff',textAlign:'center',fontFamily:fonts.robotoBold,fontSize:wp(4),marginLeft:wp(6)}}>Get verification code</Text>
                </View>
                <View style={{width:'15%',alignItems:'flex-end'}}>
               {/* <AntDesign name='arrowright' color={Colors.white} size={wp(5)} style={{ marginRight: wp(4) }} /> */}
               </View>
              </TouchableOpacity>
             }
            
            <Snackbar
              visible={this.state.snackBarVisible}
              onDismiss={()=>this.setState({snackBarVisible:false})}
              duration={3000}
              action={{
                  label: 'close',
                  onPress: () => {
                  this.setState({snackBarVisible:false})
                  },
              }}>
                  Enterd opt incorrect!
              </Snackbar>

              <Snackbar
              visible={this.state.timeoutSnackbar}
              onDismiss={()=>this.setState({timeoutSnackbar:false})}
              duration={3000}
              action={{
                  label: 'close',
                  onPress: () => {
                  this.setState({timeoutSnackbar:false})
                  },
              }}>
                  Your times up!.
              </Snackbar>


        </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    authToken:state.authToken
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setUpdateUserId:(value)=>{dispatch({type:UPDATE_USER_ID,value})},
    // setUpdateAuthToken:(value)=>{dispatch({type:UPDATE_AUTH_TOKEN,value})}
  };
}

export default connect( mapStateToProps, mapDispatchToProps )(VerifyCode);

const styles =StyleSheet.create({
  ButtonOrange: {
    width:'100%',
    height:hp(6),
    flexDirection:'row',
    backgroundColor:'#66BDAB',
    borderRadius:wp(1),
    alignItems:'center',
    marginBottom:hp(1.5),
    marginVertical:hp(2),
  }
})