import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import {Icon} from '@mdi/react'
import { mdiDotsVertical, mdiMenu } from '@mdi/js';
export default function DropDownMenu({onSelectItem,list,trigger,isOwner,up}){
  const [isActive,setIsActive]=useState(false)
  
  const ref = useRef();

    function handleActivateMenu(){
        setIsActive(!isActive)
    }



    useEffect(()=>{
        function checkBoundary(e){
            if(isActive&&ref.current&&!ref.current.contains(e.target)){
                setIsActive(false)
            }
        }

        document.addEventListener('mousedown',checkBoundary)

        //Cleanup
        return ()=>{
            document.removeEventListener('mousedown',checkBoundary);
        }
    },[isActive])

    return (

    <div ref={ref} class={clsx('dropdown',up?'is-up':'',isActive?'is-active':'')}>
        <div className={clsx("dropdown-trigger")} onClick={handleActivateMenu}>
            {trigger?trigger():
            <button  className={clsx('button','is-white','has-text-grey','has-text-weight-normal','p-3','mt-0')}><Icon path={mdiDotsVertical} size={1}></Icon></button>
            }
        </div>
        <div className={clsx("dropdown-menu")} id="dropdown-menu" role="menu">
            <div class="dropdown-content"> 
                {list.map((item,index)=>{
                    return <a visible={item.isOwner} onClick={()=>{setIsActive(false);onSelectItem(index)}} key={item.id} className={clsx('dropdown-item')}>{item.name}</a>
                    })
  
                }
            </div>
  
         </div>
    </div>
       
        
    );

}