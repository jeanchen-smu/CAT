export function SetQaCoins(qacoins){
    return {
        type: "CHANGE_QACOINS_STATE",
        payload: qacoins
    }
}

export function ResetQaCoins(){
    return {
        type: "RESET_QACOINS_STATE",
    }
}

export function SetDate(date){
    return {
        type: "CHANGE_DATE_STATE",
        payload: date
    }
}

export function SetDateTime(dateTime){
    return {
        type: "CHANGE_DATETIME_STATE",
        payload: dateTime
    }
}

export function ResetNewPost(){
    return {
        type: "RESET_NEW_POST"
    }
}

export function ErrMsgOpen(errMsg){
    return {
        type: "ERR_MSG_OPEN",
        payload: errMsg
    }
}

export function ErrMsgClose(){
    return {
        type: "ERR_MSG_CLOSE"
    }
}