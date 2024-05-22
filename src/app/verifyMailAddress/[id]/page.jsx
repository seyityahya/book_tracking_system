"use client";

import { updateUser } from '@/app/api';
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const VerifyMailAddressPage = (ctx) => {

    const router = useRouter();
    const [isVerifying, setIsVerifying] = useState(true);

    useEffect(() => {
        async function verifyMail() {
            const req = {
                "id": ctx.params.id,
                "isEmailVerified": true,
            }
            const user = await updateUser(req);

            if (user) {
                toast.success("Email verified successfully");
                router.push("/login");
            }
            setIsVerifying(false);
        }
        verifyMail();
    }, []);

    return (
        <div>
            {isVerifying ?
                <div className='flex flex-col justify-center items-center h-screen'>
                    <CircularProgress />
                    <p className='mt-4 text-lg'>Mail adresiniz onaylanıyor, lütfen bekleyiniz...</p>
                </div>
                : null}
        </div>
    )
}

export default VerifyMailAddressPage;
