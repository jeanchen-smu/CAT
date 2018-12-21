import { browserHistory } from 'react-router';

export default function LoginReducer(state={
    login: {
        uname_error_msg: "",
        pwd_error_msg: ""
    },
    user: {
        agreed: false,
        userSections: [],
        section_id: null
    },
    isNewUser: false,
    setName: false,
    fetched: false,
    fetching: false,
    error: null
}, action){
    switch(action.type){
        case "USERNAME_ERROR": {
            return {
                ...state,
                login: {
                    ...state.login,
                    uname_error_msg: action.payload
                }
            }
        }
        case "PASSWORD_ERROR": {
            return {
                ...state,
                login: {
                    ...state.login,
                    pwd_error_msg: action.payload
                }
            }
        }
        case "USERNAME_FILLED": {
            return {
                ...state,
                login: {
                    ...state.login,
                    uname_error_msg: ""
                }
            }
        }
        case "PASSWORD_FULLFILLED": {
            return {
                ...state,
                login: {
                    ...state.login,
                    pwd_error_msg: ""
                }
            }
        }
        case "GET_LOGIN_SUCCEED": {
            sessionStorage.setItem("access_token", action.payload.access_token);
            sessionStorage.setItem("userId", action.payload.userId);
            browserHistory.push("/home");
            return {
                ...state,
                user: action.payload,
                isNewUser: false,
                setName: false
            }
        }
        case "GET_LOGIN_FAIL": {
            return {
                ...state,
                login: {
                    ...state.login,
                    uname_error_msg: action.payload,
                    pwd_error_msg: action.payload
                }
            }
        }
        case "NEW_USER_LOGIN": {
            return {
                ...state,
                user: action.payload,
                isNewUser: true
            }
        }
        case "UPDATE_USER_NAME": {
            return {
                ...state,
                user: {
                    ...state.user,
                    username: action.payload
                }
            }
        }
        case "SET_USER_AGREE": {
            return {
                ...state,
                user: {
                    ...state.user,
                    agreed: true
                }
            }
        }
        case "SET_USER_REFUSE": {
            return {
                ...state,
                user: {
                    ...state.user,
                    agreed: false
                }
            }
        }
        case "SET_NAME_DIALOG_OPEN": {
            return {
                ...state,
                setName: !state.setName
            }
        }
        case "UPDATE_TELEGRAM_ACCOUNT": {
            return {
                ...state,
                user: {
                    ...state.user,
                    telegram_account: action.payload
                }
            }
        }
        case "UPDATE_SECTION": {
            return {
                ...state,
                user: {
                    ...state.user,
                    section_id: action.payload
                }
            }
        }
    };
    return state;
}
