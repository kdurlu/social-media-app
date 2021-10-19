const postReducer = (state = [], action) => {
    switch (action.type) {
        case 'FEED':
            return (state = action.payload);
        case 'DELETE':
            return (state = state.filter(
                (post) => post.post_id !== action.payload
            ));
        default:
            return state;
    }
};

export default postReducer;
