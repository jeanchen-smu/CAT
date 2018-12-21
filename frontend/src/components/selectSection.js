import React, { PropTypes } from "react";
import {connect} from "react-redux";
import {UpdateSection} from './../actions/loginAction';
import {GetPosts} from './../actions/forumAction';
import {GetMyStats} from './../actions/statAction';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class SelectSection extends React.Component {

    sectionMenuItem(section) {
        return (
            <MenuItem
                key={section.section_id}
                value={section.section_id}
                primaryText={section.section_id}
            />
        )
    }

    handleSectionChange(event, index, value) {
        this.props.updateSection({value}.value);
        this.props.getMyStats(
            sessionStorage.getItem("access_token"),
            this.props.userId,
            {value}.value
        );
        this.props.getPosts(
            sessionStorage.getItem("access_token"),
            {
                topic_id: this.props.topic,
                section_id: {value}.value,
                userId: this.props.userId
            }
        )
    }

    render() {
        
        return (
            <SelectField
                hintText="Select Section"
                value={this.props.sectionId}
                onChange={this.handleSectionChange.bind(this)}
                style={{width: 150}}
            >
                {this.props.userSections.map(this.sectionMenuItem, this)}
            </SelectField>
        )
    }
}

const mapStateToProps = (state) => {
  return {
      sectionId: state.login.user.section_id,
      userId: state.login.user.userId,
      userSections: state.login.user.userSections,
      topic: state.forum.filter.topic_id,
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateSection: (section) => {
            dispatch(UpdateSection(section))
        },
        getPosts: (access_token, filter) => {
            dispatch(GetPosts(access_token, filter))
        },
        getMyStats: (access_token, userId, section_id) => {
            dispatch(GetMyStats(access_token, userId, section_id))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectSection);