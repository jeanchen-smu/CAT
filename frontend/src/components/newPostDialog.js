import React, { PropTypes } from "react";
import Delete from "material-ui/svg-icons/action/delete";
import FlatButton from 'material-ui/FlatButton';
import {connect} from "react-redux";
import {DeleteQuestionOpen, DeleteQuestionClose} from './../actions/navAction';
import Dialog from 'material-ui/Dialog';
import EditPostDialog from './editPostDialog';
import {SetPost, 
        UpdateNewPostContent, 
        UpdateNewPostSubject,
        EditPostOpen,
        ClearNewPost} from './../actions/forumAction';
import {ResetNewPost} from "./../actions/newPostAction";
import {SetAnswer,UpdateAnswer, ResetAnswer} from "../actions/questionAction";
import {AnswerReplyOpen, AnswerReplyClose} from './../actions/navAction';

class NewPostDialog extends React.Component {
    constructor() {
        super();
        this.styles = {
            deletButton: {
                float: "right"
            }
        }
    }

    answerObj() {
        return {
            questionId: this.props.questionId,
            userId: this.props.user.userId,
            answer: this.props.newPost.content,
            level: this.props.parentId==null?2:this.props.level + 1,
            parentId: this.props.parentId==null?this.props.questionId:this.props.parentId,
            edit: false,
            previous_post_id: this.props.newPost.post_id
        }
    }

    handleAnswerRelpySub() {
        let answerObj = this.answerObj();
        this.props.setAnswer(
            sessionStorage.getItem("access_token"),
            answerObj
        );
    }

    setPostObject() {
        return{
            qacoins: this.props.qacoins,
            subject: this.props.newPost.subject,
            question: this.props.newPost.content,
            userId: this.props.user.userId,
            dateTime: this.props.dateTime,
            edit: false,
            previous_post_id: this.props.newPost.post_id
        }
    }

    handleSetPost() {
        this.props.setPost(
            sessionStorage.getItem("access_token"),
            {userId: this.props.user.userId},
            this.setPostObject()
        )
    }

    handleNewPostSub() {
        if (this.props.newPost.subject === null){
            this.handleAnswerRelpySub();
            this.props.answerReplyClose();
            this.props.resetAnswer();
        }
        else{
            this.handleSetPost();
            this.props.resetNewPost();
        }
        this.props.clearNewPost();
    }

    render() {
        const actions = [
            <FlatButton
                label="Yes, edit post"
                primary={true}
                keyboardFocused={true}
                onClick={()=>this.props.editPostOpen()}
            />,
            <FlatButton
                label="No, continue posting"
                primary={true}
                onClick={()=>this.handleNewPostSub()}
            />
        ];
        return (
            <Dialog
                title="Confirm"
                actions={actions}
                modal={false}
                open={this.props.newPost.post_id!==null}
            >
                Thoughtfulness score for this post is {this.props.newPost.thoughtfulness}<br/>
                Do you want to edit?
                <EditPostDialog {...this.props}/>
            </Dialog>
        )
    }
}

const mapStateToProps = (state) => {
  return {
	  nav: state.nav,
      newPost: state.forum.newPost,
      editPost: state.forum.editPost,
      questionId: state.ques.post.question.questionId,
      parentId: state.nav.answerReply,
      level: state.nav.answerReplyLevel,
      user: state.login.user,
      answer: state.ques.answer,
      dateTime: state.newPost.dateTime,
      qacoins: state.newPost.qacoins.value
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
        deleteQuestionOpen: () => {
            dispatch(DeleteQuestionOpen())
        },
        deleteQuestionClose: () => {
            dispatch(DeleteQuestionClose())
        },
        editPostOpen: () => {
            dispatch(EditPostOpen())
        },
        clearNewPost: () => {
            dispatch(ClearNewPost())
        },
        setPost: (access_token, filter, post) => {
            dispatch(SetPost(access_token, filter, post))
        },
        resetNewPost: () => {
            dispatch(ResetNewPost())
        },
        setAnswer: (access_token, answer) => {
            dispatch(SetAnswer(access_token, answer))
        },
        resetAnswer: () => {
            dispatch(ResetAnswer())
        },
        answerReplyClose: () => {
            dispatch(AnswerReplyClose())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewPostDialog);