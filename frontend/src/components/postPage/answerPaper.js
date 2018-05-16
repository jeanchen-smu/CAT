import React, { PropTypes } from "react";
import Paper from "material-ui/Paper";
import Divider from 'material-ui/Divider';
import AnswerCard from './answerCard';
import globalStyles from '../../styles';

class AnswerPaper extends React.Component {

    constructor() {
        super();
        this.styles = {
            answerPaper: {
                ...globalStyles.paper,
                marginTop: 10
            }
        }
    }

    renderAnswerCard(data) {
        return (
            <AnswerCard
                key={data.answerId}
                username={data.username}
                date={data.date}
                answer={data.answer}
                answerId={data.answerId}
                subAnswer={data.subAnswer}
                level={data.level}
                thoughtfulness_score={data.thoughtfulness_score}
                reviewed={data.reviewed}
                upvotes={data.upvotes}
                downvotes={data.downvotes}
                uservote={data.uservote}
          />
        );
    }

    render() {
        const {answers} = this.props
        return (
            <Paper style={this.styles.answerPaper}>
                <h3 style={globalStyles.title}>Answers</h3>
                {answers.map(this.renderAnswerCard, this)}
            </Paper>
        );
    }
}

AnswerPaper.propTypes = {
    answers: PropTypes.array
};

export default AnswerPaper;
