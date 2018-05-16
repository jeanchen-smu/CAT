import React, { PropTypes } from "react";
import TextField from "material-ui/TextField";
import Paper from "material-ui/Paper";
import RaisedButton from 'material-ui/RaisedButton';
import {SetAnswer} from "../../actions/questionAction";
import {QuestionReplyOpen} from "../../actions/navAction";
import {connect} from "react-redux";
import {ErrMsgOpen,
        ErrMsgClose} from "./../../actions/newPostAction";
import {GetTS} from "./../../actions/forumAction";

class QuestionReply extends React.Component {

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

    answerObj() {
        return {
            questionId: this.props.questionId,
            userId: this.props.user.userId,
            content: this.refs.questionReply.getValue(),
            level: 2,
            parentId: this.props.questionId,
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
            this.answerObj()
        );
        this.refs.questionReply.value = "";
        this.props.questionReplyOpen();
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
                />
                </Paper>
                <RaisedButton 
                    label="Reply"
                    style={this.styles.submitButton} 
                    onClick={()=>this.handleAnswerRelpySub()}
                />
            </div>
        );
    }
}
const mapStateToProps = (state) => {
  return {
	  user: state.login.user,
      questionId: state.ques.post.question.questionId
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
	setAnswer: (access_token, answer) => {
            dispatch(SetAnswer(access_token, answer))
        },
    questionReplyOpen: () => {
        dispatch(QuestionReplyOpen())
    },
    openErrMsg: (errMsg) => {
        dispatch(ErrMsgOpen(errMsg))
    },
    getTS: (access_token, post) => {
        dispatch(GetTS(access_token, post))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionReply);