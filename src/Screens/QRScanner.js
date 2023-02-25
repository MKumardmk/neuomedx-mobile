import React, { Component } from 'react';
import {StyleSheet, Text, TouchableOpacity, View,Modal,TextInput,Image,Alert,PermissionsAndroid,AsyncStorage,ActivityIndicator} from 'react-native';
// import { RNCamera } from 'react-native-camera';
import { heightPercentageToDP } from 'react-native-responsive-screen';

export default class QRScanner extends Component {
  constructor(props){
    super(props);
    this.state={
      scanned:null, 
      isScanned:false     
    }
  }

  componentDidMount(){
  // this.requestPermission()
  }
  
async requestPermission(){
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CAMERA)
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.warn("accepted")    
    }
    else if(granted=="denied"){
      this.requestPermission()

    }
    else if(granted=="never_ask_again"){      
      await AsyncStorage.setItem('never_ask_again_camera','true')
           
      await AsyncStorage.getItem('never_ask_again_camara').then((value) => {  
        this.setState({never_ask_again:JSON.parse(value)})
        console.warn(this.state.never_ask_again)
      }) 
  }  
}

opensetting(){
  this.requestPermission()
  Linking.openSettings()

}

 async scancode(barcodes){  
   console.log(barcodes)
   var barcodes1=[]
   barcodes1=barcodes
   if(barcodes1.length!=0){
     if(!this.state.isScanned){     
      await this.setState({isScanned:true})
      // Alert.alert("Data",barcodes[0].data+"",[{text:"DONE",onPress:()=>{this.setState({isScanned:false})}}],{cancelable:true})
      this.props.navigation.navigate("linkProfile")
     }    
   }   
  //  if(this.state.scanned!=null && this.state.isScanned){
  //    Alert.alert("Data",JSON.stringify(this.state.scanned),null,{cancelable:true})
  //  }
}


  render() {
    const leftTop={borderTopWidth:5,borderLeftWidth:5,borderColor:'#66bdab',borderTopLeftRadius:20}
    const rightTop={borderTopWidth:5,borderRightWidth:5,borderColor:'#66bdab',borderTopRightRadius:20}
    const leftbottom={borderBottomWidth:5,borderLeftWidth:5,borderColor:'#66bdab',borderBottomLeftRadius:20}
    const rightbottom={borderBottomWidth:5,borderRightWidth:5,borderColor:'#66bdab',borderBottomRightRadius:20}
    return (
      <View style={styles.container}>
        {/* <RNCamera
          ref={ref => { this.camera = ref; }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={this.state.torch? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
           this.scancode(barcodes)
          }}
          captureAudio={false}
          mute={true}
        /> */}
        

        <View style={{width:'100%',height:'100%',backgroundColor: 'rgba(52, 52, 52, 0.5)',position:'absolute'}}>
        
        <View style={{height:250,width:250,alignSelf:'center',marginTop:heightPercentageToDP(20)}}>

            <View style={{flex:1,flexDirection:'row'}}>
              <View style={{flex:1,...leftTop}}></View>
              <View style={{flex:1}}></View>
              <View style={{flex:1}}></View>
              <View style={{flex:1}}></View>
              <View style={{flex:1}}></View>
              <View style={{flex:1}}></View>
              <View style={{flex:1,...rightTop}}></View>
            </View>
              <View style={{flex:1}}/>
              <View style={{flex:1}}/>
              <View style={{flex:1,alignItems:'center'}}>
         
              </View>
              <View style={{flex:1}}/>
              <View style={{flex:1}}/>
            <View style={{flex:1,flexDirection:'row'}}>
              <View style={{flex:1,...leftbottom}}></View>
              <View style={{flex:1}}></View>
              <View style={{flex:1}}></View>
              <View style={{flex:1}}></View>
              <View style={{flex:1}}></View>
              <View style={{flex:1}}></View>
              <View style={{flex:1,...rightbottom}}></View>
            </View>
        </View>
        
  </View>
  </View>
   )         
   }
   }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});