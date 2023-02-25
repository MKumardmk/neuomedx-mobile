import React, { Component } from 'react';
import { View, Text } from 'react-native';
import IntroSlider from './Screens/IntroSlider';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Signup from './Screens/Signup';
import Signin from './Screens/Signin';
import HomeScreen from './Screens/HomeScreen';
import ForgotPasswprd from './Screens/ForgotPasswprd';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BluetoothConnect from './Screens/BluetoothConnect';
import Colors from './styles/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import images from './images';
import Testing from './Screens/Testing';
import TestingResult from './Screens/TestingResult';
import QRScanner from './Screens/QRScanner';
import TestVisiter from './Screens/TestVisiter';
import { connect } from 'react-redux';
import { UPDATE_USER_ID,UPDATE_AUTH_TOKEN } from './redux/Actions';
import fonts from './styles/fonts';
import Menus from './Screens/Menus';
import VerifyCode from './Screens/VerifyCode';
import TestReports from './Screens/TestReports';
import TestReportsDetails from './Screens/TestReportsDetails';
import EmployeeManage from './Screens/EmployeeManage';
import EmployeeAddNew from './Screens/EmployeeAddNew';
import SplashScreen from 'react-native-splash-screen';
import MyProfile from './Screens/MyProfile';
import ChangePassword from './Screens/ChangePassword';
import NFCConnect from './Screens/NFCConnect';
import ConnectDevice from './Screens/ConnectDevice';
import LinkProfile from './Screens/LinkProfile';

const Stack = createNativeStackNavigator()
class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialScreen: "signin"
    };
  }

  async componentDidMount() {
    await this.checkLoginStatus()
  }

  async checkLoginStatus() {
    // var userId = await AsyncStorage.getItem('@user_id')
    var authToken = await AsyncStorage.getItem("@access_token")
    var slider_opend = await AsyncStorage.getItem("@slider_opend")
    // console.log(userId, authToken, slider_opend)
    if (slider_opend == null) {
      await this.setState({ initialScreen: 'introScreen' })
      console.log("Intro Screen")
    } else {
      if (authToken != null) {   
        console.log("Login success")     
        await this.props.setUpdateAuthToken(authToken)
        // await this.props.setUpdateUserId(userId)        
        await this.setState({ initialScreen: "homeScreen" })       
      }
    }
    setTimeout(()=>{
      SplashScreen.hide()
    },1000)
 }

  render() {
    const AppContainer =()=> (

      <Stack.Navigator initialRouteName={this.state.initialScreen} screenOptions={{ presentation: 'card', animationTypeForReplace: 'push', animation: 'slide_from_right' }} >
        <Stack.Screen name="introScreen" component={IntroSlider} options={{ headerShown: false }} />
        <Stack.Screen name="signin" component={Signin} options={{ headerShown: false }} />
        <Stack.Screen name="signup" component={Signup} options={{ title: "Sign Up", headerTitleAlign: 'center', headerTintColor: Colors.blueAccent, headerBackTitle: "Back", headerTitleStyle: { fontSize: wp(4), fontFamily:fonts.robotoBold, color: Colors.blueAccent }, headerStyle: { backgroundColor: Colors.whiteBlueBackground } }} />
        <Stack.Screen name="forgotPassword" component={ForgotPasswprd} options={{ title: "Forgot Password", headerTitleAlign: 'center', headerTintColor: Colors.blueAccent, headerBackTitle: "Back", headerTitleStyle: { fontSize: wp(4), fontFamily:fonts.robotoBold, color: Colors.blueAccent, }, headerStyle: { backgroundColor: Colors.whiteBlueBackground } }} />
        <Stack.Screen name="homeScreen" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="connectDevice" component={ConnectDevice} options={{ title: "Connect Device", headerTitleAlign: 'center', headerTintColor: Colors.blueAccent, headerBackTitle: "Back", headerTitleStyle: { fontSize: wp(4), fontFamily:fonts.robotoBold, color: Colors.blueAccent, }, headerStyle: { backgroundColor: Colors.whiteBlueBackground }, }} />
        <Stack.Screen name="bluetoothConnect" component={BluetoothConnect} options={{ title: "Connect Device", headerTitleAlign: 'center', headerTintColor: Colors.blueAccent, headerBackTitle: "Back", headerTitleStyle: { fontSize: wp(4), fontFamily:fonts.robotoBold, color: Colors.blueAccent, }, headerStyle: { backgroundColor: Colors.whiteBlueBackground }, }} />
        <Stack.Screen name="nfcConnect" component={NFCConnect} options={{ title: "Connect Device", headerTitleAlign: 'center', headerTintColor: Colors.blueAccent, headerBackTitle: "Back", headerTitleStyle: { fontSize: wp(4), fontFamily:fonts.robotoBold, color: Colors.blueAccent, }, headerStyle: { backgroundColor: Colors.whiteBlueBackground }, }} />
        <Stack.Screen name="qrScanner" component={QRScanner} options={{ title: "Scan and Link", headerTitleAlign: 'center', headerTintColor: Colors.white, headerBackTitle: "Back", headerTitleStyle: { fontSize: wp(4), fontFamily:fonts.robotoBold, color: Colors.white, }, headerStyle: { backgroundColor: Colors.appColor } }} />
        <Stack.Screen name="testVisiter" component={TestVisiter} options={{ title: "Test for Visitor", headerTitleAlign: 'center', headerTintColor: Colors.white, headerBackTitle: "Back", headerTitleStyle: { fontSize: wp(4), fontFamily:fonts.robotoBold, color: Colors.white, }, headerStyle: { backgroundColor: Colors.appColor } }} />
        <Stack.Screen name="testing" component={Testing}  options={{ title: "Testing Screen", headerTitleAlign: 'center', headerTintColor: Colors.blueAccent, headerBackTitle: "Back", headerTitleStyle: { fontSize: wp(4), fontFamily:fonts.robotoBold, color: Colors.blueAccent, }, headerStyle: { backgroundColor: Colors.whiteBlueBackground } }}  />
        <Stack.Screen name="testResult" component={TestingResult} options={{ headerShown: false }} />
        <Stack.Screen name="menus" component={Menus} options={{ title: "Menu", headerTitleAlign: 'center', headerTintColor: Colors.blueAccent, headerBackTitle: "Back", headerTitleStyle: { fontSize: wp(4), fontFamily:fonts.robotoBold, color: Colors.blueAccent, }, headerStyle: { backgroundColor: Colors.whiteBlueBackground } }} />
        <Stack.Screen name="verifyCode" component={VerifyCode} options={{ title: "Verification Code", headerTitleAlign: 'center', headerTintColor: Colors.blueAccent, headerBackTitle: "Back", headerTitleStyle: { fontSize: wp(4), fontFamily:fonts.robotoBold, color: Colors.blueAccent, }, headerStyle: { backgroundColor: Colors.whiteBlueBackground } }} />
        <Stack.Screen name="testReports" component={TestReports} options={{ title: "Test Reports", headerTitleAlign: 'center', headerTintColor: Colors.blueAccent, headerBackTitle: "Back", headerTitleStyle: { fontSize: wp(4), fontFamily:fonts.robotoBold, color: Colors.blueAccent, }, headerStyle: { backgroundColor: Colors.whiteBlueBackground } }} />
        <Stack.Screen name="testReportsDetails" component={TestReportsDetails} options={{ title: "Test Reports", headerTitleAlign: 'center', headerTintColor: Colors.blueAccent, headerBackTitle: "Back", headerTitleStyle: { fontSize: wp(4), fontFamily:fonts.robotoBold, color: Colors.blueAccent, }, headerStyle: { backgroundColor: Colors.whiteBlueBackground } }} />
        <Stack.Screen name="manageEmployee" component={EmployeeManage} options={{ title: "Manage Employees", headerTitleAlign: 'center', headerTintColor: Colors.blueAccent, headerBackTitle: "Back", headerTitleStyle: { fontSize: wp(4), fontFamily:fonts.robotoBold, color: Colors.blueAccent, }, headerStyle: { backgroundColor: Colors.whiteBlueBackground } }} />
        <Stack.Screen name="newEmployee" component={EmployeeAddNew} options={{ title: "New Employee", headerTitleAlign: 'center', headerTintColor: Colors.blueAccent, headerBackTitle: "Back", headerTitleStyle: { fontSize: wp(4), fontFamily:fonts.robotoBold, color: Colors.blueAccent, }, headerStyle: { backgroundColor: Colors.whiteBlueBackground } }} />
        <Stack.Screen name="myProfile" component={MyProfile} options={{ title: "My Profile", headerTitleAlign: 'center', headerTintColor: Colors.blueAccent, headerBackTitle: "Back", headerTitleStyle: { fontSize: wp(4), fontFamily:fonts.robotoBold, color: Colors.blueAccent, }, headerStyle: { backgroundColor: Colors.whiteBlueBackground } }} />
        <Stack.Screen name="changePassword" component={ChangePassword} options={{ title: "Change Password", headerTitleAlign: 'center', headerTintColor: Colors.white, headerBackTitle: "Back", headerTitleStyle: { fontSize: wp(4), fontFamily:fonts.robotoBold, color: Colors.white, }, headerStyle: { backgroundColor: Colors.blueText } }} />
        <Stack.Screen name="linkProfile" component={LinkProfile} options={{ headerShown: false }} />
      </Stack.Navigator>
    )
    return (
      <NavigationContainer>
        <AppContainer />
      </NavigationContainer>
    );
  }
}
function mapStateToProps(state) {
  return {
      
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // setUpdateUserId:(value)=>{dispatch({type:UPDATE_USER_ID,value})},
    setUpdateAuthToken:(value)=>{dispatch({type:UPDATE_AUTH_TOKEN,value})}
  };
}

export default connect( mapStateToProps, mapDispatchToProps )(Navigation);

