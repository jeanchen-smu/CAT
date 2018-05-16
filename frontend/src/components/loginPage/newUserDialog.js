import React, { PropTypes } from "react";
import Delete from "material-ui/svg-icons/action/delete";
import RaisedButton from 'material-ui/RaisedButton';
import {connect} from "react-redux";
import Dialog from 'material-ui/Dialog';
import TextField from "material-ui/TextField";
import Paper from "material-ui/Paper";
import {SetAgreed, SetRefuse, SetNameDialogOpen} from './../../actions/loginAction';
import Checkbox from 'material-ui/Checkbox';
import SetNameDialog from "./setNameDialog";
import ConsentForm from './consentForm.html';
import {
    fullWhite,
    blue600
} from "material-ui/styles/colors";

class NewUserDialog extends React.Component {
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
            }
        }
    }

    render() {
        return (
            <Dialog
                title="Terms & Conditions"
                modal={false}
                autoScrollBodyContent={true}
                open={this.props.isNewUser}
                contentStyle={{width: "80%", maxWidth:"none"}}
            >
                <div dangerouslySetInnerHTML={ {__html: ConsentForm} } />
                <Checkbox
                    label="I agree to participate in the study"
                    checked={this.props.agreed}
                    onCheck={()=>{this.props.setAgreed()}}
                    style={{marginTop: 30}}
                />
                <br />
                <Checkbox
                    label="I refuse to participate in the study"
                    checked={!this.props.agreed}
                    onCheck={()=>{this.props.setRefuse()}}
                    style={{marginBottom: 16}}
                />
                <RaisedButton 
                    label="Proceed"
                    style={{float:"right"}}
                    onClick={()=>this.props.setNameDialogOpen()}
                    backgroundColor={blue600}
                    labelColor={fullWhite}
                />
                <SetNameDialog />
            </Dialog>
        )
    }
}

const mapStateToProps = (state) => {
  return {
	  nav: state.nav,
      username: state.login.user.username,
      isNewUser: state.login.isNewUser,
      userId: state.login.user.userId,
      email: state.login.user.email,
      agreed: state.login.user.agreed
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setAgreed: () => {
            dispatch(SetAgreed())
        },
        setRefuse: () => {
            dispatch(SetRefuse())
        },
        setNameDialogOpen: () => {
            dispatch(SetNameDialogOpen())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewUserDialog);