import { UPDATE_HOME, UPDATE_USER_TYPE, UPDATE_AUTH_TOKEN, UPDATE_USER_ID, IS_VISITOR, UPDATE_MANAGE_EMP } from "./Actions";
const initialState = {
    userType: "admin",
    authToken: "",
    userId:"",
    updateHome: false,
    isVisitor:false,
    isUpdateEMplist:false,
    isBluetoothConnected:false,
    tabOptions:[
        { label: "MY STAFFS", value: "staff" },
        { label: "VISITORS", value: "visitor" },
      ],
    deviceList:[],
    charactersticsArray:[],
    connectedDeviceId:null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_HOME:
            return {
                ...state,
                updateHome: action.value,
            }
       
        case UPDATE_USER_TYPE:
            return {
                ...state,
                userType: action.value,
            }
        case UPDATE_AUTH_TOKEN:
            return {
                ...state,
                authToken: action.value               
            }
        case UPDATE_USER_ID:
            return {
                ...state,
                userId: action.value               
            }
        case IS_VISITOR:
            return {
                ...state,
                isVisitor: action.value               
            }
        case "setisUpdateEMplist":
        return {
            ...state,
            isUpdateEMplist:action.value          
        }

        case "setisBluetoothConnected":
            return{
                ...state,
                isBluetoothConnected:action.value
            }

        case "settabOptions":
            return{
                ...state,
                tabOptions:action.value
            }
    
        case "setdeviceList":
            return{
                ...state,
                deviceList:action.value
            }
        case 'setcharactersticsArray':
            return{
                ...state,
                charactersticsArray:action.value
            }
        case "setconnectedDeviceId":
            return{
                ...state,
                connectedDeviceId:action.value
            }
    }
    return state
}
export default reducer