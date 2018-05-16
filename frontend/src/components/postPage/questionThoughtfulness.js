import React, { PropTypes } from "react";
import FaCheck from "react-icons/lib/fa/check";
import FlatButton from 'material-ui/FlatButton';
import {connect} from "react-redux";
import {DeleteQuestionOpen, DeleteQuestionClose} from './../../actions/navAction';
import {StartThoughtfulness, 
        EndThoughtfulness, 
        SetThoughtfulness,
        UpdateThoughtfulness} from './../../actions/questionAction';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

class QuestionThoughtfulness extends React.Component {
    constructor() {
        super();
        this.styles = {
            deletButton: {
                float: "right"
            }
        }
    }

    renderDropDownMenu(thoughtfulness) {
        return (
            <MenuItem 
                value = {thoughtfulness}
                primaryText = {thoughtfulness}
            />
        )
    }

    handleChange = (event, index, value) => this.props.setThoughtfulness({value}.value);

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={()=>this.props.endThoughtfulness()}
            />,
            <FlatButton
                label="Confirm"
                primary={true}
                keyboardFocused={true}
                onClick={()=>{this.props.updateThoughtfulness(
                    sessionStorage.getItem("access_token"),
                    {post_id: this.props.new_thoughtfulness.post_id,
                    thoughtfulness: this.props.new_thoughtfulness.thoughtfulness,
                    questionId: this.props.questionId,
                    userId: this.props.userId})}}
            />,
        ];
        return (
            <div>
            <TextField
                defaultValue={this.props.post.thoughtfulness_score}
                floatingLabelText="Thougthfulness"
                hintText="Thougthfulness"
                disabled={this.props.post.reviewed}
                onClick={()=>{this.props.startThoughtfulness(this.props.post)}}
            />
            <Dialog
                title="Set New Thoughtfulness"
                actions={actions}
                modal={false}
                open={this.props.new_thoughtfulness.post_id!=null}
                onRequestClose={()=>this.props.endThoughtfulness()}
            >
                <SelectField
                    floatingLabelText="Thoughfulness"
                    value={this.props.new_thoughtfulness.thoughtfulness}
                    onChange={this.handleChange}
                >
                    {[0,1,2,3,4,5].map(this.renderDropDownMenu, this)}
                </SelectField>
            </Dialog>
            </div>
        )
    }
}

QuestionThoughtfulness.propTypes = {
    post: PropTypes.object
}

const mapStateToProps = (state) => {
  return {
	  nav: state.nav,
      new_thoughtfulness: state.ques.new_thoughtfulness,
      questionId: state.ques.post.question.questionId,
      userId: state.login.user.userId
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
        startThoughtfulness: (post) => {
            dispatch(StartThoughtfulness(post))
        },
        setThoughtfulness: (thoughtfulness) => {
            dispatch(SetThoughtfulness(thoughtfulness))
        },
        endThoughtfulness: () => {
            dispatch(EndThoughtfulness())
        },
        updateThoughtfulness: (access_token, post) => {
            dispatch(UpdateThoughtfulness(access_token, post))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionThoughtfulness);