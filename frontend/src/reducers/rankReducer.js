export default function RankReducer(state={
    rank: null,
    fetched: false,
    fetching: false,
    error: null
}, action){
    switch(action.type){
        case "GET_RANK_SUCCEED":{
            return {
                ...state,
                rank: action.payload,
                fetched: true,
                fetching: false,
                error: null
            }
        }
        case "GET_RANK_FAIL": {
            return {
                ...state,
                fetched: false,
                fetching: false,
                error: action.payload
            }
        }
    };
    return state;
}