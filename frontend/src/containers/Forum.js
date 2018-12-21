import React from 'react';
import CommentsIcon from 'react-icons/lib/fa/comments';
import DollarIcon from 'react-icons/lib/fa/dollar';
import { Link, styles } from 'refire-app';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Paper from "material-ui/Paper";
import EuroSymbol from "material-ui/svg-icons/action/euro-symbol";
import {
    yellowA700,
    tealA700,
    blueA700,
    grey400,
    blue300
} from "material-ui/styles/colors";
import PostItem from "./../components/forumPage/PostItem";
import {GetPosts, SetPage, GotoPreviousPage, GotoNextPage} from "./../actions/forumAction";
import { connect } from "react-redux";
import FlatButton from 'material-ui/FlatButton';
import PageDropDown from "./../components/forumPage/pageDropDown";

class Forum extends React.Component {

    componentDidMount(){
        this.props.getPosts(sessionStorage.getItem("access_token"),
        {
            userId: sessionStorage.getItem("userId"),
            section_id: this.props.section_id?this.props.section_id:sessionStorage.getItem("default_section")
        })
    }

    previousPageButton(previousPageObject) {
        return (
            <FlatButton
                label="<Previous"
                disabled={previousPageObject.disabled}
                onClick={()=>previousPageObject.function()}
            />
        )
    }

    nextPageButton(nextPageObject) {
        return (
            <FlatButton
                label="Next>"
                disabled={nextPageObject.disabled}
                onClick={()=>nextPageObject.function()}
            />
        )
    }

    setPageButton(pageObject) {
        return (
            <FlatButton
                style={pageObject.style}
                label={pageObject.value}
                disabled={pageObject.disabled}
                labelStyle={{padding: 0}}
                onClick={()=>pageObject.function(pageObject.value)}
            />
        )
    }

    dotButton() {
        return (
            <FlatButton
                label="..."
                style={{
                    padding:0
                }}
                disabled={true}
            />
        )
    }

    pageNumber() {
        const styles = {
            pageButton: {
                width: 30,
                padding: 0,
                minWidth: 0
            }
        };
        var a = [];
        var pageView = [];
        var currentPage = this.props.currentPage;
        var totalPage = this.props.totalPage;
        var chunkSize = 4;
        a.push(this.previousPageButton({
            disabled: this.props.currentPage===1,
            function: this.props.gotoPreviousPage
        }))
        if (totalPage>chunkSize*2+1 && currentPage>chunkSize+1){
                a.push(this.dotButton());
        }
        var startPage = Math.max(1, Math.min(currentPage-chunkSize, totalPage-chunkSize*2));
        for (var i=startPage; i<Math.min(startPage+9, totalPage+1); i++){
            pageView.push({
                value: i,
                function: this.props.setPage,
                style:styles.pageButton,
                disabled: i==this.props.currentPage
            })
        }
        a.push(pageView.map(this.setPageButton))
        if (totalPage-currentPage>chunkSize){
            a.push(this.dotButton());
        }
        a.push(this.nextPageButton({
            disabled: currentPage === totalPage,
            function: this.props.gotoNextPage
        }))

        return a
    }

    render() {
        const styles = {
            pageDiv: {
                display: 'flex',
                justifyContent: 'center'
            },
            textSpan: {
                paddingTop: 17,
                fontSize: 16
            }
        }
        return (
            <div>
                <List>
                    <PostItem
                        posts={this.props.posts[this.props.currentPage-1]}
                    />
                <Divider />
                </List>
                <div style={styles.pageDiv}>
                {this.pageNumber()}
                </div>
                <div style={styles.pageDiv}>
                <PageDropDown />
                <span style={styles.textSpan}>
                    | {this.props.totalPage} PAGES
                </span>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
  return {
	  posts: state.forum.posts,
      currentPage: state.forum.currentPage,
      totalPage: state.forum.totalPage,
      section_id: state.login.user.section_id
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
	getPosts: (access_token, filter) => {
            dispatch(GetPosts(access_token, filter))
        },
    setPage: (pageNumber) => {
        dispatch(SetPage(pageNumber))
    },
    gotoPreviousPage: () => {
        dispatch(GotoPreviousPage())
    },
    gotoNextPage: () => {
        dispatch(GotoNextPage())
    }

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Forum);
