import axios from "axios";

function getStatReqObj(access_token, userId, section_id){
    return {
        method: "post",
        url: "/cat/api/stat",
        headers:{
            "Content-Type": "application/json",
            Authorization: "Bearer " + access_token         
        }, 
        data: {
            userId: userId,
	    section_id: section_id
        }
    };
}

export function GetMyStats(access_token, userId, section_id){
    return function(dispatch){
        axios(getStatReqObj(access_token, userId, section_id))
            .then(response => {
                dispatch ({type: "GET_MY_STATS_SUCCEED", payload: response.data})
            })
            .catch(err => {
                dispatch ({type: "GET_MY_STATS_FAIL", payload: err})
            })
    }
}
