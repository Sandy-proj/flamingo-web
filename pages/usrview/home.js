import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import Link from 'next/link'

export default function UserHome({permissions}) {

    return (
      <div className={styles.container}>
        <Head>
          <title>KandyBag</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
            <h1></h1>
        </body>
        </div>
    );
}