import React, { Component } from 'react';
import { View, Text } from 'react-native';
import BleManager from 'react-native-ble-manager';
import {connect} from 'react-redux'

class CheckBleState extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount(){
   this.getStatus()
  }

  componentDidUpdate(){
      if(this.props.isBluetoothConnected==true){
          this.getStatus()
      }
  }

  getStatus(){
    var emptyarray=[]
    const interval=  setInterval(()=>{  
     BleManager.getConnectedPeripherals([]).then((results) => {
        //  console.log(JSON.stringify(results))
         if(results.length!=0 && this.props.charactersticsArray.length==0){
          BleManager.retrieveServices(results[0].id).then((peripheralData) => {
          this.props.setcharactersticsArray(peripheralData.characteristics)
         })
        }else{
          // console.log("char props array length !=0")
        }
         if(results.length==0){
             clearInterval(interval)
            //  console.warn("0 connected devices")
             this.props.setisBluetoothConnected(false)
             this.props.setdeviceList(emptyarray)
            
            //  console.error(this.props.isBluetoothConnected)
         }
     })
    },2000)
  }

  render() {
    return <View/>
  }
}

function mapStateToProps(state) {
    return {
      isBluetoothConnected:state.isBluetoothConnected,
      charactersticsArray:state.charactersticsArray
    };
  }
  
  function mapDispatchToProps(dispatch) {
    return {
      setdeviceList:(value)=>{dispatch({type:"setdeviceList",value})},
      setisBluetoothConnected:(value)=>{dispatch({type:"setisBluetoothConnected",value})},
      setcharactersticsArray:(value)=>{dispatch({type:"setcharactersticsArray",value})}
    };
  }
  export default connect( mapStateToProps, mapDispatchToProps )(CheckBleState);