
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground, ScrollView, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign'
import fonts from '../styles/fonts';
import { ProgressBar,ActivityIndicator } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import images from '../images';
import { Circle } from 'react-native-progress';
import Colors from '../styles/Colors';
import {connect} from 'react-redux'
import CheckBleState from './CheckBleState';
import BleManager from 'react-native-ble-manager';
import { Buffer } from 'buffer';
import { baseurl } from '../Baseurl';

 class Testing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0.001,
      details: {
        name: "TestUser",
        email: "test",
        result: ""
      },
      showProgressbar: true,
      modalvisible:false,
      deviceName: "",
      deviceId: "",
      nfcId: "",
      dryControl: "",
      dryTest: "",
      wetControl: "",
      wetTest: "",
      result: "1",
      errorCode: "",
      serviceIndex:3,
      charIndex:3,
      stripsArray:[],
      stripId:"",
      stripValue:"",
    };
  }

 async componentDidMount() {
  //  console.error("mount")
    console.log(JSON.stringify(this.props.charactersticsArray))
    console.log(this.props.connectedDeviceId)
    this.getAllStrips()
  }

  getAllStrips(){
    this.setState({loading:true})
    fetch(baseurl+"get-strips-api")
    .then((response)=>response.json())
    .then((responseJson)=>{
      if(responseJson.success==true){
      this.setState({stripValue:responseJson.data.strips[0].strip_id,stripId:responseJson.data.strips[0].id})
      console.log(this.state.stripValue)
      this.validateStripe()
      }
    })
  }

  validateStripe(){
    var data = new FormData();
    data.append("strip_id",this.state.stripValue)
    console.log(data)
    fetch(baseurl+"validate-strip-api", {
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
            this.readData()
          }else{
            this.setState({loading:false})
            Alert.alert('Alert',"Your test strip Not Verified",
            [{text: 'Goback', onPress: () => this.props.navigation.navigate('homeScreen')}])
          }
        })
  }

   readData(){
    // var id='41:2C:83:B7:E2:44'
    console.log(this.props.connectedDeviceId, this.props.charactersticsArray[this.state.serviceIndex].service,this.props.charactersticsArray[this.state.charIndex].characteristic)
    if(this.props.connectedDeviceId=="41:2C:83:B7:E2:44"){
      BleManager.read(this.props.connectedDeviceId, this.props.charactersticsArray[this.state.serviceIndex].service,this.props.charactersticsArray[this.state.charIndex].characteristic)
      .then((data) => {                
      const buffer = Buffer.from(data);
      var StringfromBufferBytes = ""
      buffer.forEach(item => StringfromBufferBytes += (String.fromCharCode(item)))
      // console.error(StringfromBufferBytes)
      if(this.props.isBluetoothConnected){
        setTimeout(() => {
          this.setData(StringfromBufferBytes)
        }, 1500);
      }
      })
    }else{
      this.setState({
        deviceId:null,
        nfcId:null,
        dryControl:"123",
        dryTest:"234",
        wetControl:"456",
        wetTest:"567",
        result:1,
        errorCode:'1001'
      })
      this.sendResult()
    }
    
   }

   setData(StringfromBufferBytes){
     console.warn("called")
     if(this.state.deviceId==""){
      this.setState({deviceId:StringfromBufferBytes,serviceIndex:4,charIndex:4,progress:0.2})
      this.readData()
     }else if(this.state.nfcId==""){
      this.setState({nfcId:StringfromBufferBytes,serviceIndex:5,charIndex:5,progress:0.3})
      this.readData()
     }else if(this.state.dryControl==""){
      this.setState({dryControl:StringfromBufferBytes,serviceIndex:6,charIndex:6,progress:0.4})
      this.readData()
     }else if(this.state.dryTest==""){
      this.setState({dryTest:StringfromBufferBytes,serviceIndex:7,charIndex:7,progress:0.5})
      this.readData()
     }else if(this.state.wetControl==""){
      this.setState({wetControl:StringfromBufferBytes,serviceIndex:8,charIndex:8,progress:0.6})
      this.readData()
     }else if(this.state.wetTest==""){
      this.setState({wetTest:StringfromBufferBytes,serviceIndex:9,charIndex:9,progress:0.7})
      this.readData()
     }else if(this.state.result==""){
      this.setState({result:StringfromBufferBytes,serviceIndex:11,charIndex:11,progress:0.9})
      if(this.state.result=="1" || this.state.result=="2"){
        this.readData()
      }else if(this.state.result=="3"){
        Alert.alert('Alert',"Your test strip is ambiguous state!",
        [{text: 'Goback', onPress: () => this.props.navigation.navigate('homeScreen')}],
      )
      }else{
        Alert.alert('Alert',"Your test occurs error",
        [{text: 'Goback', onPress: () => this.props.navigation.navigate('homeScreen')}],
      )
      }
     }else if(this.state.errorCode==""){
      this.setState({errorCode:StringfromBufferBytes})
      this.sendResult()
      // this.readData()
     }
    
     
      
     console.log(this.state.deviceId,this.state.nfcId,this.state.dryControl,this.state.dryTest,this.state.wetControl,this.state.wetTest,this.state.result,this.state.errorCode)
   }

  async sendResult(){
    // var data = new FormData();
    // data.append("strip_id",this.state.stripId)
    // data.append("result_status",JSON.parse(this.state.result))
    // data.append("dry_control",JSON.parse(this.state.dryControl))
    // data.append("dry_test",JSON.parse(this.state.dryTest))
    // data.append("wet_control",JSON.parse(this.state.wetControl))
    // data.append("wet_test",JSON.parse(this.state.wetTest))
    // data.append("error_code",JSON.parse(this.state.errorCode))
    // data.append("device_id",this.state.deviceId)
    // data.append("nfc_id",this.state.nfcId)
    // data.append("bluetooth_id",null)
    // data.append("organization_id",null)
    // data.append("other_user_id",null)
    // data.append("visitor_phone",null)
    // data.append("latitude",null)
    // data.append("longitude",null)
    // console.log(data)
    // fetch("https://selvisoftware.in/sst8/trucov/api/strip-result-api", {
    //   method: 'POST',
    //    headers: {
    //      //'Content-Type':"application/x-www-form-urlencoded",
    //      'Content-Type':'multipart/form-data'
    //  },
    //  body:data
    // })
    //   .then((response) => response.json())
    //   .then((responseJson) => {
    //     console.warn(responseJson)
    //   })
    await fetch("https://selvisoftware.in/sst8/trucov/api/strip-result-api", {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "strip_id":this.state.stripId,
        "result_status":this.state.result,
        "dry_control":this.state.dryControl,
        "dry_test":this.state.dryTest,
        "wet_control":this.state.wetControl,
        "wet_test":this.state.wetTest,
        "error_code":this.state.errorCode,
        "device_id":this.state.deviceId,
        "nfc_id":this.state.nfcId,
        "bluetooth_id":null,
        "organization_id":null,
        "other_user_id":null,
        "visitor_phone":null,
        "latitude":null,
        "longitude":null,
      })
    })
      .then((response)=>response.json())
      .then((responseJson)=>{
        console.log(responseJson)
        if(responseJson.success==true){
          this.setState({progress:1})
        }else{
          Alert.alert('Alert',responseJson.message,
          [{text: 'Goback', onPress: () => this.props.navigation.navigate('homeScreen')}],
        )
        }
      })
   }
  
   navigateToHomeScreen(){
     this.props.setconnectedDeviceId(null)
     this.props.navigation.navigate("homeScreen")
   }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.whiteBlueBackground }}>
        {/* <ProgressBar progress={this.state.progress} color={'#4FBF78'} style={{ height: wp(5) }} visible={this.state.showProgressbar} /> */}
        
          <View style={styles.container}>
            
             {
               this.state.loading?
               <View style={{ alignItems: 'center', alignSelf: 'center', padding: wp(2), borderRadius: wp(2) }}>
                <ActivityIndicator color={Colors.appColor}/>
                <Text style={{ fontSize: wp(4), fontFamily: fonts.robotoBold, color: '#4FBF78', textAlign: 'center', paddingTop: hp(1) }}>Strip verification</Text>
               </View>
               :
               <>
               <View style={{ backgroundColor: '#66BDAB30', flexDirection: 'row', alignItems: 'center', alignSelf: 'center', padding: wp(2), borderRadius: wp(2) }}>
                <AntDesign name="checkcircleo" size={wp(7)} color="#4FBF78" />
                <Text style={{ fontFamily: fonts.robotoBold, color: '#4FBF78', fontSize: wp(4), paddingLeft: wp(3) }}>Strip verified</Text>
               </View>
               <Text style={{ fontSize: wp(4), fontFamily: fonts.robotoBold, color: '#4FBF78', textAlign: 'center', paddingTop: hp(1) }}>{this.state.stripValue}</Text>
               </>
             }
            </View>
            
          {/* </View> */}

          {
            !this.props.isBluetoothConnected?
            Alert.alert('Alert','Your connection lost could not continue test.',
              [{text: 'Goback', onPress: () => this.props.navigation.navigate('homeScreen')}],
            )
            :
            null
          }

          <View style={styles.container}>

            {
              this.state.progress >= 1 ?
                <>
                  {
                    this.state.result=="1"?
                    <>
                      <Text style={{ color: '#4FBF78', fontFamily: fonts.robotoBold, fontSize: wp(4.5), textAlign: 'center', paddingBottom: hp(1) }}>NEGATIVE</Text>
                      <Image source={require('../images/resultNegative.png')} style={{ width: wp(25), height: wp(25), resizeMode: 'contain' }} />
                    </>
                    :
                    <>
                      <Text style={{ color: 'red', fontFamily: fonts.robotoBold, fontSize: wp(4.5), textAlign: 'center', paddingBottom: hp(1) }}>POSITIVE</Text>
                      <Image source={require('../images/virus.png')} style={{ width: wp(25), height: wp(25), resizeMode: 'contain' }} />
                    </>
                  }
                  <Text style={{ color: '#4FBF78', fontFamily: fonts.robotoBold, fontSize: wp(4), textAlign: 'center', paddingVertical: hp(1.5) }}>Scan this QR code to link your test result to your personal application!</Text>
                  <ImageBackground source={images.redBorder} style={{ width: wp(32), height: wp(32), justifyContent: 'center', alignItems: 'center' }}>
                    <QRCode
                      value={JSON.stringify(this.state.details)}
                      size={wp(25)}
                      backgroundColor="transparent"
                    />
                  </ImageBackground>

                </>
                :
                <>
                  <Circle size={wp(40)} borderWidth={0} strokeCap='round' thickness={15} color={"#4fbf78"} unfilledColor={"#D9e4ea"} progress={this.state.progress} >
                    <View style={{ width: wp(25), height: wp(25), position: 'absolute', margin: wp(7) }}>
                      <Image style={{ width: "100%", height: '100%', resizeMode: 'contain' }} source={require('../images/virus.png')} />
                    </View>
                  </Circle>
                  {/* <Image source={require('../images/virus.png')} style={{ width: wp(30), height: wp(30), resizeMode: 'contain' }} /> */}
                  <Text style={{ color: '#4FBF78', fontFamily: fonts.robotoBold, fontSize: wp(4), paddingVertical: wp(5) }}>TESTING IN PROGRESS...</Text>
                </>
            }


          </View>

          {
            this.state.progress >= 1 ?
              <TouchableOpacity onPress={() =>this.navigateToHomeScreen()} style={{ backgroundColor: '#4FBF78',width:'90%',height:hp(6),alignSelf:'center',borderRadius:wp(1),marginTop:hp(2),justifyContent:'center',alignItems:'center',position:'absolute',bottom:0 }}>
                <Text style={{ fontSize: wp(4), fontFamily: fonts.robotoBold, color: '#fff' }}>Back to home</Text>
              </TouchableOpacity>
              :
              null
          }      
          
          <CheckBleState/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: wp(90), borderRadius: wp(1), alignSelf: 'center', alignItems: 'center', backgroundColor: '#fff', marginTop: hp(2), padding: wp(5), shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 2, elevation: 3
  }
})
function mapStateToProps(state) {
  return {
    isBluetoothConnected:state.isBluetoothConnected,
    charactersticsArray:state.charactersticsArray,
    connectedDeviceId:state.connectedDeviceId
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setdeviceList:(value)=>{dispatch({type:"setdeviceList",value})},
    setisBluetoothConnected:(value)=>{dispatch({type:"setisBluetoothConnected",value})},
    setconnectedDeviceId:(value)=>{dispatch({type:"setconnectedDeviceId",value})}
  };
}
export default connect( mapStateToProps, mapDispatchToProps )(Testing);