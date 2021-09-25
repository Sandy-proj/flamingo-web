import clsx from 'clsx';
import { useState } from 'react';
import { CONSTANTS } from '../Util/Constants';
import Menu from './Menu';
export default function GenericCategories({onSelectItem,reset,activeIndex,children}){

  const categories = [{id:1,name:CONSTANTS.commandModes.POPULAR,icon:'mdi mdi-heart has-text-danger p-2'},
                      {id:2,name:CONSTANTS.commandModes.TRENDING,icon:'mdi mdi-trending-up has-text-success p-2'},
                      {id:3,name:CONSTANTS.commandModes.MYFEED,icon:'mdi mdi-home-variant has-text-success p-2'},
                      {id:4,name:CONSTANTS.commandModes.SAVED,icon:'mdi mdi-content-save has-text-info p-2'},
                      {id:5,name:CONSTANTS.commandModes.BOOKMARKED,icon:'mdi mdi-bookmark has-text-danger p-2'}]

    return (
        <div className={clsx('')} >
           <Menu onSelectItem={onSelectItem} reset={reset}  activeItem={activeIndex} data={categories}/>
      </div> 
    );

}