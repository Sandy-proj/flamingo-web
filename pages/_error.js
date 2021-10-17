import clsx from "clsx";


function Error({ statusCode }){
    return <div className={clsx('min-screen-fill','container','centeralignment')}> 
        <p className={clsx('is-size-4')}>Failed to communicate with the server:code-{statusCode} <a>Try again.</a></p>
    </div>
}
Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
  }
  
export default Error;

