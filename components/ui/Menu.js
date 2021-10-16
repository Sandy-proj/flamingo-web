import clsx from 'clsx';
import { useEffect, useState } from 'react';
export default function Menu({onSelectItem,heading,data,reset,activeItem,children}){
  const [activeIndex,setActiveIndex]=useState(activeItem)
  const items = data;

    const Heading = ()=>{
        if(!heading)
        return null;
        return <p class="menu-label">{heading} </p>
    }

    // if(activeItem>=0&&reset){
    //     setActiveIndex(-1)
    // }

    return (


        <aside class="menu">
          <Heading/>
            <ul className={clsx('menu-list')}>
            
                {items.map((item,index)=><li key={item.id} >

                <a className={clsx(index==activeItem&&!reset?'is-active':'')} onClick={()=>{onSelectItem(item.name,index)}}>
                <span className="icon-text">
                    {item.icon&& <span className="icon">
                      <i className={item.icon}></i>
                    </span>}
                   
                    <span> <strong>{item.name}</strong></span>
                  </span>
                    
                  </a>  
                </li>)}
            </ul>

        </aside>
        
    );

}