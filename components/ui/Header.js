import SearchBar from './SearchBar'
import Head from 'next/head'
export default function Header({props,children}){
    return (<div>
        <Head>
          <title>HopSquare</title>
          <link rel="icon" href="/tinylogo.png" />
        </Head>
        </div>
    );

} 
