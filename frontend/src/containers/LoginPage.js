import React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Paper from "material-ui/Paper";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import Checkbox from "material-ui/Checkbox";
import { grey800, white, blue400 } from "material-ui/styles/colors";
import Help from "material-ui/svg-icons/action/help";
import TextField from "material-ui/TextField";
import { Link } from "react-router";
import ThemeDefault from "../theme-default";
import axios from "axios";
import { browserHistory } from 'react-router';
import store from "./../store";
import {GetLoginInfo,
        ValidateUserName,
        ValidatePassword} from "./../actions/loginAction";
import { connect } from "react-redux";
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import NewUserDialog from "./../components/loginPage/newUserDialog";
import {typography} from 'material-ui/styles';
import Divider from 'material-ui/Divider';

const styles = {
    page: {
        backgroundImage: "url(" + require("../images/login_bg.jpg") + ")",
        height: "100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
    },
    loginContainer: {
        minWidth: 320,
        maxWidth: 400,
        height: "auto",
        position: "absolute",
        top: "20%",
        left: 0,
        right: 0,
        margin: "auto"
    },
    paper: {
        padding: 20,
        overflow: "auto"
    },
    buttonsDiv: {
        textAlign: "center",
        padding: 10
    },
    flatButton: {
        color: grey800
    },
    checkRemember: {
        style: {
            float: "left",
            maxWidth: 180,
            paddingTop: 5
        },
        labelStyle: {
            color: grey800
        },
        iconStyle: {
            color: grey800,
            borderColor: grey800,
            fill: grey800
        }
    },
    loginBtn: {
        float: "right"
    },
    btn: {
        background: "#4f81e9",
        color: white,
        padding: 7,
        borderRadius: 2,
        margin: 2,
        fontSize: 13
    },
    btnFacebook: {
        background: "#4f81e9"
    },
    btnGoogle: {
        background: "#e14441"
    },
    btnSpan: {
        marginLeft: 5
    },
    title: {
        fontSize: 20,
        fontWeight: typography.fontWeightMedium,
        marginBottom: 15,
        marginTop: 15
    }
};

class LoginPage extends React.Component {
    constructor() {
        super();
    }

    checkUserName() {
        this.props.validateName(this.refs.username.getValue())
    }

    checkPassword() {
        this.props.validatePwd(this.refs.password.getValue())
    }
	
    validate() {
        var valid = true;
        if (this.refs.username.getValue() === "") {
            valid = false;
        }

        if (this.refs.password.getValue() === "") {
            valid = false;
        }
        return valid;
    }

    handleLogin() {
        if (!this.validate()) return;
        this.props.getLoginInfo(
            this.refs.username.getValue(),
            this.refs.password.getValue());
    }

    responseGoogle = (response) => {
        this.props.getLoginInfo(
            response.profileObj.email
        )
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={ThemeDefault}>
                <div style={styles.page}>
                    <div style={styles.loginContainer}>
                        <Paper style={styles.paper}>
                            <div style={styles.buttonsDiv}>
                            <h2 style={styles.title}>
                                WELCOME TO CAT FORUM
                            </h2>
                            </div>
                            <Divider/>
                            <div style={{...styles.buttonsDiv, marginTop: 50}}>
                            <GoogleLogin
                                clientId="6749461762-p7ljlku3v0k1j42m4f2inj7htqfsbnfe.apps.googleusercontent.com"
                                buttonText="LOGIN"
                                onSuccess={this.responseGoogle}
                                onFailure={this.responseGoogle}
                            />
                            </div>
                            <div style={styles.buttonsDiv}>
                                <FlatButton
                                    label="Please login with smu email"
                                    style={styles.flatButton}
                                    icon={<Help />}
                                />
                            </div>
                        </Paper>
                            
                        <NewUserDialog />
                        
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

const mapStateToProps = (state) => {
  return {
	  login: state.login.login,
      user: state.login.user
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getLoginInfo: (username, password) => {
            dispatch(GetLoginInfo(username, password))
        },
        validateName: (name) => {
            dispatch(ValidateUserName(name))
        },
        validatePwd: (password) => {
            dispatch(ValidatePassword(password))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
