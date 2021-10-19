import React from 'react';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';

import './index.css';

const PostRegister = () => {
    const history = useHistory();

    return (
        <div className='postreg'>
            <div className='postreg-container'>
                <p className='title'>Register success!</p>

                <h5>
                    We sent an email to confirm your account in order to login.
                </h5>

                <div className='postreg-button-container'>
                    <Button
                        size='lg'
                        variant='success'
                        onClick={() => history.push('/')}
                    >
                        Go back
                    </Button>
                </div>

                <p className='footer'>
                    Lorem ipsum dolor sit amet.
                </p>
            </div>
        </div>
    );
};

export default PostRegister;
