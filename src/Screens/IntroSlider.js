
import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import Swiper from 'react-native-swiper'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import images from '../images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseurl } from '../Baseurl';
import { ActivityIndicator } from 'react-native-paper';
import Colors from '../styles/Colors';
import fonts from '../styles/fonts';
import AntDesign from 'react-native-vector-icons/AntDesign'

class IntroSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      index: 0,
      array: [
        { title: "NeuomeDX Strip Initialisation", description: "Initialise test strip by inserting strip into NeuomeDX COVI-Device.", image: "https://selvisoftware.in/sst8/trucov/public/admin/images/sliders/Image-4.png" },
        { title: "NeuomeDX Strip Remove", description: "Perform five blows into NeuomeDX test strip. Upon completion, remove strip cover.", image: "https://selvisoftware.in/sst8/trucov/public/admin/images/sliders/Group-77.png" },
        { title: "Testing in Progress", description: "Insert test strip into Covi-Device testing in progress.", image: "https://selvisoftware.in/sst8/trucov/public/admin/images/sliders/Image-5.png" }
      ],
    };
  }

  componentDidMount() {
    this.getmethod()
  }

  getmethod() {
    this.setState({ loading: true })
    fetch(baseurl + "intro-sliders-api")
      .then((response) => response.json())
      .then((responseJSon) => {
        console.log(responseJSon)
        this.setState({ array: responseJSon, loading: false })
      })
  }

  async setVisited() {
    // await AsyncStorage.setItem('IntroScreenVisited',JSON.stringify("visited"))
    await AsyncStorage.setItem("@slider_opend", "open")
    this.props.navigation.navigate('signin')
  }
  swipped(index) {
    this.setState({ index: index })
  }
  render() {
    if (this.state.loading == true) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
          <ActivityIndicator />
        </View>
      )
    } else {
      return (

        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
          <View style={{ height: hp(8), width: '100%', justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => this.setVisited()} style={{ alignSelf: 'flex-end',marginRight:wp(5) }}>
              <Text style={{ fontFamily:fonts.robotoBold, fontSize: wp(4), color: Colors.blueAccent }}>Skip</Text>
            </TouchableOpacity>
          </View>
          <Swiper ref='swiper'
            // paginationStyle={styles.paginationStyle}
            dot={<View style={{ backgroundColor: '#66BDAB90', width: wp(3), height: wp(3), borderRadius: wp(2), marginLeft: wp(2), marginRight: wp(2), marginTop: wp(1), marginBottom: wp(1), }}></View>}
            activeDot={<View style={{ backgroundColor: '#66BDAB', width: wp(3), height: wp(3), borderRadius: wp(2), marginLeft: wp(2), marginRight: wp(2), marginTop: wp(1), marginBottom: wp(1), }}></View>}
            loop={false}
            onIndexChanged={(index) => this.swipped(index)}           
          >
            {
              this.state.array.map((item, index) => {
                return (
                  <View key={index}  >                    
                      <View style={{ alignSelf: 'center', height: hp(70), width: wp(90),backgroundColor:'#F2FAF9'}}>
                        <View style={{ width: '90%', height: '50%', alignItems: 'center',alignSelf:'center', padding: wp(3), }}>
                          <Image source={{ uri: item.image }} style={{ resizeMode: 'contain', height: '100%', width: '100%' }}></Image>
                        </View>
                        <View style={{ height: '40%', width: '90%', justifyContent: 'center',alignSelf:'center', alignItems: 'center', paddingHorizontal: wp(5) }}>
                          <Text style={{ fontSize: wp(5.5), color: Colors.blueAccent, textAlign: 'center', fontFamily: fonts.robotoBold }}>{item.title}</Text>
                          <Text style={{ fontSize: wp(3.5), paddingTop: hp(1), color: Colors.blueAccent, textAlign: 'center', fontFamily: fonts.roboto }}>{item.description}</Text>
                        </View>
                      </View> 
                      {
                        this.state.array.length - 1 == this.state.index ?
                          <TouchableOpacity onPress={() => this.setVisited()} style={{ flexDirection:'row',marginTop: hp(1),height:hp(6), paddingVertical: hp(1), borderRadius: wp(1), width: '70%', backgroundColor: Colors.appColor, alignSelf: 'center', alignItems: 'center',justifyContent:'center' }}>
                            <Text style={{ fontFamily: fonts.robotoBold, fontSize: wp(4), color: Colors.whiteBackground }}>Get Started</Text>
                      {/* <AntDesign name='arrowright' color={Colors.white} size={wp(5)} style={{ marginLeft: wp(5) }} /> */}
                          </TouchableOpacity>
                          :
                          <TouchableOpacity onPress={() => this.refs.swiper.scrollBy(1)} style={{ marginTop: hp(1),height:wp(16), borderRadius: wp(10), width: wp(16), alignSelf: 'center', alignItems: 'center',justifyContent:'center' }}>
                            {/* <Text style={{ fontFamily: fonts.robotoBold, fontSize: wp(4), color: Colors.blueAccent }}>NEXT</Text> */}
                            <AntDesign name="rightcircle" color={Colors.appColor} size={wp(16)} />
                          </TouchableOpacity>
                      }                  
                  </View>
                )
              })
            }
          </Swiper>
          

        </SafeAreaView>
      )
    }
  }
}

export default IntroSlider;

// const styles = StyleSheet.create({
//   paginationStyle: {
//     // position: 'absolute',
//     // bottom: 20,
//     // zIndex:1
//   },
//   skipButton: {
//     // position: 'relative',
//     alignSelf: 'flex-end',
//     margin: wp('5%')
//     // marginTop: 20,
//     // marginRight:wp('10%'),
//     // paddingHorizontal: 20,
//     // paddingVertical: 4,
//     // borderRadius: 20,
//     // backgroundColor:'#8f8e8d'
//   },
//   imageContainer: {
//     width: '100%',
//     height: '50%',
//     // justifyContent: 'flex-end',
//     alignItems: 'center',
//     padding: 15
//     // backgroundColor:'#F00'
//   },
//   cardContainer: {
//     alignSelf: 'center',
//     height: hp(45),
//     width: wp(80),
//     // justifyContent: 'flex-end',
//     // alignItems: 'center',
//     backgroundColor: '#FFF',
//     borderRadius: 20
//   },
//   imageStyle: {
//     resizeMode: 'contain',
//     height: '100%',
//     width: '100%'
//   },
//   textContainer: {
//     height: '40%',
//     width: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20
//   },
//   text1: {
//     fontSize: 20,
//     color: Colors.blueAccent,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     fontFamily: "Montserrat-SemiBold"
//   },
//   text2: {
//     fontSize: 12,
//     paddingTop: 10,
//     color: Colors.blueAccent,
//     textAlign: 'center',
//     fontFamily: "Montserrat"
//   },
//   // text3: {
//   //   fontSize: 13,
//   //   paddingTop: 5,
//   //   color:'#03314C',
//   //   textAlign: 'center',
//   //   fontFamily: "Montserrat"
//   // },
//   nextButton: {
//     marginVertical: 30,
//     paddingVertical: 8,
//     borderRadius: 5,
//     width: '70%',
//     backgroundColor: '#FFFFFF',
//     alignSelf: 'center',
//     alignItems: 'center'
//   }
// })
