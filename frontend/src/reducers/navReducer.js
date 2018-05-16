export default function NavReducer (
    state = {
        navOpen: false,
        questionReply: false,
        answerReply: null,
        answerReplyLevel: null,
        questionDelete: false,
        addTag: false
    },
    action
){
    switch(action.type){
        case "CHANGE_NAV_SATE": {
            return {
                ...state,
                navOpen: !state.navOpen
                }
            }
        case "NAV_RECEIVE_PROPS": {
            return {
                ...state,
                navOpen: action.payload
                }
            }
        case "CHANGE_QUESTION_REPLY_STATE": {
            return {
                ...state,
                questionReply: !state.questionReply
                }
            }
        case "CHANGE_ANSWER_REPLY_STATE": {
                return {
                    ...state,
                    answerReply: action.payload.answerId,
                    answerReplyLevel: action.payload.level
                    }
            }
        case "CLOSE_ANSWER_REPLY": {
            return {
                ...state,
                answerReply: null
                }
        }
        case "DELETE_QUESTION_OPEN": {
            return {
                ...state,
                questionDelete: true
                }
        }
        case "DELETE_QUESTION_CLOSE": {
            return {
                ...state,
                questionDelete: false
                }
        }
        case "ADD_TAG_OPEN": {
            return {
                ...state,
                addTag: true
                }
        }
        case "ADD_TAG_CLOSE": {
            return {
                ...state,
                addTag: false
                }
        }
        }
    return state
}