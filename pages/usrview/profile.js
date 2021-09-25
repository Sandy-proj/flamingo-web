import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import Link from 'next/link'
import clsx from 'clsx'

export default function Profile() {
    
    return (
      <div>
        <Head>
          <title>HopSquare</title>
          <link rel="icon" href="/tinylogo.png" />
        </Head>
        <div className={clsx('columns')}>
          <div className={clsx('column','is-half','is-offset-one-fifth')}>
            <div className={clsx('box')}>
              <div className={clsx('columns')}>
                <div className={clsx('column','is-one-fifth')}>
                  <div className={clsx('container')}>
                  <figure className={clsx('image','is-128x128')}><img src='/tinylogo.png'/></figure>
                  </div>
                
                </div>
                <div className={clsx('column','is-auto')}>
                <form>
                        <p className="title is-5 is-grouped is-grouped-centered">pop_adams</p>
                     

                        <div className="field">
                            <div className="field"><Link href='/'><a className="button is-light"><strong>Change Password</strong></a></Link></div>                            
                        </div>
                      <div className={clsx('field')}>

                        <span className="icon-text">
                          
                          <span className={'icon'}><i className={clsx('mdi','mdi-heart','has-text-danger','p-2')}></i></span>
                        </span>
                        <span> 8989</span>
                      </div>

                       
                      <div className={clsx('field')}>

                        <span className="icon-text">
                          
                          <span className={'icon'}><i className={clsx('mdi','mdi-post','has-text-danger','p-2')}></i></span>
                        </span>
                        <span> 8989</span>
                      </div>

                       
                        <div className={clsx()}>
                            <span className="button is-info is-align-self-stretch"><strong>Save</strong></span>
                            <span className="field"><Link href='/'><a className="button is-light"><strong>Cancel</strong></a></Link> </span>
                         </div>

                        <div className="field is-grouped is-grouped-centered">
                                                      
                        </div>
                        <div>
                            

                           
                        </div>
                    </form>
        
                </div>
              </div>
              
               
            </div>
          </div>

        </div>
       
      </div>
    );
}