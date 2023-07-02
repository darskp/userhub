import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const host = process.env.REACT_APP_HOST;
const token = process.env.REACT_APP_TOKEN;

const Signup = () => {
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
        username: Yup.string().min(2, 'Username must have at least 2 char').required('Username is required'),
        first_name: Yup.string()
            .required('First Name is required')
            .matches(/^[^0-9]*$/, 'First Name should not contain any numbers'),
        last_name: Yup.string()
            .required('Last Name is required')
            .matches(/^[^0-9]*$/, 'Last Name should not contain any numbers'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup
            .string()
            .required('Password is required')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
                "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character (ex : User#123)"
            ),
        phoneNumber: Yup.string().required('Phone Number is required'),
    });

    const formik = useFormik({
        initialValues: {
            username: '',
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            phoneNumber: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const data = {
                username: values.username,
                first_name: values.first_name,
                last_name: values.last_name,
                email: values.email.toLowerCase(),
                password: values.password,
                phone_number: values.phoneNumber,
            };

            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('Authorization', `Bearer ${token}`);

            const options = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(data),
                redirect: "follow",
            };

            try {
                const response = await fetch(`${host}/register/`, options);
                const result = await response.json();
                if (result.status === 201) {
                    alert(result.message);
                    navigate('/login');
                } else if (result.status === 400 && result.error && result.error.email) {
                    alert(result.error.email[0]);
                    navigate('/login');
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.log("signup error", error);
            }
        }
    });


    useEffect(() => {
        if (currentUserToken) {
            navigate('/users');
        }
    }, [currentUserToken, navigate]);

    return (
        <Box display="flex" alignItems="center" justifyContent="center" sx={{ minHeight: '80vh', backgroundColor: 'white',width:"100%" }}>
            <Box
                component="form"
                width="14rem"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                   mb:5
                }}
                onSubmit={formik.handleSubmit}
            >
                <Typography variant="h3" component="div" sx={{ py: 2, }}>
                    Sign Up
                </Typography>
                <TextField
                    label="Username"
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.username && formik.errors.username ? true : false}
                    helperText={formik.touched.username && formik.errors.username}
                    variant="outlined"
                />
                <TextField
                    label="First Name"
                    name="first_name"
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.first_name && formik.errors.first_name ? true : false}
                    helperText={formik.touched.first_name && formik.errors.first_name}
                    variant="outlined"
                />
                <TextField
                    label="Last Name"
                    name="last_name"
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.last_name && formik.errors.last_name ? true : false}
                    helperText={formik.touched.last_name && formik.errors.last_name}
                    variant="outlined"
                />
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
                <TextField
                    label="Phone Number"
                    name="phoneNumber"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.phoneNumber && formik.errors.phoneNumber ? true : false}
                    helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                    variant="outlined"
                />
                <Button type="submit" variant="contained">
                    Sign Up
                </Button>
            </Box>
        </Box>
    );
};

export default Signup;
