import React, { PropTypes } from "react";
import Delete from "material-ui/svg-icons/action/delete";
import FlatButton from 'material-ui/FlatButton';
import {connect} from "react-redux";
import {DeleteQuestionOpen, DeleteQuestionClose} from './../actions/navAction';
import Dialog from 'material-ui/Dialog';
import TextField from "material-ui/TextField";
import Paper from "material-ui/Paper";
import {SetPost, 
        UpdateNewPostContent, 
        UpdateNewPostSubject,
        EditPostOpen,
        ClearNewPost} from './../actions/forumAction';
import {ResetNewPost} from "./../actions/newPostAction";
import {SetAnswer,UpdateAnswer, ResetAnswer} from "../actions/questionAction";
import {AnswerReplyOpen, AnswerReplyClose} from './../actions/navAction';

class EditPostDialog extends React.Component {
    constructor() {
        super();
        this.styles = {
            deletButton: {
                float: "right"
            },
            textField: {
                paddingLeft: 10,
                paddingRight: 10
            },
            contentPaper: {
                marginTop: 10
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
            edit: true,
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
            edit: true,
            previous_post_id: this.props.newPost.post_id
        }
    }

    handleSetPost() {
        this.props.setPost(
            sessionStorage.getItem("access_token"),
            1,
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
        this.props.editPostOpen();
        this.props.clearNewPost();
    }

    render() {
        const actions = [
            <FlatButton
                label="Post"
                primary={true}
                onClick={()=>this.handleNewPostSub()}
            />,
        ];
        return (
            <Dialog
                title="Edit Post"
                actions={actions}
                modal={false}
                open={this.props.editPost}
            >
                <Paper zDepth={1}>
                    {this.props.newPost.subject===null?null:
                    <TextField
                        style={this.styles.textField}
                        name="title"
                        id="newPostTitle"
                        ref="newPostTitle"
                        hintText="Title"
                        floatingLabelText="Title"
                        fullWidth={true}
                        underlineShow={false}
                        value={this.props.newPost.subject}
                        onChange={()=>
                        this.props.updateNewPostSubject(this.refs.newPostTitle.getValue())}
                    />}
                    </Paper>
                    <Paper 
                        zDepth={1}
                        style={this.styles.contentPaper}>
                    <TextField 
                        style={this.styles.textField}
                        name="content"
                        id="newPostContent"
                        ref="newPostContent"
                        hintText="Content"
                        floatingLabelText="Content"
                        multiLine={true}
                        rows={5}
                        underlineShow={false}
                        fullWidth={true}
                        value={this.props.newPost.content}
                        onChange={()=>
                        this.props.updateNewPostContent(this.refs.newPostContent.getValue())}
                    />
                    </Paper>
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
        editPostOpen: () => {
            dispatch(EditPostOpen())
        },
        clearNewPost: () => {
            dispatch(ClearNewPost())
        },
        updateNewPostSubject: (subject) => {
            dispatch(UpdateNewPostSubject(subject))
        },
        updateNewPostContent: (content) => {
            dispatch(UpdateNewPostContent(content))
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

export default connect(mapStateToProps, mapDispatchToProps)(EditPostDialog);