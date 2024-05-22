import User from "@/models/User";
import { verifyJwtToken } from "@/lib/jwt";
import connect from "@/lib/db";

export async function GET(req, ctx) {
    /**
     * TODO: Add the following code extract the method to a helper function
     */
    const accessToken = req.headers.get("authorization");
    const token = accessToken.split(" ")[1];

    const decodedToken = verifyJwtToken(token);

    if (!accessToken || !decodedToken) {
        return new Response(
            JSON.stringify({ error: "unauthorized (wrong or expired token)" }),
            { status: 403 }
        );
    }

    await connect();

    const { id } = ctx.params;

    try {
        const user = await User.findById(id);

        if (!user) {
            return new Response(JSON.stringify(null), { status: 404 });
        }

        return new Response(JSON.stringify(user), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify(null), { status: 500 });
    }
}

export async function PUT(req, ctx) {
    try {

        /**
         * TODO: Add the following code extract the method to a helper function
         */
        // const accessToken = req.headers.get("authorization");
        // const token = accessToken.split(" ")[1];

        // const decodedToken = verifyJwtToken(token);

        // if (!accessToken || !decodedToken) {
        //     return new Response(
        //         JSON.stringify({ error: "unauthorized (wrong or expired token)" }),
        //         { status: 403 }
        //     );
        // }

        await connect();

        const body = await req.json();
        const { id } = ctx.params;

        const user = await User.findByIdAndUpdate
            (id, body, { new: true });

        return new Response(JSON.stringify(user), { status: 201 });
    } catch (error) {
        console.log(error + "error: " + error.message);
        return new Response(JSON.stringify(null), { status: 500 });
    }
}