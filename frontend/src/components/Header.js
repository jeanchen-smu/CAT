import React, { PropTypes } from "react";
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";
import MenuIcon from "material-ui/svg-icons/navigation/menu";
import ExitToAppIcon from "material-ui/svg-icons/action/exit-to-app";
import SettingsIcon from "material-ui/svg-icons/action/settings";
import { white, red600 } from "material-ui/styles/colors";
import { browserHistory } from 'react-router';
import Avatar from 'material-ui/Avatar';
import Badge from 'material-ui/Badge';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import { connect } from "react-redux";
import AccountCircle from "material-ui/svg-icons/action/account-circle";

const styles = {
	appBar: {
		position: "fixed",
		top: 0,
		overflow: "hidden",
		maxHeight: 75
	},
	menuButton: {
		marginLeft: 10
	},
	title: {
		marginLeft: 15,
		cursor: 'pointer',
		width: 100
	},
	logOutButton: {
		marginRight: 15
	}
};

class Header extends React.Component {
	constructor() {
		super();
	}

    logOut(){
        localStorage.removeItem("token");
		browserHistory.push("/cat/login");
    }

	getTitle() {
		return (
			<div style={styles.title}>
				CAT Forum
			</div>
		);
	}

	getRightMenu() {
		return (
			<div>
				<IconButton
					style={styles.menuButton}
					onClick={this.props.handleChangeRequestNavDrawer}
				>
					<AccountCircle color={white}/>
				</IconButton>
				<IconButton style={styles.logOutButton} onClick={this.logOut.bind(this)}>
					<ExitToAppIcon color={white} />
				</IconButton>
			</div>
		);
	}

	handleTouchTap() {
		browserHistory.push("/cat/home")
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

	render() {
		return (
			<AppBar
				style={{ ...this.props.styles, ...styles.appBar }}
				title={this.getTitle()}
				onTitleTouchTap={()=>this.handleTouchTap()}
				iconElementRight={this.getRightMenu()}
			/>
		);
	}
}

Header.propTypes = {
	styles: PropTypes.object,
	handleChangeRequestNavDrawer: PropTypes.func
};

export default Header;
