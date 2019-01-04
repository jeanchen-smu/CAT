import axios from "axios";

function GetPostsReqObj(access_token, filter){
    return {
        method: "post",
        url: "/cat/api/posts",
        headers:{
            "Content-Type": "application/json",
            Authorization: "Bearer " + access_token,
        },
        data: {
            filter: filter
        }
    };
}

export function GetPosts(access_token, filter){
    return function(dispatch){
        axios(GetPostsReqObj(access_token, filter))
            .then(response => {
                dispatch ({type: "GET_POSTS_SUCCEED", payload: response.data})
            })
            .catch(err => {
                dispatch ({type: "GET_POSTS_FAIL", payload: err})
            })
    }
}

export function SetPage(pageNumber) {
    return {
        type: "SET_PAGE_NUBMER",
        payload: pageNumber
    }
}

export function GotoPreviousPage() {
    return {
        type: "GOTO_PREVIOUS_PAGE"
    }
}

export function GotoNextPage() {
    return {
        type: "GOTO_NEXT_PAGE"
    }
}

function GetTSReqObj(access_token, post){
    return {
        method: "post",
        url: "/cat/api/getthoughtfulness",
        headers:{
            "Content-Type": "application/json",
            Authorization: "Bearer " + access_token,
        },
        data: {
            post: post
        }
    };
}

export function GetTS(access_token, post){
    return function(dispatch){
        axios(GetTSReqObj(access_token, post))
            .then(response => {
                dispatch ({type: "GET_THOUGHTFULNESS_SUCCEED", payload: {
                    ...response.data,
                    subject: post.subject,
                    content: post.content
                }})
            })
            .catch(err => {
                dispatch ({type: "GET_THOUGHTFULNESS_FAIL", payload: err})
            })
    }
}

export function ClearNewPost(){
    return{
        type: "CLEAR_NEW_POST"
    }
}

export function EditPostOpen(){
    return {
        type: "EDIT_POST_OPEN"
    }
}

export function UpdateNewPostSubject(subject) {
    return {
        type: "UPDATE_NEW_POST_SUBJECT",
        payload: subject
    }
}

export function UpdateNewPostContent(content) {
    return {
        type: "UPDATE_NEW_POST_CONTENT",
        payload: content
    }
}

function GetTopicsReqObj(access_token){
    return {
        method: "post",
        url: "/cat/api/get_topics",
        headers:{
            "Content-Type": "application/json",
            Authorization: "Bearer " + access_token,
        },
        data: {}
    };
}

export function GetTopics(access_token){
    return function(dispatch){
        axios(GetTopicsReqObj(access_token))
            .then(response => {
                dispatch ({type: "GET_TOPICS_SUCCEED", payload: response.data})
            })
            .catch(err => {
                dispatch ({type: "GET_TOPICS_FAIL", payload: err})
            })
    }
}

export function CloseSearch(){
    return {
        type: "CLOSE_SEARCHING_BAR"
    }
}

export function UpdateTopic(topic,section){
    return {
        type: "UPDATE_TOPIC_ID",
        payload: {
                    topic: topic,
                    section: section
                }
    }
}

// function GetSessionsReqObj(access_token, avatar_id){
//     return {
//         method: "post",
//         url: "/api/get_sessions",
//         headers:{
//             "Content-Type": "application/json",
//             Authorization: "Bearer " + access_token,
//         },
//         data: {
//             avatar_id: avatar_id
//         }
//     };
// }
//
// export function GetSessions(access_token, avatar_id){
//     return function(dispatch){
//         axios(GetSessionsReqObj(access_token, avatar_id))
//             .then(response => {
//                 dispatch ({type: "GET_SESSIONS_SUCCEED", payload: response.data})
//             })
//             .catch(err => {
//                 dispatch ({type: "GET_SESSIONS_FAIL", payload: err})
//             })
//     }
// }
//
// export function UpdateSection(section){
//     return {
//         type: "UPDATE_SECTION",
//         payload: section
//     }
// }

export function NewEditPostOpen(){
    return {
        type: "NEW_EDIT_POST_OPEN"
    }
}

function GetNewTSReqObj(access_token, post){
    return {
        method: "post",
        url: "/cat/api/getnewts",
        headers:{
            "Content-Type": "application/json",
            Authorization: "Bearer " + access_token,
        },
        data: {
            post: post
        }
    };
}

export function GetNewTS(access_token, post){
    return function(dispatch){
        axios(GetNewTSReqObj(access_token, post))
            .then(response => {
                dispatch ({type: "GET_NEW_THOUGHTFULNESS_SUCCEED", payload: {
                    ...response.data,
                    subject: post.subject,
                    content: post.content
                }})
            })
            .catch(err => {
                dispatch ({type: "GET_NEW_THOUGHTFULNESS_FAIL", payload: err})
            })
    }
}
