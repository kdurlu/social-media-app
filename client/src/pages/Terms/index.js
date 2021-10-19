import React from 'react';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';

import './index.css';

const Terms = () => {
    const history = useHistory();

    return (
        <div className='about'>
            <div className='about-container'>
                <p className='title'>Title</p>

                <ul>
                    <li>
                        <p>
                            Lorem ipsum dolor sit amet.
                        </p>
                    </li>
                    <li>
                        <p>
                            Lorem ipsum dolor sit amet.
                        </p>
                    </li>
                    <li>
                        <p>
                            Lorem ipsum dolor sit amet.
                        </p>
                    </li>
                    <li>
                        <p>
                            Lorem ipsum dolor sit amet.
                        </p>
                    </li>
                    <li>
                        <p>
                            Lorem ipsum dolor sit amet.
                        </p>
                    </li>
                </ul>

                <p className='title'>SMA</p>
                <ul>
                    <li>
                        <p>
                            Lorem ipsum dolor sit amet.
                        </p>
                    </li>
                    <li>
                        <p>
                            Lorem ipsum dolor sit amet.
                        </p>
                    </li>
                    <li>
                        <p>
                            Lorem ipsum dolor sit amet.
                        </p>
                    </li>
                    <li>
                        <p style={{ fontWeight: 'bold', color: 'red' }}>
                            Lorem ipsum dolor sit amet.
                        </p>
                    </li>
                </ul>

                <div className='about-button-container'>
                    <Button
                        size='lg'
                        variant='success'
                        onClick={() => history.push('/')}
                    >
                        Go Back
                    </Button>
                </div>

                <p className='footer'>
                    Lorem ipsum dolor sit amet.
                </p>
            </div>
        </div>
    );
};

export default Terms;
