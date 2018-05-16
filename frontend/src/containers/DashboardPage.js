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

    handleTopicChange(event, index, value) {
        this.props.updateTopic({value}.value);
        this.props.getPosts(
            sessionStorage.getItem("access_token"),
            {value}.value!=0?{
                topic_id: {value}.value,
		userId: sessionStorage.getItem("userId")
          }:{userId: sessionStorage.getItem("userId")} 
        )
    }

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
                                this.props.getTopics(sessionStorage.getItem("access_token"))
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
      search: state.forum.search,
      topic: state.forum.filter.topic_id
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
    closeSearch: () => {
        dispatch(CloseSearch())
    },
    updateTopic: (topic) => {
        dispatch(UpdateTopic(topic))
    },
    getPosts: (access_token, filter) => {
        dispatch(GetPosts(access_token, filter))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
