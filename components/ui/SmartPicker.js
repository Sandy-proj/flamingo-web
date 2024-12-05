import { mdiAccount, mdiAccountCircle } from "@mdi/js";
import Icon from "@mdi/react";
import clsx from "clsx";
import axios from 'axios'
import React from "react";
import { useEffect } from 'react'
import { useContext, useState } from 'react'
import { CONSTANTS } from '../../components/Util/Constants'


const SmartPicker = React.memo(
  function SmartPicker ({ visible, onDeactivate, onAgree, onOk, onCancel, selectedIds, pickDto}) {
  const [suggestions, setSuggestions] = useState([])
  const [tag, setTag] = useState('All')
  const suggestionsUrl = '/hopsapi/suggestions'
  
  function doNothing(){

  }

  function switchTag(tagLabel){

    setTag(tagLabel)
    //setTag(tagLabel)
  }

  function SuggestionItem({ suggestion ,tags}) {
    const[selected,setSelected] = useState(selectedIds.current.includes(suggestion.id));
    // const [titleText, setTitleText] = useState(initialTitle)
    // function handleTitleTextEntry(e) {
    //   titleRef.current = e.target.value;
    //   setTitleText(e.target.value)
    // }

    useEffect(() => {
      setSelected(selectedIds.current.includes(suggestion.id))
    }, [suggestion])

    return tags.tags && tags.tags.includes(tag)?  
          <div className={clsx('box', 'is-active', selected? 'active-suggestion':'inactive-suggestion')} 
            
            onClick={()=>{setSelected(!selected);handleSelection(suggestion,!selected)}}>
             {suggestion.name}</div> :
             <div></div>;

  }





  function handleSelection(suggestion,isAddition){
    //handlePick(value,CONSTANTS.TEXT_TYPE)
    if(isAddition){
      if(!selectedIds.current.includes(suggestion.id) ){
        selectedIds.current.push(suggestion.id)
    }
      
    }else{
      if(selectedIds.current.includes(suggestion.id) ){
        const index = selectedIds.current.indexOf(suggestion.id);
        if(index > -1){
          selectedIds.current.splice(index,1)
        }
      }
    }
    pickDto.set(suggestion.id ,{action:isAddition?"ADD":"DELETE",entry: {name: suggestion.name, type: CONSTANTS.TEXT_TYPE, suggestionId:suggestion.id}});
  }

  useEffect(async () => {
    try {
      const suggestionsData = await axios.get(suggestionsUrl, { timeout: CONSTANTS.REQUEST_TIMEOUT })
      setSuggestions(suggestionsData.data.data)
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  // useEffect(async () => {
  //   try {
  //       setSuggestions(suggestions.map((suggestion) => suggestion.tags.tags.includes(tag)))
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // }, [tag]);

  return <div className={clsx('modal', 'is-radiusless',visible ? 'is-active' : '')}>
    <div class="modal-background" onClick={onCancel}></div>
    <div className={clsx('modal-card','has-background-white')}>
      <header class="modal-card-head">
        <p className={clsx('title')}>Smart Picker</p>
        <div></div>
      </header>
      <section class="modal-card-body p-4">
      <nav class="level">
  <div class="level-item has-text-centered">
    <div>
    <span class="button is-link is-large is-hoverable is-rounded" onClick={()=>switchTag('All')}>All</span>
    </div>
  </div>
  <div class="level-item has-text-centered">
  <div>
    <span class="button is-link is-large is-hoverable is-rounded" onClick={()=>switchTag('Lighter')}>Lighter</span>
    </div>
  </div>
  <div class="level-item has-text-centered">
  <div>
    <span class="button is-link is-large is-hoverable is-rounded" onClick={()=>switchTag('Greener')}>Greener</span>
    </div>
  </div>
</nav>
        <div className={clsx('container')}>
          <ul>
            {suggestions.map((value, index) => { ; return <li><SuggestionItem suggestion={value.suggestion} tags={value.tags}></SuggestionItem></li> })}
          </ul>
        </div>

      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button class="button is-success" onClick={onOk}>Ok</button>
          <button class="button" onClick={onCancel}>Cancel</button>
        </div>
      </footer>
    </div>

  </div>

}
);

export default SmartPicker;