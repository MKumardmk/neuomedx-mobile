
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, Text, SafeAreaView, StyleSheet,ActivityIndicator, TouchableOpacity, Image, Platform } from 'react-native';
import base64 from 'react-native-base64';
import {TextInput} from 'react-native-paper'
import { baseurl } from '../Baseurl';
import images from '../images';
import {StackActions} from '@react-navigation/native'
import fonts from '../styles/fonts';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Colors from '../styles/Colors';

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loading:false,
        emailError:"",
        email:"",
        password:"",
        passwordError:"",
        hidePassword:true,
        deviceType:null,
        deviceToken:"test"
    };
  } 

  componentDidMount(){
    AsyncStorage.getItem('@slider_opend').then((value) => {
      if(value!=null){
       console.log(value)
      }
    })
  }

  checkEmailPassword(){
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    if(this.state.email==""){
        this.setState({emailError:'The email field is required'}) 
    }else if(reg.test(this.state.email) === true){
        this.setState({emailError:""})
        }else{
          console.warn("formet")
            this.setState({emailError:'check the email format'})
        }  

    if(this.state.password==""){
      this.setState({passwordError:"The password field is required"})
    }else {
      this.setState({passwordError:""})
    }

  }

  signin(){
    
    if(this.state.email!="" && this.state.emailError=="" && this.state.password!="" && this.state.passwordError==""){
      console.log("ok")
      var deviceType=null
      if(Platform.OS=="android"){
        deviceType=2
      }else if(Platform.OS=="ios"){
        deviceType=1
      }

      var data = new FormData();
      data.append("email",this.state.email)
      data.append("password",base64.encode(this.state.password))
      data.append("device_type",deviceType)
      data.append("device_token","test")

      this.setState({loading:true})
      fetch(baseurl+"login-api", {
        method: 'POST',
         headers: {
           //'Content-Type':"application/x-www-form-urlencoded",
           'Content-Type':'multipart/form-data'
       },
       body:data
 
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.warn(responseJson)
          
          if(responseJson.success==true){
            // AsyncStorage.setItem('@user_id',JSON.stringify(responseJson.data.user.id))
            AsyncStorage.setItem("@access_token",responseJson.data.user.access_token)
            AsyncStorage.setItem("@email",responseJson.data.user.email)
            AsyncStorage.setItem("@user_pass",this.state.password)
            this.setState({loading:false,passwordError:""})
            this.props.navigation.dispatch(StackActions.replace('homeScreen'))
          }else{
            this.setState({loading:false,passwordError:responseJson.message})
          }
        })

    // console.log(data)
       
    }else{
      this.checkEmailPassword()
    }
  }

  render() {
    return (
        <View style={{flex:1,alignItems:'center',justifyContent:'center',padding:wp(8),backgroundColor:'#fff'}}>        
         <View style={{width:'70%',height:'10%',alignItems:'center',marginBottom:hp(2)}}>        
           <Image source={images.logo} style={{width:'90%',height:'100%',resizeMode:'contain'}}/>
         </View>

         {/* <Text style={{textAlign:'center',color:'#0F0A39',fontSize:25,marginTop:30,marginBottom:15,fontFamily:fonts.robotoBold}}>Sign in</Text> */}
   
             <View style={styles.TextInputMainView}>
               <TextInput style={styles.TextInputView}                
                 label="Email"
                 mode='outlined'
                 dense={true}
                 theme={{ colors: { text: '#000', primary: "#66BDAB",placeholder:'#CBC9D9' } }}
                 ref={(input) => { this.emaildRef = input; }}
                 onSubmitEditing={() => {this.passwordRef.focus()}}
                 onChangeText={(value)=>{this.setState({email:value})}} 
                 returnKeyType={"next"}
                />                
                 {
                  this.state.emailError==""?null
                  :
                  <Text style={{color:'red',fontSize:12,marginBottom:5,fontFamily:fonts.roboto}}>{this.state.emailError}</Text>
                }                
               </View>

               <View style={styles.TextInputMainView}>                
                      <TextInput
                        mode='outlined'
                        label="Password"
                        dense={true}
                        theme={{ colors: { text: '#000', primary: "#66BDAB",placeholder:'#CBC9D9' } }}
                        style={styles.TextInputView}    
                        value={this.state.password}
                        ref={(input) => { this.passwordRef = input; }}  
                        secureTextEntry={this.state.hidePassword}
                        right={ <TextInput.Icon  onPress={() => { this.setState({hidePassword:!this.state.hidePassword})}} color={"#CBC9D9"} name={this.state.hidePassword?"eye-off":"eye"} />}
                        onChangeText={(value)=>{this.setState({password:value})}} 
                        onSubmitEditing={() => {this.signin()}}
                        returnKeyType={"done"}        
                        textContentType="oneTimeCode"    
                        />                  
                  
                  </View>  
               
               <View style={{alignSelf:'flex-start',marginTop:-8}}>
               {
                this.state.passwordError==""?
                 null
                 :
                 <Text style={{color:'red',fontSize:wp(3),marginBottom:5,fontFamily:fonts.roboto}}>{this.state.passwordError}</Text>
                } 
               </View>
            <View style={{width:'100%',paddingTop:15,paddingBottom:5}}>
                <TouchableOpacity onPress={()=>this.props.navigation.navigate("forgotPassword")} style={{alignSelf:'flex-end'}}>
                  <Text style={{fontSize:wp(3.5),fontFamily:fonts.roboto,color:"grey"}}>Forgot Password?</Text>
                </TouchableOpacity>
            </View>

       {
         this.state.loading?
         <TouchableOpacity style={{ width:'100%',height:45,justifyContent:'center',backgroundColor:'#66BDAB',borderRadius:3,alignItems:'center',marginBottom:15,marginVertical:10}}>
           <ActivityIndicator color="#fff"/>
         </TouchableOpacity>
         :
         <TouchableOpacity onPress={()=>this.signin()} style={styles.ButtonOrange}>
           <View style={{width:'85%',alignItems:'center',justifyContent:'center'}}>
           <Text style={{color:'#fff',textAlign:'center',fontFamily:fonts.robotoBold,fontSize:wp(4),marginLeft:wp(6)}}>Login</Text>
           </View>
           <View style={{width:'15%',alignItems:'flex-end'}}>
          {/* <AntDesign name='arrowright' color={Colors.white} size={wp(5)} style={{ marginRight: wp(4) }} /> */}
          </View>
         </TouchableOpacity>
       }
        {/* <View style={{flexDirection:'row',alignItems:'center',alignSelf:'center',marginBottom:15}}>
                <Text style={{fontSize:13,fontFamily:fonts.roboto}}>Don't have an account?</Text>
                <TouchableOpacity onPress={()=>this.props.navigation.navigate("signup")}>
                  <Text style={{color:'#66BDAB',paddingLeft:5,fontSize:15,fontFamily:fonts.robotoBold}}>Sign Up</Text>
                </TouchableOpacity>
        </View> */}
        <TouchableOpacity onPress={()=>this.props.navigation.navigate("signup")} style={styles.ButtonOrange1}>
           <View style={{width:'85%',alignItems:'center',justifyContent:'center'}}>
           <Text style={{color:Colors.blueAccent,textAlign:'center',fontFamily:fonts.robotoBold,fontSize:wp(4),marginLeft:wp(6)}}>Sign Up</Text>
           </View>
           <View style={{width:'15%',alignItems:'flex-end'}}>
          {/* <AntDesign name='arrowright' color={Colors.blueAccent} size={wp(5)} style={{ marginRight: wp(4) }} /> */}
          </View>
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
        paddingHorizontal:wp(6),
        alignItems:'center',
        justifyContent:'center'
      },
      TextInputView:{       
        borderColor:'grey',
        alignSelf:'center',
        backgroundColor:'#F5F6FA',
        width:'100%',        
        fontSize:wp(3.5),
        fontFamily:fonts.roboto
        },
    TextInputMainView:{
        width:'100%',
        marginBottom:10
    },
    ButtonOrange:{
        width:'100%',
        height:hp(6),
        flexDirection:'row',
        backgroundColor:'#66BDAB',
        borderRadius:wp(1),
        alignItems:'center',
        marginBottom:hp(1.5),
        marginVertical:hp(1),
      },
      ButtonOrange1:{
        width:'100%',
        marginTop:hp(1),
        height:hp(6),
        flexDirection:'row',
        borderRadius:wp(1),
        borderWidth:1,
        borderColor:Colors.blueAccent,
        alignItems:'center',
        marginBottom:hp(1.5),
        marginVertical:hp(1),
      },
    skipbtn:{
        width:'100%',
        // paddingVertical:15,
        height:45,
        justifyContent:'center',
        borderRadius:3,
        alignItems:'center',
        marginBottom:15,
        marginVertical:10,
        borderWidth:1,
        borderColor:'gray',
      },
})

export default Signin;