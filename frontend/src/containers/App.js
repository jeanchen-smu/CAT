import React, { PropTypes } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from '../components/Header';
import LeftDrawer from '../components/LeftDrawer';
import withWidth, {LARGE, SMALL} from 'material-ui/utils/withWidth';
import ThemeDefault from '../theme-default';
import { connect } from "react-redux";
import { NavOpen,
         NavReceiveProps} from "./../actions/navAction";
import {GetMyStats} from "./../actions/statAction";

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.width !== nextProps.width) {
       this.props.navReceiveProps(nextProps.width === LARGE);
    }
  }

  handleChangeRequestNavDrawer() {
    if (this.props.nav.navOpen == false){
      this.props.getMyStats(
        sessionStorage.getItem("access_token"),
        sessionStorage.getItem("userId"));
    }
    this.props.navOpen();
  }

  render() {
    const paddingLeftDrawerOpen = 300;

    const styles = {
      header: {
        paddingRight: this.props.nav.navOpen ? paddingLeftDrawerOpen : 0
      },
      container: {
        margin: '80px 20px 20px 15px',
        paddingRight: this.props.nav.navOpen && this.props.width !== SMALL ? paddingLeftDrawerOpen : 0
      }
    };


    return (
      <MuiThemeProvider muiTheme={ThemeDefault}>
        <div>
          <Header styles={styles.header}
                  handleChangeRequestNavDrawer={this.handleChangeRequestNavDrawer.bind(this)}/>

            <LeftDrawer />

            <div style={styles.container}>
              {this.props.children}
            </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  children: PropTypes.element,
  width: PropTypes.number
};

const mapStateToProps = (state) => {
  return {
	  login: state.login.login,
    user: state.login.user,
    nav: state.nav
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
        navOpen: () => {
          dispatch(NavOpen())
        },
        navReceiveProps: (bol) => {
          dispatch(NavReceiveProps(bol))
        },
        getMyStats: (access_token, userId) => {
          dispatch(GetMyStats(access_token, userId))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withWidth()(App));
