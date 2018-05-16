export default function ForumReducer(state={
    posts: [[],[]],
    totalPage: 1,
    currentPage: 1,
    fetched: false,
    fetching: false,
    newPost: {
        post_id:null,
        thoughtfulness:null,
        subject:null
    },
    topics:[],
    filter:{
        topic_id: null
    },
    search: false,
    tags:{},
    editPost: false,
    error: null
}, action){
    switch(action.type){
        case "GET_POSTS_SUCCEED": {
            return {
                ...state,
                posts: action.payload,
                totalPage: action.payload.length,
                currentPage: 1,
                fetched: true,
                fetching: false,
                error: null
            }
        }
        case "GET_POSTS_FAIL": {
            return {
                ...state,
                fetched: false,
                fetching: false,
                error: action.payload
            }
        }
        case "SET_POSTS_SUCCEED": {
            return {
                ...state,
                posts: action.payload,
                totalPage: action.payload.length,
                currentPage: 1,
                fetched: true,
                fetching: false,
                error: null
            }
        }
        case "SET_POSTS_FAIL": {
            return {
                ...state,
                fetched: false,
                fetching: false,
                error: action.payload
            }
        }
        case "SET_PAGE_NUBMER": {
            return {
                ...state,
                currentPage: action.payload
            }
        }
        case "GOTO_PREVIOUS_PAGE": {
            return {
                ...state,
                currentPage: state.currentPage - 1
            }
        }
        case "GOTO_NEXT_PAGE": {
            return {
                ...state,
                currentPage: state.currentPage + 1
            }
        }
        case "GET_THOUGHTFULNESS_SUCCEED": {
            return {
                ...state,
                newPost: action.payload
            }
        }
        case "GET_THOUGHTFULNESS_SUCCEED": {
            return {
                ...state,
                error: action.payload
            }
        }
        case "CLEAR_NEW_POST": {
            return {
                ...state,
                newPost: {
                    post_id:null,
                    thoughtfulness:null,
                    subject:null
                }
            }
        }
        case "EDIT_POST_OPEN": {
            return {
                ...state,
                editPost: !state.editPost
            }
        }
        case "UPDATE_NEW_POST_SUBJECT": {
            return {
                ...state,
                newPost: {
                    ...state.newPost,
                    subject: action.payload
                }
            }
        }
        case "UPDATE_NEW_POST_CONTENT": {
            return {
                ...state,
                newPost: {
                    ...state.newPost,
                    content: action.payload
                }
            }
        }
        case "GET_TOPICS_SUCCEED": {
            return {
                ...state,
                topics: action.payload,
                search: true
            }
        }
        case "CLOSE_SEARCHING_BAR": {
            return {
                ...state,
                search:false
            }
        }
        case "UPDATE_TOPIC_ID": {
            return {
                ...state,
                filter: {
                    ...state.filter,
                    topic_id: action.payload
                }
            }
        }
    };
    return state;
}
