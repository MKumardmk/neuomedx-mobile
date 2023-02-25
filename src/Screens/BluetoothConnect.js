import React, {Component} from 'react';
import {SafeAreaView,StyleSheet,ScrollView,View,Text,StatusBar,NativeModules,NativeEventEmitter,Platform,PermissionsAndroid,TouchableHighlight,TouchableOpacity,Alert,Modal,Switch} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import ConnectivityManager from 'react-native-connectivity-status'

import BleManager from 'react-native-ble-manager';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
import { Buffer } from 'buffer';
import { ActivityIndicator, Button, Dialog, Paragraph,Snackbar } from 'react-native-paper';
import Colors from '../styles/Colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import fonts from '../styles/fonts';
import { connect } from 'react-redux';

const peripherals = new Map();

class BluetoothConnect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceName: "",
      deviceId: "",
      nfcId: "",
      dryTest: "",
      dryResult: "",
      wetTest: "",
      WetResult: "",
      result: "",
      errorCode: "",
      isScanning: false,
      connectedDevices: [],
      permissionsAllowed: false,
      showDialog: false,
      readButtonLoading: false,
      dialogAsciiData: "",
      dialogTitle: "",
      dialogScrollData: [
        {
          "properties": {
            "Read": "Read"
          },
          "characteristic": "2a00",
          "service": "1800"
        },
        {
          "properties": {
            "Read": "Read"
          },
          "characteristic": "2a01",
          "service": "1800"
        },
      ],
      peripheralId: null,
      list: [],
      isBluetoothEnabled: false,
      snackBarVisible:false,
      snackBarLabel:"",
      pairLoading:false,
      pairDeviceId:null
    };
  }
  async componentDidMount() {
    this.getMethod()
  }

 async getMethod(){
    await this.addEventListeners()
    await this.checkBluetoothStatus()
    await this.checkLocationStatus()
    await this.checkBeforeScanningStart()
  }

  addEventListeners(){
    BleManager.start({ showAlert: false });
    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral.bind(this));
    bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan.bind(this));
    bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral.bind(this));
    bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic.bind(this));
  }

  removeEventListener(){
    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral.bind(this)).remove();
    bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan.bind(this)).remove();
    bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral.bind(this)).remove();
    bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic.bind(this)).remove();
  }

 async refresh(){
   await this.removeEventListener()
   await this.addEventListeners()
    this.checkBeforeScanningStart()
  }
  componentWillUnmount() {
    console.log('unmount');
    // this.removeEventListener()
      }

  async checkLocationStatus() {
    await this.checkLocationPermisson()
    const locationServicesAvailable = await ConnectivityManager.areLocationServicesEnabled()
    console.log(locationServicesAvailable, "Location service")
    if (!locationServicesAvailable) {
      if (Platform.OS == 'android') {
        await this.checkLocationPermisson()
      }
      const locationServicesAvailableInside = await ConnectivityManager.areLocationServicesEnabled()
      console.log(locationServicesAvailableInside, "Location service inside")
      console.log(this.state.permissionsAllowed, "permission allowed")
      if (!locationServicesAvailableInside) {
        Alert.alert("Location Required", "Location required to scan nearby bluetooth devices")
      }
    }
    const locationServicesAvailableReturn = await ConnectivityManager.areLocationServicesEnabled()
    return locationServicesAvailableReturn
  }

  async checkBluetoothStatus() {
    const bluetoothIsOn = await ConnectivityManager.isBluetoothEnabled()
    await this.setState({ isBluetoothEnabled: bluetoothIsOn })
    console.log(bluetoothIsOn, "Bluetooth service")
    if (!bluetoothIsOn) {
      if (Platform.OS == 'android') {
        await BleManager.enableBluetooth()
          .then(() => { console.log("The bluetooth is already enabled or the user confirm"); })
          .catch((error) => { console.log("The user refuse to enable bluetooth"); });
        const bluetoothstatus = await ConnectivityManager.isBluetoothEnabled()
        await this.setState({ isBluetoothEnabled: bluetoothstatus })
        console.log(bluetoothstatus, "Bluetooth service inside")
        if (!bluetoothstatus) {
          Alert.alert("Bluetooth Required", "Please turn on Bluetooth to scan devices")
        }
      }
    }
    const bluetoothIsOnReturn = await ConnectivityManager.isBluetoothEnabled()
    await this.setState({ isBluetoothEnabled: bluetoothIsOnReturn })

    return bluetoothIsOnReturn
  }

  async checkLocationPermisson() {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
        if (result) {
          console.log("Permission is OK");
          this.setState({ permissionsAllowed: true })
        } else {
          PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
            if (result) {
              console.log("User accept");
              this.setState({ permissionsAllowed: true })
            } else {
              console.log("User refuse");
              this.setState({ permissionsAllowed: false })
            }
          });
        } 
      });
    } else {
      this.setState({ permissionsAllowed: true })
    }
  }

  async checkBeforeScanningStart() {
    var bluetooth = await this.checkBluetoothStatus()
    var location = await this.checkLocationStatus()
    if (bluetooth && location) {
      await this.retrieveConnected()
      // if(this.props.isBluetoothConnected==false){
        this.startScan()
      // }
      
    }
  }

  async startScan() {
    
    // if (!this.state.isScanning) {
      // BleManager.scan([], 5, true).then((results) => {
      //   console.log("results "+ results)
      //   // this.addEventListeners()
      //   // console.warn('Scanning...', []);
      //   this.setState({ isScanning: true })
      //   // this.setState({ list: [] })

      // // }).catch(err => {
      //   // console.error(err);
      // });
    // }

    BleManager.scan([], 5, true).then(() => {
      // Success code
      console.log("Scan started");
      this.setState({ isScanning: true })
    });
  }



  handleStopScan() {
    console.log('Scan is stopped');
    this.setState({ isScanning: false });
  }

  handleDisconnectedPeripheral(data) {
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      peripherals.set(peripheral.id, peripheral);
      this.setState({ list: Array.from(peripherals.values()) });
    }
    console.log('Disconnected from ' + data.peripheral);
  }
  //command
  handleUpdateValueForCharacteristic = (data) => {
    console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
  }

  retrieveConnected() {
    console.error("retrive call")
     this.setState({list:[]})
    BleManager.getConnectedPeripherals([]).then((results) => {
      if (results.length == 0) {
        // console.error('No connected peripherals')
      }
      console.warn("retrived "+JSON.stringify(results));
      for (var i = 0; i < results.length; i++) {
        var peripheral = results[i];
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);       
        this.setState({list:Array.from(peripherals.values())});  
        // this.props.setdeviceList(this.state.list)     
        // console.log("props retr "+JSON.stringify(this.props.deviceList))
      }
    });
  }

  handleDiscoverPeripheral(peripheral) {
    this.setState({isScanning:true})
    console.warn('Got ble peripheral', JSON.stringify(peripheral));
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    peripherals.set(peripheral.id, peripheral);
    this.setState({ list: Array.from(peripherals.values()) });
  }

  isConnected(peripheral) {
    return this.state.connectedDevices.filter(cd => cd.id == peripheral.id).length > 0;
  }

  async connectDevice(peripheral) {
    // console.log(peripheral)
    // if (peripheral) {
        this.setState({pairLoading:true,pairDeviceId:peripheral.id})
        BleManager.connect(peripheral.id).then(() => {
          var deviceList=this.state.list
          deviceList.map((item,index)=>{
            if(item.id==peripheral.id){
              item.connected=true
            }
          })
          this.setState({list:deviceList,pairLoading:false})
          var emptyarray=[]
          this.props.setcharactersticsArray(emptyarray)
          this.props.setisBluetoothConnected(true)
          this.props.setconnectedDeviceId(peripheral.id)
          this.setState({snackBarLabel:"Device connected!",snackBarVisible:true})
          // console.log('Connected to ' + peripheral.id);
        }).catch((error) => {
          // console.log('Connection error', error);
        });
    // }

  }

  disconnectDevice(peripheral){
    BleManager.disconnect(peripheral.id);
    var deviceList=this.state.list
    deviceList.map((item,index)=>{
      if(item.id==peripheral.id){
        item.connected=false
      }
    })
    this.setState({list:deviceList})
    this.props.setisBluetoothConnected(false)
    this.props.setconnectedDeviceId(null)
    this.setState({snackBarLabel:"Device disconnected!",snackBarVisible:true})
  }

  // readBleData(peripheral) {
  //   this.setState({ readButtonLoading: true })
  //    console.error(peripheral)
  //   BleManager.retrieveServices(peripheral.id).then((peripheralData) => {
  //     console.log('Retrieved peripheral services', JSON.stringify(peripheralData));
  //     this.setState({ dialogScrollData: peripheralData.characteristics, peripheralId: peripheral.id, readButtonLoading: false, showDialog: true })
  //   });
  // }

  toggelConnection(item){
    if(item.advertising.isConnectable==true){
      if(item.connected==true){
        console.log("item is connected")
        this.disconnectDevice(item)
      }else{
        console.log("item is not connected")
        this.connectDevice(item)
      }
    }else{
      console.log("item is not connectable")
    }

  }

 async changeBluetoothStatus(value){
   await this.setState({isBluetoothEnabled:!this.state.isBluetoothEnabled,list:[]})
   console.error(this.state.isBluetoothEnabled)
    if(this.state.isBluetoothEnabled==true){
      this.getMethod()
    }
  }

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{ backgroundColor: '#FFF', flex: 1 }}>
         
          <View style={{ height: hp(10), backgroundColor: Colors.whiteBlueBackground, alignItems: 'center', paddingVertical: hp(2), flexDirection: 'row', paddingHorizontal: wp(5) }}>
            <View style={{ width: '98%', height: hp(7), flexDirection: 'row', alignItems: 'center', alignSelf: 'center', backgroundColor: '#FFF', borderRadius: wp(1) }}>
              <View style={{ width: '15%', alignItems: 'center' }}>
                <FontAwesome name="bluetooth" size={wp(8)} color={Colors.appColor} />
              </View>
              <View style={{ width: '65%' }}>
                <Text style={{ color: Colors.blueAccent, fontFamily: fonts.roboto, fontSize: wp(3.5) }} >Bluetooth</Text>
              </View>
              <View style={{ width: '20%',alignItems:'flex-end'}}>
                <Switch
                  // style={{ paddingVertical: hp(0.3), paddingHorizontal: wp(2) }}
                  trackColor={{ false: "#767577", true: Colors.successGreen }}
                  thumbColor={this.state.isBluetoothEnabled ? "#F4f3f4" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() =>this.changeBluetoothStatus()}
                  value={this.state.isBluetoothEnabled}
                />
              </View>
            </View>
          </View>

          {
            this.state.isBluetoothEnabled?
            <>
                <View style={{ padding: wp(5), flexDirection: 'row', alignItems: 'center',justifyContent:'space-between' }}>
                  {/* <View style={{ width: '80%' }}> */}
                    <Text style={{ color: Colors.blueAccent, fontFamily: fonts.robotoBold, fontSize: wp(4) }} >Available Devices</Text>
                  {/* </View> */}
                  <TouchableOpacity style={{height: hp(5), alignItems: 'center' }} onPress={() => { this.state.isScanning ? null : this.refresh()}}>
                    <View style={{ backgroundColor: '#ededed', width: wp(10), height: wp(10), borderRadius: wp(5), justifyContent: 'center', alignItems: 'center' }} >
                      {this.state.isScanning ?
                        <ActivityIndicator size='small' style={{ width: wp(6.5), height: wp(6.5) }} color={Colors.blueAccent} /> :
                        <SimpleLineIcons name="refresh" size={wp(6.5)} color={Colors.blueAccent} />
                      }
                    </View>
                  </TouchableOpacity>

                </View>
          
                <ScrollView >
                {
                this.state.readButtonLoading?
                  <View style={{ padding: 10,alignSelf:'flex-end' }}>
                    <ActivityIndicator color={Colors.appColor} size="small" />
                  </View>
                  :
                  null
                }
                  {(this.state.list.length == 0) ?
                    <View style={{ flex: 1, margin: 20 }}>
                      <Text style={{ textAlign: 'center' }}>No peripherals</Text>
                    </View> :
                    <View style={{ flex: 1 }} >
                      {this.state.list.map((item, index) => {
                        console.log(item)
                        const color = item.connected ? Colors.appColor : '#f2f5f6';
                        return (
                          <TouchableOpacity onPress={()=>this.toggelConnection(item)} style={{ marginVertical: 10, paddingHorizontal: 10 }} key={index} >
                            <View style={{ backgroundColor: color, padding:wp(2), borderRadius: wp(1), borderWidth: 1, borderColor: 'lightgrey', flexDirection: 'row',alignItems:'center' }}>
                                <View style={{ width: '10%', alignItems: 'center' }}>
                                  {
                                    this.state.pairLoading && item.id==this.state.pairDeviceId?
                                    <ActivityIndicator color={Colors.appColor}/>
                                    :
                                    <FontAwesome name="bluetooth" size={wp(8)} color={item.connected?"#fff":Colors.appColor} />
                                  }
                                  
                                </View>
                              <View style={{ width: '50%'}}>
                              <Text style={{ fontSize:wp(4),fontFamily:fonts.robotoBold, textAlign:'left', color:item.connected?"#fff":"#333333", padding: 10 }}>{(item.name == "NO NAME" || item.name == null) ? item.id : item.name}</Text>
                                {/* {
                                  item.name == "NO NAME" || item.name == null ?null:
                                  <Text style={{fontSize:wp(3),fontFamily:fonts.roboto, textAlign:'left', color:item.connected?"#fff":"#333333",paddingLeft:10}}>{item.id}</Text>
                                  } */}
                                {/* <Text style={{ fontSize: 10, textAlign: 'center', color: '#333333', padding: 2 }}>RSSI: {item.rssi}</Text> */}
                              </View>
                              <View style={{ width: '35%',alignItems:'flex-end',}}>

                                {
                                  item.advertising.isConnectable ?null:
                                    <Text style={{ color: '#F00', fontSize: 12, marginTop: 5, textAlign: 'center' }} >Not Connectable</Text>
                                }
                              </View>
                            </View>
                          </TouchableOpacity>
                        )
                      })

                      }
                    </View>
                  }
                </ScrollView>
              {
                this.props.isBluetoothConnected?
                  <TouchableOpacity onPress={()=>this.props.navigation.navigate("homeScreen")} style={{width:wp(90),marginVertical:wp(3),padding:wp(4),backgroundColor:Colors.appColor,alignSelf:'center',borderRadius:3}}>
                    <Text style={{fontFamily:fonts.robotoBold,color:'#fff',fontSize:wp(4),textAlign:'center'}}>BACK TO HOME</Text>
                  </TouchableOpacity>
                  :
                  null
              }

                <Snackbar
                    visible={this.state.snackBarVisible}
                    onDismiss={()=>this.setState({snackBarVisible:false})}
                    duration={2000}
                    action={{
                        label: 'close',
                        onPress: () => {
                        this.setState({snackBarVisible:false})
                        },
                    }}>
                       {this.state.snackBarLabel}
                </Snackbar>
            </>
            :
            null
            }
        </SafeAreaView>
      </>
    );
  }
};

const styles = StyleSheet.create({

  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  highlight: {
    fontWeight: '700',
  },
});

function mapStateToProps(state) {
  return {
    // userId:state.userId,
    authToken:state.authToken,
    isBluetoothConnected:state.isBluetoothConnected,
    deviceList:state.deviceList,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setdeviceList:(value)=>{dispatch({type:"setdeviceList",value})},
    setisBluetoothConnected:(value)=>{dispatch({type:"setisBluetoothConnected",value})},
    setconnectedDeviceId:(value)=>{dispatch({type:"setconnectedDeviceId",value})},
    setcharactersticsArray:(value)=>{dispatch({type:"setcharactersticsArray",value})}
  };
}
export default connect( mapStateToProps, mapDispatchToProps )(BluetoothConnect);