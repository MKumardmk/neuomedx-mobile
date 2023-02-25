
import React, { Component } from 'react'
import { Text, View,TouchableOpacity,KeyboardAvoidingView,Image, ActivityIndicator,StyleSheet } from 'react-native'
import { TextInput } from 'react-native-paper';
import images from '../images/index';
import Colors from '../styles/Colors';
import {Snackbar} from 'react-native-paper'
import { baseurl } from '../Baseurl';
import base64 from 'react-native-base64';
import fonts from '../styles/fonts';
import { widthPercentageToDP as wp ,heightPercentageToDP as hp } from 'react-native-responsive-screen';

class ForgetPassword extends Component {
    

    state={
        response:[],
        email:'', emailError:'',
        responseEmail:null,
        loading:false,
        verify:false, 
        mobile_numberError:'',
        isValidMail:false,
        newPassword:'',newPasswordError:'',
        confirmPassword:'',confirmPasswordError:'',  
        updating:false,
        responseCode0:"",responseCode1:"",responseCode2:"",responseCode3:"",responseCode4:"",responseCode5:"",
        responseCode:'',responseCodeError:'',
        hideNewPassword:true,
        hideConfirmPassword:true,   
        snackBarVisible:false     
    }

   componentDidMount(){

   }

  async  verify(){
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        if(this.state.email!==''){
                 if(reg.test(this.state.email)===true){
                     this.setState({emailError:''})
                     
                     this.sendEmail()
                     
                 }else{
                     this.setState({emailError:'Check your email format'})
                 }
                }else{
                 this.setState({emailError:'This feild is required'})
             }
        }
    
        sendEmail(){
            var data=new FormData()
            data.append("email",this.state.email)
            this.setState({loading:true})
            fetch(baseurl+"forget-password-code-api", {
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
                    this.setState({loading:false,snackBarVisible:true,isValidMail:true,responseEmail:responseJson.data.email})
                }else{
                    this.setState({loading:false})
                }
            })
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
          }else if(index==4){
            await this.setState({responseCode4:value})
          }else if(index==5){
            await this.setState({responseCode5:value})
            await this.setState({responseCode:this.state.responseCode0+this.state.responseCode1+this.state.responseCode2+this.state.responseCode3+this.state.responseCode4+this.state.responseCode5})
          }          
            if(value.toString().length==1){
                focusvalue.focus()                                     
            }
        }

        async updatePassword(){
            console.log(this.state.responseCode,this.state.newPassword,this.state.confirmPassword)
            if(this.state.responseCode==''){
              await  this.setState({responseCodeError:"please enter your response code"})
            }else{
              await  this.setState({responseCodeError:''})
            }

            if(this.state.newPassword==''){
                await this.setState({newPasswordError:"This feild is required"})
            }else{
                await this.setState({newPasswordError:''})
            }

            if(this.state.confirmPassword==''){
                await this.setState({confirmPasswordError:"This feild is required"})
            }else{
              await  this.setState({confirmPasswordError:''})
            }

             if(this.state.responseCode!=='' && this.state.newPassword!=='' && this.state.confirmPassword!==''){
                 if(this.state.newPassword==this.state.confirmPassword){
                     
                      this.changePassword()
                        
                      }else{
                          this.setState({responseCodeError:'',newPasswordError:'',confirmPasswordError:"Passwords are mismatched"})
                      }               
            }
            }
    
            changePassword(){
                var data=new FormData()
                data.append("email",this.state.email)
                data.append("code",this.state.responseCode)
                data.append("password",base64.encode(this.state.newPassword))
                this.setState({loading:true})
                fetch(baseurl+"change-password-api", {
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
                        this.setState({loading:false})
                        this.props.navigation.navigate('signin')
                    }else{
                        this.setState({loading:false})
                    }
                })
            }

        
    render() {
        return (
            <KeyboardAvoidingView keyboardVerticalOffset={80} behavior={Platform.OS == "ios" ? "padding" : "height"} style={{flex:1}}>
                <View style={{flex:1,backgroundColor:'#fff',padding:20,alignItems:'center',justifyContent:'center'}}>
                 
                    <View style={{width:'50%',height:70}}>
                    <Image source={images.logo} style={{borderRadius:7,width:undefined,height:undefined,flex:1,resizeMode:'contain'}} />
                    </View>

                    {
                        this.state.isValidMail==false?
                        <View style={{width:'100%'}}>

                        <View style={{ width:'100%',marginBottom:hp(1)}}>
                        <TextInput 
                            style={{ borderColor:'grey',alignSelf:'center',backgroundColor:'#F5F6FA',width:'100%',fontSize:wp(3.5)}}                
                            dense={true}
                            label="Email"
                            mode='outlined'
                            theme={{ colors: { text: '#000', primary: "#66BDAB",placeholder:'#CBC9D9' } }}
                            ref={(input) => { this.email = input; }}
                            onSubmitEditing={() => { this.verify()}}
                            onChangeText={(value)=>{this.setState({email:value})}} 
                            returnKeyType={"next"}
                            /> 
                          {
                          this.state.emailError==''?null:
                            <View style={{width:'100%'}}>
                            <Text style={styles.errorFontstyle}>{this.state.emailError}</Text>
                            </View>
                            }
                        </View>
                        
                    </View>
                    :
                    <View style={{width:'100%',marginVertical:hp(1.5)}}>
                
                            <Text style={{fontFamily:fonts.robotoBold,paddingVertical:5}}>Enter your response code</Text>
                            <View style={{ width:'100%',flexDirection:'row',justifyContent:'space-around'}}>
                                <TextInput 
                                    style={{ borderColor:'grey',alignSelf:'center',backgroundColor:'#F5F6FA',width:'12%',fontSize:wp(3.5)}}                
                                    dense={true}
                                    value={this.state.responseCode0}
                                    mode='outlined'
                                    placeholder="*"
                                    theme={{ colors: { text: '#000', primary: "#66BDAB",placeholder:'#CBC9D9' } }}
                                    ref={(input) => { this.res0 = input; }}
                                    onSubmitEditing={() => { this.res1.focus()}}
                                    onChangeText={(value)=>{
                                        this.setResponsecode(value,this.res1,0)
                                    }} 
                                    returnKeyType={"next"}
                                    maxLength={1}
                                    /> 

                                <TextInput 
                                    style={{ borderColor:'grey',alignSelf:'center',backgroundColor:'#F5F6FA',width:'12%',fontSize:wp(3.5)}}                
                                    dense={true}
                                    value={this.state.responseCode1}
                                    mode='outlined'
                                    placeholder="*"
                                    theme={{ colors: { text: '#000', primary: "#66BDAB",placeholder:'#CBC9D9' } }}
                                    ref={(input) => { this.res1 = input; }}
                                    onSubmitEditing={() => { this.res2.focus()}}
                                    onChangeText={(value)=>{
                                         this.setResponsecode(value,this.res2,1)
                                    }} 
                                    returnKeyType={"next"}
                                    maxLength={1}
                                    /> 

                                <TextInput 
                                    style={{ borderColor:'grey',alignSelf:'center',backgroundColor:'#F5F6FA',width:'12%',fontSize:wp(3.5)}}                
                                    dense={true}
                                    value={this.state.responseCode2}
                                    mode='outlined'
                                    placeholder="*"
                                    theme={{ colors: { text: '#000', primary: "#66BDAB",placeholder:'#CBC9D9' } }}
                                    ref={(input) => { this.res2 = input; }}
                                    onSubmitEditing={() => { this.res3.focus()}}
                                    onChangeText={(value)=>{
                                        this.setResponsecode(value,this.res3,2)
                                    }} 
                                    returnKeyType={"next"}
                                    maxLength={1}
                                    /> 

                                <TextInput 
                                    style={{ borderColor:'grey',alignSelf:'center',backgroundColor:'#F5F6FA',width:'12%',fontSize:wp(3.5)}}                
                                    dense={true}
                                    value={this.state.responseCode3}
                                    mode='outlined'
                                    placeholder="*"
                                    theme={{ colors: { text: '#000', primary: "#66BDAB",placeholder:'#CBC9D9' } }}
                                    ref={(input) => { this.res3 = input; }}
                                    onSubmitEditing={() => { this.res4.focus()}}
                                    onChangeText={(value)=>{
                                        this.setResponsecode(value,this.res4,3)
                                    }} 
                                    returnKeyType={"next"}
                                    maxLength={1}
                                    /> 

                                <TextInput 
                                    style={{ borderColor:'grey',alignSelf:'center',backgroundColor:'#F5F6FA',width:'12%',fontSize:wp(3.5)}}                
                                    dense={true}
                                    value={this.state.responseCode4}
                                    mode='outlined'
                                    placeholder="*"
                                    theme={{ colors: { text: '#000', primary: "#66BDAB",placeholder:'#CBC9D9' } }}
                                    ref={(input) => { this.res4 = input; }}
                                    onSubmitEditing={() => { this.res5.focus()}}
                                    onChangeText={(value)=>{
                                        this.setResponsecode(value,this.res5,4)
                                    }} 
                                    returnKeyType={"next"}
                                    maxLength={1}
                                    /> 

                                <TextInput 
                                    style={{ borderColor:'grey',alignSelf:'center',backgroundColor:'#F5F6FA',width:'12%',fontSize:wp(3.5)}}                
                                    dense={true}
                                    placeholder="*"
                                    value={this.state.responseCode5}
                                    mode='outlined'
                                    theme={{ colors: { text: '#000', primary: "#66BDAB",placeholder:'#CBC9D9' } }}
                                    ref={(input) => { this.res5 = input; }}
                                    onSubmitEditing={() => { this.password.focus()}}
                                    onChangeText={(value)=>{
                                        this.setResponsecode(value,this.password,5)
                                    }} 
                                    returnKeyType={"next"}
                                    maxLength={1}
                                    /> 
                                    
                            </View>

                            {
                             this.state.responseCodeError==''?null:
                                <View style={{width:'100%'}}>
                                  <Text style={styles.errorFontstyle}>{this.state.responseCodeError}</Text>
                                </View>
                            }

                            
                            <TextInput
                                mode='outlined'
                                label="New Password"
                                dense={true}
                                theme={{ colors: { text: '#000', primary: "#66BDAB",placeholder:'#CBC9D9' } }}
                                style={{borderColor:'grey',alignSelf:'center',backgroundColor:'#F5F6FA',width:'100%',fontSize:wp(3.5),marginTop:hp(1)}}    
                                value={this.state.password}
                                ref={(input) => { this.password = input; }}  
                                secureTextEntry={this.state.hideNewPassword}
                                right={ <TextInput.Icon  onPress={() => { this.setState({hideNewPassword:!this.state.hideNewPassword})}} color={"#CBC9D9"} name={this.state.hidePassword?"eye-off":"eye"} />}
                                onChangeText={(value)=>{this.setState({newPassword:value})}} 
                                onSubmitEditing={() => {this.confirm.focus()}}
                                returnKeyType={"next"}        
                                textContentType="oneTimeCode"    
                                />   

                                {
                                this.state.newPasswordError==''?null:
                                    <View style={{width:'100%'}}>
                                    <Text style={styles.errorFontstyle}>{this.state.newPasswordError}</Text>
                                    </View>
                                }     

                           <TextInput
                                mode='outlined'
                                label="Confirm Password"
                                dense={true}
                                theme={{ colors: { text: '#000', primary: "#66BDAB",placeholder:'#CBC9D9' } }}
                                style={{borderColor:'grey',alignSelf:'center',backgroundColor:'#F5F6FA',width:'100%',fontSize:wp(3.5),marginTop:10}}    
                                value={this.state.confirmPassword}
                                ref={(input) => { this.confirm = input; }}  
                                secureTextEntry={this.state.hideConfirmPassword}
                                right={ <TextInput.Icon  onPress={() => { this.setState({hideConfirmPassword:!this.state.hideConfirmPassword})}} color={"#CBC9D9"} name={this.state.hidePassword?"eye-off":"eye"} />}
                                onChangeText={(value)=>{this.setState({confirmPassword:value})}} 
                                onSubmitEditing={() => {this.updatePassword()}}
                                returnKeyType={"done"}        
                                textContentType="oneTimeCode"    
                                />  

                                {
                                this.state.confirmPasswordError==''?null:
                                    <View style={{width:'100%'}}>
                                    <Text style={styles.errorFontstyle}>{this.state.confirmPasswordError}</Text>
                                    </View>
                                }                               
                    </View>
                    }

                        {
                            this.state.loading?
                            <View style={{width:'100%',height:45,justifyContent:'center',backgroundColor:Colors.appColor,borderRadius:3,alignItems:'center',marginBottom:15,marginVertical:20,}}>
                                    <ActivityIndicator size="small" color={'#fff'}/>
                                 </View>
                            
                            :
                            <>
                            {
                              !this.state.isValidMail?
                                <TouchableOpacity onPress={()=>this.verify()} 
                                    style={{width:'100%',justifyContent:'center',height:hp(6),backgroundColor:Colors.appColor,borderRadius:3,alignItems:'center',marginBottom:hp(1.5),marginVertical:hp(2),}}>
                                    <Text style={{fontFamily:fonts.robotoBold,color:'#FFF',fontSize:wp(4)}}>Verify</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={()=>this.updatePassword()} 
                                    style={{width:'100%',justifyContent:'center',height:hp(6),backgroundColor:Colors.appColor,borderRadius:3,alignItems:'center',marginBottom:hp(1.5),marginVertical:hp(2),}}>
                                    <Text style={{fontFamily:fonts.robotoBold,color:'#FFF',fontSize:wp(4)}}>Update</Text>
                                </TouchableOpacity>
                            }
                            </>
                            
                        }      
                                   
                </View>

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
                        Please check your email & get back!
                    </Snackbar>
                </KeyboardAvoidingView>
        )
    }
}
export default ForgetPassword;

const styles=StyleSheet.create({
    errorFontstyle:{
        fontSize:wp(3),
        color:'red'
    }
})