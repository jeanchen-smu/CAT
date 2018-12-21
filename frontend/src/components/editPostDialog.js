import React, { PropTypes } from "react";
import Delete from "material-ui/svg-icons/action/delete";
import FlatButton from 'material-ui/FlatButton';
import {connect} from "react-redux";
import {DeleteQuestionOpen, DeleteQuestionClose} from './../actions/navAction';
import Dialog from 'material-ui/Dialog';
import TextField from "material-ui/TextField";
import Paper from "material-ui/Paper";
import {UpdateNewPostContent,
        UpdateNewPostSubject,
        EditPostOpen,
        ClearNewPost,
        NewEditPostOpen,
        GetNewTS} from './../actions/forumAction';
import {ResetNewPost} from "./../actions/newPostAction";
import {SetPost,SetAnswer,UpdateAnswer, ResetAnswer} from "../actions/questionAction";
import {AnswerReplyOpen, AnswerReplyClose} from './../actions/navAction';
import {DeleteTag} from './../actions/questionAction';

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

    answerObj(isNewPost) {
        return {
            questionId: this.props.questionId,
            userId: this.props.user.userId,
            answer: isNewPost?this.props.newPost.new_content:this.props.newPost.content,
            level: this.props.parentId==null?2:this.props.level + 1,
            parentId: this.props.parentId==null?this.props.questionId:this.props.parentId,
            edit: true,
            previous_post_id: this.props.newPost.post_id
        }
    }

    handleAnswerRelpySub(isNewPost) {
        let answerObj = this.answerObj(isNewPost);
        this.props.setAnswer(
            sessionStorage.getItem("access_token"),
            answerObj
        );
    }

    handleGetNewTS(){
        this.props.getNewTs(
            sessionStorage.getItem("access_token"),
            {
                subject: this.props.newPost.subject,
                content: this.props.newPost.content
            }
        )
    }

    setPostObject(isNewPost) {
        return{
            qacoins: this.props.qacoins,
            subject: isNewPost?this.props.newPost.new_subject:this.props.newPost.subject,
            question: isNewPost?this.props.newPost.new_content:this.props.newPost.content,
            userId: this.props.user.userId,
            dateTime: this.props.dateTime,
            edit: true,
            previous_post_id: this.props.newPost.post_id,
            section_id: this.props.section_id
        }
    }

    handleSetPost(isNewPost) {
        this.props.setPost(
            sessionStorage.getItem("access_token"),
            {userId: this.props.user.userId},
            this.setPostObject(isNewPost)
        )
    }

    handleNewPostSub(isNewPost) {
        if (this.props.newPost.subject === null){
            this.handleAnswerRelpySub(isNewPost);
            this.props.answerReplyClose();
            this.props.resetAnswer();
        }
        else{
            this.handleSetPost(isNewPost);
            this.props.resetNewPost();
        }
        this.props.editPostOpen();
        this.props.newEditPostOpen();
        this.props.clearNewPost();
    }

    render() {
        const actions = [
            <FlatButton
                label="Post"
                primary={true}
                onClick={()=>{this.handleGetNewTS()}}
            />,
        ];
        const actions2 = [
            <FlatButton
                label="Select First Post"
                primary={true}
                onClick={()=>this.handleNewPostSub(false)}
            />,
            <FlatButton
                label="Select Second Post"
                primary={true}
                onClick={()=>this.handleNewPostSub(true)}
            />
        ];
        return (
            <div>
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
                        value={this.props.newPost.new_subject}
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
                        value={this.props.newPost.new_content}
                        onChange={()=>
                        this.props.updateNewPostContent(this.refs.newPostContent.getValue())}
                    />
                    </Paper>
            </Dialog>
            <Dialog
                title="Select Post"
                actions={actions2}
                modal={false}
                open={this.props.newEditPost}
            >
                Thoughtfulness score for your first post is {this.props.newPost.thoughtfulness}<br/>
                Thoughtfulness score for your second post is {this.props.newPost.new_thoughtfulness}<br/>
                Please select the post you want to proceed with.
            </Dialog>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
  return {
	  nav: state.nav,
      newPost: state.forum.newPost,
      editPost: state.forum.editPost,
      newEditPost: state.forum.newEditPost,
      questionId: state.ques.post.question.questionId,
      parentId: state.nav.answerReply,
      level: state.nav.answerReplyLevel,
      user: state.login.user,
      answer: state.ques.answer,
      dateTime: state.newPost.dateTime,
      qacoins: state.newPost.qacoins.value,
      section_id: state.login.user.section_id
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
        editPostOpen: () => {
            dispatch(EditPostOpen())
        },
        newEditPostOpen: () => {
            dispatch(NewEditPostOpen())
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
        },
        getNewTs: (access_token, post) => {
            dispatch(GetNewTS(access_token, post))
        },
        deleteTag: (access_token, post) => {
            dispatch(DeleteTag(access_token, post))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPostDialog);
