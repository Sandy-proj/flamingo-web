import Head from 'next/head'
import Link from 'next/link'
import { useState  } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import BaseLayout from '../../components/ui/BaseLayout'
import { mdiDragVertical, mdiPlus,  mdiClose, mdiMinus, mdiCheckboxBlankOutline, mdiCheck } from '@mdi/js'
import {Icon} from '@mdi/react'
import  axios from 'axios'
import clsx from 'clsx';
import Popup from '../../components/ui/Popup'
import { arrayMove } from 'react-sortable-hoc'
import { sortableContainer,sortableElement,sortableHandle } from 'react-sortable-hoc' 
import { CONSTANTS } from '../../components/Util/Constants'

export default function UseSquare({resourceId,resource,onEdit,isLoggedIn,isEditable}) {

    const list = resource
    function handleEdit(e){
        onEdit()
    }


    function ExpandableListItem({item}){
      const [isExpanded,setExpanded]=useState(false);
      const [isSelected,setSelected]=useState(false);
      const[itemData,setData]=useState(item)
   
      
      function handleExpansion(){
       setExpanded(!isExpanded)
      }
  
      function handleMainInput(e){
        setData(e.target.value)
      }

      function handleSelection(e){
        setSelected(!isSelected)
      }
  
      console.log('using square - '+isLoggedIn)
     
      return <li className="mb-0 ml-0 p-1">
      
        <div className={clsx('columns','is-gapless','is-mobile')}>
        <div className={clsx('column','is-auto',isSelected?'active-item':false)}>
            <button className={clsx('button','is-white')} onClick={handleSelection}>
              <span className='icon'><Icon path={isSelected?mdiCheck:mdiCheckboxBlankOutline} size={1}></Icon></span>
            </button>
          </div>
         
          <div className={clsx('column','is-10','ml-1','mr-1')}>
            <input className={clsx('input','is-hovered','entrystyle')} type="text" value={itemData} placeholder="Enter an item" onChange={handleMainInput}></input>
          </div>
          <div className={clsx('column','is-auto',isExpanded?'active-item':false)}>
         
          </div>
          <div className={clsx('column','is-auto',isExpanded?'active-item':false)}>
            <button className={clsx('button','is-white')} onClick={handleExpansion}>
              <span className='icon'><Icon path={isExpanded?mdiMinus:mdiPlus} size={1}></Icon></span>
            </button>
          </div>
        </div>
                        
  
  
    <div className={clsx('tray',isExpanded?'tray-max':'tray-min')}>
        <input className={clsx('input','entrystyle')} type="text" defaultValue={''} placeholder="Add details"/>
    </div>
      
      </li>
    }


    function EditButton(){
      if(!isLoggedIn){
        return null;
      }
      
      if(!isEditable){
        return null;
      }

      return (
        <div>
            <button className={clsx('button')} onClick={handleEdit}>Edit</button>
         </div>
      );
    }


    return (
      <BaseLayout>
        <Head>
          <title>HopSquare</title>
          <link rel="icon" href="/tinylogo.png" />
        </Head>
        <div>
         
          
          <div className={clsx('columns','listbox')}>
            <div className="column is-one-fifth">
              <div className="columns">
                <div className="column is-narrow">
                <div className="box ml-2">
                  <span className="icon-text">
                    <span><i className="mdi mdi-heart has-text-danger"></i></span>
                    <span><label><strong>Like</strong></label></span>
                  </span>
                {/* <span className="image is-48x48 mdi mdi-heart has-text-danger"></span> */}
              </div>
              <div className="box ml-2">
                  <span className="icon-text">
                    <span><i className="mdi mdi-download has-text-success"></i></span>
                    <span><label><strong>Download</strong></label></span>
                  </span>
                {/* <span className="image is-48x48 mdi mdi-heart has-text-danger"></span> */}
              </div>
              <div className="box ml-2">
                  <span className="icon-text">
                    <span><i className="mdi mdi-home has-text-danger"></i></span>
                    <span><label><strong>Home</strong></label></span>
                  </span>
                {/* <span className="image is-48x48 mdi mdi-heart has-text-danger"></span> */}
              </div>
                </div>
              </div>
             
            </div>
            <div className={clsx('column','is-auto')}>
            <div className="card p-3"><p className="title is-4">A list of awesome things</p></div>
            <ul className="card">
              {list.map(item=>{return <ExpandableListItem item={item}/>})}

            </ul>
            </div>
            <div className="column has-text-centered is-one-fifth">
              <p className={clsx('subtitle','is-4','m-2')}><strong>44</strong>%</p>
              <div className="card p-3">
                <progress class="progress is-info" value="44" max="100"><p>89</p></progress>
              </div>
              <EditButton></EditButton>
            </div>

          </div>
           
        </div>
        </BaseLayout>
    );


 }