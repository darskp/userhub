import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box, Button, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const host = process.env.REACT_APP_HOST;

const UserDetails = () => {
    const { id } = useParams();
    const [selectedUser, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const currentUserToken = useSelector((state) => state.currentUser.token);
    const navigate = useNavigate();

    const getFullName = () => {
        const { first_name, last_name } = selectedUser;
        if (first_name) {
            if (last_name) {
                return `${first_name} ${last_name}`;
            } else {
                return first_name;
            }
        }
        return '-';
    };

    useEffect(() => {
        if (!currentUserToken) {
            navigate('/login');
            return;
        }

        const fetchUserDetails = async () => {
            try {
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Authorization", `Token ${currentUserToken}`);

                const requestOptions = {
                    method: "GET",
                    headers: myHeaders,
                };

                const response = await fetch(`${host}/retrive_update_user/${id}/`, requestOptions);
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    alert('invalid Id');
                    navigate('/users');
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [currentUserToken, id, navigate]);

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            sx={{ backgroundColor: 'white' }}
        >
            <Typography gutterBottom variant="h5" component="div" sx={{ py: 2, fontWeight: 'bold', fontSize: '2rem' }}>
                User Details
            </Typography>
            {loading ? (
                <CircularProgress />
            ) : (
                selectedUser && (
                    <>
                        <Card>
                            <CardContent>
                                <Typography variant="body1">
                                    <span style={{ fontWeight: 'bold' }}>Username:</span> {selectedUser.username || '-'}
                                </Typography>
                                <Typography variant="body1">
                                    <span style={{ fontWeight: 'bold' }}>Full Name:</span> {getFullName()}
                                </Typography>
                                <Typography variant="body1">
                                    <span style={{ fontWeight: 'bold' }}>Email Address:</span> {selectedUser.email || '-'}
                                </Typography>
                            </CardContent>
                        </Card>
                        <Box sx={{ py: 2 }}><Button size="small" variant="contained" color="primary">
                            <Link to="/users" style={{ textDecoration: 'none', color: "white" }}>
                                GO Back
                            </Link>
                        </Button>
                        </Box>
                    </>
                )
            )}
        </Box>
    );
};

export default UserDetails;
