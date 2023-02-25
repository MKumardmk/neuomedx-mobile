import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { TextInput } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { baseurl } from '../Baseurl';
import base64 from 'react-native-base64';
import fonts from '../styles/fonts';
import Colors from '../styles/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldPassword: '',
            currentPassword: '', currentPasswordError: '',
            newPassword: '', newPasswordError: '',
            confirmPassword: '', confirmPasswordError: '',
            hidecurrentPassword: true,
            hideNewPassword: true,
            hideConfirmPassword: true,
            loading:false
        };
    }

   async componentDidMount(){
     await this.getOldDetails()
    }

    async getOldDetails(){
        var user_pass = await AsyncStorage.getItem("@user_pass")
        var user_email = await AsyncStorage.getItem("@email")
        console.log(user_pass)
        console.log(user_email)
       await this.setState({oldPassword:user_pass,email:user_email})
       console.log(this.props.authToken)
    }

    async updatePassword() {
        console.log(this.state.currentPassword, this.state.newPassword, this.state.confirmPassword)
        if (this.state.currentPassword == '') {
            await this.setState({ currentPasswordError: "This feild is required" })
        } else {
            if (this.state.currentPassword == this.state.oldPassword) {
                await this.setState({ currentPasswordError: "" })
            } else {
                await this.setState({ currentPasswordError: "Passwords are mismatched" })
            }
        }

        if (this.state.newPassword == '') {
            await this.setState({ newPasswordError: "This feild is required" })
        } else {
            await this.setState({ newPasswordError: '' })
        }

        if (this.state.confirmPassword == '') {
            await this.setState({ confirmPasswordError: "This feild is required" })
        } else {
            await this.setState({ confirmPasswordError: '' })
        }

        if (this.state.currentPassword !== '' && this.state.newPassword !== '' && this.state.confirmPassword !== '') {
            if (this.state.newPassword == this.state.confirmPassword) {

               await this.setState({ newPasswordError: '', confirmPasswordError: '' })
                this.changePassword()

                console.log("Update Password")

            } else {
               await this.setState({ newPasswordError: '', confirmPasswordError: "Passwords are mismatched" })
            }
        }
    }

    async changePassword() {
        var data = new FormData()
        data.append("email", this.state.email)
        // data.append("code", this.state.responseCode)
        data.append("password", base64.encode(this.state.newPassword))
        data.append("from", 'profile')
       await this.setState({ loading: true })
       await fetch(baseurl + "change-password-api", {
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
                    this.setState({ loading: false })
                    this.props.navigation.navigate('signin')
                } else {
                    this.setState({ loading: false })
                }
            }).catch(err=>{
                console.log(err)
                this.setState({loading:false})
            })
    }
    render() {
        return (
            <View style={{ flex: 1 ,backgroundColor:'#fff'}}>
                <ScrollView style={{ flex: 1, paddingHorizontal: wp(5) }} keyboardDismissMode='on-drag' keyboardShouldPersistTaps='always' >
                    <TextInput
                        mode='outlined'
                        label="Current password"
                        dense={true}
                        theme={{ colors: { text: '#000', primary: "#66BDAB", placeholder: '#CBC9D9' } }}
                        style={{ borderColor: 'grey', alignSelf: 'center', backgroundColor: '#F5F6FA', width: '100%', fontSize: wp(3.5), marginTop: hp(3) }}
                        value={this.state.currentPassword}
                        ref={(input) => { this.password = input; }}
                        secureTextEntry={this.state.hidecurrentPassword}
                        right={<TextInput.Icon onPress={() => { this.setState({ hidecurrentPassword: !this.state.hidecurrentPassword }) }} color={"#CBC9D9"} name={this.state.hidecurrentPassword ? "eye-off" : "eye"} />}
                        onChangeText={(value) => { this.setState({ currentPassword: value }) }}
                        onSubmitEditing={() => { this.newpassword.focus() }}
                        returnKeyType={"next"}
                        textContentType="oneTimeCode"
                    />

                    {
                        this.state.currentPasswordError == '' ? null :
                            <View style={{ width: '100%' }}>
                                <Text style={styles.errorFontstyle}>{this.state.currentPasswordError}</Text>
                            </View>
                    }



                    <TextInput
                        mode='outlined'
                        label="New password"
                        dense={true}
                        theme={{ colors: { text: '#000', primary: "#66BDAB", placeholder: '#CBC9D9' } }}
                        style={{ borderColor: 'grey', alignSelf: 'center', backgroundColor: '#F5F6FA', width: '100%', fontSize: wp(3.5), marginTop: hp(3) }}
                        value={this.state.newPassword}
                        ref={(input) => { this.newpassword = input; }}
                        secureTextEntry={this.state.hideNewPassword}
                        right={<TextInput.Icon onPress={() => { this.setState({ hideNewPassword: !this.state.hideNewPassword }) }} color={"#CBC9D9"} name={this.state.hideNewPassword ? "eye-off" : "eye"} />}
                        onChangeText={(value) => { this.setState({ newPassword: value }) }}
                        onSubmitEditing={() => { this.confirm.focus() }}
                        returnKeyType={"next"}
                        textContentType="oneTimeCode"
                    />

                    {
                        this.state.newPasswordError == '' ? null :
                            <View style={{ width: '100%' }}>
                                <Text style={styles.errorFontstyle}>{this.state.newPasswordError}</Text>
                            </View>
                    }


                    <TextInput
                        mode='outlined'
                        label="Confirm password"
                        dense={true}
                        theme={{ colors: { text: '#000', primary: "#66BDAB", placeholder: '#CBC9D9' } }}
                        style={{ borderColor: 'grey', alignSelf: 'center', backgroundColor: '#F5F6FA', width: '100%', fontSize: wp(3.5), marginTop: hp(1) }}
                        value={this.state.confirmPassword}
                        ref={(input) => { this.confirm = input; }}
                        secureTextEntry={this.state.hideConfirmPassword}
                        right={<TextInput.Icon onPress={() => { this.setState({ hideConfirmPassword: !this.state.hideConfirmPassword }) }} color={"#CBC9D9"} name={this.state.hideConfirmPassword ? "eye-off" : "eye"} />}
                        onChangeText={(value) => { this.setState({ confirmPassword: value }) }}
                        onSubmitEditing={() => { this.updatePassword() }}
                        returnKeyType={"done"}
                        textContentType="oneTimeCode"
                    />

                    {
                        this.state.confirmPasswordError == '' ? null :
                            <View style={{ width: '100%' }}>
                                <Text style={styles.errorFontstyle}>{this.state.confirmPasswordError}</Text>
                            </View>
                    }

                    <TouchableOpacity onPress={() => {this.state.loading?{} : this.updatePassword()}} style={styles.ButtonOrange}>
                        {this.state.loading?
                        <ActivityIndicator size={'small'} color={'#FFF'} />
                        :
                            <Text style={{ color: '#fff', fontFamily: fonts.robotoBold, fontSize: wp(4) }}>{"SAVE"}</Text>
                        }
                    </TouchableOpacity>

                </ScrollView>
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
export default connect(mapStateToProps,mapDispatchToProps) (ChangePassword);

const styles = StyleSheet.create({
    errorFontstyle: {
        fontSize: wp(3),
        color: 'red'
    },
    ButtonOrange: {
        width: wp(90),
        // paddingVertical:15,
        alignSelf: 'center',
        height: hp(6.5),
        justifyContent: 'center',
        backgroundColor: Colors.blueText,
        borderRadius: wp(1),
        alignItems: 'center',
        marginBottom: hp(2.5),
        marginVertical: hp(1),
        marginTop: hp(3)
    },
})