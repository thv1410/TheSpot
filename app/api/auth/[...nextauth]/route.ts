import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connectMongoDB from "@/config/mongodb";

export const authConfig = {
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials: any) {
                await connectMongoDB();

                const user = await User.findOne({ email: credentials.email });
                if (!user) return null;

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) return null;

                return { id: user._id.toString(), email: user.email };
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
};

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
