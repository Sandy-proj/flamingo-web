import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import {Icon} from '@mdi/react'
import { mdiMenu } from '@mdi/js';
export default function DropDownMenu({onSelectItem,list,trigger,data,reset,activeItem,children}){
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
        console.log('adding listener'+ref.current)
        document.addEventListener('mousedown',checkBoundary)

        //Cleanup
        return ()=>{
            document.removeEventListener('mousedown',checkBoundary);
        }
    },[isActive])

    return (

    <div ref={ref} class={clsx('dropdown',isActive?'is-active':'')}>
        <div className={clsx("dropdown-trigger")} onClick={handleActivateMenu}>
            {trigger?trigger():
            <a  className={clsx('p-3','mt-2')}><Icon path={mdiMenu} size={1.5}></Icon></a>
            }
        </div>
        <div class="dropdown-menu" id="dropdown-menu" role="menu">
            <div class="dropdown-content"> 
                {list.map((item,index)=>{
                    return <a onClick={()=>{setIsActive(false);onSelectItem(index)}} className={'dropdown-item'}>{item}</a>
                    })
  
                }
            </div>
  
         </div>
    </div>
       
        
    );

}