import React from 'react';
import * as Yup from "yup";
import { signUp } from "../services/client.js";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, useField } from "formik";
import { useAuth } from "./auth/AuthContext.jsx";

// Custom input component
const MyTextInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);

    return (
        <div style={{ marginBottom: '1rem' }}>
            <label htmlFor={props.id || props.name} style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                {label}
            </label>
            <input
                {...field}
                {...props}
                style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                }}
            />
            {meta.touched && meta.error ? (
                <div style={{ color: 'red', marginTop: '0.25rem' }}>{meta.error}</div>
            ) : null}
        </div>
    );
};

const SignUpForm = ({ onSuccess }) => {
    return (
        <Formik
            validateOnMount={true}
            validationSchema={Yup.object({
                username: Yup.string().required("Username is required"),
                email: Yup.string().email('Invalid email').required('Email is required'),
                password: Yup.string().max(20, 'Must be 20 characters or less').required('Password is required'),
            })}
            initialValues={{ username: '', email: '', password: '' }}
            onSubmit={(values, { setSubmitting }) => {
                setSubmitting(true);

                const user = {
                    username: values.username,
                    email: values.email,
                    password: values.password
                };

                signUp(user)
                    .then(res => {
                        onSuccess(res.headers["authorization"]);
                    })
                    .catch(err => {
                        console.error(err);
                    })
                    .finally(() => setSubmitting(false));
            }}
        >
            {({ isValid, isSubmitting }) => (
                <Form>
                    <MyTextInput
                        label="Username"
                        name="username"
                        type="username"
                        placeholder="username is required"
                    />
                    <MyTextInput
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="abc@gmail.com"
                    />
                    <MyTextInput
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="Enter password"
                    />

                    <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                        Already a user? <Link to="/">Login</Link>
                    </div>

                    <button
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        {isSubmitting ? 'Submitting...' : 'Sign Up'}
                    </button>
                </Form>
            )}
        </Formik>
    );
};

const RegisterUserForm = () => {
    const { setUserFromToken } = useAuth();
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f5f5f5'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Sign Up</h1>
                <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#555' }}>
                    To enjoy all of our cool features ✌️
                </p>

                <SignUpForm onSuccess={(token) => {
                    localStorage.setItem("access_token", token);
                    setUserFromToken();
                    navigate("/dashboard");
                }} />
            </div>
        </div>
    );
};

export default RegisterUserForm;
