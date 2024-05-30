import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import { signJwtToken } from "@/lib/jwt";
import bcrypt from "bcrypt";
import connect from "@/lib/db";
import sendEmail from "@/helpers/mail/mail.helper";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        username: { label: "Email", type: "text", placeholder: "John Doe" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;

        await connect();

        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("Invalid input");
        }

        const comparePass = await bcrypt.compare(password, user.password);

        if (!comparePass) {
          throw new Error("Invalid input");
        } else {
          const { password, ...currentUser } = user._doc;

          // Get the User IP address
          const userIpAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddresss;

          if (currentUser.lastLoginIp !== undefined && currentUser.lastLoginIp !== userIpAddress) {

            // Send an email to the user about the login
            const body = `
            <div style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif;">
              <img src="https://www.booksment.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FnewLogo.41e5950b.png&w=640&q=75" style="display: block; margin: 0 auto;">
              <h1 style="color: #333; text-align: center;">Hello ${currentUser.name},</h1>
              <p style="color: #333; text-align: center;">We detected a new login to your account from a new IP address. If this was you, you can ignore this email. If you think someone else accessed your account, please reset your password immediately.</p>
              <hr>
              <p style="color: #333; text-align: center;">Best,</p>
              <a href="https://www.booksment.com/"><p style="color: #333; text-align: center; font-style: italic;">Booksment</p></a>
            </div>
            `;
            // Send the email
            await sendEmail(currentUser.email, "New Suspected Login Detected", body);
          }

          // Update the last login IP address
          await User.updateOne({ email }, { $set: { lastLoginIp: userIpAddress } });
          const accessToken = signJwtToken(currentUser, { expiresIn: "6d" });

          return {
            ...currentUser,
            accessToken,
          };
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token._id = user._id;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.accessToken = token.accessToken;
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };
