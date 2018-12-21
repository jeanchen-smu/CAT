import axios from "axios";

export function ValidateUserName(userName){
    if (userName === ""){
        return {
            type: "USERNAME_ERROR",
            payload: "UserName is empty."
        }
    }
    else {
        return {
            type: "USERNAME_FILLED"
        }
    }
}

export function ValidatePassword(password){
    if (password === ""){
        return {
            type: "PASSWORD_ERROR",
            payload: "Password is empty."
        }
    }
    else {
        return {
            type: "PASSWORD_FULLFILLED"
        }
    }
}

export function GetLoginInfo(email){
    const loginObject = {
        method: "post",
            url: "/api/login",
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                email: email
            }
    }
    return function(dispatch){
        axios(loginObject)
            .then(response => {
                if (response.data.username===null|response.data.username===""){
                    dispatch ({type: "NEW_USER_LOGIN", payload: response.data});
                }
                else{
                    dispatch ({type: "GET_LOGIN_SUCCEED", payload: response.data});
                }
                return true
            })
            .catch(err => {
                dispatch ({type: "GET_LOGIN_FAIL", payload: "Invalid username or password."})
                return false
            })
    }
}

export function UpdateUserName(userName) {
    return {
        type: "UPDATE_USER_NAME",
        payload: userName
    }
}

export function UpdateTelegram(tg) {
    return {
        type: "UPDATE_TELEGRAM_ACCOUNT",
        payload: tg
    }
}

function SetUserNameReqObj(access_token, user){
    return {
        method: "post",
        url: "/api/setusername",
        headers:{
            "Content-Type": "application/json",
            Authorization: "Bearer " + access_token,
        },
        data: {
            user: user
        }
    };
}

export function SetUserName(access_token, user, email){
    return function(dispatch){
        axios(SetUserNameReqObj(access_token, user))
            .then(response => {
                dispatch ({type: "GET_LOGIN_SUCCEED",
                            payload: {...response.data, access_token: access_token}})
            })
            .catch(err => {
                dispatch ({type: "GET_LOGIN_FAIL", payload: err})
            })
    }
}

export function SetAgreed() {
    return {
        type: "SET_USER_AGREE"
    }
}

export function SetRefuse() {
    return {
        type: "SET_USER_REFUSE"
    }
}

export function SetNameDialogOpen() {
    return {
        type: "SET_NAME_DIALOG_OPEN"
    }
}

export function UpdateSection(section){
    return {
        type: "UPDATE_SECTION",
        payload: section
    }
}
