import React from "react";
import Forum from "./Forum";
import QuestionPaper from "../components/postPage/questionPaper";
import Paper from "material-ui/Paper";
import globalStyles from '../styles';
import NewPost from "./../components/forumPage/newPost";
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import {connect} from 'react-redux';
import {SetPost, GetTopics, CloseSearch, UpdateTopic, GetPosts} from "./../actions/forumAction";
import {SetQaCoins, ResetQaCoins, SetDate, SetDateTime} from "./../actions/newPostAction";
import moment from "moment";
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import axios from "axios";

class DashboardPage extends React.Component {
    constructor(){
        super();
        this.styles = {
            newPostPaper: {
                ...globalStyles.paper,
                marginTop: 10,
                paddingBottom: 65
            },
            newPostButton:{
                float: "right"
            }
        };
    }

    routeToNewPost() {
        if (document.getElementById("newPostTitle")) {
            document.getElementById("newPostTitle").focus()
        }
    }

    tagMenuItems(tags) {
        return tags.map((tag) => (
        <MenuItem
            key={tag.tag_id}
            value={tag.tag_id}
            primaryText={tag.tag}
        />
        ));
    }

    topicMenuItem(topic) {
        return (
            <MenuItem
                key={topic.topic_id}
                value={topic.topic_id}
                primaryText={topic.topic}
            />
        );
    }

    // sessionMenuItem(session) {
    //     return (
    //         <MenuItem
    //             key={session.section_id}
    //             value={session.section_id}
    //             primaryText={session.section_id}
    //         />
    //     )
    // }

    handleTopicChange(event, index, value) {
        this.props.updateTopic({value}.value, this.props.section_id);
        this.props.getPosts(
            sessionStorage.getItem("access_token"),
            {
                topic_id: {value}.value,
                section_id: this.props.section_id,
                userId: this.props.userId
            }
        )
    }

    // handleSectionChange(event, index, value) {
    //     this.props.updateSection({value}.value);
    //     this.props.getPosts(
    //         sessionStorage.getItem("access_token"),
    //         {
    //             topic_id: this.props.topic,
    //             section_id: {value}.value,
    //             userId: this.props.userId
    //         }
    //     )
    // }

    render() {
        return (
            <div>
            <Paper style={globalStyles.paper}>
                <h3 style={globalStyles.title}>
                    Discussion
                    <div style={this.styles.newPostButton}>
                    <RaisedButton
                        label="Search"
                        style={{marginRight:20}}
                        secondary={true}
                        onClick={()=>{
                            if(!this.props.search){
                                this.props.getTopics(sessionStorage.getItem("access_token")),
                                this.props.getSessions(sessionStorage.getItem("access_token"),
                                this.props.userId)
                            }
                            else{
                                this.props.closeSearch()
                            }
                        }}
                    />

                    <RaisedButton
                        label="New Post"
                        secondary={true}
                        onClick={this.routeToNewPost.bind(this)}
                    />
                    </div>
                </h3>
                {this.props.search?
                <div>
                    <br />
                    <Paper style={{paddingLeft: 20}}>
                        <SelectField
                            hintText="Search By Topic"
                            value={this.props.topic}
                            onChange={this.handleTopicChange.bind(this)}
                            style={{marginRight:50}}
                        >
                            <MenuItem
                                key={0}
                                value={0}
                                primaryText="NONE"
                            />
                            {this.props.topics.map(this.topicMenuItem, this)}
                        </SelectField>

                    </Paper>
                </div>:null
                }
                <Divider />
                <Forum />
            </Paper>
            <Paper style={this.styles.newPostPaper}>
                <h3 style={globalStyles.title}>New Post</h3>
                <NewPost />
            </Paper>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
  return {
      stat: state.stat.stat,
      newPost: state.newPost,
      userId: state.login.user.userId,
      topics: state.forum.topics,
      sessions: state.forum.sessions,
      search: state.forum.search,
      topic: state.forum.filter.topic_id,
      session: state.forum.filter.session,
      isTeacher: state.login.user.is_teacher,
      section_id: state.login.user.section_id
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
    resetQaCoins: () => {
        dispatch(ResetQaCoins())
    },
    setDate: (date) => {
        dispatch(SetDate(date))
    },
    setDateTime: (dateTime) => {
        dispatch(SetDateTime(dateTime))
    },
    getTopics: (access_token) => {
        dispatch(GetTopics(access_token))
    },
    // getSessions: (access_token, userId) => {
    //     dispatch(GetSessions(access_token, userId))
    // },
    closeSearch: () => {
        dispatch(CloseSearch())
    },
    updateTopic: (topic, section) => {
        dispatch(UpdateTopic(topic, section))
    },
    // updateSection: (section) => {
    //     dispatch(UpdateSection(section))
    // },
    getPosts: (access_token, filter) => {
        dispatch(GetPosts(access_token, filter))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
