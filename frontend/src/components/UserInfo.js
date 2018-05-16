import React, {PropTypes} from "react";
import {
    Card,
    CardActions,
    CardHeader,
    CardText,
    Tabs,
    Tab
} from "material-ui/Tabs";
import SwipeableViews from "react-swipeable-views";
import {
    cyan600,
    pink600,
    purple600,
    orange600,
    red600,
    blue600,
    yellow900,
    white,
    blue900
} from "material-ui/styles/colors";
import Alarm from "material-ui/svg-icons/action/alarm";
import Ranking from "./Ranking";
import Equalizer from "material-ui/svg-icons/av/equalizer";
import AccountCircle from "material-ui/svg-icons/action/account-circle";
import MyStats from "./MyStats"

const styles = {
    slide: {
        padding: 10
    },
    tab: {
        color: white,
        backgroundColor: blue600,
        height: 58
    },
    inkBar: {
        background: blue900
    }
};

class UserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            slideIndex: 0
        };
    }

    handleChange = value => {
        this.setState({
            slideIndex: value
        });
    };

    render() {
        return (
            <div>
                <Tabs
                    onChange={this.handleChange}
                    value={this.state.slideIndex}
                    inkBarStyle={styles.inkBar}
                    tabItemContainerStyle={{height:60}}
                >
                    <Tab 
                    icon={<AccountCircle/>}
                    label="My Stats" value={0}  
                    style={styles.tab} 
                    buttonStyle={{height:60}}/>
                    <Tab 
                    icon={<Equalizer/>}
                    label="Ranking" 
                    value={1}  
                    style={styles.tab} 
                    buttonStyle={{height:60}}/>
                </Tabs>
                <SwipeableViews
                    index={this.state.slideIndex}
                    onChangeIndex={this.handleChange}
                >
                    <div style={styles.slide}>
                        <MyStats {...this.props}/>
                    </div>
                    <div style={styles.slide}>
                        <Ranking {...this.props}/>
                    </div>
                </SwipeableViews>
            </div>
        );
    }
}

export default UserInfo