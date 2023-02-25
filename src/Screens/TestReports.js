import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Modal, Pressable, Image } from 'react-native';
import Colors from '../styles/Colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Text as SVGText } from 'react-native-svg'
import { PieChart } from 'react-native-svg-charts';
import fonts from '../styles/fonts';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';

const deviceWidth = Dimensions.get('window').width
const data = [
    {
        key: 1,
        amount: 15,
        svg: { fill: Colors.mediumGreen },
    },
    {
        key: 2,
        amount: 5,
        svg: { fill: Colors.failureRed }
    },
]

const Labels = ({ slices, height, width }) => {
    return slices.map((slice, index) => {
        const { labelCentroid, pieCentroid, data } = slice;
        return (
            <SVGText
                key={index}
                x={pieCentroid[0]}
                y={pieCentroid[1]}
                fill={'#fff'}
                textAnchor={'middle'}
                alignmentBaseline={'middle'}
                fontSize={wp(5)}
                stroke={'black'}
                strokeWidth={0.2}
                fontFamily={fonts.robotoBold}
            >
                {data.amount}
            </SVGText>
        )
    })
}

export default class TestReports extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterBy: "day",
            sortBy: [{ name: "Today", selected: true }, { name: "Yesterday", selected: false }, { name: "Last Week", selected: false }, { name: "last Month", selected: false }, { name: "Custom Range", selected: false }],
            labelWidth: 0,
            datePickerModal: false,
            modalVisible: false,
            startDate: new Date(),
            endDate: new Date(),
            type:"employees"
        };
    }

    componentDidMount() {
        this.setHeaderOptions()
    }
    async setHeaderOptions() {
        var { type } = this.props.route.params
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


    async sortFunction(item) {
        if (item.name == "Custom Range") {
            this.setState({  datePickerModal: true })
        } else {
            var temp = this.state.sortBy
            temp.map((i, index) => {
                if (i.name == item.name) {
                    i.selected = true
                } else {
                    i.selected = false
                }
            })
            console.log(temp)
            await this.setState({ sortBy: temp,  })
        }
    }

    async onDateChange(date, type) {
        console.log(date, type)
        if(this.state.filterBy=="day"){
            await this.setState({ startDate: date,datePickerModal: false });
        }else{
            if (type === 'END_DATE') {
                await this.setState({ endDate: date, datePickerModal: false });
            } else {
                await this.setState({ startDate: date });
            }
        }
        
    }

    navigateToReportDetails(value) {
        this.props.navigation.navigate("testReportsDetails", { focusing: value,type:this.state.type })
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFF' }}>

                {/* <View style={{backgroundColor:Colors.blueText,flexDirection:'row',justifyContent:'space-between',height:hp(10),alignItems:'center',paddingHorizontal:wp(4)}}>
            <TouchableOpacity onPress={()=>this.props.navigation.navigate("menus")}>
                <MaterialIcons name="arrow-back-ios" size={wp(8)} color="#fff"/>
             </TouchableOpacity>
            <Text style={{color:'#fff',fontFamily:fonts.robotoBold,fontSize:hp(3)}}>Test Reports</Text>
            <TouchableOpacity onPress={()=>this.setState({modalVisible:true})}>
                <Feather name="filter" size={wp(8)} color="#fff"/>
             </TouchableOpacity>
        </View> */}

                {/* <Modal
                    visible={this.state.modalVisible}
                    // visible={true}
                    transparent={true}
                    animationType={'fade'}
                    onRequestClose={() => this.setState({ modalVisible: false })}>

                    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'rgba(52,52,52,0.2)' }}>
                        <Pressable
                            onPress={() => { this.setState({ modalVisible: false }) }}
                            style={{ zIndex: -1, width: '100%', height: '100%' }} >

                        </Pressable>
                        <View style={{ zIndex: 1, backgroundColor: '#fff', width: wp(100) }}>
                            <View style={styles.sortByDate}>
                                
                                <Text />
                                <Text style={{ fontSize: wp(4.5) }}>Sort by Date</Text>
                                <Text />
                            </View>

                            {
                                this.state.sortBy.map((item, index) => {
                                    return (
                                        <TouchableOpacity key={index} onPress={() => this.sortFunction(item)} style={[styles.sortByDate, { marginHorizontal: wp(2), marginBottom: hp(1) }]}>
                                            <Text style={{ fontSize: wp(3.6) }}>{item.name}</Text>
                                            {
                                                item.selected ? <AntDesign color={Colors.appColor} name="checkcircleo" size={wp(5)} /> : null
                                            }
                                        </TouchableOpacity>
                                    )
                                })
                            }

                        </View>
                    </View>
                </Modal> */}
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ backgroundColor: Colors.whiteBlueBackground }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly',alignSelf:'center',width:'90%', paddingTop: hp(2),paddingBottom:hp(1) }}>

                            <TouchableOpacity onPress={() => this.setState({ filterBy: "day" })} style={this.state.filterBy == "day" ? styles.selectedFilter : styles.filter}>
                                <Text style={this.state.filterBy == "day" ? styles.seletedTextColor : styles.textColor}>Day</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ filterBy: "weekly" })} style={this.state.filterBy == "weekly" ? styles.selectedFilter : styles.filter}>
                                <Text style={this.state.filterBy == "weekly" ? styles.seletedTextColor : styles.textColor}>Weekly</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ filterBy: "monthly" })} style={this.state.filterBy == "monthly" ? styles.selectedFilter : styles.filter}>
                                <Text style={this.state.filterBy == "monthly" ? styles.seletedTextColor : styles.textColor}>Monthly</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ filterBy: "all" })} style={this.state.filterBy == "all" ? styles.selectedFilter : styles.filter}>
                                <Text style={this.state.filterBy == "all" ? styles.seletedTextColor : styles.textColor}>Custom Range</Text>
                            </TouchableOpacity>

                        </View>

                        <View style={{ height: hp(7.5), justifyContent: 'center', }}>
                            <TouchableOpacity onPress={() => { this.setState({ datePickerModal: true }) }} style={{  width: '85%', flexDirection: 'row', borderRadius: wp(1), borderWidth: 0.5, borderColor: 'lightgrey', alignItems: 'center', alignSelf: 'center', backgroundColor: Colors.white, }}>

                                <View style={{ width: '85%', paddingVertical: hp(1), paddingHorizontal: 5, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: "#000", textAlign: 'center',fontSize:wp(3) }}>
                                        {this.state.filterBy=="day"?
                                        <Text>{moment(this.state.startDate).format("DD/MM/YYYY")}</Text>
                                        :
                                        <Text>{moment(this.state.startDate).format("DD/MM/YYYY")}   -   {moment(this.state.endDate).format("DD/MM/YYYY")}</Text>
                                        }
                                        </Text>
                                </View>
                                <View style={{ width: '15%', paddingVertical: hp(1), paddingHorizontal: wp(1), justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white, borderTopRightRadius: wp(1), borderBottomRightRadius: wp(1) }}>
                                    <EvilIcons name='calendar' size={wp(8)} color={Colors.appColor} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>


                    {/* date picker section start */}

                    {/* <TouchableOpacity onPress={()=>this.setState({datePickerModal:true})}
         style={{flexDirection:'row',backgroundColor:'#fff',alignItems:'center',justifyContent:'space-between',width:wp(90),borderWidth:0.5,padding:hp(1.5),alignSelf:'center',borderRadius:3}}>
            {
                this.state.filterBy=="day"?<Text>dd/mm/yyyy</Text>:null
            }
            {
                this.state.filterBy=="weekly"?<Text>dd/mm/yyyy  -  dd/mm/yyyy</Text>:null
            }
            {
                this.state.filterBy=="monthly"?<Text>month - yyyy</Text>:null
            }
            {
                this.state.filterBy=="all"?<Text>dd/mm/yyyy</Text>:null
            }
            <FontAwesome name="calendar" size={hp(4)}/>
        </TouchableOpacity> */}

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
                                    allowRangeSelection={true}
                                    // minDate={new Date()}
                                    // minDate={'2021-10-10'}
                                    // initialDate={'2021-10-10'}
                                    maxDate={new Date()}
                                    // todayBackgroundColor={Colors.appColor}
                                    selectedDayColor={Colors.appColor}
                                    selectedDayTextColor="#FFFFFF"
                                    onDateChange={(date, type) => this.onDateChange(date, type)}
                                // onDateChange={(e)=>console.log(e)}
                                />

                                {/* <View>
                    <Text>SELECTED START DATE:{ this.state.startDate }</Text>
                    <Text>SELECTED END DATE:{ this.state.endDate }</Text>
                </View> */}
                            </View>
                        </View>
                    </Modal>
                    {/* date picker section end */}



                    <View style={{ backgroundColor: '#fff', paddingBottom: hp(3), paddingTop: hp(5) }}>
                        <PieChart
                            style={{ height: hp(30) }}
                            valueAccessor={({ item }) => item.amount}
                            data={data}
                        // spacing={0}
                        //   outerRadius={'95%'}
                        >
                            <Labels />
                        </PieChart>

                        <Text
                            onLayout={({ nativeEvent: { layout: { width } } }) => {
                                this.setState({ labelWidth: width, });
                            }}
                            style={{
                                bottom: hp(20),
                                //   top:85,
                                //   position: 'absolute',
                                left: deviceWidth / 2 - this.state.labelWidth / 2,
                                textAlign: 'center',
                                fontSize: wp(8),
                                color: "#03314C",
                                fontFamily: fonts.robotoBold
                            }}>
                            20
                        </Text>
                        <Text
                            onLayout={({ nativeEvent: { layout: { width } } }) => {
                                this.setState({ labelWidth: width, });
                            }}
                            style={{
                                bottom: hp(20),
                                //   top:85,
                                //   position: 'absolute',
                                left: deviceWidth / 2 - this.state.labelWidth / 2,
                                textAlign: 'center',
                                fontSize: wp(3),
                                color: "#03314C",
                                fontFamily: fonts.roboto
                            }}>
                            Total Testing
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', backgroundColor: '#fff', paddingBottom: hp(5), justifyContent: 'space-evenly' }}>
                        <TouchableOpacity onPress={() => this.navigateToReportDetails("all")} style={[styles.resultBtn, { backgroundColor: '#F3F3F3' }]}>
                            <Text style={{ fontSize: wp(5), fontFamily: fonts.robotoBold, color: Colors.appColor }}>20</Text>
                            <Text style={{ fontSize: wp(3), fontFamily: fonts.roboto, color: Colors.appColor }}>Total Testing</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.navigateToReportDetails("Negative")} style={[styles.resultBtn, { backgroundColor: '#C7F2D3' }]}>
                            <Text style={{ fontSize: wp(5), fontFamily: fonts.robotoBold, color: Colors.mediumGreen }}>15</Text>
                            <Text style={{ fontSize: wp(3), fontFamily: fonts.roboto, color: Colors.mediumGreen }}>Total Negative</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.navigateToReportDetails("Positive")} style={[styles.resultBtn, { backgroundColor: '#FECDCD' }]}>
                            <Text style={{ fontSize: wp(5), fontFamily: fonts.robotoBold, color: Colors.failureRed }}>5</Text>
                            <Text style={{ fontSize: wp(3), fontFamily: fonts.roboto, color: Colors.failureRed }}>Total Pasitive</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    sortByDate: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: wp(3),
        alignItems: 'center'
    },
    filter: {
        backgroundColor: '#ffffff',
        padding: hp(1.5),
        borderRadius: wp(1)
    },
    selectedFilter: {
        backgroundColor: Colors.appColor,
        padding: hp(1.5),        
        borderRadius: wp(1)
    },
    seletedTextColor: {
        color: '#fff',
        fontSize:wp(3)
    },
    textColor: {
        color: '#000',
        fontSize:wp(3)
    },
    resultBtn: {
        // borderWidth:0.5,
        borderRadius: 3,
        width: wp(30),
        padding: hp(2),
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.9,
        shadowRadius: 3,
        elevation: 5,
    }
})