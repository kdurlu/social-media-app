const userReducer = (state = {}, action) => {
    switch (action.type) {
        case 'LOGIN':
            return (state = action.payload);
        case 'LOGOUT':
            return (state = {});
        case 'UPDATE':
            return (state = { ...state, liked_post_ids: action.payload });
        default:
            return state;
    }
};

export default userReducer;
