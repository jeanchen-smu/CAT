import React, { PropTypes } from "react";
import Delete from "material-ui/svg-icons/action/delete";
import FlatButton from 'material-ui/FlatButton';
import {connect} from "react-redux";
import {AddTagOpen, AddTagClose} from './../../actions/navAction';
import {SelectNewTags, AddNewTag} from './../../actions/questionAction';
import Dialog from 'material-ui/Dialog';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import axios from "axios";

class AddTag extends React.Component {
    constructor() {
        super();
        this.styles = {
            addTagButton: {
                marginLeft: 20
            }
        };
        this.tags = [];
    }

    menuItems(values) {
        return this.tags.map((tag) => (
        <MenuItem
            key={tag.tag_id}
            value={tag.tag_id}
            primaryText={tag.tag}
        />
        ));
    }

    componentDidMount(){
        const getTagObj = {
            method: "post",
                url: "/cat/api/get_tags",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + sessionStorage.getItem("access_token")
                },
                data: {
                    post_id: this.props.questionId
                }
        }
        axios(getTagObj)
            .then(response => {
                this.tags = response.data
            })
            .catch(err => {
                this.tags = []
            })
    }

    handleTagChange(event, index, value) {
        this.props.selectNewTags({value}.value);
    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={()=>this.props.addTagClose()}
            />,
            <FlatButton
                label="Add"
                primary={true}
                keyboardFocused={true}
                onClick={()=>{this.props.addNewTag(
                    sessionStorage.getItem("access_token"),
                    {
                        post_id: this.props.questionId,
                        questionId: this.props.questionId,
                        tag_id: this.props.newTags,
                        userId: this.props.userId
                    }
                );
                this.props.addTagClose()}}
            />,
        ];  
        return (
            <FloatingActionButton 
                style={this.styles.addTagButton}
                mini={true}
                disabled={this.props.tags.length==3}
                onClick={()=>this.props.addTagOpen()}
            >
            <ContentAdd />
            <Dialog
                title="Add New Tags"
                actions={actions}
                modal={false}
                open={this.props.nav.addTag}
                onRequestClose={()=>this.props.addTagClose()}
            >
                <SelectField
                    hintText="Select new tags"
                    value={this.props.newTags}
                    onChange={this.handleTagChange.bind(this)}
                >
                    {this.menuItems(this.props.newTags)}
                </SelectField>
            </Dialog>
            </FloatingActionButton>
        )
    }
}

const mapStateToProps = (state) => {
  return {
	  nav: state.nav,
      newTags: state.ques.newTags,
      questionId: state.ques.post.question.questionId,
      userId: state.login.user.userId,
      tags: state.ques.post.question.tags
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addTagOpen: () => {
            dispatch(AddTagOpen())
        },
        addTagClose: () => {
            dispatch(AddTagClose())
        },
        selectNewTags: (tags) => {
            dispatch(SelectNewTags(tags))
        },
        addNewTag: (access_token, post) => {
            dispatch(AddNewTag(access_token, post))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTag);
