import axios from "axios";

function getStatReqObj(access_token, userId){
    return {
        method: "post",
        url: "/cat/api/stat",
        headers:{
            "Content-Type": "application/json",
            Authorization: "Bearer " + access_token         
        }, 
        data: {
            userId: userId
        }
    };
}

export function GetMyStats(access_token, userId){
    return function(dispatch){
        axios(getStatReqObj(access_token, userId))
            .then(response => {
                dispatch ({type: "GET_MY_STATS_SUCCEED", payload: response.data})
            })
            .catch(err => {
                dispatch ({type: "GET_MY_STATS_FAIL", payload: err})
            })
    }
}
