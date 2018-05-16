import React, { PropTypes } from "react";
import Drawer from "material-ui/Drawer";
import { white, amber700, cyan100 } from "material-ui/styles/colors";
import { Link } from "react-router";
import { List, ListItem } from "material-ui/List";

import Assessment from "material-ui/svg-icons/action/assessment";
import GpsFixed from "material-ui/svg-icons/device/gps-fixed";
import Timer from "material-ui/svg-icons/image/timer";
import PinDrop from "material-ui/svg-icons/maps/pin-drop";
import Grade from "material-ui/svg-icons/action/grade";
import Warning from "material-ui/svg-icons/alert/warning";
import Fingerprint from "material-ui/svg-icons/action/fingerprint";
import Redeem from "material-ui/svg-icons/action/redeem";
import UserInfo from "./UserInfo";
import store from "./../store";
import {GetMyStats} from "./../actions/statAction";
import { connect } from "react-redux";

const styles = {
	listItem: {
		color: white,
		fontSize: 14
	},
	listIcon:{
		color:amber700
	},
	drawer: {
		backgroundColor: white
	}
};

class LeftDrawer extends React.Component {
	constructor() {
		super();
	}

	componentDidMount(){
		this.props.getMyStats(
			sessionStorage.getItem("access_token"),
			sessionStorage.getItem("userId"))
	}

	render() {
		return (
			<Drawer 
			open={this.props.nav}
			openSecondary={true}
			containerStyle={styles.drawer}
			width={300}
			disableSwipeToOpen={true}>
				<UserInfo
					 stat={this.props.stat}
					 rankings={this.props.rankings}
				/>
			</Drawer>
		);
	}
}

const mapStateToProps = (state) => {
  return {
	  stat: state.stat.stat,
	  rankings: state.stat.rankings,
	  nav: state.nav.navOpen
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
	getMyStats: (access_token, userId) => {
            dispatch(GetMyStats(access_token, userId))
        }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftDrawer);
