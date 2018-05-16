import React, { PropTypes } from "react";
import TextField from "material-ui/TextField";
import Paper from "material-ui/Paper";
import RaisedButton from 'material-ui/RaisedButton';
import {connect} from 'react-redux';
import {AnswerReplyOpen, AnswerReplyClose} from './../../actions/navAction';
import {SetAnswer,UpdateAnswer, ResetAnswer} from "../../actions/questionAction";
import Dialog from 'material-ui/Dialog';
import {ErrMsgOpen,
        ErrMsgClose} from "./../../actions/newPostAction";
import {GetTS} from "./../../actions/forumAction";


class AnswerReply extends React.Component {

    constructor() {
        super();
        this.styles = {
            textField: {
                paddingLeft: 10,
                paddingRight: 10
            },
            contentPaper: {
                marginTop: 10
            },
            submitButton: {
                marginTop:10,
                float: 'right'
            }

        }
    }

    handleAnswerChange = (e) => {
        this.props.updateAnswer(e.target.value);
    }

    answerObj() {
        return {
            questionId: this.props.questionId,
            userId: this.props.user.userId,
            content: this.props.answer,
            level: this.props.level + 1,
            parentId: this.props.parentId,
            subject: null
        }
    }

    handleAnswerRelpySub() {
        let answerObj = this.answerObj();
        if (!answerObj.content|answerObj.content==""){
            this.props.openErrMsg("Please fill in post content!")
            return
        }
        this.props.getTS(
            sessionStorage.getItem("access_token"),
            answerObj
        );
    }

    render() {
        return (
            <div>
                <Paper 
                    zDepth={1}
                >
                <TextField 
                    style={this.styles.textField}
                    name="questionReply"
                    ref="questionReply"
                    hintText="Reply"
                    floatingLabelText="Reply"
                    multiLine={true}
                    rows={5}
                    underlineShow={false}
                    fullWidth={true}
                    onChange={this.handleAnswerChange}
                />
                </Paper>
                <RaisedButton 
                    label="Reply"
                    style={this.styles.submitButton} 
                    onClick={()=>{this.handleAnswerRelpySub()}}
                />
                <Dialog
                    title="New Post Not Created"
                    modal={false}
                    open={this.props.errMsgOpen}
                    onRequestClose={()=>this.props.closeErrMsg()}
                >
                    {this.props.errMsg}
                </Dialog>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
  return {
	  nav: state.nav,
      questionId: state.ques.post.question.questionId,
      parentId: state.nav.answerReply,
      level: state.nav.answerReplyLevel,
      user: state.login.user,
      answer: state.ques.answer,
      errMsgOpen: state.newPost.errMsgOpen,
      errMsg: state.newPost.errMsg
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
        answerReplyOpen: (answerId) => {
            dispatch(AnswerReplyOpen(answerId))
        },
        answerReplyClose: () => {
            dispatch(AnswerReplyClose())
        },
        setAnswer: (access_token, answer) => {
            dispatch(SetAnswer(access_token, answer))
        },
        updateAnswer: (answer) => {
            dispatch(UpdateAnswer(answer))
        },
        resetAnswer: () => {
            dispatch(ResetAnswer())
        },
        openErrMsg: (errMsg) => {
            dispatch(ErrMsgOpen(errMsg))
        },
        closeErrMsg: () => {
            dispatch(ErrMsgClose())
        },
        getTS: (access_token, post) => {
            dispatch(GetTS(access_token, post))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnswerReply);