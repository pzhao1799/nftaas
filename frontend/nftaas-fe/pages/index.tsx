import type { NextPage } from 'next'
import Image from 'next/image';
import styles from '../styles/Home.module.css'
import gif from '../public/home-page.gif'
import GlobalHeader from '../components/global-header'

const Home: NextPage = () => {
  return (
      <div className={styles.container}>
          <GlobalHeader />

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
