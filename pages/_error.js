import clsx from "clsx";

function Error({statusCode}){
    return <div className={clsx('min-screen-fill','container','centeralignment')}> 
        <p className={clsx('is-size-4')}>Failed to communicate with the server. <a>Try again.</a></p>
    </div>
}

export default Error;