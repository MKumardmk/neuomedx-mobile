import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Modal, Alert, RefreshControl } from 'react-native';
import images from '../images';
import Colors from '../styles/Colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import fonts from '../styles/fonts';
import { connect } from 'react-redux';
import { baseurl } from '../Baseurl'
import { ActivityIndicator } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

class EmployeeManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sub_users: [
                // {name:"Dinesh Kumar",emp_number:"AS2021001",email:"dinesh@authorselvi.com"},
                // {name:"Ajith Kumar",emp_number:"AS2021002",email:"ajith@authorselvi.com"},
                // {name:"Gnana Kumar",emp_number:"AS2021003",email:"gnana@authorselvi.com"},
                // {name:"Vinoth Kumar",emp_number:"AS2021004",email:"vinoth@authorselvi.com"},
                // {name:"Ganesh Kumar",emp_number:"AS2021005",email:"ganesh@authorselvi.com"},
            ],
            loading: false,
            refresh: false
        };
    }
    async componentDidMount() {
        // //console.error("props "+this.props.isUpdateEMplist)
        await this.getDetails()
    }

   async componentDidUpdate(){
    //console.error("props "+this.props.isUpdateEMplist)
        if(this.props.isUpdateEMplist==true){
            await this.props.setisUpdateEMplist(false)
            this.getDetails()
        }
    }

    async getDetails() {
        // //console.log(this.props.authToken)
        await this.setState({ loading: true })
        await fetch(baseurl + "manage-employees-api", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.props.authToken}`
            }
        })
            .then(res => res.json())
            .then(reponceJson => {
                //console.log(JSON.stringify(reponceJson))
                if (reponceJson.success) {
                    this.setState({ sub_users: reponceJson.data })
                }

            })
            .catch(err => {
                //console.log(err)
                this.setState({ loading: false })
            })
        await this.setState({ loading: false })
        
    }

    // async blockConfirmation(name,id){
    //     //console.log(name,id)
    //     Alert.alert("Block User", "Are you sure want to block "+name, [{ text: 'Cancel', onPress: () => { }, style: 'cancel' }, { text: 'Block', onPress: () => { this.blockUser(id,true) }, style: 'destructive' }], { cancelable: true })
    // }
    // async unblockConfirmation(name,id){
    //     //console.log(name,id)
    //     Alert.alert("Unblock User", "Are you sure want to unblock "+name, [{ text: 'Cancel', onPress: () => { }, style: 'cancel' }, { text: 'Unblock', onPress: () => { this.blockUser(id,false) }, style: 'destructive' }], { cancelable: true })
    // }
    // async blockUser(id,type){
    // //console.log("Blocking "+type,id)
    // await this.setState({loading:true})
    //     await fetch( baseurl+"additional-users-api/"+id+"?block="+type,{
    //         method:'DELETE',
    //         headers:{
    //             'Content-Type':'application/json',
    //             'Authorization':`Bearer ${this.props.authToken}`  
    //         }
    //     })
    //     .then(res=>res.json())
    //     .then(reponceJson=>{
    //         //console.log(JSON.stringify(reponceJson))
    //     })
    //     await this.setState({loading:false})
    //     await this.getDetails()
    // }
    async deleteConfirmation(name, id) {
        //console.log(name, id)
        Alert.alert("Delete User", "Are you sure want to delete " + name, [{ text: 'Cancel', onPress: () => { }, style: 'cancel' }, { text: 'Delete', onPress: () => { this.deleteUser(id) }, style: 'destructive' }], { cancelable: true })
    }
    async deleteUser(id) {
        //console.log("Delete ", id)
        await this.setState({ loading: true })

        //console.log(this.props.authToken)
        await fetch(baseurl + "manage-employees-api/" + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.props.authToken}`
            }
        })
            .then(res => res.json())
            .then(reponceJson => {
                //console.log(JSON.stringify(reponceJson))
                if (reponceJson.success) {
                    // this.setState({sub_users:reponceJson.data}) 
                }
            })
            .catch(err => {
                //console.log(err)
                this.setState({ loading: false })
            })
        await this.setState({ loading: false })
        await this.getDetails()
    }
    refreshvalue = async () => {
        //console.log("refresh")
        this.setState({ refresh: true })
        await this.getDetails()
        this.setState({ refresh: false })
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.whiteBlueBackground }}>
                <ScrollView style={{ flex: 1 }} refreshControl={<RefreshControl refreshing={this.state.refresh} onRefresh={this.refreshvalue} />} >
                    <View style={{ padding: hp(2), paddingBottom: hp(3) }}>
                        {/* <TouchableOpacity
                            onPress={() => { this.props.navigation.navigate("newEmployee", { type: "new", empDetails: "" }) }}
                            style={{ width: '100%', paddingVertical: hp(1), minHeight: hp(6), backgroundColor: Colors.appColor, borderRadius: wp(1), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <AntDesign name='pluscircleo' size={wp(6)} color={Colors.white} />
                            <Text style={{ marginLeft: wp(3), color: Colors.white, fontFamily: fonts.roboto, fontSize: wp(4) }}>ADD NEW EMPLOYEE</Text>
                        </TouchableOpacity> */}

                        {this.state.sub_users.map((item, index) => {

                            return (<View key={index} style={[styles.card, styles.cardShadowStyle]}>
                                <TouchableOpacity onPress={() => { this.props.navigation.navigate("newEmployee", { type: "view", empDetails: item }) }}
                                  style={{ width: '70%'}}>
                                    <View style={{ flexDirection: 'row' }} >
                                        <View style={styles.listTitle}>
                                            <Text style={styles.listTitleText}>{"Name"}</Text>
                                        </View>
                                        <Text style={styles.colonText} > : </Text>
                                        <View style={styles.listValue}>
                                            <Text style={styles.listValueText}> {item.name}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row' }} >
                                        <View style={styles.listTitle}>
                                            <Text style={styles.listTitleText}>{"Emp.Id"}</Text>
                                        </View>
                                        <Text style={styles.colonText} > : </Text>
                                        <View style={styles.listValue}>
                                            <Text style={styles.listValueText}> {item.emp_number}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.buttons}>
                                    <TouchableOpacity
                                        onPress={() => { this.props.navigation.navigate("newEmployee", { type: "view", empDetails: item }) }}
                                        style={styles.list}
                                    >
                                        <Entypo name='eye' color={Colors.appColor} size={wp(5)} />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => { this.props.navigation.navigate("newEmployee", { type: "edit", empDetails: item }) }}
                                        style={styles.list}
                                    >
                                        <AntDesign name='edit' color={Colors.appColor} size={wp(5)} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => { this.deleteConfirmation(item.name, item.emp_id) }}
                                        style={styles.list}
                                    >
                                        <FontAwesome5 name='trash-alt' color={Colors.appColor} size={wp(5)} />
                                    </TouchableOpacity>
                                </View>
                            </View>)

                        })
                        }


                    </View>
                </ScrollView>
                <TouchableOpacity  
                onPress={() => { this.props.navigation.navigate("newEmployee", { type: "new", empDetails: "" }) }}
                style={{position:'absolute',right:wp(5),borderRadius:wp(10),bottom:hp(3),width:wp(15),height:wp(15),backgroundColor:Colors.appColor,justifyContent:'center',alignItems:'center'}}>
                    <AntDesign name="plus" color={Colors.white} size={wp(8)} />
                </TouchableOpacity>
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
        isUpdateEMplist:state.isUpdateEMplist
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setisUpdateEMplist:(value)=>{dispatch({type:"setisUpdateEMplist",value})}
        
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeManage);

const styles = StyleSheet.create({
    cardShadowStyle: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 3
    },
    card: {
        marginTop: hp(2),
        backgroundColor: '#FFF',
        borderRadius: wp(1),
        padding: wp(3),
        paddingVertical: hp(1.5),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    cardItem: {
        justifyContent: 'center',
        width: '70%',
        paddingVertical: hp(1),
        paddingLeft: wp(1),
        // backgroundColor:'green'
    },
    buttons: {
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        width: '30%',
        paddingVertical: hp(1),
    },
    list: {
        width: '30%',
        padding: wp(1),
        justifyContent: 'center',
        alignItems: 'center',
    },
    listImg: {
        width: wp(4),
        height: wp(4),
        resizeMode: 'center'
    },
    listTitle: {
        width: '25%',
        paddingBottom: hp(0.5)
    },
    listValue: {
        width: '75%',
        paddingBottom: hp(0.5),
    },
    listTitleText: {
        color: Colors.blueText,
        fontSize: wp(3.5),
        fontFamily: fonts.roboto
    },
    listValueText: {
        color: Colors.blueText,
        fontSize: wp(3.5),
        fontFamily: fonts.roboto
    },
    colonText: {
        color: Colors.blueText,
        fontFamily: fonts.robotoBold,
        fontSize: wp(3)
    },
})

