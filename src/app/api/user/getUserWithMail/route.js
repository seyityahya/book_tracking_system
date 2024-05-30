import connect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcrypt";

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        await connect();

        const user = await User.findOne({
            email: email,
        });

        if (!user) {
            return new Response(JSON.stringify("User not found!"), { status: 404 });
        }

        const comparePass = await bcrypt.compare(password, user.password);

        if (!comparePass) {
            return new Response(JSON.stringify("Email and password incorrect!"), { status: 400 });
        }

        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify(null), { status: 500 });
    }
}