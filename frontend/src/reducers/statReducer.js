import { browserHistory } from 'react-router';

export default function StatReducer(state={
    stat: {},
    rankings: [],
    fetched: false,
    fetching: false,
    error: null
}, action){
    switch(action.type){
        case "GET_MY_STATS_SUCCEED":{
            return {
                ...state,
                stat: action.payload.stat,
                rankings: action.payload.rank,
                fetched: true,
                fetching: false,
                error: null
            }
        }
        case "GET_MY_STATS_FAIL": {
            sessionStorage.removeItem("token");
		    browserHistory.push("/cat/login");
            return {
                ...state,
                fetched: false,
                fetching: false,
                error: action.payload
            }
        }
    }
    return state;
}
