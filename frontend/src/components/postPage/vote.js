import React, { PropTypes } from "react";
import ThumbsDown from 'react-icons/lib/fa/thumbs-o-down'; 
import ThumbsUp from 'react-icons/lib/fa/thumbs-o-up'; 
import FaThumbsUp from 'react-icons/lib/fa/thumbs-up';
import FaThumbsDown from 'react-icons/lib/fa/thumbs-down';
import {blue400} from "material-ui/styles/colors";
import IconButton from "material-ui/IconButton";
import {VoteClick} from './../../actions/questionAction';
import {connect} from 'react-redux';

class Vote extends React.Component {
    voteObj(vote) {
        return {
            questionId: this.props.questionId,
            post_id: this.props.post_id,
            avatar_id: this.props.userId,
            vote: vote
        }
    }

    upVoteClick() {
        if (this.props.uservote==1){
            this.props.voteClick(
            sessionStorage.getItem("access_token"),
            this.voteObj(0)
        )
    }
        else if(!this.props.uservote){
            this.props.voteClick(
            sessionStorage.getItem("access_token"),
            this.voteObj(1)
        )
        }
    
    }

    downVoteClick() {
         if (this.props.uservote==2){
            this.props.voteClick(
            sessionStorage.getItem("access_token"),
            this.voteObj(0)
        )
    }
        else if(!this.props.uservote){
            this.props.voteClick(
            sessionStorage.getItem("access_token"),
            this.voteObj(2)
        )
        }
    }

    render() {
        return (
            <span style={{paddingRight: 15, marginBottom: 30}}>
                <span style={{paddingRight: 15}}>
                    <IconButton 
                        iconStyle={{paddingBottom: 15}}
                        onClick={()=>{this.upVoteClick()}}
                    >
                        {
                            this.props.uservote == 1?
                            <FaThumbsUp color={blue400} size={25} />:
                            <ThumbsUp color={blue400} size={25} />       
                        }
                    </IconButton>
                    <span>
                    {this.props.upvotes}
                    </span>
                </span>
                {/*<span style={{paddingRight: 15}}>
                    <IconButton 
                        iconStyle={{paddingBottom: 10}}
                        onClick={()=>{this.downVoteClick()}}
                    >
                        {
                            this.props.uservote == 2?
                            <FaThumbsDown color={blue400} size={25} />:
                            <ThumbsDown color={blue400} size={25} />       
                        }
                    </IconButton>
                    {this.props.downvotes}
                </span>*/}
            </span>
        );
    }
}

Vote.propTypes = {
    upvotes: PropTypes.any,
    downvotes: PropTypes.any,
    uservote: PropTypes.any,
    post_id: PropTypes.any
};

const mapStateToProps = (state) => {
  return {
	  errorVote: state.nav.errorVote,
      questionId: state.ques.post.question.questionId,
      userId: state.login.user.userId
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
        voteClick: (access_token, vote) => {
            dispatch(VoteClick(access_token, vote))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Vote);