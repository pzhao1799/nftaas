import type { NextPage } from 'next'
import Link from 'next/link'
import ConnectWallet from '../components/ConnectWallet'
import MintView from '../components/MintView'
import styles from '../styles/Home.module.css'
import { useCallback } from 'react';
import { useAccount } from '../store/account';

const Home: NextPage = () => {
    const accountId = useAccount(useCallback((state) => state.accountId, []));

  return (
      <div className={styles.container}>
          <div className="w-100 flex pa5 justify-between">
              <div>
                  Hello World
              </div>

              <Link href="/image-upload">
                  <a>Try uploading an image</a>
              </Link>

              <Link href="/signin">
                  <a>Web3 Authentication</a>
              </Link>

              <Link href="/gift-card">
                  <a>Create Gift Card</a>
              </Link>
              {accountId ? accountId : <ConnectWallet />}
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
