import React, { Component } from 'react';
import { View, Text, TouchableOpacity, BackHandler, ScrollView, ImageBackground } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Colors from '../styles/Colors'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome' //long-arrow-right
import fonts from '../styles/fonts';
import { StackActions } from '@react-navigation/routers';
import { connect } from 'react-redux';
import images from '../images';
import QRCode from 'react-native-qrcode-svg';
class TestingResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details:{
        name:"TestUser",
        email:"test",
        result:""
      }
    };
  }

  async componentDidMount() {
    // BackHandler.addEventListener("hardwareBackPress", this.backAction);
    console.log(this.props.isVisitor)
  }
  componentWillUnmount() {
    // BackHandler.removeEventListener("hardwareBackPress", this.backAction);
  }
  backAction = () => {
    this.goHome()
    return true;
  };
  goHome() {
    // this.props.navigation.dispatch(
    //     StackActions.replace('homeScreen')
    //   )
    this.props.navigation.navigate('homeScreen')
  }

  render() {
    return (
      <ScrollView style={{ flex: 1, paddingHorizontal: '3%', backgroundColor: Colors.white }}>
        <View style={{ marginTop: hp(3.5), width: '90%', alignSelf: 'center', alignItems: 'center' }}>
          <Text style={{ color: Colors.failureRed, fontSize: wp(4.5) }}>Name: Rajesh Kumar</Text>
          <Text style={{ color: Colors.blueText, fontSize: wp(4.5) }} >Staff No: AS2021001</Text>
          <Text style={{ marginTop: hp(2), color: Colors.successGreen, fontSize: wp(5.5) }} >UID: HGP84HSL59MNF04B75</Text>
        </View>
        <View style={{ marginTop: hp(2), flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(2), width: '100%', height: hp(16) }} >
          <View style={{ width: '35%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <Feather name='check-circle' color={Colors.successGreen} size={wp(20)} />
          </View>
          <View style={{ width: '65%', height: '100%', justifyContent: 'center', paddingLeft: wp(5) }}>
            <Text style={{ color: Colors.blueAccent, fontSize: wp(4.5), fontFamily: fonts.robotoBold }} >New COVID Status</Text>
            <Text style={{ color: Colors.successGreen, fontSize: wp(8), fontFamily: fonts.robotoBold }} >Negative</Text>
          </View>
        </View>
        <View style={{ width: '100%', marginTop: hp(1), alignItems: 'center' }}>
          <Text style={{ color: Colors.blueText, fontSize: wp(3.5) }} >COVI-Breath taken on: Thursday, 07 Sep 2021 12:30 PM</Text>
        </View>

        <View style={{ backgroundColor: Colors.lightgrey, width: '92%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: hp(3), minHeight: hp(10), paddingVertical: hp(1), paddingHorizontal: wp(1), borderRadius: wp(2) }}>
          
        {this.props.isVisitor && 
        <View style={{marginTop:hp(1),width:wp(50),height:wp(50)}}>
          <ImageBackground  source={images.redBorder} style={{width:wp(50),height:wp(50),justifyContent:'center',alignItems:'center'}}>
              <QRCode 
              value={JSON.stringify(this.state.details)}
              size={wp(35)}
              backgroundColor="transparent"
              />
          </ImageBackground>
        </View>}
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: '15%', alignItems: 'center' }}>
              <Feather name='check-circle' color={Colors.successGreen} size={wp(10)} />
            </View>
            <View style={{ width: '85%', minHeight: hp(8), paddingVertical: hp(1), paddingHorizontal: wp(1), borderRadius: wp(2), alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: Colors.blueText }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: '15%', alignItems: 'center' }}>
              <Feather name='check-circle' color={Colors.successGreen} size={wp(10)} />
            </View>
            <View style={{ width: '85%', minHeight: hp(8), paddingVertical: hp(1), paddingHorizontal: wp(1), borderRadius: wp(2), alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: Colors.blueText }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: '15%', alignItems: 'center' }}>
              <Feather name='check-circle' color={Colors.successGreen} size={wp(10)} />
            </View>
            <View style={{ width: '85%', minHeight: hp(8), paddingVertical: hp(1), paddingHorizontal: wp(1), borderRadius: wp(2), alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: Colors.blueText }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</Text>
            </View>
          </View>

        </View>

        <TouchableOpacity onPress={() => this.goHome()}
          style={{ marginTop: hp(3), flexDirection: 'row', paddingVertical: 8,marginBottom:hp(5), borderRadius: 5, width: '95%', backgroundColor: Colors.appColor, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: fonts.robotoBold, fontSize: wp(4), color: Colors.whiteBackground }}>BACK TO HOME</Text>
          <FontAwesome name='long-arrow-right' color={Colors.white} size={wp(8)} style={{ marginLeft: wp(7) }} />
        </TouchableOpacity>


      </ScrollView>
    );
  }
}
function mapStateToProps(state) {
  return {
    userId: state.userId,
    authToken: state.authToken,
    isVisitor: state.isVisitor
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setUpdateUserId: (value) => { dispatch({ type: UPDATE_USER_ID, value }) },
    setUpdateAuthToken: (value) => { dispatch({ type: UPDATE_AUTH_TOKEN, value }) },
    setIsVisitor: (value) => { dispatch({ type: IS_VISITOR, value }) }
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(TestingResult);
