import Link from 'next/link'
import { useState } from 'react';
import BaseLayout from './../components/ui/BaseLayout'
export default function ResetPassword({permissions,props}){
    const [input,setInput] = useState(''); 
    function validateLogin(){

        if(input.length>0){
            return true;
        }
        return false;
    }

    const handleSubmit = (e)=>{
        e.preventDefault();
      
        //axios.post('http://localhost:3000/user/login',{emailId:credentials.emailId,password:credentials.passWord}).then((response)=>console.log(response)).catch(error=>console.log(error));
        
        //setLoginStatus(true)
        //setLoginAttempts(loginAttempts+1);

    }
    return (<BaseLayout use="default">
    <div className="columns">
        <div className="column is-one-third is-offset-one-third">
            <section className="section is-small">
            <div className="box">
               
                <form>
                    <p className="title is-4 is-grouped is-grouped-centered">Kandyjar</p>
                    <div className="field">
                        <input className="input is-rounded" value={input} placeholder="Email Id" onChange={(e)=>setInput(e.target.value)}/>
                    </div> 
                  
                    <div className="field is-grouped is-grouped-centered">
                        <button disabled={!validateLogin()} className="button is-primary" onClick={handleSubmit}>Reset password</button>
                    </div>

                    <div className="field is-grouped is-grouped-centered">
                        <div className="field"><Link href='/'><a className="button is-light">Home</a></Link></div>
                                               
                    </div>
                    <div>
                      
                    </div>
                </form>
    
               
            </div> 
            </section>
            
        </div>
        </div>
    </BaseLayout>);
}