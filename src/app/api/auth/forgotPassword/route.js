import sendEmail from "@/helpers/mail/mail.helper";
import connect from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
    try {
        const { email } = await req.json();

        await connect();

        const user = await User.findOne({ email });

        if (!user) {
            return Response(JSON.stringify("User not found"), { status: 404 });
        }

        const resetPasswordToken = user.getResetPasswordTokenFromUser();

        // Send the email
        const body = `
        <div style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif;">
            <img src="https://www.booksment.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FnewLogo.41e5950b.png&w=640&q=75" style="display: block; margin: 0 auto;">
            <h1 style="color: #333; text-align: center;">Hello ${user.name},</h1>
            <p style="color: #333; text-align: center;">You can reset your e-mail address by clicking the button below.</p>
            <hr>
            <p style="color: #333; text-align: center;">Best,</p>
            <a href="http"><p style="color: #333; text-align: center; font-style: italic;">Booksment</p></a>
            <div style="text-align: center;">
                <a href="http://localhost:3000/resetPassword/${resetPasswordToken}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border: none; border-radius: 5px;">Reset Password</a>
            </div>
        </div>
        `;

        await sendEmail(email, "Forgot your password?", body);

        await user.save();

        return new Response(JSON.stringify("Email has been sent!"), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify(null), { status: 500 });
    }
}
