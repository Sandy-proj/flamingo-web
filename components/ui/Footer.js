import { mdiClockTimeSix } from '@mdi/js';
import clsx from 'clsx';
export default function Footer({props,children}){
    return (
    <div className = {clsx('footer','mt-1','footer-background')}>
        <div className={clsx('content','has-text-centered')}>
        2021 <strong>Copyright &#169;HopSquare</strong>
        </div>
       <div className={clsx('columns')}>

           <div className={clsx('column','is-2','centeralignment')}> 
                <ul>
                    {/* <li key={1} className={clsx('title','is-6','mb-1')}>Feedback</li>
                    <li key={2} className={clsx('sub-title','is-7')}>hopsquare.app@gmail.com</li> */}
                </ul>
               
           </div>
           <div className={clsx('column','is-2','centeralignment')}> 
                <ul>
                    {/* <li key={1} className={clsx('title','is-6','mb-1')}>Account</li>
                    <li key={2} className={clsx('sub-title','is-7')}>Login</li>
                    <li key={3} className={clsx('sub-title','is-7')}>Signup</li> */}
                </ul>
               
           </div>
          
           <div className={clsx('column','is-2','centeralignment')}> 
                <ul>
                    {/* <li key={1} className={clsx('title','is-6','mb-1')}>Links</li> */}
                    <li key={2} className={clsx('is-size-6','mb-1','has-text-grey')}><a className={clsx('has-text-grey')} href='/tos' target='_blank'>Terms and Conditions</a></li>
                   
                </ul>
               
           </div>
           <div className={clsx('column','is-2','centeralignment')}> 
                <ul>
                    {/* <li key={1} className={clsx('title','is-6','mb-1')}>Links</li> */}
                   
                    <li key={3} className={clsx('is-size-6','mb-1')}><a className={clsx('has-text-grey')} href='/p_pol' target='_blank'>Privacy policy</a></li>
                </ul>
               
           </div>
           <div className={clsx('column','is-2','centeralignment')}></div>
           
       </div>
    </div>
    );

}