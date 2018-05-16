import React from "react";
import PageBase from "../components/PageBase";
import QuestionPaper from "../components/postPage/questionPaper";
import AnswerPaper from "../components/postPage/answerPaper";
import { connect } from "react-redux";
import {GetQuestion} from "./../actions/questionAction";

class PostPage extends React.Component {

    render() {
        return (
            <div>
                <QuestionPaper
                    question={this.props.question}
                    onRequestDelete={()=>{console.log("_______Delete")}}
                    isTeacher={this.props.isTeacher}
                />
                <AnswerPaper 
                    answers={this.props.answers}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
  return {
	  question: state.ques.post.question,
      answers: state.ques.post.answers,
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

export default connect(mapStateToProps, mapDispatchToProps)(PostPage);
