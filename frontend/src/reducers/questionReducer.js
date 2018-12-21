export default function QuestionReducer(state={
    post: {
        question:{},
        answers:[]
    },
    new_thoughtfulness: {
        post_id:null,
        thoughtfulness:null
    },
    answer: null,
    newTags: null,
    fetched: false,
    fetching: false,
    initTag: false,
    error: null
}, action){
    switch(action.type){
        case "GET_QUESTION_SUCCEED": {
            return {
                ...state,
                post: {
                    ...state.post,
                    question: action.payload.question,
                    answers: action.payload.answers
                },
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
        case "SET_ANSWER_SUCCEED": {
            return {
                ...state,
                post: {
                    ...state.post,
                    question: action.payload.question,
                    answers: action.payload.answers
                },
                fetched: true,
                fetching: false,
                error: null
            }
        }
        case "SET_ANSWER_FAIL": {
            return {
                ...state,
                fetched: false,
                fetching: false,
                error: action.payload
            }
        }
        case "SET_SUBANSWER_SUCCEED": {
            return {
                ...state,
                post: {
                    ...state.post,
                    question: action.payload.question,
                    answers: action.payload.answers
                },
                fetched: true,
                fetching: false,
                error: null
            }
        }
        case "SET_SUBANSWER_FAIL": {
            return {
                ...state,
                fetched: false,
                fetching: false,
                error: action.payload
            }
        }
        case "SELECT_NEW_TAGS": {
            return {
                ...state,
                newTags: action.payload
            }
        }
        case "UPDATE_ANSWER_CONTENT": {
            return {
                ...state,
                answer: action.payload
            }
        }
        case "RESET_ANSWER_CONTENT": {
            return {
                ...state,
                answer: null
            }
        }
        case "START_NEW_THOUGHTFULNESS": {
            return {
                ...state,
                new_thoughtfulness: {
                    post_id: action.payload.post_id,
                    thoughtfulness: action.payload.thoughtfulness_score
                }
            }
        }
        case "SET_NEW_THOUGHTFULNESS": {
           return {
                ...state,
                new_thoughtfulness: {
                    ...state.new_thoughtfulness,
                    thoughtfulness: action.payload
                }
            }
        }
        case "END_NEW_THOUGHTFULNESS": {
            return {
                ...state,
                new_thoughtfulness: {
                    post_id:null,
                    thoughtfulness:null
                }
            }
        }
        case "SET_THOUGHTFULNESS_SUCCEED": {
            return {
                ...state,
                post: {
                    ...state.post,
                    question: action.payload.question,
                    answers: action.payload.answers
                },
                new_thoughtfulness: {
                    post_id:null,
                    thoughtfulness:null
                }
            }
        }
        case "SET_THOUGHTFULNESS_FAIL": {
            return {
                ...state,
                new_thoughtfulness: {
                    post_id:null,
                    thoughtfulness:null
                },
                error: action.payload
            }
        }
        case "ADD_TAG_SUCCEED": {
            return {
               ...state,
                post: {
                    ...state.post,
                    question: action.payload.question,
                    answers: action.payload.answers
                },
                newTags: null
            }
        }
        case "ADD_TAG_FAIL": {
            return {
               ...state,
                newTags: null,
                error: action.payload
            }
        }
        case "DELETE_TAG_SUCCEED": {
            return {
               ...state,
                post: {
                    ...state.post,
                    question: action.payload.question,
                    answers: action.payload.answers
                }
            }
        }
        case "DELETE_TAG_FAIL": {
            return {
               ...state,
                error: action.payload
            }
        }
        case "UPDATE_VOTE_SUCCESSFUL": {
            return {
                ...state,
                post: {
                    ...state.post,
                    question: action.payload.question,
                    answers: action.payload.answers
                },
                fetched: true,
                fetching: false,
                error: null
            }
        }
        case "UPDATE_VOTE_FAIL": {
            return {
                ...state,
                fetched: false,
                fetching: false,
                error: action.payload
            }
        }
	case "NEED_IMPROVEMENT_OPEN_CLICK": {
            return {
                ...state,
                needImp: !state.needImp,
                impPostId: action.payload
            }
        }
	case "SET_POSTS_SUCCEED": {
            return {
                ...state,
                post: {
                    ...state.post,
                    question: action.payload.question,
                    answers: action.payload.answers
                },
                initTag: true,
                fetched: true,
                fetching: false,
                error: null
            }
        }
        case "INIT_TAG_OPEN_CLICK": {
            return {
                ...state,
                initTag: !state.initTag
            }
        }
    };
    return state;
}
