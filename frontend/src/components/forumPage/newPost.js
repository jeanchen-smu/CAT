import React, {PropTypes} from "react";;
import TextField from "material-ui/TextField";
import Paper from "material-ui/Paper";
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import moment from 'moment';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {connect} from 'react-redux';
import {SetPost, GetTS} from "./../../actions/forumAction";
import {SetQaCoins, 
        SetDate, 
        SetDateTime,
        ResetNewPost,
        ErrMsgOpen,
        ErrMsgClose} from "./../../actions/newPostAction";
import NewPostDialog from "./../newPostDialog";
import CircularProgress from 'material-ui/CircularProgress';

class NewPost extends React.Component {
    constructor(){
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
                marginTop:15,
                float: 'right'
            },
            selectField: {
                marginTop:-10,
                float: 'left',
                width: 80
            },
            datePicker: {
                marginTop:-10,
                float: 'left',
                width: 150,
                marginLeft: 10
            }
        }
    }

    handleChange = (event, index, value) => this.props.setQaCoins({value});

    postObject() {
        return{
            qacoins: this.props.qacoins,
            subject: document.getElementById("newPostTitle").value,
            content: document.getElementById("newPostContent").value,
            userId: this.props.userId,
            dateTime: this.props.dateTime
        }
    }

    handleNewPostSub() {
        if(!document.getElementById("newPostTitle").value|
            document.getElementById("newPostTitle").value==""){
            this.props.openErrMsg("Please fill in post title!")
            return
        }
        if(!document.getElementById("newPostContent").value|
            document.getElementById("newPostContent").value==""){
            this.props.openErrMsg("Please fill in post content!")
            return
        }
        if (!this.props.qacoins==null) {
            this.props.openErrMsg("Please fill in QAcoins!")
            return
        }
        if (!this.props.dateTime) {
            this.props.openErrMsg("Please fill in Time Limit!")
            return
        }
        if (this.props.qacoins>this.props.ownedQacoins){
            this.props.openErrMsg("You do not enough QA Coins!")
            return
        }
        if (new Date(this.props.dateTime) < new Date()){
            this.props.openErrMsg("Please specify a timelimit that is later than now!")
            return
        }
        this.props.getTS(
            sessionStorage.getItem("access_token"),
            this.postObject()
        );
        document.getElementById("newPostTitle").value = "";
        document.getElementById("newPostContent").value = "";
        document.getElementById("timeLimit").value = "";
    }

    qacoinsMenuItem(value){
        return (
            <MenuItem value={value} primaryText={value.toString()} />
        )
    }

    qacoinsArray(max_value){
        var qacoinsArray=[];
        for (var i = 0; i < max_value; i++){
            qacoinsArray.push(i)
        }
        return qacoinsArray
    }

    render(){
        return (
        <div>
            <Paper zDepth={1}>
            <TextField
                style={this.styles.textField}
                name="title"
                id="newPostTitle"
                ref="newPostTitle"
                hintText="Title"
                floatingLabelText="Title"
                fullWidth={true}
                underlineShow={false}
            />
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
            />
            </Paper>
            <SelectField
                floatingLabelText="QA Coins"
                style={this.styles.selectField}
                value={this.props.qacoins}
                onChange={this.handleChange}
            >
                {this.qacoinsArray(21).map(this.qacoinsMenuItem, this)}   
            </SelectField>
            <TextField 
                style={this.styles.datePicker}
                value={this.props.dateTime}
                id="timeLimit"
                onClick={()=>{this.refs.datepicker.openDialog()}}
                hintText="Time Limit"
                floatingLabelText="Time Limit"
            />
            <DatePicker
                ref="datepicker"
                style={{ display: 'none' }}
                onChange={(x, event)=>{
                    this.props.setDate(event);
                    this.refs.timepicker.openDialog();
                    }}
            />
            <TimePicker
                ref="timepicker"
                style={{ display: 'none' }}
                onChange={(x, event)=>{
                    this.props.setDateTime(
                        moment({
                            year: moment(this.props.date).year(),
                            month: moment(this.props.date).month(),
                            day: moment(this.props.date).date(),
                            hour: moment(event).hours(),
                            minute: moment(event).minutes()
                        }).format("YYYY-MM-DD HH:mm:ss")
                        );
                }}
            />
            <RaisedButton 
                label="Post"
                style={this.styles.submitButton}
                onClick={()=>{this.handleNewPostSub()}}
            />
            <Dialog
                title="New Post Not Created"
                modal={false}
                open={this.props.errMsgOpen}
                onRequestClose={()=>this.props.closeErrMsg()}
            >
                {this.props.errMsg}
            </Dialog>
            <NewPostDialog />
        </div>
        )
    }
}

const mapStateToProps = (state) => {
  return {
      date: state.newPost.date,
      userId: state.login.user.userId,
      dateTime: state.newPost.dateTime,
      qacoins: state.newPost.qacoins.value,
      errMsgOpen: state.newPost.errMsgOpen,
      errMsg: state.newPost.errMsg,
      ownedQacoins: state.stat.stat.qacoins
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
	setPost: (access_token, filter, post) => {
        dispatch(SetPost(access_token, filter,post))
    },
    setQaCoins: (qacoins) => {
        dispatch(SetQaCoins(qacoins))
    },
    resetNewPost: () => {
        dispatch(ResetNewPost())
    },
    setDate: (date) => {
        dispatch(SetDate(date))
    },
    setDateTime: (dateTime) => {
        dispatch(SetDateTime(dateTime))
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewPost);