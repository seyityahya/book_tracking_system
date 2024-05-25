import sendEmail from "@/helpers/mail/mail.helper";


export async function POST(req) {
    try {
        const { email, id } = await req.json();

        const body = `
        <div style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif;">
            <img src="https://www.booksment.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FnewLogo.41e5950b.png&w=640&q=75" style="display: block; margin: 0 auto;">
            <h1 style="color: #333; text-align: center;">Hello,</h1>
            <p style="color: #333; text-align: center;">You can confirm your e-mail address by clicking the button below.</p>
            <hr>
            <p style="color: #333; text-align: center;">Best,</p>
            <a href="http"><p style="color: #333; text-align: center; font-style: italic;">Booksment</p></a>
            <div style="text-align: center;">
                <a href="http://localhost:3000/verifyMailAddress/${id}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border: none; border-radius: 5px;">Verify Email</a>
            </div>
        </div>
        `;

        // Send the email
        await sendEmail(email, "Verify Email Address", body);

        return new Response(JSON.stringify("Email has been sent!"), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify(null), { status: 500 });
    }
}