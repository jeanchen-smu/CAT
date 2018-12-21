import React, { PropTypes } from "react";
import Paper from "material-ui/Paper";
import Divider from 'material-ui/Divider';
import QuestionCard from './questionCard';
import globalStyles from '../../styles';
import QuestionDelete from "./questionDelete";
import QuestionThoughtfulness from "./questionThoughtfulness";
import InitTag from "./initTag";

const QuestionPaper = props => {
    return (
      <Paper style={globalStyles.paper}>
          <h3 style={globalStyles.title}>Question</h3>
          {props.isTeacher?<QuestionThoughtfulness post={{
              post_id: props.question.questionId,
              thoughtfulness_score: props.question.thoughtfulness_score,
              reviewed: props.question.reviewed
          }}/>:null}
          <QuestionCard
            username={props.question.username}
            date={props.question.date}
            subject={props.question.subject}
            question={props.question.question}
            tags={props.question.tags}
            isUser={props.question.isUser}
            onRequestDelete={props.onRequestDelete}
            upvotes={props.question.upvotes}
            downvotes={props.question.downvotes}
            uservote={props.question.uservote}
          />
	  <InitTag/>
      </Paper>
    )
};

QuestionPaper.propTypes = {
    question: PropTypes.object,
    onRequestDelete: PropTypes.func,
    isTeacher: PropTypes.any
};

export default QuestionPaper;
