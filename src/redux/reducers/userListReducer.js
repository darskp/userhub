import { actions } from "../constants/constants";

let initialState={
    userList: [],
    error: null,
}

const userListReducer = (state =initialState, action) => {
    switch (action.type) {
        case actions.SET_USER_LIST:
            return {
                ...state,
                userList: action.payload,
                    error: null,
            };
        case actions.SET_ERROR:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default userListReducer;