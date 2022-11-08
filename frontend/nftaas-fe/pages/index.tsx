import type { NextPage } from 'next'
import Link from 'next/link'
import ConnectWallet from '../components/ConnectWallet'
import MintView from '../components/MintView'
import styles from '../styles/Home.module.css'
import { useCallback } from 'react';
import { useAccount } from '../store/account';
import Image from 'next/image';
import gif from '../public/home-page.gif';
import GlobalHeader from '../components/global-header';
const Home: NextPage = () => {
    const accountId = useAccount(useCallback((state) => state.accountId, []));

  return (
      <div className={styles.container}>
          <GlobalHeader />

          {accountId ? accountId : <ConnectWallet />}

          <div className="w-100 flex pa5 justify-center">
              <Image src={gif} alt={"home page gif"}/>
          </div>

          <footer className={styles.footer}>
              <a
                  href="https://moralis.io/?utm_source=gads&utm_campaign=17600841074&utm_medium=140711338200&network=g&device=c&gclid=Cj0KCQjwnbmaBhD-ARIsAGTPcfXwQTdecnN4fDbJcrwz1pd_wXOTc3mrkf9T6IxPuCj-gRtnzucnlL8aAlxAEALw_wcB"
                  target="_blank"
                  rel="noopener noreferrer"
              >
                  Powered by Moralis
              </a>
          </footer>
      </div>
  )
}

export default Home
