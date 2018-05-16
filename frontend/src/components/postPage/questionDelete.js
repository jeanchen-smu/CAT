import React, { PropTypes } from "react";
import Delete from "material-ui/svg-icons/action/delete";
import FlatButton from 'material-ui/FlatButton';
import {connect} from "react-redux";
import {DeleteQuestionOpen, DeleteQuestionClose} from './../../actions/navAction';
import Dialog from 'material-ui/Dialog';

class QuestionDelete extends React.Component {
    constructor() {
        super();
        this.styles = {
            deletButton: {
                float: "right"
            }
        }
    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={()=>this.props.deleteQuestionClose()}
            />,
            <FlatButton
                label="Delete"
                primary={true}
                keyboardFocused={true}
                onClick={()=>this.props.deleteQuestionClose()}
            />,
        ];
        return (
            <div>
            <FlatButton 
                label="Delete" 
                icon={<Delete />} 
                style={this.styles.deletButton}
                onClick={()=>this.props.deleteQuestionOpen()}
            />
            <Dialog
                title="Delete"
                actions={actions}
                modal={false}
                open={this.props.nav.questionDelete}
                onRequestClose={()=>this.props.deleteQuestionClose()}
            >
                Are you sure to delete this post?
            </Dialog>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
  return {
	  nav: state.nav
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
        deleteQuestionOpen: () => {
            dispatch(DeleteQuestionOpen())
        },
        deleteQuestionClose: () => {
            dispatch(DeleteQuestionClose())
        }  
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionDelete);