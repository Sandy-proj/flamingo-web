import clsx from 'clsx';
import { useState } from 'react';
import Menu from './Menu';
export default function Categories({onSelectItem,reset,activeIndex,data,children}){

  const categories =   data;

    return (
      
        <div className={clsx('')} >
           <Menu onSelectItem={onSelectItem} reset={reset} activeItem={activeIndex} heading='Hot categories' data={categories}/>
      </div> 
    );

}