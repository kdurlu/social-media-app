export const postFeed = (obj) => {
    return {
        type: 'FEED',
        payload: obj,
    };
};

export const postDelete = (obj) => {
    return {
        type: 'DELETE',
        payload: obj,
    };
};
