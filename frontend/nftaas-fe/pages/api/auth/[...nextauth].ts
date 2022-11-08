import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';
import axiosClient from "../../../components/axios-client";

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'MoralisAuth',
            credentials: {
                message: {
                    label: 'Message',
                    type: 'text',
                    placeholder: '0x0',
                },
                signature: {
                    label: 'Signature',
                    type: 'text',
                    placeholder: '0x0',
                },
            },
            async authorize(credentials) {
                return await axiosClient.post(
                    '/auth/authorize',
                    credentials,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                ).then(
                    (resp) => {
                        console.log("response received.");
                        return resp.data;
                    }
                ).catch(
                    (error) => {
                        console.error(error);
                        return null;
                    }
                );
            },
        }),
    ],
    // adding user info to the user session object
    callbacks: {
        async jwt({ token, user }) {
            user && (token.user = user);
            return token;
        },
        async session({ session, token }) {
            session.user = token;
            return session;
        },
    },
});