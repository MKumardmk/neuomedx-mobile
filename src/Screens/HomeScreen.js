import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView,Dimensions, Alert } from 'react-native';
import { widthPercentageToDP as wp,heightPercentageToDP as hp } from 'react-native-responsive-screen';
import fonts from '../styles/fonts';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Fontisto from 'react-native-vector-icons/Fontisto'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Searchbar,ActivityIndicator,TextInput } from 'react-native-paper';
import {connect} from 'react-redux'
import { baseurl } from '../Baseurl';
import images from '../images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IS_VISITOR, UPDATE_AUTH_TOKEN } from '../redux/Actions';
import Colors from '../styles/Colors';
import SwitchSelector from 'react-native-switch-selector';
import CheckBleState from './CheckBleState';
const height = Dimensions.get("window").height;
class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBluetoothconected:false,
      who:"staff",
      searchValue:null,
      selectedEmployeeid:null,
      employeeList:[],
      contactNumber:null,
      options:[
        { label: "MY STAFFS", value: "staff" },
        { label: "VISITORS", value: "visitor" },
      ]
    };
  }

  componentDidMount(){
    this.getDetails()
  }


   async getDetails(){
    const value = await AsyncStorage.getItem('@access_token')
    // console.error(value)
    // await AsyncStorage.getItem('@access_token').then((value) => {
      if(value!=null){
      await this.props.setUpdateAuthToken(value)
       console.log(this.props.authToken)
      }
    // })
    // const options = await AsyncStorage.getItem('')
    
    const op = await AsyncStorage.getItem('option')
    console.log("options "+ op)
    if(op!=null){

     await this.props.settabOptions(JSON.parse(op))
      console.log(this.props.tabOptions)
    }
  }

  changeTab(value){
      this.setState({who:value})
  }

   async searchList(text){
    
    await this.setState({searchValue:text});
    if(this.state.searchValue=="" || this.state.searchValue==null){
      this.setState({employeeList:[],selectedEmployeeid:null})
    }else{
    console.log(text)
    // console.error(this.props.authToken)
    var data = new FormData();
    data.append("data",this.state.searchValue)
    
    this.setState({loading:true})
      fetch(baseurl+"manage-employees-api/search", {
        method: 'POST',
         headers: {
           //'Content-Type':"application/x-www-form-urlencoded",
           'Content-Type':'multipart/form-data',
           'Authorization': `Bearer ${this.props.authToken}`
       },
       body:data
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.warn(responseJson)
          this.setState({employeeList:responseJson.data,loading:false})
        })
      }
    }

  selecteEmployee(item){
    this.setState({selectedEmployeeid:item.emp_id,searchValue:item.name})
  }

  navigateToTestscreen(){
    if(this.state.who=="visitor" || this.state.selectedEmployeeid!=null){
      this.props.navigation.navigate("testing")
    }
  }

  render() {
    return (
      <View style={{backgroundColor:'#fff',height:hp(100)}}>
        {/* header section start */}
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:wp(5),backgroundColor:'#F2FAF9',height:hp(15)}}>
          <Image source={require('../images/logo.png')} style={{width:"45%",height:"50%",resizeMode:'contain'}}/>  
          <TouchableOpacity onPress={()=>this.props.navigation.navigate("connectDevice")} style={{width:'15%',height:'45%',alignItems:'center'}}>    
            <View style={{width:"100%",height:'100%',backgroundColor:'#fff',alignItems:'center',justifyContent:'center',borderRadius:50}}>
            <View style={{width:25,height:25,position:'absolute',left:"50%",top:"-15%",zIndex:1,backgroundColor:this.props.isBluetoothConnected?"#4FBF78":"red",borderRadius:20,borderWidth:0.5,borderColor:'gray',alignItems:'center',justifyContent:'center'}}>
              {
                this.props.isBluetoothConnected?
                  <AntDesign name="check" color="#fff" size={wp(4)}/>
                  :
                  <AntDesign name="close" color="#fff" size={wp(4)}/>
              }            
            </View>
              <Image source={require('../images/device.png')} style={{width:"80%",height:"70%",resizeMode:'contain'}}/>
            </View>
          </TouchableOpacity>
        </View>
        {/* header section end */}

      {
        this.props.isBluetoothConnected?
        <>
      {/* tab section start */}
        {/* <View style={{flexDirection:'row',justifyContent:'space-around',marginVertical:hp(2)}}>
          <View style={{width:'45%',}}>
            <TouchableOpacity onPress={()=>this.changeTab("staff")} style={{padding:wp(2.5),justifyContent:'center',alignItems:'center',borderWidth:1,backgroundColor:this.state.who=="staff"?Colors.appColor:'#fff',borderColor:this.state.who=="staff"?Colors.appColor:"#96A6AF",borderRadius:wp(1)}}>
              <Text style={{color:this.state.who=="staff"?'#fff':'#96A6AF',fontFamily:fonts.robotoBold,fontSize:wp(3.5)}}>MY STAFFS</Text>
            </TouchableOpacity>
            <AntDesign name="caretdown" color={this.state.who=="staff"?Colors.appColor:"#fff"} size={wp(5)} style={{marginTop:-6,alignSelf:'center'}}/>
          </View>

          <View style={{width:'45%',}}>
          <TouchableOpacity onPress={()=>this.changeTab("visitor")} style={{padding:wp(2.5),justifyContent:'center',alignItems:'center',borderWidth:1,backgroundColor:this.state.who=="visitor"?Colors.appColor:'#fff',borderColor:this.state.who=="visitor"?Colors.appColor:"#96A6AF",borderRadius:wp(1)}}>
              <Text style={{color:this.state.who=="visitor"?'#fff':'#96A6AF',fontFamily:fonts.robotoBold,fontSize:wp(3.5)}}>VISITORS</Text>
            </TouchableOpacity>
            <AntDesign name="caretdown" color={this.state.who=="visitor"?Colors.appColor:"#fff"} size={wp(5)} style={{marginTop:-6,alignSelf:'center'}}/>
          </View>
        </View> */}

        <View style={{paddingVertical:hp(2)}}>
            <SwitchSelector
              options={this.props.tabOptions}
              backgroundColor={'#ECECEF'}
              // animationDuration={100}
              buttonColor={Colors.white}
              textColor={"grey"}
              selectedColor={Colors.appColor}
              hasPadding
              borderRadius={wp(1)}
              borderColor={"#ECECEF"}
              style={{width:'90%',alignSelf:'center'}}
              initial={0}
              onPress={value => this.changeTab(value)}
            />
          </View>

        {
          this.state.who=="staff"?
          <>
          <View style={{width:'99%',alignSelf:'center',padding:wp(3),borderRadius:wp(1),elevation:1,backgroundColor:'#FFF'}}>
            <Text style={{color:Colors.blueAccent,fontFamily:fonts.robotoBold,fontSize:wp(4),marginLeft:wp(3)}}>Scan/Enter to proceed</Text>
            <Searchbar
                inputStyle={{fontSize:wp(3.5),backgroundColor:'#FFF'}}
                placeholder="Search"
                onChangeText={(value)=>this.searchList(value)}
                value={this.state.searchValue}
                // editable={false}
                style={{borderWidth:0.5,borderRadius:wp(1),marginTop:hp(1),marginHorizontal:wp(1),elevation:0,borderColor:Colors.appColor,backgroundColor:'#FFF',fontSize:wp(3)}}
                onIconPress={()=>this.setState({searchValue:null,employeeList:[]})}
              />
              </View>

              <ScrollView keyboardShouldPersistTaps='always' keyboardDismissMode='on-drag' >
              {
                    this.state.employeeList.length==0 && this.state.searchValue!=null?
                    <View style={{alignSelf:'center',marginTop:10}}>
                        {
                          this.state.loading?
                          <ActivityIndicator/>
                          :
                          <Text>No results found</Text>
                        }
                    </View>
                    :
                    <>
                    {
                      this.state.employeeList.map((item,index)=>{
                        return(
                          <View key={index} style={{flexDirection:'row',justifyContent:'space-between',backgroundColor:item.emp_id==this.state.selectedEmployeeid?Colors.appColor:'#fff',borderColor:'#cbc9d9',
                              borderWidth:0.5,borderRadius:2,marginBottom:15,marginHorizontal:10,padding:wp(4), shadowColor: '#000',
                              shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.8,shadowRadius: 2,elevation: 5}}>
                            
                            <TouchableOpacity onPress={()=>this.selecteEmployee(item)} style={{flexDirection:'column',justifyContent:'space-around',width:wp(60)}}>
                              <Text style={{color:item.emp_id==this.state.selectedEmployeeid?"#fff":null,fontSize:wp(3),fontFamily:fonts.roboto,paddingBottom:5}}>Name   :  {item.name}</Text>
                              <Text style={{color:item.emp_id==this.state.selectedEmployeeid?"#fff":null,fontSize:wp(3),fontFamily:fonts.roboto}}>Emp.Id  :  {item.emp_number}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{flexDirection:'row',alignItems:'center',justifyContent:'flex-end',width:wp(30)}} onPress={()=>this.props.navigation.navigate("qrScanner")}>
                              <Text style={{color:item.emp_id==this.state.selectedEmployeeid?"#fff":Colors.appColor,textAlign:'center',fontSize:wp(3),fontFamily:fonts.robotoBold}}>Link profile  </Text>
                              <AntDesign name="arrowright" color={item.emp_id==this.state.selectedEmployeeid?"#fff":Colors.appColor} size={wp(4)} style={{marginRight:wp(2)}}/>
                            </TouchableOpacity>
                          </View>
                        )
                      })
                    }
                    </>
                  }
                  
                </ScrollView>
             </>
             :
             <>
             <ScrollView  keyboardShouldPersistTaps='always' keyboardDismissMode='on-drag'>
             <View style={{width:'99%',alignSelf:'center',marginBottom:hp(2),padding:wp(3),borderRadius:wp(1),elevation:1,backgroundColor:'#FFF'}}>
            <Text style={{color:Colors.blueAccent,fontFamily:fonts.robotoBold,fontSize:wp(4)}}>Enter details to proceed (optional)</Text>
                <TextInput style={{borderColor:Colors.appColor,alignSelf:'center',backgroundColor:'#FFF',width:'100%',fontSize:15,fontFamily:fonts.roboto}}
                  label="Contact"
                  mode='outlined'
                  dense={true}
                  theme={{ colors: { text: '#000', primary: Colors.appColor,placeholder:'#CBC9D9' } }}
                  ref={(input) => { this.emaildRef = input; }}
                  //  onSubmitEditing={() => {this.passwordRef.focus()}}
                  value={this.state.contactNumber}
                  keyboardType={"number-pad"}
                  maxLength={10}
                  onChangeText={(value)=>{this.setState({contactNumber:value})}} 
                  returnKeyType={"next"}
                  />  
                  <Text style={{fontSize:wp(3),fontFamily:fonts.roboto,textAlign:'center',paddingVertical:wp(2)}}>This will help you to track your results </Text>
              </View>     
             </ScrollView>   
             </>
            }
      {/* tab section end */}
            </>
            :
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <View style={{width:wp(60),height:wp(60),borderRadius:wp(30),borderWidth:20,alignItems:'center',justifyContent:'center',borderColor:'#EFF8F6'}}>
                <View style={{width:wp(50),height:wp(50),borderRadius:wp(25),borderWidth:20,alignItems:'center',justifyContent:'center',borderColor:'#E4F1EE'}}>
                  <TouchableOpacity onPress={()=>this.props.navigation.navigate("connectDevice")} style={{width:wp(40),height:wp(40),borderRadius:wp(25),borderWidth:20,alignItems:'center',justifyContent:'center',borderColor:'#DBEAE7',backgroundColor:Colors.appColor}}>
                   <AntDesign name="mobile1" size={wp(8)} color="#fff"/>
                   <Text style={{fontFamily:fonts.robotoBold,fontSize:wp(3),color:'#fff',paddingTop:5}}>Connect device</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          }
    {/* footer section start */}
        <View style={{width:wp(100),backgroundColor:'#F2FAF9',alignItems:'center',flexDirection:'row',justifyContent:'space-between'}}>
           <TouchableOpacity style={{width:wp(40),alignItems:'center',justifyContent: 'center',}}>
             <AntDesign name="home" color={Colors.appColor} size={wp(7)}/>
             <Text style={{color:Colors.appColor,fontSize:wp(3),fontFamily:fonts.robotoBold}}>Home</Text>
           </TouchableOpacity>
           
            <TouchableOpacity onPress={()=>this.navigateToTestscreen()} style={{width:wp(20),height:wp(20),backgroundColor:this.state.selectedEmployeeid==null && this.state.who=="staff"?"#E3EEEC":Colors.appColor,borderWidth:wp(1),borderColor:'#fff',borderRadius:wp(25),top:wp(-10),justifyContent:'center',alignItems:'center'}}>
              <MaterialCommunityIcons name="test-tube" color='#fff' size={30} style={{ transform: [{ rotate: '40deg'}]}}/>
              <Text style={{fontFamily:fonts.robotoBold,fontSize:wp(3.5),color:'#fff'}}>TEST</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={()=>this.props.navigation.navigate("verifyCode")} style={{width:wp(40),alignItems:'center',justifyContent: 'center'}}>
             <Fontisto name="nav-icon-grid-a" color={Colors.blueAccent} size={wp(7)}/>
             <Text style={{fontSize:wp(3),fontFamily:fonts.roboto,color:Colors.blueAccent}}>Menu</Text>
           </TouchableOpacity>
        </View>
      
      {/* footer section end */}

      <CheckBleState/>

      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    // userId:state.userId,
    authToken:state.authToken,
    isBluetoothConnected:state.isBluetoothConnected,
    tabOptions:state.tabOptions
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // setUpdateUserId:(value)=>{dispatch({type:UPDATE_USER_ID,value})},
    setUpdateAuthToken:(value)=>{dispatch({type:UPDATE_AUTH_TOKEN,value})},
    setIsVisitor:(value)=>{dispatch({type:IS_VISITOR,value})},
    settabOptions:(value)=>{dispatch({type:"settabOptions",value})},
  };
}
export default connect( mapStateToProps, mapDispatchToProps )(HomeScreen);