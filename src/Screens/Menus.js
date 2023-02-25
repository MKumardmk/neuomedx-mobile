import React, { Component } from 'react';
import { View, Text, StatusBar, ScrollView, StyleSheet, TouchableOpacity, Image, Alert, Modal } from 'react-native';
import Colors from '../styles/Colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import fonts from '../styles/fonts';
import images from '../images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Fontisto from 'react-native-vector-icons/Fontisto'
import {connect} from 'react-redux'
import { TextInput,Snackbar } from 'react-native-paper';

class Menus extends Component {
    constructor(props) {
        super(props);
        this.state = {
           labelName:"",
           modalvisible:false
        };
    }
    
   async componentWillUnmount(){
        const op = await AsyncStorage.getItem('option')
        console.log("options "+ op)
        if(op!=null){
          await this.props.settabOptions(JSON.parse(op))
        }
    }
    
    logoutConfirmation() {
        // console.log("logout")
        Alert.alert("Logout", "Are you sure want to logout", [{ text: 'Cancel', onPress: () => { }, style: 'cancel' }, { text: 'Logout', onPress: () => { this.logout() }, style: 'destructive' }], { cancelabel: true })
    }
    
   async logout(){
        console.log("Logout")
        //this.props.navigation.goBack()
        // await AsyncStorage.removeItem("@user_id")
        await AsyncStorage.removeItem("@access_token")
        await AsyncStorage.removeItem("@email")
        this.props.navigation.navigate("signin")
    }

   async changelabel(){
     this.setState({labelName:this.props.tabOptions[0].label,modalvisible:true})
    }

   async chageButton(){
        var options=this.props.tabOptions
       await options.map((item,index)=>{
            if(index==0){
                item.label=this.state.labelName
            }
        })
    //    await this.props.settabOptions(options)
    //    console.log(this.props.tabOptions)
       await AsyncStorage.setItem('option',JSON.stringify(options))
        this.setState({modalvisible:false,snackBarVisible:true})
        // const op = await AsyncStorage.getItem('option')
        // console.log(op)

    }

    render() {
        return (
            <>
                <StatusBar backgroundColor={Colors.blueText} />
                <ScrollView style={{ flex: 1, backgroundColor: Colors.whiteBlueBackground }} keyboardDismissMode='on-drag' keyboardShouldPersistTaps='always' >
                    <View style={{ paddingBottom: hp(3), marginTop: hp(1), flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>

                        <TouchableOpacity onPress={()=>{this.props.navigation.navigate('myProfile')}} style={[styles.card, styles.cardShadowStyle]} >
                            <View style={styles.cardItem}>
                                <Image style={{ height: wp(8), width: wp(8), resizeMode: 'contain' }} source={images.user} />
                                <Text style={{ marginTop: hp(0.8), fontFamily: fonts.robotoBold, fontSize: wp(3.5), color: Colors.greyText, textAlign: 'center' }}>My Profile </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>{this.props.navigation.navigate('manageEmployee',{updating:0})}} style={[styles.card, styles.cardShadowStyle]} >
                            <View style={styles.cardItem}>
                                <Image style={{ height: wp(8), width: wp(8), resizeMode: 'contain' }} source={images.userGroup} />
                                <Text style={{ marginTop: hp(0.8), fontFamily: fonts.robotoBold, fontSize: wp(3.5), color: Colors.greyText, textAlign: 'center' }}>{"Manage Employees"} </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>{this.props.navigation.navigate('testReports',{type:"employees"})}} style={[styles.card, styles.cardShadowStyle]} >
                            <View style={styles.cardItem}>
                                <Image style={{ height: wp(8), width: wp(8), resizeMode: 'contain' }} source={images.listDropDown} />
                                <Text style={{ marginTop: hp(0.8), fontFamily: fonts.robotoBold, fontSize: wp(3.5), color: Colors.greyText, textAlign: 'center' }}>{"Test Report Employees"} </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>{this.props.navigation.navigate('testReports',{type:"visitors"})}} style={[styles.card, styles.cardShadowStyle]} >
                            <View style={styles.cardItem}>
                                <Image style={{ height: wp(8), width: wp(8), resizeMode: 'contain' }} source={images.listDropDown} />
                                <Text style={{ marginTop: hp(0.8), fontFamily: fonts.robotoBold, fontSize: wp(3.5), color: Colors.greyText, textAlign: 'center' }}>{"Test Report Visitors"} </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>this.props.navigation.navigate("connectDevice")} style={[styles.card, styles.cardShadowStyle]} >
                            <View style={styles.cardItem}>
                                <Image style={{ height: wp(8), width: wp(8), resizeMode: 'contain' }} source={images.mobileCheck} />
                                <Text style={{ marginTop: hp(0.8), fontFamily: fonts.robotoBold, fontSize: wp(3.5), color: Colors.greyText, textAlign: 'center' }}>{"Connect Device"} </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>this.changelabel()}  style={[styles.card, styles.cardShadowStyle]} >
                            <View style={styles.cardItem}>
                                <Image style={{ height: wp(8), width: wp(8), resizeMode: 'contain' }} source={images.renameTag} />
                                <Text style={{ marginTop: hp(0.8), fontFamily: fonts.robotoBold, fontSize: wp(3.5), color: Colors.greyText, textAlign: 'center' }}>{"Rename Label"} </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>{this.props.navigation.navigate('changePassword')}} style={[styles.card, styles.cardShadowStyle]} >
                            <View style={styles.cardItem}>
                                <Image style={{ height: wp(8), width: wp(8), resizeMode: 'contain' }} source={images.passwordKey} />
                                <Text style={{ marginTop: hp(0.8), fontFamily: fonts.robotoBold, fontSize: wp(3.5), color: Colors.greyText, textAlign: 'center' }}>{"Change Password"} </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity  style={[styles.card, styles.cardShadowStyle]} >
                            <View style={styles.cardItem}>
                                <Image style={{ height: wp(8), width: wp(8), resizeMode: 'contain' }} source={images.help} />
                                <Text style={{ marginTop: hp(0.8), fontFamily: fonts.robotoBold, fontSize: wp(3.5), color: Colors.greyText, textAlign: 'center' }}>{"Help"} </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity  style={[styles.card, styles.cardShadowStyle]} >
                            <View style={styles.cardItem}>
                                <Image style={{ height: wp(8), width: wp(8), resizeMode: 'contain' }} source={images.policy} />
                                <Text style={{ marginTop: hp(0.8), fontFamily: fonts.robotoBold, fontSize: wp(3.5), color: Colors.greyText, textAlign: 'center' }}>{"Privacy Policy"} </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity  style={[styles.card, styles.cardShadowStyle]} >
                            <View style={styles.cardItem}>
                                <Image style={{ height: wp(8), width: wp(8), resizeMode: 'contain' }} source={images.listLine} />
                                <Text style={{ marginTop: hp(0.8), fontFamily: fonts.robotoBold, fontSize: wp(3.5), color: Colors.greyText, textAlign: 'center' }}>{"Terms and Conditions"} </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>{this.logoutConfirmation()}} style={[styles.card, styles.cardShadowStyle]} >
                            <View style={styles.cardItem}>
                                <Image style={{ height: wp(8), width: wp(8), resizeMode: 'contain' }} source={images.logout} />
                                <Text style={{ marginTop: hp(0.8), fontFamily: fonts.robotoBold, fontSize: wp(3.5), color: Colors.greyText, textAlign: 'center' }}>{"Logout"} </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cardDummy} >
                            <View style={styles.cardItem}></View>
                        </TouchableOpacity>


                    </View>
                </ScrollView>
                 {/* footer section start */}
                    <View style={{width:wp(100),backgroundColor:'#FAFAFA',paddingVertical:hp(1.5),alignItems:'center',flexDirection:'row',justifyContent:'space-between'}}>
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate("homeScreen")} style={{width:wp(40),alignItems:'center',justifyContent: 'center',}}>
                        <AntDesign name="home" color={Colors.blueAccent} size={wp(7)}/>
                        <Text style={{color:Colors.blueAccent,fontSize:wp(3),fontFamily:fonts.robotoBold}}>Home</Text>
                    </TouchableOpacity>
                    
                        
                        
                        <TouchableOpacity onPress={()=>this.props.navigation.navigate("menus")} style={{width:wp(40),alignItems:'center',justifyContent: 'center'}}>
                        <Fontisto name="nav-icon-grid-a" color={Colors.appColor} size={wp(7)}/>
                        <Text style={{fontSize:wp(3),fontFamily:fonts.roboto,color:Colors.appColor}}>Menu</Text>
                    </TouchableOpacity>
                    </View>
      
                 {/* footer section end */}

                 <Modal
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => { this.setState({modalvisible: false }) }}
                    visible={this.state.modalvisible}>
                    {/* visible={true}> */}
                    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'rgba(52,52,52,0.5)' }}>
                        <View style={{width:'100%',backgroundColor:'#fff',padding:wp(5)}}>
                            {/* <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:wp(5)}}>
                                <Text style={{fontFamily:fonts.robotoBold,fontSize:wp(5)}}>Change label name</Text>
                                <TouchableOpacity onPress={()=>this.setState({modalvisible:false})} style={{width:wp(8),height:wp(8),backgroundColor:'red',borderRadius:wp(7),alignItems:'center',justifyContent:'center'}}>
                                    <AntDesign name="close" size={wp(5)} color="#FFF"/>
                                </TouchableOpacity>
                            </View> */}

                            <TextInput style={styles.TextInputView}
                            dense={true}
                            label="Change label"
                            mode='outlined'
                            theme={{ colors: { text: '#000', primary: "#66BDAB", placeholder: '#CBC9D9' } }}
                            ref={(input) => { this.employeeSearch = input; }}
                            onChangeText={(value) => { this.setState({ labelName: value }) }}
                            returnKeyType="next"
                            onSubmitEditing={() =>this.chageButton()}
                            value={this.state.labelName}
                            />
                            <Text>Please add 15 characters </Text>
                            <TouchableOpacity onPress={()=>this.chageButton()} style={{backgroundColor:Colors.appColor,padding:wp(3.5),width:'100%',borderRadius:3,marginTop:wp(5)}}>
                                <Text style={{color:'#fff',fontSize:wp(4),fontFamily:fonts.robotoBold,textAlign:'center'}}>Update Label</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Snackbar
                visible={this.state.snackBarVisible}
                onDismiss={()=>this.setState({snackBarVisible:false})}
                duration={3000}
                action={{
                    label: 'Close',
                    onPress: () => {
                    this.setState({snackBarVisible:false})
                    },
                }}>
                Label name changed!
                </Snackbar>
            </>
        );
    }
}
const styles = StyleSheet.create({
    cardShadowStyle: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 3
    },
    card: {
        marginTop: hp(2.5),
        backgroundColor: '#FFF',
        borderRadius: wp(2),
        padding: wp(3),
        paddingVertical: hp(1.5),
        height: wp(30),
        alignItems: 'center',
        justifyContent: 'center',
        width: wp(30),
    },
    cardDummy: {
        marginTop: hp(2.5),
        backgroundColor: 'transparent',
        borderRadius: wp(2),
        padding: wp(3),
        paddingVertical: hp(1.5),
        height: wp(30),
        alignItems: 'center',
        justifyContent: 'center',
        width: wp(30),
    },
    cardItem: {
        padding: wp(2),
        justifyContent: 'center',
        alignItems: 'center'
    },

})
function mapStateToProps(state) {
    return {
      tabOptions:state.tabOptions
    };
  }
  
  function mapDispatchToProps(dispatch) {
    return {
      settabOptions:(value)=>{dispatch({type:"settabOptions",value})},
    };
  }
  export default connect( mapStateToProps, mapDispatchToProps )(Menus);
  
