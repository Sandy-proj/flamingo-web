import Header from './Header'
import Footer from './Footer'
export default function BaseLayout({props,children}){
    return (<div>{children}<Footer></Footer></div>);

}
