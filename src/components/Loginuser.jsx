import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUser } from '../redux/actions/userActions';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { IconButton } from '@mui/material';

const host = process.env.REACT_APP_HOST;
const token = process.env.REACT_APP_TOKEN;

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUserToken = useSelector((state) => state.currentUser.token);
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            let data = {
                username: values.email.toLowerCase(),
                password: values.password,
            };

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${token}`);

            var options = {
                method: "POST",
                headers: myHeaders,
                body: JSON.stringify(data),
                redirect: "follow",
            };

            try {
                const response = await fetch(`${host}/login/`, options);
                const result = await response.json();
                if (result.status === 200) {
                    alert(result.message);
                    dispatch(setCurrentUser(values.email.toLowerCase(), result.token));
                    navigate('/users');
                }
                else {
                    alert(result.message)
                }
            } catch (error) {
                console.log(`login error`,error);
            }
        }
    })

    useEffect(() => {
        if (currentUserToken) {
            navigate('/users');
        }
    }, [currentUserToken, navigate]);

    return (
        <Box display="flex" alignItems="center" justifyContent="center" sx={{ minHeight: '80vh', backgroundColor: 'white' }}>
            <Box
                component="form"
                width="14rem"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                }}
                onSubmit={formik.handleSubmit}
            >
                <Typography variant="h3" component="div" sx={{ py: 2 }}>
                    Login
                </Typography>
                <TextField
                    label="Email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && formik.errors.email ? true : false}
                    helperText={formik.touched.email && formik.errors.email}
                    variant="outlined"
                    type="email"
                />
                <TextField
                    label="Password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && formik.errors.password ? true : false}
                    helperText={formik.touched.password && formik.errors.password}
                    variant="outlined"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <IconButton
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                aria-label="toggle password visibility"
                            >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        ),
                    }}
                />
                <Button type="submit" variant="contained">
                    Login
                </Button>
            </Box>
        </Box>
    );
};

export default Login;
