import React, { Component } from 'react';
import { View, Text,TouchableOpacity, StyleSheet,Image,ScrollView, FlatList, Pressable, Modal } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import fonts from '../styles/fonts';
import Colors from '../styles/Colors';
import moment from 'moment';
import CalendarPicker from 'react-native-calendar-picker';
import { TextInput } from 'react-native-paper';

export default class TestReportsDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
        sortBy:"all",
        sortByTemp:"all",
        list:[
            {uid:"UID102324sdf1233",name:"employee 1",empId:"EMPID001",date:"2021/10/10 10:00 AM",status:"Negative"},
            {uid:"UID102324sdf1233",name:"employee 1",empId:"EMPID001",date:"2021/10/10 10:00 AM",status:"Positive"},
            {uid:"UID102324sdf1233",name:"employee 1",empId:"EMPID001",date:"2021/10/10 10:00 AM",status:"Negative"},
            {uid:"UID102324sdf1233",name:"employee 1",empId:"EMPID001",date:"2021/10/10 10:00 AM",status:"Positive"},
            {uid:"UID102324sdf1233",name:"employee 1",empId:"EMPID001",date:"2021/10/10 10:00 AM",status:"Negative"},
            {uid:"UID102324sdf1233",name:"employee 1",empId:"EMPID001",date:"2021/10/10 10:00 AM",status:"Negative"},
            {uid:"UID102324sdf1233",name:"employee 1",empId:"EMPID001",date:"2021/10/10 10:00 AM",status:"Negative"},
            {uid:"UID102324sdf1233",name:"employee 1",empId:"EMPID001",date:"2021/10/10 10:00 AM",status:"Negative"}
        ],
        filterModalVisible:false,
        startDate: new Date(),
        endDate: new Date(),
        datePickerModal:false,
        datePicketType:"start",
        type:"employees",
        employeeSearchName:""
    };
  }

 
  componentDidMount() {
    this.setHeaderOptions()
}
async setHeaderOptions() {
    var { type,focusing } = this.props.route.params
    console.log(focusing)
    this.setState({sortBy:focusing})
    console.log(type)
    if (type == "employees") {
        await this.props.navigation.setOptions({ title: "Test Reports - Employee" })
        this.setState({type:type})
    }
    else {
        await this.props.navigation.setOptions({ title: "Test Reports - Visitors" })
        this.setState({type:type})
    }
}

  async onDateChange(date, type) {
    console.log(date, type)
    if(this.state.datePicketType=="start"){
        await this.setState({ startDate: date,datePickerModal: false });
    }else{        
        await this.setState({ endDate: date, datePickerModal: false });
    }
    
}

  sortbyFun(value){
      this.setState({sortByTemp:value})
  }

  applyFilter(){
      this.setState({sortBy:this.state.sortByTemp,filterModalVisible:false})
  }

  render() {
    return (
      <View style={{flex:1,backgroundColor:Colors.whiteBlueBackground}}>  
        {/* <View style={{backgroundColor:Colors.blueText,flexDirection:'row',justifyContent:'space-between',height:hp(10),alignItems:'center',paddingHorizontal:wp(4)}}>
            <TouchableOpacity onPress={()=>this.props.navigation.navigate("testReports")}>
                <MaterialIcons name="arrow-back-ios" size={25} color="#fff"/>
             </TouchableOpacity>
            <Text style={{color:'#fff',fontFamily:fonts.robotoBold,fontSize:hp(3)}}>Test Reports</Text>
            <Text/>
        </View> */}

        <View style={{height:hp(10),justifyContent:'center'}}>

            <View style={{paddingHorizontal:wp(4),flexDirection:'row',alignItems:'center'}}>
                <View style={{width:'70%',flexDirection:'row',alignItems:'center'}}>
                    <View style={{width:'35%',paddingLeft:wp(3)}}>
                        <Text style={{color:Colors.blueAccent,fontSize:wp(4)}}>{(this.state.sortBy).toLocaleUpperCase()}</Text>
                    </View>
                </View>
                <View style={{width:'30%',paddingHorizontal:wp(2),flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                    <TouchableOpacity onPress={()=>this.setState({filterModalVisible:true,sortByTemp:this.state.sortBy})} style={{width:wp(10),height:wp(10),backgroundColor:Colors.blueAccent,borderRadius:wp(5),justifyContent:'center',alignItems:'center'}}>
                        <Ionicons name="filter" color={Colors.white} size={wp(5)} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{width:wp(10),height:wp(10),backgroundColor:Colors.appColor,borderRadius:wp(5),justifyContent:'center',alignItems:'center'}}>
                    <AntDesign name="download" color={Colors.white} size={wp(5)} />
                    </TouchableOpacity>

                </View>
            </View>

        </View>
        

        <ScrollView>
            {
                this.state.list.map((item,index)=>{
                 if(item.status==this.state.sortBy || this.state.sortBy=="all"){
                   return(
                    <View key={index} style={{padding:wp(4),marginHorizontal:wp(5),borderWidth:1,borderColor:item.status=="Positive"?"#F00":Colors.appColor,backgroundColor:item.status=="Positive"?Colors.failureCardRed:"#F3F3F3",marginBottom:wp(3),borderRadius:wp(1)}}>
                        <Text style={{color:item.status=="Positive"?Colors.failureRed:Colors.successGreen,fontSize:wp(4),paddingBottom:hp(1)}}>UID : {item.uid}</Text>
                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                            <View>
                                <Text style={styles.itemTextSize}>Name : {item.name}</Text>
                                <Text style={styles.itemTextSize}>Id : {item.empId}</Text>
                            </View>
                            <View>
                                <Text style={styles.itemTextSize}>Date : {item.date}</Text>
                                <Text style={styles.itemTextSize}>Status : <Text style={{fontFamily:fonts.robotoBold,color:item.status=="Positive"?Colors.failureRed:Colors.successGreen}}> {item.status}</Text></Text>
                            </View>
                            
                            <TouchableOpacity>
                                {
                                    item.status=="Negative"?
                                    <AntDesign name='checkcircleo' color={Colors.successGreen} size={wp(6)}/>
                                    :
                                    <Image source={require('../images/positive.png')} style={{width:wp(6),height:wp(6)}}/>
                                }
                                
                            </TouchableOpacity>
                        </View>
                    </View>
                   )
                 }
                })
            }
        </ScrollView>
        <Modal
          animationType="slide"
          transparent={true}
          onRequestClose={() => { this.setState({ filterModalVisible: false }) }}
          visible={this.state.filterModalVisible}>
          <View
            style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'rgba(52,52,52,0.5)' }}>
            <Pressable
              onPress={() => { this.setState({ filterModalVisible: false,}) }}
              style={{ zIndex: -1, width: '100%', height: '100%' }} >

            </Pressable>
            <View style={{ zIndex: 1, paddingTop: hp(2), paddingBottom: hp(1), maxHeight: '90%', width: '100%', paddingHorizontal: '5%', borderTopLeftRadius: wp(3), borderTopRightRadius: wp(3), backgroundColor: '#FAFAFA' }}>
            
           
           {this.state.type=="employees"? 
           <>
           <View style={{ justifyContent: 'center', paddingVertical: hp(1) }}>
                <Text style={{ textAlign: 'left', color: Colors.blueAccent,fontSize:wp(4),fontFamily:fonts.robotoBold }}>Filter by employees :</Text>
              </View>
              
              <View style={{paddingVertical:hp(1),}}>
              <TextInput style={styles.TextInputView}
                dense={true}
                label="Search Employee"
                mode='outlined'
                theme={{ colors: { text: '#000', primary: "#66BDAB", placeholder: '#CBC9D9' } }}
                ref={(input) => { this.employeeSearch = input; }}
                onChangeText={(value) => { this.setState({ employeeSearchName: value }) }}
                right={<TextInput.Icon  color={"#CBC9D9"} name={"magnify"} />}
                returnKeyType={"next"}
                value={this.state.employeeSearchName}
              />
              </View>
              
              </>
              :null
            }

            <View style={{ justifyContent: 'center', paddingVertical: hp(1) }}>
                <Text style={{ textAlign: 'left', color: Colors.blueAccent,fontSize:wp(4),fontFamily:fonts.robotoBold }}>Filter by Date :</Text>
              </View>
              
              <View style={{ height: hp(7.5),alignItems:'center' ,flexDirection:'row' }}>
                            <TouchableOpacity onPress={() => { this.setState({ datePickerModal: true,datePicketType:"start" }) }} style={{  width: '45%', flexDirection: 'row', borderRadius: wp(1), borderWidth: 0.5, borderColor: 'lightgrey', alignItems: 'center', alignSelf: 'center', backgroundColor: Colors.lightgrey, }}>

                                <View style={{ width: '70%', paddingVertical: hp(1), paddingHorizontal: 5, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: "#000", textAlign: 'center',fontSize:wp(3) }}>{moment(this.state.startDate).format("DD/MM/YYYY")}</Text>
                                </View>
                                <View style={{ width: '30%', paddingVertical: hp(1), paddingHorizontal: wp(1), justifyContent: 'center', alignItems: 'center', borderTopRightRadius: wp(1), borderBottomRightRadius: wp(1) }}>
                                    <EvilIcons name='calendar' size={wp(8)} color={Colors.appColor} />
                                </View>
                            </TouchableOpacity>

                            <View style={{width:'10%',alignItems:'center'}}>
                                <Text style={{color:Colors.blueAccent,fontSize:wp(3)}}>to</Text>
                            </View>

                            <TouchableOpacity onPress={() => { this.setState({ datePickerModal: true,datePicketType:"end" }) }} style={{  width: '45%', flexDirection: 'row', borderRadius: wp(1), borderWidth: 0.5, borderColor: 'lightgrey', alignItems: 'center', alignSelf: 'center', backgroundColor: Colors.lightgrey, }}>

                                <View style={{ width: '70%', paddingVertical: hp(1), paddingHorizontal: 5, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: "#000", textAlign: 'center',fontSize:wp(3) }}>{moment(this.state.endDate).format("DD/MM/YYYY")}</Text>
                                </View>
                                <View style={{ width: '30%', paddingVertical: hp(1), paddingHorizontal: wp(1), justifyContent: 'center', alignItems: 'center', borderTopRightRadius: wp(1), borderBottomRightRadius: wp(1) }}>
                                    <EvilIcons name='calendar' size={wp(8)} color={Colors.appColor} />
                                </View>
                            </TouchableOpacity>
                        </View>
              
              
              <View style={{ justifyContent: 'center', paddingVertical: hp(1) }}>
                <Text style={{ textAlign: 'left', color: Colors.blueAccent,fontSize:wp(4),fontFamily:fonts.robotoBold }}>Filter by test result :</Text>
              </View>
              
              <View style={{flexDirection:'row',paddingBottom:hp(1.5)}}>
            <TouchableOpacity onPress={()=>this.sortbyFun("all")} style={{marginLeft:wp(1),flexDirection:'row',alignItems:'center'}}>
                <MaterialIcons name={this.state.sortByTemp=="all"?"radio-button-checked":"radio-button-off"} size={wp(6.5)} color={Colors.blueText}/>
                <Text style={{fontSize:wp(4),fontFamily:fonts.roboto,color:this.state.sortByTemp=="all"?Colors.blueText:null,paddingLeft:wp(1)}}>All</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>this.sortbyFun("Negative")} style={{marginLeft:wp(4),flexDirection:'row',alignItems:'center'}}>
                <MaterialIcons name={this.state.sortByTemp=="Negative"?"radio-button-checked":"radio-button-off"} size={wp(6.5)} color={Colors.blueText}/>
                <Text style={{fontSize:wp(4),fontFamily:fonts.roboto,color:this.state.sortByTemp=="Negative"?Colors.blueText:null,paddingLeft:wp(1)}}>Negative</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>this.sortbyFun("Positive")} style={{marginLeft:wp(4),flexDirection:'row',alignItems:'center'}}>
                <MaterialIcons name={this.state.sortByTemp=="Positive"?"radio-button-checked":"radio-button-off"} size={wp(6.5)} color={Colors.blueText}/>
                <Text style={{fontSize:wp(4),fontFamily:fonts.roboto,color:this.state.sortByTemp=="Positive"?Colors.blueText:null,paddingLeft:wp(1)}}>Positive</Text>
            </TouchableOpacity>
        </View>

              
            <View style={{ marginTop: hp(1),marginBottom:hp(1) }}>
            <TouchableOpacity onPress={() => this.applyFilter()} style={{ width: '95%', alignSelf: 'center', marginTop: hp(1), borderRadius: 5, backgroundColor: Colors.appColor, height: hp(6), justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#FFF', textAlign: 'center',fontSize:wp(4) }}>APPLY</Text>
            </TouchableOpacity>
            </View>
               
              
            </View>
          </View>
        </Modal>
        <Modal
                        visible={this.state.datePickerModal}
                        transparent={true}
                        animationType={'fade'}
                        onRequestClose={() => this.setState({ datePickerModal: false })}>

                        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'rgba(52,52,52,0.2)' }}>
                            <Pressable
                                onPress={() => { this.setState({ datePickerModal: false }) }}
                                style={{ zIndex: -1, width: '100%', height: '100%' }} >

                            </Pressable>
                            <View style={{ zIndex: 1, backgroundColor: '#fff', paddingBottom: hp(5) }}>
                                <CalendarPicker
                                    startFromMonday={true}                                    
                                    // minDate={null}
                                    maxDate={new Date()}
                                    selectedDayColor={Colors.appColor}
                                    selectedDayTextColor="#FFFFFF"
                                    onDateChange={(date, type) => this.onDateChange(date, type)}
                                />
                            </View>
                        </View>
                    </Modal>
      </View>
    );
  }
}

const styles=StyleSheet.create({
    itemTextSize:{
        fontSize:wp(3),
        color:Colors.blueText,
        paddingBottom:hp(0.5)
    },
    TextInputView: {
        borderColor: 'grey',
        alignSelf: 'center',
        backgroundColor: Colors.lightgrey,
        width: '100%',
        // height:45,
        fontSize: wp(3.5),
        fontFamily: fonts.roboto,
      },
})