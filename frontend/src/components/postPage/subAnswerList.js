import React, { PropTypes } from "react";
import Avatar from 'material-ui/Avatar';
import {connect} from 'react-redux';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import {grey100, grey400, darkBlack, lightBlack,blue300} from 'material-ui/styles/colors';
import IconButton from "material-ui/IconButton";
import TextField from "material-ui/TextField";
import Paper from "material-ui/Paper";
import RaisedButton from 'material-ui/RaisedButton';
import {AnswerReplyOpen, AnswerReplyClose} from './../../actions/navAction';
import {SetAnswer,UpdateAnswer, ResetAnswer} from "../../actions/questionAction";
import Dialog from 'material-ui/Dialog';
import {ErrMsgOpen,
        ErrMsgClose} from "./../../actions/newPostAction";
import QuestionThoughtfulness from "./questionThoughtfulness";
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {GetTS} from "./../../actions/forumAction";
import NewPostDialog from "./../newPostDialog";
import Vote from "./vote";

class SubAnswer extends React.Component {
    constructor() {
        super();
        this.styles = {
            textField: {
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop:5
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

    renderSubAnswerContent(pUserName) {
        return (
              <span style={{color: darkBlack}}>@ {pUserName}: </span>
        )
    }

    renderSubAnswerReply(){
        return (
            <div>
                <Paper 
                    zDepth={1}
                >
                <TextField
                    style={this.styles.textField}
                    name="subAnswerReply"
                    ref="subAnswerReply"
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
        )
    }

    handleSubanswerReply(answer) {
        if (this.props.nav.answerReply==answer.answerId){
            this.props.answerReplyClose();
            this.props.resetAnswer();
        }else{
            this.props.answerReplyOpen(answer);
        }
    }

    handleAnswerChange = (e) => {
        this.props.updateAnswer(e.target.value);
    }

    getShortForm(username){
        if(username){
            var fields = username.split(" ");
            var sf_username = fields[0][0].toUpperCase()
            if (fields.length > 1){
            sf_username = sf_username + fields[1][0].toUpperCase()
            }
            return sf_username
        }
        return username
    }
    
    renderSubAnswerListItem(subAnswer) {
        const styles = {
            answerCard: {
                marginTop: 5,
                paddingBottom: (this.props.nav.answerReply==subAnswer.answerId)?35:55,
                backgroundColor: grey100,
                marginLeft:(subAnswer.level-3)*20
            }
        }
        return (
            <Card 
                style={styles.answerCard}
                key={subAnswer.answerId}
            >
                <CardHeader
                    title={subAnswer.aUserName}
                    subtitle={subAnswer.postDate}
                    avatar={<Avatar>{this.getShortForm(subAnswer.aUserName)}</Avatar>}
                    />
                <CardText>
                    {this.renderSubAnswerContent(subAnswer.pUserName)}
                    {subAnswer.content}
                </CardText>
                <CardActions style={{float: "right"}}>
                    <div>
                    <span>
                    <Vote 
                        upvotes={subAnswer.upvotes} 
                        downvotes={subAnswer.downvotes} 
                        uservote={subAnswer.uservote}
                        post_id={subAnswer.answerId}/>
                    </span>
                    <span>
                    <RaisedButton 
                        label={this.props.nav.answerReply === subAnswer.answerId?"Cancel":"Reply"}
                        onClick={()=>{this.handleSubanswerReply({
                            answerId:subAnswer.answerId,
                            level: subAnswer.level
                        })}}
                    />
                    </span>
                    </div>
                </CardActions>
                <NewPostDialog />
                {
                    this.props.isTeacher?<QuestionThoughtfulness post={{
                    post_id: subAnswer.answerId,
                    thoughtfulness_score: subAnswer.thoughtfulness_score,
                    reviewed: subAnswer.reviewed
                    }}/>:null
                }
                
                {this.props.nav.answerReply === subAnswer.answerId?
                    <CardText style={{marginTop:40}}>{this.renderSubAnswerReply()}</CardText> :null
                }
                 
            </Card>
        )
    }

    render(){
        return (
            <List>
                {this.props.subAnswer.map(this.renderSubAnswerListItem,this)}
            </List>
        )
    }
};

SubAnswer.propTypes = {
    subAnswer: PropTypes.array
};

const mapStateToProps = (state) => {
  return {
	  nav: state.nav,
      questionId: state.ques.post.question.questionId,
      parentId: state.nav.answerReply,
      level: state.nav.answerReplyLevel,
      user: state.login.user,
      answer: state.ques.answer,
      errMsgOpen: state.newPost.errMsgOpen,
      errMsg: state.newPost.errMsg,
      isTeacher: state.login.user.is_teacher
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

export default connect(mapStateToProps, mapDispatchToProps)(SubAnswer);