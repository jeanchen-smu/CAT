import React, { PropTypes } from "react";
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Paper from "material-ui/Paper";
import {
    yellowA700,
    tealA700,
    blueA700
} from "material-ui/styles/colors";
import LightbulbOutline from "material-ui/svg-icons/action/lightbulb-outline";
import EuroSymbol from "material-ui/svg-icons/action/euro-symbol";
import Equalizer from "material-ui/svg-icons/av/equalizer";
import GetMyStats from "./../actions/statAction";

const styles = {
    avatar: {
        fontSize: 15
    }
};


class MyStats extends React.Component {

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

  render(){
    return (
      <Paper>
        <List>
          <ListItem
            leftAvatar={<Avatar>{this.getShortForm(this.props.stat.username)}</Avatar>}
            primaryText="User Name"
            secondaryText={this.props.stat.username}
          />
          <Divider />
          <ListItem
            primaryText="Section ID"
            secondaryText={this.props.stat.section_id}
            leftIcon={<Equalizer/>}
          />
          <ListItem
            primaryText="Thoughfulness"
            secondaryText={this.props.stat.thoughfulness}
            leftIcon={<LightbulbOutline />}
          />
          <ListItem
            primaryText="QA Coins"
            secondaryText={this.props.stat.qacoins}
            leftIcon={<EuroSymbol/>}
          />
          <ListItem
            primaryText="My Ranking"
            secondaryText={this.props.stat.ranking}
            leftIcon={<Equalizer/>}
          />
        </List>
      </Paper>
    )
  }  
};

MyStats.propTypes = {
    stat: PropTypes.object
};

export default MyStats