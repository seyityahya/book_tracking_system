import connect from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
    try {
        const { resetPasswordToken } = await req.json();

        await connect();

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            console.log("Invalid token");
            return new Response(JSON.stringify("Invalid token"), { status: 400 });
        }

        return new Response(JSON.stringify("Token is valid"), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify(null), { status: 500 });
    }
}
