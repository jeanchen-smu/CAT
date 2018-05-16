import React, { PropTypes } from "react";
import Delete from "material-ui/svg-icons/action/delete";
import FlatButton from 'material-ui/FlatButton';
import {connect} from "react-redux";
import Dialog from 'material-ui/Dialog';
import TextField from "material-ui/TextField";
import Paper from "material-ui/Paper";
import {UpdateUserName, SetUserName, UpdateTelegram} from './../../actions/loginAction';

class SetNameDialog extends React.Component {
    constructor() {
        super();
        this.styles = {
            deletButton: {
                float: "right"
            },
            textField: {
                paddingLeft: 50,
                paddingRight: 50
            },
            contentPaper: {
                marginTop: 10
            },
            waringText: {
                marginTop: 16,
                paddingLeft: 50
            }
        }
    }

    render() {
        const actions = [
            <FlatButton
                label="Post"
                primary={true}
                onClick={()=>this.props.setUserName(
                    this.props.access_token,
                    {
                        username: this.props.username,
                        userId: this.props.userId,
                        agreed: this.props.agreed,
                        telegram_account: this.props.telegram_account
                    },
                    this.props.email
                )}
            />,
        ];
        return (
            <Dialog
                title="Choose Username & Telegram Account"
                actions={actions}
                modal={false}
                open={this.props.setName}
            >
                <TextField
                    style={this.styles.textField}
                    name="SetNameField"
                    ref="SetNameField"
                    hintText="Username"
                    floatingLabelText="Username"
                    value={this.props.username}
                    onChange={()=>
                    this.props.updateUserName(this.refs.SetNameField.getValue())}
                />
                <br />
                <div style={this.styles.waringText}>
                    * You should choose an avatar name (nick name) to protect your real identity.
                </div>
                <br />
                <TextField
                    style={this.styles.textField}
                    name="SetTGField"
                    ref="SetTGField"
                    hintText="Telegram Account"
                    floatingLabelText="Telegram Account"
                    value={this.props.telegram_account}
                    onChange={()=>
                    this.props.updateTelegram(this.refs.SetTGField.getValue())}
                />
            </Dialog>
        )
    }
}

const mapStateToProps = (state) => {
  return {
	  nav: state.nav,
      username: state.login.user.username,
      setName: state.login.setName,
      userId: state.login.user.userId,
      email: state.login.user.email,
      agreed: state.login.user.agreed,
      telegram_account: state.login.user.telegram_account,
      access_token: state.login.user.access_token
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateUserName: (username) => {
            dispatch(UpdateUserName(username))
        },
        setUserName: (access_token, user, email) => {
            dispatch(SetUserName(access_token, user, email))
        },
        updateTelegram: (tg) => {
            dispatch(UpdateTelegram(tg))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetNameDialog);