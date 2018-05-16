import moment from 'moment';
const today = new Date((new Date()).valueOf() + 1000*3600*24)
export default function NewPostReducer (
    state = {
        qacoins: {
            value: 0
        },
        date: null,
        dateTime: moment(today).format("YYYY-MM-DD HH:mm"),
        errMsg: null,
        errMsgOpen: false
    },
    action
){
    switch(action.type){
        case "CHANGE_QACOINS_STATE": {
            return {
                ...state,
                qacoins: action.payload
                }
            }
        case "RESET_QACOINS_STATE": {
            return {
                ...state,
                qacoins: {
                    ...state.qacoins,
                    value: 0
                }
                }
            }
        case "CHANGE_DATE_STATE": {
            return {
                ...state,
                date: action.payload
                }
            }
        case "CHANGE_DATETIME_STATE": {
            return {
                ...state,
                dateTime: action.payload
                }
            }
        case "RESET_NEW_POST": {
            return {
                ...state,
                qacoins: {
                    value: 0
                },
                date: null,
                dateTime: moment(today).format("YYYY-MM-DD HH:mm"),
                errMsg: null
                }
            }

        case "ERR_MSG_OPEN": {
            return {
                ...state,
                errMsgOpen: true,
                errMsg: action.payload
                }
            } 
        case "ERR_MSG_CLOSE": {
            return {
                ...state,
                errMsgOpen: false,
                errMsg: null
                }
            } 
        }
    return state
}
