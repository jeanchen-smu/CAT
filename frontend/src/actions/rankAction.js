import axios from "axios";

function getRankObject(){
    return {
        method: "post",
        url: "/api/rank",
        headers:{
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("access_token")            
        }, 
        data: {}
    };
}

export function GetRanking(){
    axios(getRankObject())
        .then(response => {
            dispatch ({type: "GET_RANK_SUCCEED", payload: response.data})
        })
        .catch(err => {
            dispatch ({type: "GET_RANK_FAIL", payload: err})
        })
}