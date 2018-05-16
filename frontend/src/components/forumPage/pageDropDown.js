import React, {PropTypes} from "react";
import {
    yellowA700,
    tealA700,
    blueA700,
    grey400,
    blue300
} from "material-ui/styles/colors";

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { connect } from "react-redux";
import {GetPosts, SetPage, GotoPreviousPage, GotoNextPage} from "./../../actions/forumAction";

class PageDropDown extends React.Component {

    constructor() {
        super();
    }

    renderDropDownMenu(pageNumber) {
        return (
            <MenuItem 
                value = {pageNumber}
                primaryText = {pageNumber}
            />
        )
    }

    getPageArray(totalPage){
        var pageArray = [];
        for (var i=1; i<totalPage+1; i++){
            pageArray.push(i);
        }
        return pageArray
    }

    handlePageRoute(page) {
        var pageNumber = page;
        this.props.setPage(pageNumber.value);
    }

    handleChange = (event, index, value) => this.handlePageRoute({value});

    render() {
        var pageArray = this.getPageArray(this.props.totalPage);
        return (
            <DropDownMenu 
                value={this.props.currentPage} 
                maxHeight={300}
                onChange={this.handleChange}
                style={{marginRight:-25}}           
            > 
                {pageArray.map(this.renderDropDownMenu, this)}
            </DropDownMenu>
        );
    }
}

const mapStateToProps = (state) => {
  return {
	  totalPage: state.forum.totalPage,
      currentPage: state.forum.currentPage
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
	setPage: (pageNumber) => {
            dispatch(SetPage(pageNumber))
        }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PageDropDown);
