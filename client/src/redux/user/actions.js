export const userLogin = (obj) => {
    return {
        type: 'LOGIN',
        payload: obj,
    };
};

export const userLogout = () => {
    return {
        type: 'LOGOUT',
    };
};

export const userGetInfo = () => {
    return {
        type: 'GET_INFO',
    };
};

export const userUpdate = (obj) => {
    return {
        type: 'UPDATE',
        payload: obj,
    };
};
