import React, { Component } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ActivityIndicator, TouchableOpacity, Image, Platform, ScrollView, Modal } from 'react-native';
import { images } from '../images';
import { TextInput } from 'react-native-paper'
import IonicIcons from 'react-native-vector-icons/Ionicons'
import base64 from 'react-native-base64';
import { baseurl } from '../Baseurl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fonts from '../styles/fonts';
import { connect } from 'react-redux';
import Colors from '../styles/Colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

class MyProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOrganisation: 1,
            loading: false,
            updateLoading: false,
            Name: null, NameError: null,
            phone: null, phoneError: null,
            email: null, emailError: null,
            userId: null,
            password: null, passwordError: null,
            pocName: null, pocNameError: null,
            pocNumber: null, pocNumberError: null,
            pocEmail: null, pocEmailError: null,
            pocId: null,
            isProfileEdit: false,
            uen: null,
            usename: null
        };
    }


    async componentDidMount() {
        await this.getProfileDetails()
    }

    async getProfileDetails() {
        // //console.log(this.props.authToken)
        await this.setState({ loading: true })
        await fetch(baseurl + "profile-api", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.props.authToken}`
            }
        })
            .then(res => res.json())
            .then(reponceJson => {
                console.log(JSON.stringify(reponceJson))
                // if (reponceJson.success) {
                // this.setState({ sub_users: reponceJson.data })
                var userdata = reponceJson.data.user_data
                var pocData = reponceJson.data.user_poc

                // console.log(userdata)
                // console.log(pocData)
                this.setState({ email: userdata.email, Name: userdata.name, phone:userdata.phone == null ? "9042992323" : userdata.phone, userId: userdata.id })
                this.setState({ pocEmail: pocData.email, pocName: pocData.name, pocNumber: pocData.phone, pocId: pocData.id })
                // }

            })
            .catch(err => {
                //console.log(err)
                this.setState({ loading: false })
            })
        await this.setState({ loading: false })

    }

    async updateProfile() {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (this.state.Name == null) {
            await this.setState({ NameError: "This field is required" })
        } else {
            await this.setState({ NameError: null })
        }



        if (this.state.pocName == null) {
            await this.setState({ pocNameError: "This field is required" })
        } else {
            await this.setState({ pocNameError: null })
        }

        if (this.state.pocNumber == null) {
            await this.setState({ pocNumberError: "This field is required" })
        } else {
            await this.setState({ pocNumberError: null })
        }

        if (this.state.pocEmail == null) {
            await this.setState({ pocEmailError: 'This field is required' })
        } else if (reg.test(this.state.pocEmail) === true) {
            await this.setState({ pocEmailError: null })
        } else {
            // console.warn("formet")
            await this.setState({ pocEmailError: 'Check the email format' })
        }

        if (this.state.Name != null && this.state.pocName != null &&
            this.state.pocEmail != null && this.state.pocEmailError == null && this.state.pocNumber != null) {



            var data = new FormData();
            data.append("id", this.state.userId)
            data.append("name", this.state.Name)
            data.append("email", this.state.email)
            data.append("phone", this.state.phone)
            data.append("poc_id", this.state.pocId)
            data.append("poc_name", this.state.pocName)
            data.append("poc_email", this.state.pocEmail)
            data.append("poc_contact", this.state.pocNumber)

            console.log(data)
            this.setState({ updateLoading: true })
            fetch(baseurl + "update-profile-api", {
                method: 'POST',
                headers: {
                    //'Content-Type':"application/x-www-form-urlencoded",
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${this.props.authToken}`

                },
                body: data

            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.warn(responseJson)
                    if (responseJson.success == true) {
                        // AsyncStorage.setItem('@user_id',JSON.stringify(responseJson.data.user.id))

                        this.setState({ updateLoading: false })
                        this.props.navigation.goBack()
                    } else {
                        this.setState({ emailError: responseJson.message.email, updateLoading: false })
                    }
                })
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false} keyboardDismissMode='on-drag' keyboardShouldPersistTaps='always' style={{ backgroundColor: '#fff' }} >
                    <View style={{ flex: 1, marginVertical: hp(1), padding: wp(7), backgroundColor: '#fff' }}>

                        <View style={{ paddingBottom: hp(3) }}>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <View style={{width:'70%'}}>
                            <Text style={{ textAlign: 'left', color: '#0F0A39', fontSize: wp(4), marginVertical: hp(1.5), fontFamily: fonts.robotoBold }}>Select Purpose <Text style={{ color: "#F00" }}>*</Text></Text>
                            </View>
                            <View style={{width:'25%'}}>
                            {
                            this.state.updateLoading == true ?
                                <TouchableOpacity style={styles.ButtonOrange}>
                                    <ActivityIndicator color="#fff" />
                                </TouchableOpacity>
                                :
                                <>
                                    {this.state.isProfileEdit ?
                                        <TouchableOpacity onPress={() => this.updateProfile()} style={styles.ButtonOrange}>
                                            <Text style={{ color: '#fff', fontFamily: fonts.robotoBold, fontSize: wp(3) }}>SAVE</Text>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity onPress={() => this.setState({ isProfileEdit: true })} style={styles.ButtonOrange}>
                                            <Text style={{ color: '#FFF', fontFamily: fonts.robotoBold, fontSize: wp(3) }}>EDIT</Text>
                                        </TouchableOpacity>
                                    }

                                </>
                        }
                                </View> 
                            </View>
                            {/* <View> */}
                            <TouchableOpacity onPress={() => {this.state.isProfileEdit? this.setState({isOrganisation: 1, companyName: null }):{} }} style={{ flexDirection: 'row', paddingBottom: 10 }}>
                                <View style={{ width: '15%', alignItems: 'center' }}>
                                    <IonicIcons name={this.state.isOrganisation == 1 ? "radio-button-on" : "radio-button-off"} color={this.state.isOrganisation == 1 ? Colors.appColor : 'lightgrey'} size={25} />
                                </View>

                                <View style={{ width: '85%', justifyContent: 'center' }}>
                                    <Text style={{ color: '#03314C', fontSize: wp(3.5) }}>Organisation</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {this.state.isProfileEdit? this.setState({ isOrganisation: 0, companyName: null }):{} }} style={{ flexDirection: 'row' }}>
                                <View style={{ width: '15%', alignItems: 'center' }}>
                                    <IonicIcons name={this.state.isOrganisation == 0 ? "radio-button-on" : "radio-button-off"} color={this.state.isOrganisation == 0 ? Colors.appColor : 'lightgrey'} size={25} />
                                </View>

                                <View style={{ width: '85%', justifyContent: 'center' }}>
                                    <Text style={{ color: '#03314C', fontSize: wp(3.5) }}>Malls/Functions/Meetings/Etc.,</Text>
                                </View>
                            </TouchableOpacity>
                            {/* </View> */}
                        </View>

                        <View style={styles.TextInputMainView}>
                            <TextInput style={styles.TextInputView}
                                dense={true}
                                label="Name"
                                mode='outlined'
                                theme={{ colors: { text: '#000', primary: "#66BDAB", placeholder: '#CBC9D9' } }}
                                ref={(input) => { this.company = input; }}
                                onSubmitEditing={() => { this.uen.focus() }}
                                onChangeText={(value) => { this.setState({ Name: value }) }}
                                value={this.state.Name}
                                returnKeyType={"next"}
                                editable={this.state.isProfileEdit}
                            />
                            {
                                this.state.NameError == null ? null
                                    :
                                    <Text style={{ color: 'red', fontSize: 12, marginBottom: 5, fontFamily: 'Lato-Regular' }}>{this.state.NameError}</Text>
                            }
                        </View>

                        <View style={styles.TextInputMainView}>
                            <TextInput style={styles.TextInputView}
                                dense={true}
                                label="UEN"
                                mode='outlined'
                                theme={{ colors: { text: '#000', primary: "#66BDAB", placeholder: '#CBC9D9' } }}
                                ref={(input) => { this.uen = input; }}
                                onSubmitEditing={() => { this.email.focus() }}
                                onChangeText={(value) => { this.setState({ uen: value }) }}
                                returnKeyType={"next"}
                                keyboardType="phone-pad"
                                value={this.state.uen}
                                maxLength={10}
                                editable={this.state.isProfileEdit}
                            />

                        </View>

                        <View style={styles.TextInputMainView}>
                            <TextInput style={styles.TextInputView}
                                dense={true}
                                label="Email"
                                mode='outlined'
                                theme={{ colors: { text: '#000', primary: "#66BDAB", placeholder: '#CBC9D9' } }}
                                ref={(input) => { this.email = input; }}
                                onSubmitEditing={() => { this.usename.focus() }}
                                onChangeText={(value) => { this.setState({ email: value }) }}
                                returnKeyType={"next"}
                                value={this.state.email}
                                editable={false}
                            />
                            {
                                this.state.emailError == null ? null
                                    :
                                    <Text style={{ color: 'red', fontSize: 12, marginBottom: 5, fontFamily: 'Lato-Regular' }}>{this.state.emailError}</Text>
                            }
                        </View>

                        <View style={styles.TextInputMainView}>
                            <TextInput style={styles.TextInputView}
                                dense={true}
                                label="Username"
                                mode='outlined'
                                theme={{ colors: { text: '#000', primary: "#66BDAB", placeholder: '#CBC9D9' } }}
                                ref={(input) => { this.usename = input; }}
                                onSubmitEditing={() => { this.pocName.focus() }}
                                onChangeText={(value) => { this.setState({ username: value }) }}
                                returnKeyType={"next"}
                                keyboardType="default"
                                value={this.state.username}
                                editable={this.state.isProfileEdit}
                            />

                        </View>





                        <Text style={{ textAlign: 'left', color: '#0F0A39', fontSize: wp(4), marginTop: hp(2), marginBottom: hp(1.5), fontFamily: fonts.robotoBold }}>POC Information <Text style={{ color: "#F00" }}>*</Text></Text>

                        <View style={styles.TextInputMainView}>
                            <TextInput style={styles.TextInputView}
                                dense={true}
                                label="Name"
                                mode='outlined'
                                theme={{ colors: { text: '#000', primary: "#66BDAB", placeholder: '#CBC9D9' } }}
                                ref={(input) => { this.pocName = input; }}
                                onSubmitEditing={() => { this.pocEmail.focus() }}
                                onChangeText={(value) => { this.setState({ pocName: value }) }}
                                returnKeyType={"next"}
                                value={this.state.pocName}
                                editable={this.state.isProfileEdit}
                            />
                            {
                                this.state.pocNameError == null ? null
                                    :
                                    <Text style={{ color: 'red', fontSize: 12, marginBottom: 5, fontFamily: 'Lato-Regular' }}>{this.state.pocNameError}</Text>
                            }
                        </View>
                       
                        <View style={styles.TextInputMainDoubleView}>
                            <TextInput style={styles.TextInputHalfView}
                                dense={true}
                                label="Email"
                                mode='outlined'
                                theme={{ colors: { text: '#000', primary: "#66BDAB", placeholder: '#CBC9D9' } }}
                                ref={(input) => { this.pocEmail = input; }}
                                onSubmitEditing={() => { this.pocNumber.focus() }}
                                onChangeText={(value) => { this.setState({ pocEmail: value }) }}
                                returnKeyType={"next"}
                                value={this.state.pocEmail}
                                editable={this.state.isProfileEdit}
                            />
                            {
                                this.state.pocEmailError == null ? null
                                    :
                                    <Text style={{ color: 'red', fontSize: 12, marginBottom: 5, fontFamily: 'Lato-Regular' }}>{this.state.pocEmailError}</Text>
                            }
                        
                            <TextInput style={styles.TextInputHalfView}
                                dense={true}
                                label="Contact No"
                                mode='outlined'
                                theme={{ colors: { text: '#000', primary: "#66BDAB", placeholder: '#CBC9D9' } }}
                                ref={(input) => { this.pocNumber = input; }}
                                onSubmitEditing={() => { this.updateProfile() }}
                                onChangeText={(value) => { this.setState({ pocNumber: value }) }}
                                returnKeyType={"next"}
                                value={this.state.pocNumber}
                                maxLength={10}
                                keyboardType="phone-pad"
                                editable={this.state.isProfileEdit}
                            />
                            {
                                this.state.pocNumberError == null ? null
                                    :
                                    <Text style={{ color: 'red', fontSize: 12, marginBottom: 5, fontFamily: 'Lato-Regular' }}>{this.state.pocNumberError}</Text>
                            }
                        </View>


                        

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
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);
const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: '#fff',
        // margin:20,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
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
        width: '48%',
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
        width: '100%',
        // paddingVertical:15,
        height: hp(4),
        justifyContent: 'center',
        backgroundColor: '#66BDAB',
        borderRadius: wp(10),
        alignItems: 'center',
        marginBottom: hp(1.5),
        marginVertical: hp(1),
        marginTop: hp(3)
    }
})