import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { signIn } from 'next-auth/react';
import { useAccount, useConnect, useSignMessage, useDisconnect } from 'wagmi';
import axiosClient from '../utils/axios-client';
import { TextButton } from '@thumbtack/thumbprint-react';
import MetaMask from "../public/metamask.png";
import Image from "next/image";

export default function SignIn() {
    const { connectAsync } = useConnect();
    const { disconnectAsync } = useDisconnect();
    const { isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();

    const handleAuth = async () => {
        //disconnects the web3 provider if it's already active
        if (isConnected) {
            await disconnectAsync();
        }
        // enabling the web3 provider metamask
        const { account, chain } = await connectAsync({ connector: new MetaMaskConnector() });

        const userData = { address: account, chain: chain.id, network: 'evm' };
        // making a post request to our 'request-message' endpoint
        const { data } = await axiosClient.post('/auth/request-message', userData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const message = data.message;
        // signing the received message via metamask
        const signature = await signMessageAsync({ message });

        // redirect user after success authentication to '/user' page
        const resp = await signIn(
            'credentials',
            { message, signature, redirect: false, callbackUrl: '/user' },
        );

        /**
         * instead of using signIn(..., redirect: "/user")
         * we get the url from callback and push it to the router to avoid page refreshing
         */
        if (!!resp && !!resp.url) {
            window.location.assign('/user');
        }
    };

    return (
        <div className="flex v-mid">
            <Image src={MetaMask} width={20} height={20}/>
            <div className="ml2">
                <TextButton
                    onClick={() => handleAuth()}
                >
                    Connect Metamask Wallet
                </TextButton>
            </div>
        </div>
    );
}