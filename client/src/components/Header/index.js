import React, { useEffect, useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { userLogout } from '../../redux/user/actions';

const Header = () => {
    const [page, setPage] = useState('');

    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        if (location.pathname === '/') {
            setPage('home');
        }
        // if (location.pathname === 'profile') {
        //     setPage('profile');
        // }
        if (location.pathname === '/about-us') {
            setPage('about');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOnClick = (action) => {
        if (action === 'logout') {
            localStorage.setItem('token', '');
            localStorage.setItem('username', '');
            dispatch(userLogout);
            window.location.reload();
        }
    };

    return (
        <Navbar
            style={{
                padding: '8px 32px',
            }}
            sticky='top'
            bg='dark'
            variant='dark'
        >
            <Navbar.Brand
                style={{
                    fontSize: '26px',
                }}
                className='navbar-brand'
            >
                Social Media App
            </Navbar.Brand>
            <Nav>
                <Nav.Link
                    onClick={() => history.push('/')}
                    className='nav-links'
                    style={{
                        fontSize: '20px',
                        color: page === 'home' ? 'rgba(255,200,0,1)' : 'none',
                    }}
                >
                    Home
                </Nav.Link>
                {/* <Nav.Link
                    onClick={() => history.push('/')}
                    className='nav-links'
                    style={{
                        fontSize: '20px',
                        color:
                            page === 'profile' ? 'rgba(255,200,0,1)' : 'none',
                    }}
                >
                    Profil
                </Nav.Link> */}
                <Nav.Link
                    onClick={() => history.push('/about-us')}
                    className='nav-links'
                    style={{
                        fontSize: '20px',
                        color: page === 'about' ? 'rgba(255,200,0,1)' : 'none',
                    }}
                >
                    About
                </Nav.Link>
            </Nav>
            <Nav className='ms-auto'>
                <Nav.Link
                    onClick={() => handleOnClick('logout')}
                    className='nav-links'
                    style={{ fontSize: '20px' }}
                >
                    Logout
                </Nav.Link>
            </Nav>
        </Navbar>
    );
};

export default Header;
