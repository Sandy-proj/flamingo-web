import clsx from 'clsx';
import { useState } from 'react';
import Menu from './Menu';
export default function Categories({onSelectItem,reset,activeIndex,children}){

  const categories =    [{id:1,name:'Travel'},
                         {id:2,name:'Food'},
                         {id:3,name:'Development'},
                         {id:4,name:'Pets'},                         
                          {id:5,name:'Anime'}];

    return (
        <div className={clsx('')} >
           <Menu onSelectItem={onSelectItem} reset={reset} activeItem={activeIndex} heading='Hot categories' data={categories}/>
      </div> 
    );

}