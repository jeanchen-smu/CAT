import {combineReducers} from "redux";
import RankReducer from "./rankReducer";
import StatReducer from "./statReducer";
import LoginReducer from "./loginReducer";
import NavReducer from "./navReducer";
import ForumReducer from "./forumReducer";
import QuestionReducer from "./questionReducer";
import NewPostReducer from "./newPostReducer";

export default combineReducers({
    login: LoginReducer,
    rank: RankReducer,
    stat: StatReducer,
    nav: NavReducer,
    forum: ForumReducer,
    ques: QuestionReducer,
    newPost: NewPostReducer
});