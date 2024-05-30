"use client";

import { useState, useEffect } from 'react';
import { checkResetPasswordToken, resetPassword } from '@/app/api';
import { TextField, Button, CircularProgress } from '@mui/material';
import { BsInfoCircleFill } from 'react-icons/bs';
import Link from 'next/link';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from 'next/navigation';

const ResetPasswordPage = (ctx) => {
    const { id } = ctx.params;
    const [isValidToken, setIsValidToken] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [isPageLoading, setIsPageLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        async function checkToken() {
            const status = await checkResetPasswordToken(id);
            if (status) {
                setIsValidToken(true);
            }
            setIsPageLoading(false);
        }
        checkToken();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }
        await resetPassword(id, newPassword);
        router.push('/login');
    };

    if (isPageLoading) {
        return (
            <div className='flex flex-col justify-center items-center h-screen'>
                <CircularProgress />
            </div>
        )
    }

    if (isValidToken) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <form onSubmit={handleSubmit} className="p-8 bg-white rounded-sm shadow-md">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Şifrenizi Değiştirin
                        </h2>
                    </div>
                    <div className='my-4'>
                        <TextField
                            type="password"
                            label="Yeni Şifre"
                            variant="outlined"
                            className="w-full"
                            value={newPassword}
                            required
                            autoComplete="password"
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        className='flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    >
                        Şifreyi Değiştir
                    </Button>
                </form>
                <ToastContainer />
            </div>
        );
    } else {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="p-8 bg-white shadow-md flex items-center rounded-md">
                    <BsInfoCircleFill className="text-blue-600 text-4xl" />
                    <div className="ml-4">
                        <h1 className="text-xl font-bold">Geçersiz token</h1>
                        <p className="text-gray-500">Kullanmaya çalıştığınız token geçersiz veya süresi dolmuş.</p>
                        <Link href="/forgotPassword">
                            <p className="text-blue-600">Şifrenizi sıfırlamak için buraya tıklayın</p>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
};

export default ResetPasswordPage;