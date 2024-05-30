import connect from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
    try {
        const { resetPasswordToken, newPassword } = await req.json();

        await connect();

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return new Response(JSON.stringify("Invalid token"), { status: 400 });
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        return new Response(JSON.stringify("Password reset successful"), { status: 200 });

    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify(null), { status: 500 });
    }
}