import '../styles/globals.css'
import { createClient, configureChains, defaultChains, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { SessionProvider } from 'next-auth/react';
import GlobalHeader from '../components/global-header';

const { provider, webSocketProvider } = configureChains(defaultChains, [publicProvider()]);

const client = createClient({
  provider,
  webSocketProvider,
  autoConnect: true,
});

function MyApp({ Component, pageProps }: any) {
  return (
      <WagmiConfig client={client}>
          <SessionProvider session={pageProps.session} refetchInterval={0}>
              <GlobalHeader />
              <Component {...pageProps} />
          </SessionProvider>
      </WagmiConfig>
  );
}

export default MyApp
