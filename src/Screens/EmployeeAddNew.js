import moment from 'moment';
import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import base64 from 'react-native-base64';
import CalendarPicker from 'react-native-calendar-picker';
import { Menu, Divider, TextInput, ActivityIndicator, RadioButton } from 'react-native-paper'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import { baseurl } from '../Baseurl';
import images from '../images';
import { UPDATE_MANAGE_EMP } from '../redux/Actions';
import Colors from '../styles/Colors';
import fonts from '../styles/fonts';

class EmployeeAddNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            nameErr: "",
            emp_number: "",
            emp_numberErr: "",
            nric_or_passport_no: "",
            nric_or_passport_noErr: "",
            hp_contact: "",
            hp_contactErr: "",
            dob: null,
            dobErr: "",
            showDateMenu: false,
            gender: "",
            genderErr: "",
            emp_id: 0,
            isEmpEdit: false,
            iseditable: true,
            loading: false
        };
    }

    async componentDidMount() {
        //console.warn(this.props.isUpdateEMplist)
        const { type, empDetails } = this.props.route.params
        // console.log(type, empDetails)
        if (type == "edit") {
            await this.props.navigation.setOptions({ title: "Edit Employee" })
            await this.setState({ iseditable: true, isEmpEdit: true })
            await this.setDetails(empDetails)
        }
        else if (type == "view") {
            await this.props.navigation.setOptions({ title: "View Employee" })
            await this.setState({ iseditable: false, isEmpEdit: false })
            await this.setDetails(empDetails)
        }
        else {
            this.props.navigation.setOptions({ title: "Add New Employee" })
            this.setState({ iseditable: true, isEmpEdit: false })
        }

        //console.log(this.props.authToken)
        //console.log(this.props.userId)
    }

   async componentWillUnmount(){
    //    await this.props.setisUpdateEMplist(true)
    //    this.props.setisUpdateEMplist(true)
       //console.warn("unmount "+ this.props.isUpdateEMplist)
    }

    async setDetails(item) {
        // this.setState(Object.assign(this.state,item))
        var dob = item.dob
        var slicedYear = dob.slice(0, 4)
        var slicedMonth = dob.slice(5, 7)
        var slicedDate = dob.slice(8)
        var momentDate = moment(dob)
        var newDate = new Date(momentDate)
        newDate.setDate(newDate.getDate() + 1)
       await this.setState({ 
            dob: newDate,
            emp_id:item.emp_id,
            emp_number:item.emp_number,
            gender:item.gender,
            hp_contact:item.hp_contact,
            name:item.name,
            nric_or_passport_no: item.nric_or_passport_no 
        })
       console.log(this.state.dob,this.state.emp_id,this.state.emp_number,this.state.gender,this.state.hp_contact,this.state.name,this.state.nric_or_passport_no) 
   }

    onDateChange = async (date, type) => {
        //function to handle the date change    
        //console.log(date)
        await this.setState({ dob: new Date(date), showDateMenu: false, dobErr: "" })
    };


    async createEmployee() {
        await this.setState({ loading: true })
        var data = new FormData()
        data.append("name", this.state.name)
        data.append("emp_number", this.state.emp_number)
        data.append("nric_or_passport_no", this.state.nric_or_passport_no)
        data.append("hp_contact", this.state.hp_contact)
        data.append("dob", moment(this.state.dob).format("YYYY-MM-DD"))
        data.append("gender", this.state.gender)

        await fetch(baseurl + "manage-employees-api", {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${this.props.authToken}`
            },
            body: data
        })
            .then(responce => responce.json())
            .then(responceJson => {
                //console.log(JSON.stringify(responceJson))
                // this.props.setisUpdateEMplist(true)
                this.props.setisUpdateEMplist(true)
                this.props.navigation.goBack()
            }).catch(err => {
                //console.log(err)
                 this.setState({ loading: false })
            })
        await this.setState({ loading: false })

    }

    async updateEmployee() {
        await this.setState({ loading: true })
        var data1 = new FormData()
        data1.append("_method","PUT")
        data1.append("name",this.state.name)
        data1.append("emp_number",this.state.emp_number)
        data1.append("nric_or_passport_no",this.state.nric_or_passport_no)
        data1.append("hp_contact",this.state.hp_contact)
        data1.append("dob",moment(this.state.dob).format("YYYY-MM-DD")+"")
        data1.append("gender",this.state.gender)
        console.log(data1)
        await fetch(baseurl + "manage-employees-api/" + this.state.emp_id, {    
            method:'POST',        
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${this.props.authToken}`
            },
            body: data1
        })
            .then(responce => responce.json())
            .then(responceJson => {
                console.log(JSON.stringify(responceJson))
                // this.props.setisUpdateEMplist(true)
                if(responceJson.success==true){
                    this.props.setisUpdateEMplist(true)
                    this.props.navigation.goBack()
                }else{
                    this.setState({ loading: false })
                }
            }).catch(err => {
                //console.log(err)
                 this.setState({ loading: false })
            })
        
    }

    validateDataFields() {
        if (this.state.name != "" && this.state.emp_number != "" && this.state.nric_or_passport_no != "" && this.state.hp_contact != "" && this.state.dob != null && this.state.gender != "") {
            this.setState({ dobErr: "", nameErr: "", emp_numberErr: "", hp_contactErr: "", nric_or_passport_noErr: '', genderErr: "" })
            return true
        }
        else {

            if (this.state.name == "") { this.setState({ nameErr:"This is field required" }) } else { this.setState({ nameErr: "" }) }
            if (this.state.emp_number == "") { this.setState({ emp_numberErr:"This is field required" }) } else { this.setState({ emp_numberErr: "" }) }
            if (this.state.nric_or_passport_no == "") { this.setState({ nric_or_passport_noErr:"This is field required" }) } else { this.setState({ nric_or_passport_noErr: "" }) }
            if (this.state.hp_contact == "") { this.setState({ hp_contactErr:"This is field required" }) } else { this.setState({ hp_contactErr: "" }) }
            if (this.state.dob == null) { this.setState({ dobErr:"This is field required" }) } else { this.setState({ dobErr: "" }) }
            if (this.state.gender == "") { this.setState({ genderErr:"This is field required" }) } else { this.setState({ genderErr: "" }) }
            return false
        }
    }

    checkBeforeSend() {
        var status = this.validateDataFields()
        //console.log(status)
        if (status) {
            if (this.state.isEmpEdit) {
                console.log("Update Employee")
                this.updateEmployee()
            }
            else {
                console.log("Create New Employee")
                this.createEmployee()
            }
        }
    }


    render() {
        return (
            <View style={{ flex: 1 }}>
                <ScrollView keyboardDismissMode='on-drag' keyboardShouldPersistTaps='always'>
                    <View style={{ paddingHorizontal: wp(5), paddingTop: hp(3), paddingBottom: hp(5) }}>
                        <View style={styles.TextInputMainView}>
                            <TextInput style={styles.TextInputView}
                                dense={true}
                                label="Name"
                                mode='outlined'
                                value={this.state.name}
                                editable={this.state.iseditable}
                                theme={{ colors: { text: Colors.blackText, primary: Colors.appColor, placeholder: Colors.placeHolderBGColor } }}
                                ref={(input) => { this.nameRef = input; }}
                                onSubmitEditing={() => { this.empNoRef.focus() }}
                                onChangeText={(value) => { this.setState({ name: value, nameErr: "" }) }}
                                returnKeyType={"next"}
                            />
                            {
                                this.state.nameErr == "" ? null
                                    :
                                    <Text style={{ color: 'red', fontSize: wp(3), marginBottom: hp(0.5), fontFamily: fonts.roboto }}>{this.state.nameErr}</Text>
                            }
                        </View>
                        <View style={styles.TextInputMainDoubleView}>
                            <View style={{width:'48%'}}>
                            <TextInput style={styles.TextInputHalfView}
                                dense={true}
                                label="Employee Id"
                                mode='outlined'
                                editable={this.state.iseditable}
                                value={this.state.emp_number}
                                theme={{ colors: { text: Colors.blackText, primary: Colors.appColor, placeholder: Colors.placeHolderBGColor } }}
                                ref={(input) => { this.empNoRef = input; }}
                                onSubmitEditing={() => { this.nricRef.focus() }}
                                onChangeText={(value) => { this.setState({ emp_number: value, emp_numberErr: "" }) }}
                                returnKeyType={"next"}
                            />
                            {
                                this.state.emp_numberErr == "" ? null
                                    :
                                    <Text style={{ color: 'red', fontSize: wp(3), marginBottom: hp(0.5), fontFamily: fonts.roboto }}>{this.state.emp_numberErr}</Text>
                            }
                           </View>

                           <View style={{width:'48%'}}>
                            <TextInput style={styles.TextInputHalfView}
                                dense={true}
                                label="NRIC/Passport No"
                                mode='outlined'
                                editable={this.state.iseditable}
                                value={this.state.nric_or_passport_no}
                                theme={{ colors: { text: Colors.blackText, primary: Colors.appColor, placeholder: Colors.placeHolderBGColor } }}
                                ref={(input) => { this.nricRef = input; }}
                                onSubmitEditing={() => { this.hpContactRef.focus() }}
                                onChangeText={(value) => { this.setState({ nric_or_passport_no: value, nric_or_passport_noErr: "" }) }}
                                returnKeyType={"next"}
                                keyboardType={'ascii-capable'}
                            />
                            {
                                this.state.nric_or_passport_noErr == "" ? null
                                    :
                                    <Text style={{ color: 'red', fontSize: wp(3), marginBottom: hp(0.5), fontFamily: fonts.roboto }}>{this.state.nric_or_passport_noErr}</Text>
                            }
                            </View>
                        </View>
                        <View style={styles.TextInputMainDoubleView}>

                            <View style={{width:'48%'}}>
                                <TextInput style={styles.TextInputHalfView}
                                    dense={true}
                                    label="HP Contact"
                                    mode='outlined'
                                    editable={this.state.iseditable}
                                    value={this.state.hp_contact}
                                    theme={{ colors: { text: Colors.blackText, primary: Colors.appColor, placeholder: Colors.placeHolderBGColor } }}
                                    ref={(input) => { this.hpContactRef = input; }}
                                    // onSubmitEditing={() => { this.passwordRef.focus() }}
                                    onChangeText={(value) => { this.setState({ hp_contact: value, hp_contactErr: "" }) }}
                                    returnKeyType={"next"}
                                    keyboardType={'decimal-pad'}
                                />
                                {
                                    this.state.hp_contactErr == "" ? null
                                        :
                                        <Text style={{ color: 'red', fontSize: wp(3), marginBottom: hp(0.5), fontFamily: fonts.roboto }}>{this.state.hp_contactErr}</Text>
                                }
                            </View>

                            <View style={{width:'48%'}}>
                            <Menu
                                visible={this.state.showDateMenu}
                                // visible={true}
                                style={{ borderRadius: wp(2), overflow: 'hidden',}}
                                onDismiss={() => this.setState({ showDateMenu: false })}
                                anchor={
                                    <TextInput
                                        mode='outlined'
                                        dense={true}
                                        label="DOB"
                                        editable={false}
                                        theme={{ colors: { text: '#000', primary: "#66BDAB", placeholder: '#CBC9D9' } }}
                                        style={{ borderColor: 'grey',alignSelf: 'center',backgroundColor: '#FAFAFA',width: '100%',fontSize: wp(3.5),fontFamily: fonts.roboto}}
                                        value={this.state.dob != null ? moment(this.state.dob).format("DD-MM-YYYY") + "" : ""}
                                        ref={(input) => { this.passwordRef = input; }}
                                        right={<TextInput.Icon onPress={() => { this.state.iseditable ? this.setState({ showDateMenu: true }) : {} }} color={Colors.appColor} name={"calendar-month-outline"} />}
                                        // onChangeText={(value) => { this.setState({ password: value }) }}
                                        onSubmitEditing={() => { this.signin() }}
                                    />
                                }>

                                <CalendarPicker
                                    // startFromMonday={true}
                                    maxDate={new Date()}                                
                                    previousTitle="Previous"
                                    nextTitle="Next"
                                    width={wp(85)}
                                    // scrollable={true}
                                    initialDate={this.state.dob!=null?this.state.dob:new Date()}
                                    todayBackgroundColor={Colors.appColor}
                                    selectedDayColor={Colors.appColor}
                                    selectedDayTextColor={Colors.white}
                                    selectedDayTextStyle={{ color: Colors.white }}
                                    scaleFactor={400}
                                    textStyle={{ color: Colors.blackText, fontFamily: fonts.roboto }}
                                    restrictMonthNavigation={true}
                                    onDateChange={this.onDateChange}
                                />

                            </Menu>
                            {this.state.dobErr == "" ? null
                                :
                                <Text style={{ color: 'red', fontSize: wp(3), marginBottom: hp(0.5), fontFamily: fonts.roboto }}>{this.state.dobErr}</Text>
                            }
                            </View>
                            
                        </View>




                        <View>
                            <View style={{ marginTop: hp(1.5) }}>
                                <Text style={{ color: Colors.blueAccent, fontFamily: fonts.robotoBold, fontSize: wp(4) }}>Gender <Text style={{ color: '#F00' }}></Text></Text>
                            </View>
                            
                            <RadioButton.Group onValueChange={value => { this.state.iseditable ? this.setState({ gender: value, genderErr: "" }) : {} }} value={this.state.gender}>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', width: wp(25), paddingVertical: hp(1) }}>
                                        <RadioButton value="M" color={Colors.blueText} />
                                        <TouchableOpacity onPress={() => { this.state.iseditable ? this.setState({ gender: "M", genderErr: "" }) : {} }}>
                                            <Text style={{ fontFamily: fonts.roboto, fontSize: wp(3.5), paddingLeft: wp(1), color: Colors.blueText }}>Male</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', width: wp(25), paddingVertical: hp(1) }}>
                                        <RadioButton value="F" color={Colors.blueText} />
                                        <TouchableOpacity onPress={() => { this.state.iseditable ? this.setState({ gender: "F", genderErr: "" }) : {} }}>
                                            <Text style={{ fontFamily: fonts.roboto, fontSize: wp(3.5), paddingLeft: wp(1), color: Colors.blueText }}>Female</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </RadioButton.Group>
                            
                            {
                                this.state.genderErr != "" &&
                                <Text style={{ color: 'red', fontSize: wp(3), marginBottom: hp(0.5), fontFamily: fonts.roboto }}>{this.state.genderErr}</Text>
                            }
                        </View>

                        {this.state.iseditable && <TouchableOpacity onPress={() => this.checkBeforeSend()} style={styles.ButtonOrange}>
                    <Text style={{ color: '#fff', fontFamily: fonts.robotoBold, fontSize: 17 }}>{this.state.isEmpEdit ? "Update" : "Save"}</Text>
                </TouchableOpacity>}

                    </View>
                </ScrollView>

                
                <Modal
                    visible={this.state.loading}
                    transparent={true}
                    animationType={'fade'}
                    onRequestClose={() => this.props.navigation.goBack()}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(52,52,52,0.2)' }}>
                        <ActivityIndicator color={Colors.appColor} size='large' />
                    </View>
                </Modal>
            </View>
        );
    }
}
function mapStateToProps(state) {
    return {
        authToken: state.authToken,
        userId:state.userId,
        isUpdateEMplist:state.isUpdateEMplist
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setisUpdateEMplist:(value)=>{dispatch({type:"setisUpdateEMplist",value})}
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(EmployeeAddNew);

const styles = StyleSheet.create({
    TextInputView: {
        borderColor: 'grey',
        alignSelf: 'center',
        backgroundColor: '#FAFAFA',
        width: '100%',
        // height:45,
        fontSize: wp(3.5),
        fontFamily: fonts.roboto
    },
    TextInputHalfView: {
        borderColor: 'grey',
        alignSelf: 'center',
        backgroundColor: '#FAFAFA',
        width: '100%',
        // height:45,
        fontSize: wp(3.5),
        fontFamily: fonts.roboto
    },
    TextInputMainView: {
        width: '100%',
        marginBottom: hp(1)
    },
    TextInputMainDoubleView: {
        width: '100%',
        flexDirection: 'row',
        marginBottom: hp(1),
        justifyContent: 'space-between'
    },
    ButtonOrange: {
        width: wp(90),
        // paddingVertical:15,
        alignSelf: 'center',
        height: hp(6.5),
        justifyContent: 'center',
        backgroundColor: Colors.appColor,
        borderRadius: wp(1),
        alignItems: 'center',
        marginBottom: hp(2.5),
        marginVertical: hp(1),
    },
})

