import axios from "axios";
import { browserHistory } from 'react-router';

function GetQuestionReqObj(access_token, questionId, userId){
    return {
        method: "post",
        url: "/cat/api/question",
        headers:{
            "Content-Type": "application/json",
            Authorization: "Bearer " + access_token,       
        }, 
        data: {
            questionId: questionId,
            userId: userId
        }
    };
}

export function GetQuestion(access_token, questionId, userId){
    return function(dispatch){
        axios(GetQuestionReqObj(access_token, questionId, userId))
            .then(response => {
                dispatch ({type: "GET_QUESTION_SUCCEED", payload: response.data})
            })
            .then(() => {
                browserHistory.push("/cat/home/post");
            })
            .catch(err => {
                dispatch ({type: "GET_QUESTION_FAIL", payload: err})
            })
    }
}

function SetAnswerReqObj(access_token, answer){
    return {
        method: "post",
        url: "/cat/api/setanswer",
        headers:{
            "Content-Type": "application/json",
            Authorization: "Bearer " + access_token,       
        }, 
        data: {
            answer: answer
        }
    };
}

export function SetAnswer(access_token, answer){
    return function(dispatch){
        axios(SetAnswerReqObj(access_token, answer))
            .then(response => {
                dispatch ({type: "SET_ANSWER_SUCCEED", payload: response.data})
            })
            .catch(err => {
                dispatch ({type: "SET_ANSWER_FAIL", payload: err})
            })
    }
}

export function SelectNewTags(tags){
    return {
        type: "SELECT_NEW_TAGS",
        payload: tags
    }
}

export function UpdateAnswer(answer){
    return {
        type: "UPDATE_ANSWER_CONTENT",
        payload: answer
    }
}


export function ResetAnswer(){
    return {
        type: "RESET_ANSWER_CONTENT"
    }
}

export function StartThoughtfulness(post_thoughtfulness){
    return {
        type: "START_NEW_THOUGHTFULNESS",
        payload: post_thoughtfulness
    }
}

export function SetThoughtfulness(thoughtfulness){
    return {
        type: "SET_NEW_THOUGHTFULNESS",
        payload: thoughtfulness
    }
}

export function EndThoughtfulness(){
    return {
        type: "END_NEW_THOUGHTFULNESS"
    }
}

function UpdateThoughtfulnessReqObj(access_token, post){
    return {
        method: "post",
        url: "/cat/api/setthoughtfulness",
        headers:{
            "Content-Type": "application/json",
            Authorization: "Bearer " + access_token,       
        }, 
        data: {
            post: post
        }
    };
}

export function UpdateThoughtfulness(access_token, post){
    return function(dispatch){
        axios(UpdateThoughtfulnessReqObj(access_token, post))
            .then(response => {
                dispatch ({type: "SET_THOUGHTFULNESS_SUCCEED", payload: response.data})
            })
            .catch(err => {
                dispatch ({type: "SET_THOUGHTFULNESS_FAIL", payload: err})
            })
    }
}

function AddNewTagReqObj(access_token, post){
    return {
        method: "post",
        url: "/cat/api/addtag",
        headers:{
            "Content-Type": "application/json",
            Authorization: "Bearer " + access_token,       
        }, 
        data: {
            post: post
        }
    };
}

export function AddNewTag(access_token, post){
    return function(dispatch){
        axios(AddNewTagReqObj(access_token, post))
            .then(response => {
                dispatch ({type: "ADD_TAG_SUCCEED", payload: response.data})
            })
            .catch(err => {
                dispatch ({type: "ADD_TAG_FAIL", payload: err})
            })
    }
}

function DeleteTagReqObj(access_token, post){
    return {
        method: "post",
        url: "/cat/api/deletetag",
        headers:{
            "Content-Type": "application/json",
            Authorization: "Bearer " + access_token,       
        }, 
        data: {
            post: post
        }
    };
}

export function DeleteTag(access_token, post){
    return function(dispatch){
        axios(DeleteTagReqObj(access_token, post))
            .then(response => {
                dispatch ({type: "DELETE_TAG_SUCCEED", payload: response.data})
            })
            .catch(err => {
                dispatch ({type: "DELETE_TAG_FAIL", payload: err})
            })
    }
}

function VoteClickReqObj(access_token, vote){
    return {
        method: "post",
        url: "/cat/api/vote",
        headers:{
            "Content-Type": "application/json",
            Authorization: "Bearer " + access_token,       
        }, 
        data: {
            vote: vote
        }
    };
}

export function VoteClick(access_token, vote){
    return function(dispatch){
        axios(VoteClickReqObj(access_token, vote))
            .then(response => {
                dispatch ({type: "UPDATE_VOTE_SUCCESSFUL", payload: response.data})
            })
            .catch(err => {
                dispatch ({type: "UPDATE_VOTE_FAIL", payload: err})
            })
    }
}