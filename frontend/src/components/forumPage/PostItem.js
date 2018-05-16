import React, {PropTypes} from "react";

import CommentsIcon from 'react-icons/lib/fa/comments';
import DollarIcon from 'react-icons/lib/fa/dollar';
import FaSearch from 'react-icons/lib/fa/search';
import EuroSymbol from "material-ui/svg-icons/action/euro-symbol";
import {List, ListItem} from 'material-ui/List';
import { Link, styles } from 'refire-app';
import Avatar from 'material-ui/Avatar';
import {
    yellowA700,
    tealA700,
    blueA700,
    grey400,
    blue300
} from "material-ui/styles/colors";
import {GetQuestion} from "./../../actions/questionAction";
import { connect } from "react-redux";
import Divider from 'material-ui/Divider';


class PostItem extends React.Component {

    constructor() {
        super();
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

    handleReadReq = (questionId, userId) => {
        this.props.getQuestion(
            sessionStorage.getItem("access_token"),
            questionId,
            userId
        );
    }

    renderPostItem(props) {
        return (
            <div key = {props.key}>
            <ListItem
                leftIcon={<EuroSymbol color={(props.qacoins==0)?grey400:yellowA700}/>}
                rightAvatar={<Avatar>{this.getShortForm(props.username)}</Avatar>}
                primaryText={<a onClick={()=>this.handleReadReq(props.key,this.props.userId)}>
                    {props.subject}</a>}
                secondaryText={<div>
                    <span>{props.date} &nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <span style={{paddingRight: 10}}><CommentsIcon color={blue300}/> {props.commentCounts} </span>
                    {
                        (props.qacoins>0)?
                            <span style={{paddingRight: 10}}>
                            <DollarIcon color={yellowA700}/>{props.qacoins}
                            </span>:null
                    }
                    {
                        this.props.isTeacher?<span><FaSearch color={(props.reviewCounts>0)?yellowA700:grey400}/>{
                            props.reviewCounts}</span>:null
                    }
                    </div>}
            />
            <Divider />
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.props.posts.map(this.renderPostItem, this)}
            </div>
        );
    }
}

PostItem.propTypes = {
    posts: PropTypes.array
};

const mapStateToProps = (state) => {
  return {
	  question: state.ques.post.question,
      answers: state.ques.post.answers,
      userId: state.login.user.userId,
      isTeacher: state.login.user.is_teacher
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
	getQuestion: (access_token, key, userId) => {
            dispatch(GetQuestion(access_token, key, userId))
        }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostItem);
