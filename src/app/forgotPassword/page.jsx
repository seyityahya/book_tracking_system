"use client"
import { Button, Card, TextField } from '@mui/material';
import React from 'react';
import { sendForgotPasswordMail } from '../api';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function ForgotPassword() {
    const [email, setEmail] = React.useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await sendForgotPasswordMail(email);
    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <Card className='p-7 rounded-md'>
                    <div className="max-w-md w-full space-y-8">
                        <div>
                            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                                Şifrenizi mi unuttunuz?
                            </h2>
                        </div>
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            <input type="hidden" name="remember" value="true" />
                            <div className="rounded-md shadow-sm -space-y-px">
                                <div>
                                    <TextField
                                        name="email"
                                        type="email"
                                        required
                                        fullWidth
                                        id="email"
                                        label="E-Posta Adresiniz"
                                        autoComplete="email"
                                        variant="outlined"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <Button
                                    type="submit"
                                    fullWidth
                                    className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                >
                                    Şifreyi Sıfırla
                                </Button>
                            </div>
                        </form>
                    </div>
                </Card>
                <ToastContainer />
            </div>
        </>
    );
}