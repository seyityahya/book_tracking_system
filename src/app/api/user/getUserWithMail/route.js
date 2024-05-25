import connect from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
    try {
        const { email } = await req.json();

        await connect();

        const user = await User.findOne({
            email: email,
        });

        if (!user) {
            return new Response(JSON.stringify("User not found!"), { status: 404 });
        }

        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify(null), { status: 500 });
    }
}