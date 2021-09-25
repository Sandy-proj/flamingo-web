
import Link from 'next/link'
import { useState } from 'react';
import BaseLayout from './../components/ui/BaseLayout'
export default function ChangePassword({props}){
    const [formData,setFormData] = useState({oldPassword:'',newPassword:'',confirmPassword:''}); 
    function validateLogin(){
       return true;
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
                        <input className="input is-rounded" type="password" value={formData.oldPassword} placeholder="Email Id" onChange={(e)=>setFormData({...formData,oldPassword:e.target.value})}/>
                    </div> 
                  
                    <div className="field">
                        <input className="input is-rounded" type="password" value={formData.newPassword} placeholder="New password" onChange={(e)=>setFormData({...formData,newPassword:e.target.value})}/>
                    </div> 

                    <div className="field">
                        <input className="input is-rounded" type="password" value={formData.confirmPassword} placeholder="Confirm password" onChange={(e)=>setFormData({...formData,confirmPassword:e.target.value})}/>
                    </div> 

                    <div className="field is-grouped is-grouped-centered">
                        <button disabled={!validateLogin()} className="button is-primary" onClick={handleSubmit}>Change password</button>
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