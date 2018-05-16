import React, { PropTypes } from "react";
import IconButton from "material-ui/IconButton";
import Badge from 'material-ui/Badge';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';

class Notification extends React.Component {
    render() {
        return (
            <IconButton
                style={styles.menuButton}
                onClick={this.handleTouchTap}
            >
                <NotificationsIcon color={white}/>
                <Badge
                    badgeContent={4}
                    primary={true}
                    badgeStyle={{top: -30, right: -2, backgroundColor: red600}}
                />
            </IconButton>
        )
    }
}