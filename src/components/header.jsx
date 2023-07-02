import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { logoutUser } from '../redux/actions/userActions';
import { AccountCircle} from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

const host = process.env.REACT_APP_HOST;

const Header = () => {
    const currentUserToken = useSelector((state) => state.currentUser.token);
    const currentUserEmail = useSelector((state) => state.currentUser.email);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Token ${currentUserToken}`);

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                redirect: "follow",
            };

            const response = await fetch(`${host}/api/logout/`, requestOptions);
            const data = await response.json();
            if (data.status===200) {
                dispatch(logoutUser());
                alert(data.message);
                navigate('/login');
            } 
        } catch (error) {
            console.log('logout error', error);
        }
    };


    const showButton = () => {
        if (currentUserToken) {
            return (
<>
                    <Box display="flex" alignItems="center">
                        <Tooltip title={currentUserEmail}>
                            <IconButton sx={{ color: '#c9f29b'}}>
                                <AccountCircle />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Button onClick={handleLogout} size="small" variant="contained" color="primary">
                        Logout
                    </Button>
</>
            );
        }
        return (
            <>
                <Button component={Link} to="/signup" size="small" variant="contained" color="primary">
                    Signup
                </Button>
                <Button component={Link} size="small" to="/login" variant="contained" color="primary">
                    Login
                </Button>
            </>
        );
    };

    return (
        <>
            <AppBar position="static" sx={{ px: 2,width:"100%" }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {currentUserToken ?<Link to="/users" style={{ textDecoration: 'none', color: "white" }}>
                            UserHub
                        </Link>:<Link to="/" style={{ textDecoration: 'none', color: "white" }}>
                            UserHub
                        </Link>
                        }
                    </Typography>
                    <Box sx={{ display: 'flex', gap: '1rem' }}>
                        {showButton()}
                    </Box>
                </Toolbar>
            </AppBar>
        </>
    );
};

export default Header;
