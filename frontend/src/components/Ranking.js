import React, { PropTypes } from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import Paper from "material-ui/Paper";
import {
    yellowA700,
    tealA700,
    blueA700
} from "material-ui/styles/colors";

const styles = {
    avatar: {
        fontSize: 15
    }
};

class Ranking extends React.Component {

    getShortForm(username){
        var fields = username.split(" ");
        var sf_username = fields[0][0].toUpperCase()
        if (fields.length > 1){
          sf_username = sf_username + fields[1][0].toUpperCase()
        }
        return sf_username
    }

    renderRankingListItem(ranking) {
        return (
            <ListItem
              primaryText={ranking.username}
              leftAvatar={<Avatar>{ranking.username?this.getShortForm(ranking.username):null}</Avatar>}
              rightAvatar={<Avatar backgroundColor={yellowA700}>{ranking.ranking}</Avatar>}
            />
        )
    }

    render() {
        return (
            <Paper>
              <List>
                {this.props.rankings.map(this.renderRankingListItem,this)}
              </List>
              <Divider />
              <List>
                <Subheader>My Ranking</Subheader>
                <ListItem
                  primaryText={this.props.stat.username}
                  leftAvatar={<Avatar>{this.props.stat.username?this.getShortForm(this.props.stat.username):null}</Avatar>}
                  rightAvatar={<Avatar>{this.props.stat.ranking}</Avatar>}
                />
              </List>
            </Paper>
        );
    }
}

Ranking.propTypes = {
  rankings: PropTypes.array,
  stat: PropTypes.object
}

export default Ranking;