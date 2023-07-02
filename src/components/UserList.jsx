import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Box, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress } from '@mui/material';
import { setError, setUserList } from '../redux/actions/userListActions';
import { useNavigate } from 'react-router-dom';

const host = process.env.REACT_APP_HOST;

const UserList = () => {
    const dispatch = useDispatch();
    const currentUserToken = useSelector((state) => state.currentUser.token);
    const userList = useSelector((state) => state.userList.userList);
    const currentUserEmail = useSelector((state) => state.currentUser.email);
    const isLoading = useSelector((state) => state.userList.isLoading); 
    const navigate = useNavigate();

    const handleViewUser = (id) => {
        navigate(`/users/${id}`);
    };

    useEffect(() => {
        if (!currentUserToken) {
            navigate('/login');
            return;
        }

        const fetchUsers = async () => {
            try {
                const options = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${currentUserToken}`
                    }
                };

                const response = await fetch(`${host}/retrive_update_user/`, options);
                if (response.ok) {
                    const data = await response.json();
                    dispatch(setUserList(data));
                } else {
                    throw new Error("Failed to fetch user list");
                }
            } catch (error) {
                console.error("Error - user list", error);
                dispatch(setError(error.message));
            }
        };

        fetchUsers();
    }, [dispatch, currentUserToken, navigate]);

    return (
        <div>
            <Box display="flex" alignItems="center" justifyContent="center" sx={{ py: 3 }}>
                <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
                    User List
                </Typography>
            </Box>
            <Box sx={{ px: { md: 5, xs: 1 }, mb: 4, overflowX: 'auto' }}>
                {isLoading ? ( 
                    <Box display="flex" alignItems="center" justifyContent="center" sx={{ py: 2 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Table sx={{ border: '1px solid #C4C4C4' }}>
                        <TableHead sx={{
                            background: "#c9f29b"
                        }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold" }}>Username</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Full Name</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                                {userList.filter(user => user.email !== currentUserEmail).map(user => (
                                <TableRow
                                    key={user.id}
                                    onClick={() => handleViewUser(user.id)}
                                    sx={{
                                        cursor: "pointer",
                                        "&:hover": {
                                            backgroundColor: "#CAD5E2",
                                        },
                                    }}
                                >
                                    <TableCell>{user.username || "-"}</TableCell>
                                    <TableCell>{user.first_name+" "+ user.last_name || "-"}</TableCell>
                                    <TableCell>{user.email || "-"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Box>
        </div>
    );
};

export default UserList;
