export default function ForumReducer(state={
    posts: [[],[]],
    set_post_id: null,
    totalPage: 1,
    currentPage: 1,
    fetched: false,
    fetching: false,
    newPost: {
        post_id:null,
        thoughtfulness:null,
        subject:null,
        content:null,
        new_subject:null,
        new_content:null,
        new_thoughtfulness:null
    },
    topics:[],
    sessions:[],
    filter:{
        topic_id: 0,
        session: 0,
	section_id: 0
	  
    },
    search: false,
    tags:[],
    newTags:null,
    editPost: false,
    newEditPost: false,
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
                newPost: {
                    ...state.newPost,
                    post_id: action.payload.post_id,
                    thoughtfulness: action.payload.thoughtfulness,
                    subject: action.payload.subject,
                    content: action.payload.content,
                    new_subject: action.payload.subject,
                    new_content: action.payload.content
                }
            }
        }
        case "GET_THOUGHTFULNESS_FAIL": {
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
                    subject:null,
                    content:null,
                    new_subject:null,
                    new_content:null,
                    new_thoughtfulness:null
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
                    new_subject: action.payload
                }
            }
        }
        case "UPDATE_NEW_POST_CONTENT": {
            return {
                ...state,
                newPost: {
                    ...state.newPost,
                    new_content: action.payload
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
                    topic_id: action.payload.topic,
		    section_id: action.payload.section
                }
            }
        }
        // case "GET_SESSIONS_SUCCEED": {
        //     return {
        //         ...state,
        //         sessions: action.payload,
        //         search: true
        //     }
        // }
        // case "UPDATE_SECTION": {
        //     return {
        //         ...state,
        //         filter: {
        //             ...state.filter,
        //             session: action.payload
        //         }
        //     }
        // }
        case "NEW_EDIT_POST_OPEN": {
            return {
                ...state,
                newEditPost: !state.newEditPost
            }
        }
        case "GET_NEW_THOUGHTFULNESS_SUCCEED": {
            return {
                ...state,
                newPost:{
                    ...state.newPost,
                    new_thoughtfulness: action.payload.new_thoughtfulness
                },
		newEditPost: true

            }
        }
        case "GET_NEW_THOUGHTFULNESS_FAIL": {
            return {
                ...state,
                error: action.payload
            }
        }
    };
    return state;
}
