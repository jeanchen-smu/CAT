export function NavOpen(){
    return {type: "CHANGE_NAV_SATE"}
}

export function NavReceiveProps(bol){
    return {
        type: "NAV_RECEIVE_PROPS",
        payload: bol
    }
}

export function QuestionReplyOpen(){
    return {
        type: "CHANGE_QUESTION_REPLY_STATE"
    }
}

export function AnswerReplyOpen(answerId){
    return {
        type: "CHANGE_ANSWER_REPLY_STATE",
        payload: answerId
    }
}

export function AnswerReplyClose(){
    return {
        type: "CLOSE_ANSWER_REPLY"
    }
}

export function DeleteQuestionOpen(){
    return {
        type: "DELETE_QUESTION_OPEN"
    }
}

export function DeleteQuestionClose(){
    return {
        type: "DELETE_QUESTION_CLOSE"
    }
}

export function AddTagOpen(){
    return {
        type:"ADD_TAG_OPEN"
    }
}

export function AddTagClose(){
    return {
        type: "ADD_TAG_CLOSE"
    }
}