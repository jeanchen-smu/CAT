import React, { PropTypes } from "react";
import Chip from 'material-ui/Chip';
import AddTag from './addTag';

class Tag extends React.Component {

    constructor() {
        super();
        this.styles = {
            chip: {
                margin: 4,
            },
            wrapper: {
                display: 'flex',
                flexWrap: 'wrap',
            },
        };
    }

    renderChip(data) {
        return (
            <Chip
                key={data.key}
                style={this.styles.chip}
                onRequestDelete={this.props.isUser?
                ()=>{this.props.onRequestDelete(
                    sessionStorage.getItem("access_token"),
                    {
                        post_id: this.props.questionId,
                        questionId: this.props.questionId,
                        userId: this.props.userId,
                        tag_id: data.key
                    })}:null}
            >
                {data.label}
            </Chip>
        );
    }

    render() {
        return (
            <div style={this.styles.wrapper}>
                {this.props.tags.map(this.renderChip, this)}
                {this.props.isUser?<AddTag />:null}
                
            </div>
        );
    }
}

Tag.propTypes = {
    tags: PropTypes.array,
    isUser: PropTypes.bool,
    onRequestDelete: PropTypes.func,
    questionId: PropTypes.any,
    userId: PropTypes.any
};

export default Tag;
