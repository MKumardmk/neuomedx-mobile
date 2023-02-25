import React, { Component } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ActivityIndicator, TouchableOpacity, Image, Platform, ScrollView } from 'react-native';
import { images } from '../images';
import { TextInput } from 'react-native-paper'
import IonicIcons from 'react-native-vector-icons/Ionicons'
import base64 from 'react-native-base64';
import { baseurl } from '../Baseurl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fonts from '../styles/fonts';
import { widthPercentageToDP as wp , heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Colors from '../styles/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOrganisation: 1,
      loading: false,
      companyName: null, companyError: null,
      uen: null,
      email: null, emailError: null,
      username:null,usernameError:null,
      newPassword: null, newPasswordError: null,
      confirmPassword: null, confirmPasswordError: null,
      pocName: null, pocNameError: null,
      pocNumber: null, pocNumberError: null,
      pocEmail: null, pocEmailError: null,
      acceptTerms:false
    };
  }

  async signup() {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (this.state.companyName == null) {
      await this.setState({ companyError: "This field is required" })
    } else {
      await this.setState({ companyError: null })
    }

    if (this.state.email == null) {
      await this.setState({ emailError: 'This field is required' })
    } else if (reg.test(this.state.email) === true) {
      await this.setState({ emailError: null })
    } else {
      // console.warn("formet")
      await this.setState({ emailError: 'Check the email format' })
    }

    if (this.state.newPassword == null) {
      await this.setState({ newPasswordError: "This field is required" })
    } else {
      await this.setState({ newPasswordError: null })
    }

    if (this.state.username == null) {
      await this.setState({ usernameError: "This field is required" })
    } else {
      await this.setState({ usernameError: null })
    }

    if (this.state.confirmPassword == null) {
      await this.setState({ confirmPasswordError: "This field is required" })
    } else {
      if (this.state.newPassword == this.state.confirmPassword) {
        await this.setState({ newPasswordError: '', confirmPasswordError: '' })
     } else {
        await this.setState({ newPasswordError: '', confirmPasswordError: "Passwords are mismatched" })
     }
    }

    

    if (this.state.pocName == null) {
      await this.setState({ pocNameError: "This field is required" })
    } else {
      await this.setState({ pocNameError: null })
    }

    if (this.state.pocNumber == null) {
      await this.setState({ pocNumberError: "This field is required" })
    } else {
      await this.setState({ pocNumberError: null })
    }

    if (this.state.pocEmail == null) {
      await this.setState({ pocEmailError: 'This field is required' })
    } else if (reg.test(this.state.pocEmail) === true) {
      await this.setState({ pocEmailError: null })
    } else {
      // console.warn("formet")
      await this.setState({ pocEmailError: 'Check the email format' })
    }

    if (this.state.companyName != null && this.state.email != null && this.state.username!=null && this.state.emailError == null && this.state.newPassword != null && this.state.pocName != null &&
      this.state.pocEmail != null && this.state.pocEmailError == null && this.state.pocNumber != null && this.state.acceptTerms==true) {

      var deviceType = null
      if (Platform.OS == "android") {
        deviceType = 2
      } else if (Platform.OS == "ios") {
        deviceType = 1
      }
      var from=null
      if(this.state.isOrganisation==1){
        from="organization"
      }else if(this.state.isOrganisation==0){
        from="personal"
      }
      console.log("signup fun")

      var data = new FormData();
      data.append("type", this.state.isOrganisation)
      data.append("company_name", this.state.companyName)
      data.append("uen", this.state.uen)
      data.append("user_name",this.state.username)
      data.append("email", this.state.email)
      data.append("password", base64.encode(this.state.newPassword))
      data.append("poc_name", this.state.pocName)
      data.append("poc_email", this.state.pocEmail)
      data.append("poc_contact", this.state.pocNumber)
      data.append("device_type", deviceType)
      data.append("device_token", "test")
      data.append("from", from)

      console.log(data)
      this.setState({ loading: true })
      fetch(baseurl + "register-api", {
        method: 'POST',
        headers: {
          //'Content-Type':"application/x-www-form-urlencoded",
          'Content-Type': 'multipart/form-data'
        },
        body: data

      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.warn(responseJson)
          if (responseJson.success == true) {
            // AsyncStorage.setItem('@user_id',JSON.stringify(responseJson.data.user.id))
            AsyncStorage.setItem("@access_token", responseJson.data.access_token)
            AsyncStorage.setItem("@email", responseJson.data.email)
            AsyncStorage.setItem("@user_pass", this.state.newPassword)
            this.setState({ loading: false })
            this.props.navigation.navigate("homeScreen")
          } else {
            if(responseJson.message.email!=""){
              this.setState({ emailError: responseJson.message.email})
            }else{
              this.setState({emailError:null})
            }
            if(responseJson.message.user_name!=""){
              this.setState({ usernameError: responseJson.message.user_name})
            }else{
              this.setState({usernameError:null})
            }
            this.setState({loading:false})
          }
        })
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardDismissMode='on-drag' keyboardShouldPersistTaps='always' style={{ backgroundColor: '#fff' }} >
          <View style={{ flex: 1, marginVertical: hp(1),paddingHorizontal:wp(7), padding: wp(3), backgroundColor: '#fff' }}>
            <View style={{ paddingBottom: hp(3) }}>
              <Text style={{ textAlign: 'left', color: '#0F0A39', fontSize: wp(4), paddingLeft: wp(3), marginVertical: hp(1.5), fontFamily: fonts.robotoBold }}>Select Purpose <Text style={{color:"#F00"}}>*</Text></Text>

              {/* <View> */}
              <TouchableOpacity onPress={() => { this.setState({ isOrganisation: 1, companyName: null }) }} style={{ flexDirection: 'row', paddingBottom: 10 }}>
                <View style={{ width: '15%', alignItems: 'center' }}>
                  <IonicIcons name={this.state.isOrganisation == 1 ? "radio-button-on" : "radio-button-off"} color={this.state.isOrganisation == 1 ? Colors.appColor : 'lightgrey'} size={25} />
                </View>

                <View style={{ width: '85%', justifyContent: 'center' }}>
                  <Text style={{ color: '#03314C', fontSize: 14 }}>Organisation</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { this.setState({ isOrganisation: 0, companyName: null }) }} style={{ flexDirection: 'row' }}>
                <View style={{ width: '15%', alignItems: 'center' }}>
                  <IonicIcons name={this.state.isOrganisation == 0 ? "radio-button-on" : "radio-button-off"} color={this.state.isOrganisation == 0 ? Colors.appColor : 'lightgrey'} size={25} />
                </View>

                <View style={{ width: '85%', justifyContent: 'center' }}>
                  <Text style={{ color: '#03314C', fontSize: 14 }}>Malls/Functions/Meetings/Etc.,</Text>
                </View>
              </TouchableOpacity>
              {/* </View> */}
            </View>

            <View style={styles.TextInputMainView}>
              <TextInput style={styles.TextInputView}
                dense={true}
                label={this.state.isOrganisation ? "Company Name" : "Name"}
                mode='outlined'
                theme={{ colors: { text: '#000', primary: "#66BDAB", placeholder: '#CBC9D9' } }}
                ref={(input) => { this.company = input; }}
                onSubmitEditing={() => { this.uen.focus() }}
                onChangeText={(value) => { this.setState({ companyName: value }) }}
                value={this.state.companyName}
                returnKeyType={"next"}
              />
              {
                this.state.companyError == null ? null
                  :
                  <Text style={{ color: 'red', fontSize: 12, marginBottom: 5, fontFamily: fonts.roboto }}>{this.state.companyError}</Text>
              }
            </View>
            <View style={styles.TextInputMainView}>
              <TextInput style={styles.TextInputView}
                dense={true}
                label="UEN"
                mode='outlined'
                theme={{ colors: { text: '#000', primary: "#66BDAB", placeholder: '#CBC9D9' } }}
                ref={(input) => { this.uen = input; }}
                onSubmitEditing={() => { this.email.focus() }}
                onChangeText={(value) => { this.setState({ uen: value }) }}
                returnKeyType={"next"}
                keyboardType="phone-pad"
                value={this.state.uen}
              />

            </View>

            {/* <View style={styles.TextInputMainView}>
               <TextInput style={styles.TextInputView}                
                 dense={true}
                 label="User name"
                 mode='outlined'
                 theme={{ colors: { text: '#000', primary: "#66BDAB",placeholder:'#CBC9D9' } }}
                 ref={(input) => { this.userName = input; }}
                 onSubmitEditing={() => { this.email.focus()}}
                 onChangeText={(value)=>{this.setState({userName:value})}} 
                 returnKeyType={"next"}
                 value={this.state.userName}
                />                 */}
            {/* {
                  this.state.emailError==null?null
                  :
                  <Text style={{color:'red',fontSize:12,marginBottom:5,fontFamily:'Lato-Regular'}}>{this.state.emailError}</Text>
                }                 */}
            {/* </View> */}

            <View style={styles.TextInputMainView}>
              <TextInput style={styles.TextInputView}
                dense={true}
                label="Email"
                mode='outlined'
                theme={{ colors: { text: '#000', primary: "#66BDAB", placeholder: '#CBC9D9' } }}
                ref={(input) => { this.email = input; }}
                onSubmitEditing={() => { this.username.focus() }}
                onChangeText={(value) => { this.setState({ email: value }) }}
                returnKeyType={"next"}
                value={this.state.email}
              />
              {
                this.state.emailError == null ? null
                  :
                  <Text style={{ color: 'red', fontSize: 12, marginBottom: 5, fontFamily: fonts.roboto }}>{this.state.emailError}</Text>
              }
            </View>

            <View style={styles.TextInputMainView}>
              <TextInput style={styles.TextInputView}
                dense={true}
                label={"Username"}
                mode='outlined'
                theme={{ colors: { text: '#000', primary: "#66BDAB", placeholder: '#CBC9D9' } }}
                ref={(input) => { this.username = input; }}
                onSubmitEditing={() => { this.newPassword.focus() }}
                onChangeText={(value) => this.setState({ username: value.replace(/\s/g, '') }) }
                value={this.state.username}
                returnKeyType={"next"}
              />
              {
                this.state.usernameError == null ? null
                  :
                  <Text style={{ color: 'red', fontSize: 12, marginBottom: 5, fontFamily: fonts.roboto }}>{this.state.usernameError}</Text>
              }
            </View>

            <View style={styles.TextInputMainDoubleView}>
              <View style={{width:'48%'}}>
              <TextInput
                dense={true}
                mode='outlined'
                label="New Password"
                theme={{ colors: { text: '#000', primary: "#66BDAB", placeholder: '#CBC9D9' } }}
                style={[styles.TextInputHalfView,{width:'100%'}]}
                value={this.state.newPassword}
                ref={(input) => { this.newPassword = input; }}
                // secureTextEntry={this.state.hidePassword}
                // right={<TextInput.Icon onPress={() => { this.setState({ hidePassword: !this.state.hidePassword }) }} color={"#CBC9D9"} name={this.state.hidePassword ? "eye-off" : "eye"} />}
                onChangeText={(value) => { this.setState({ newPassword: value }) }}
                onSubmitEditing={() => { this.confirmPassword.focus() }}
                returnKeyType={"next"}
                textContentType="oneTimeCode"
              />
              {
                this.state.newPasswordError == null ? null
                  :
                  <Text style={{ color: 'red', fontSize: 12, marginBottom: 5, fontFamily: fonts.roboto }}>{this.state.newPasswordError}</Text>
              }     
              </View> 
              <View style={{width:'48%'}}>      
              <TextInput
                dense={true}
                mode='outlined'
                label="Confirm Password"
                theme={{ colors: { text: '#000', primary: "#66BDAB", placeholder: '#CBC9D9' } }}
                style={[styles.TextInputHalfView,{width:'100%'}]}
                value={this.state.confirmPassword}
                ref={(input) => { this.confirmPassword = input; }}
                // secureTextEntry={this.state.hidePassword}
                // right={<TextInput.Icon onPress={() => { this.setState({ hidePassword: !this.state.hidePassword }) }} color={"#CBC9D9"} name={this.state.hidePassword ? "eye-off" : "eye"} />}
                onChangeText={(value) => { this.setState({ confirmPassword: value }) }}
                onSubmitEditing={() => { this.pocName.focus() }}
                returnKeyType={"next"}
                textContentType="oneTimeCode"
              />
              {
                this.state.confirmPasswordError == null ? null
                  :
                  <Text style={{ color: 'red', fontSize: 12, marginBottom: 5, fontFamily: fonts.roboto }}>{this.state.confirmPasswordError}</Text>
              }
              </View>
            </View>
            
            <Text style={{ textAlign: 'left', color: '#0F0A39', fontSize: wp(4), marginTop: 20, marginBottom: 15, fontFamily: fonts.robotoBold }}>POC Information <Text style={{color:"#F00"}}>*</Text></Text>

            <View style={styles.TextInputMainView}>
              <TextInput style={styles.TextInputView}
                dense={true}
                label="Name"
                mode='outlined'
                theme={{ colors: { text: '#000', primary: "#66BDAB", placeholder: '#CBC9D9' } }}
                ref={(input) => { this.pocName = input; }}
                onSubmitEditing={() => { this.pocEmail.focus() }}
                onChangeText={(value) => { this.setState({ pocName: value }) }}
                returnKeyType={"next"}
                value={this.state.pocName}
              />
              {
                this.state.pocNameError == null ? null
                  :
                  <Text style={{ color: 'red', fontSize: 12, marginBottom: 5, fontFamily: 'Lato-Regular' }}>{this.state.pocNameError}</Text>
              }
            </View>
            
            <View style={styles.TextInputMainDoubleView}>
              <View style={{width:'48%'}}>
              <TextInput style={[styles.TextInputHalfView,{width:'100%'}]}
                dense={true}
                label="Email"
                mode='outlined'
                theme={{ colors: { text: '#000', primary: "#66BDAB", placeholder: '#CBC9D9' } }}
                ref={(input) => { this.pocEmail = input; }}
                onSubmitEditing={() => { this.pocNumber.focus() }}
                onChangeText={(value) => { this.setState({ pocEmail: value }) }}
                returnKeyType={"next"}
                value={this.state.pocEmail}
              />
              {
                this.state.pocEmailError == null ? null
                  :
                  <Text style={{ color: 'red', fontSize: 12, marginBottom: 5, fontFamily: 'Lato-Regular' }}>{this.state.pocEmailError}</Text>
              }
            </View>
            <View style={{width:'48%'}}>
              <TextInput style={[styles.TextInputHalfView,{width:'100%'}]}
                dense={true}
                label="Contact No"
                mode='outlined'
                theme={{ colors: { text: '#000', primary: "#66BDAB", placeholder: '#CBC9D9' } }}
                ref={(input) => { this.pocNumber = input; }}
                onSubmitEditing={() => { this.signup() }}
                onChangeText={(value) => { this.setState({ pocNumber: value }) }}
                returnKeyType={"next"}
                value={this.state.pocNumber}
                maxLength={10}
                keyboardType="phone-pad"
              />
              {
                this.state.pocNumberError == null ? null
                  :
                  <Text style={{ color: 'red', fontSize: 12, marginBottom: 5, fontFamily: 'Lato-Regular' }}>{this.state.pocNumberError}</Text>
              }
            </View>
            </View>

              <TouchableOpacity onPress={()=>this.setState({acceptTerms:!this.state.acceptTerms})} style={{flexDirection:'row',marginVertical:wp(3)}}>
                <Feather name={this.state.acceptTerms?"check-square":"square"} color={this.state.acceptTerms?"#000":"red"} size={wp(6)}/>
                <Text style={{fontFamily:fonts.roboto,fontSize:wp(3.5),paddingLeft:wp(3)}}>I agree to the Trucov <Text style={{color:Colors.appColor}}> User Agreement </Text> and {"\n"}<Text  style={{color:Colors.appColor}}>Privacy Policy</Text></Text>
              </TouchableOpacity>


            {
              this.state.loading == true ?
                <TouchableOpacity style={{ width:'100%',
                height:hp(6),
                // flexDirection:'row',
                backgroundColor:'#66BDAB',
                borderRadius:wp(1),
                justifyContent:'center',
                alignItems:'center',
                marginBottom:hp(1.5),
                marginVertical:hp(1),}}>
                  <ActivityIndicator color="#fff" />
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={()=>this.signup()} style={styles.ButtonOrange}>
                <View style={{width:'85%',alignItems:'center',justifyContent:'center'}}>
                <Text style={{color:'#fff',textAlign:'center',fontFamily:fonts.robotoBold,fontSize:wp(4),marginLeft:wp(6)}}>Signup</Text>
                </View>
                <View style={{width:'15%',alignItems:'flex-end'}}>
               {/* <AntDesign name='arrowright' color={Colors.white} size={wp(5)} style={{ marginRight: wp(4) }} /> */}
               </View>
              </TouchableOpacity>
            }

          </View>
        </ScrollView>
      </View>

    );
  }
}
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    // margin:20,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  TextInputView: {
    borderColor: 'grey',
    alignSelf: 'center',
    backgroundColor: '#FAFAFA',
    width: '100%',
    // height:45,
    fontSize: wp(3.5),
    fontFamily: fonts.roboto
  },
  TextInputHalfView: {
    borderColor: 'grey',
    alignSelf: 'center',
    backgroundColor: '#FAFAFA',
    width: '48%',
    // height:45,
    fontSize: wp(3.5),
    fontFamily: fonts.roboto
  },
  TextInputMainView: {
    width: '100%',
    marginBottom: hp(1)
  },
  TextInputMainDoubleView: {
    width: '100%',
    flexDirection:'row',
    marginBottom: hp(1),
    justifyContent:'space-between'
  },
  ButtonOrange: {
    width:'100%',
    height:hp(6),
    flexDirection:'row',
    backgroundColor:'#66BDAB',
    borderRadius:wp(1),
    alignItems:'center',
    marginBottom:hp(1.5),
    marginVertical:hp(1),
  }
})

export default Signup;