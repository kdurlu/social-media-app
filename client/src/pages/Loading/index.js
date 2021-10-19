import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

import './index.css';

const Loading = () => {
    return (
        <div className='loading-container'>
            <Spinner
                animation='border'
                style={{ width: '4rem', height: '4rem' }}
            />
        </div>
    );
};

export default Loading;
