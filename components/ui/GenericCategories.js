import clsx from 'clsx';
import { useContext, useState } from 'react';
import { AuthorizationContext } from '../Util/AuthContext';
import { CONSTANTS } from '../Util/Constants';
import Menu from './Menu';
export default function GenericCategories({onSelectItem,reset,activeIndex,children}){
  const user = useContext(AuthorizationContext)

  const categories = [
                      // {id:1,name:CONSTANTS.commandModes.POPULAR,icon:'mdi mdi-heart has-text-danger p-2',isPublic:true},
                      // {id:2,name:CONSTANTS.commandModes.FRESH,icon:'mdi mdi-leaf has-text-success p-2',isPublic:true},
                      // {id:3,name:CONSTANTS.commandModes.MYFEED,icon:'mdi mdi-home-variant has-text-success p-2',isPublic:false},
                      {id:4,name:CONSTANTS.commandModes.SAVED,icon:'mdi mdi-content-save has-text-info p-2',isPublic:false},
                      // {id:5,name:CONSTANTS.commandModes.BOOKMARKED,icon:'mdi mdi-bookmark has-text-danger p-2',isPublic:false}
                      {id:6,name:CONSTANTS.commandModes.CREATE,icon:'mdi mdi-content-save has-text-info p-2',isPublic:false},
                    ]

   let customCategories = [];
   if(!user.isLoggedIn){
    customCategories = categories.filter(item=>item.isPublic===true)
   }else{
     customCategories = categories;
   }
    return (
        <div className={clsx('')} >
           <Menu onSelectItem={onSelectItem} reset={reset}  activeItem={activeIndex} data={customCategories}/>
      </div> 
    );

}