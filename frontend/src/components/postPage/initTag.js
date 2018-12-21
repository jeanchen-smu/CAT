import React, { PropTypes } from "react";
import FlatButton from 'material-ui/FlatButton';
import {connect} from "react-redux";
import Tag from "./tag"
import {InitTagOpenClick} from './../../actions/questionAction';
import Dialog from 'material-ui/Dialog';
import {DeleteTag} from './../../actions/questionAction';


class InitTag extends React.Component {

    render() {
        const actions = [
            <FlatButton
                label="Confirm Tags"
                primary={true}
                onClick={()=>this.props.initTagOpenClick()}
            />
        ];  
        return (
            <Dialog
                title="Select Tags"
                actions={actions}
                modal={false}
                open={this.props.nav}
            >
                <Tag
                    tags={this.props.tags}
                    isUser={true}
                    onRequestDelete={this.props.deleteTag}
                    questionId={this.props.questionId}
                    userId={this.props.userId}
                />
            </Dialog>
        )
    }
}

const mapStateToProps = (state) => {
  return {
      nav: state.ques.initTag,
      questionId: state.ques.post.question.questionId,
      userId: state.login.user.userId,
      tags: state.ques.post.question.tags
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
        initTagOpenClick: () => {
            dispatch(InitTagOpenClick())
        },
        deleteTag: (access_token, post) => {
            dispatch(DeleteTag(access_token, post))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InitTag);