import { mdiAccount, mdiAccountCircle, mdiCheck, mdiCheckBold, mdiClose, mdiLightbulb } from "@mdi/js";
import Icon from "@mdi/react";
import clsx from "clsx";
import axios from 'axios'
import React from "react";
import { useEffect } from 'react'
import { useContext, useState } from 'react'
import { CONSTANTS } from '../../components/Util/Constants'


const SmartPicker = React.memo(
  function SmartPicker({ visible, onDeactivate, onAgree, onOk, onCancel, selectedIds, pickDto }) {
    const [suggestions, setSuggestions] = useState([])
    const [tag, setTag] = useState('All')
    const suggestionsUrl = '/hopsapi/suggestions'

    function doNothing() {

    }

    function switchTag(tagLabel) {

      setTag(tagLabel)
      //setTag(tagLabel)
    }

    function SuggestionItem({ suggestion, tags }) {
      const [selected, setSelected] = useState(selectedIds.current.includes(suggestion.id));
      // const [titleText, setTitleText] = useState(initialTitle)
      // function handleTitleTextEntry(e) {
      //   titleRef.current = e.target.value;
      //   setTitleText(e.target.value)
      // }

      useEffect(() => {
        setSelected(selectedIds.current.includes(suggestion.id))
      }, [suggestion])

      return tags.tags && tags.tags.includes(tag) ? <div>
        <a style={{ display: "flex", alignContent: "center" }} className={clsx('box', 'is-radiusless', 'is-shadowless', 'suggestion-item', 'is-borderless', 'mt-0.5', 'is-active', selected ? 'active-suggestion' : 'inactive-suggestion')}

          onClick={() => { setSelected(!selected); handleSelection(suggestion, !selected) }}>
          <span className={clsx('has-text-success', selected ? 'trypsmart-visible' : 'trypsmart-hidden', 'mr-2')}><Icon path={mdiCheck} size={0.75}></Icon></span>{suggestion.name}</a></div> :
        <div></div>;

    }





    function handleSelection(suggestion, isAddition) {
      //handlePick(value,CONSTANTS.TEXT_TYPE)
      if (isAddition) {
        if (!selectedIds.current.includes(suggestion.id)) {
          selectedIds.current.push(suggestion.id)
        }

      } else {
        if (selectedIds.current.includes(suggestion.id)) {
          const index = selectedIds.current.indexOf(suggestion.id);
          if (index > -1) {
            selectedIds.current.splice(index, 1)
          }
        }
      }
      pickDto.set(suggestion.id, { action: isAddition ? "ADD" : "DELETE", entry: { name: suggestion.name, type: CONSTANTS.TEXT_TYPE, suggestionId: suggestion.id } });
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

    return <div className={clsx('modal', 'is-radiusless', visible ? 'is-active' : '')}>
      <div class="modal-background" onClick={doNothing}></div>
      <div className={clsx('modal-card', 'has-background-white', 'trypsmart-picker')}>
        <nav class={clsx('level','is-mobile','remove-level-margin')}>

          <div class="level-left">
            <div class="level-item ml-5 mt-5">
              <div>
                <p className={clsx('is-size-5', 'has-text-link')}><strong>Suggestions</strong></p>
                <p class="is-size-7 is-text-weight-light">Select the items to add to your checklist.</p>

              </div>
            </div>

          </div>

          <div class="level-right">
            <button class="button is-ghost" onClick={onCancel} >
              <span className={clsx('has-text-gray')} ><Icon path={mdiClose} size={1.5}></Icon></span>
            </button>
          </div>
        </nav>
        <hr className="seperator"/>
        <section class="modal-card-body p-0">
          <nav className={clsx('level', 'is-mobile','remove-level-margin','mt-2')}>
            <div className={clsx('level-item','has-text-centered')}>
              <div>
                <p onClick={()=>switchTag('All')} className={clsx('thumbnail','overlay-layer','is-clickable',tag==='All'?'thumbnail-selected':'')} style={{
                  backgroundImage: "url(" + "/travel-theme.jpg" + ")",
                  backgroundPosition: 'center',
                  backgroundSize: 'cover'
                }}></p>
                
                <p className={clsx('button','has-text-weight-bold', 'is-small', 'is-ghost', tag === 'All' ?['has-text-success','has-text-weight-bold'] : 'has-text-gray')}  onClick={() => switchTag('All')}>All</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
            <div>
                <p onClick={()=>switchTag('Trekking')} className={clsx('thumbnail','overlay-layer','is-clickable',tag==='Trekking'?'thumbnail-selected':'')} style={{
                  backgroundImage: "url(" + "/travel-theme2.jpg" + ")",
                  backgroundPosition: 'center',
                  backgroundSize: 'cover'
                }}></p>
                
                <p className={clsx('button','has-text-weight-bold', 'is-small', 'is-ghost', tag === 'Trekking' ?['has-text-success','has-text-weight-bold'] : 'has-text-gray')}  onClick={() => switchTag('Trekking')}>Trekking</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
            <div>
                <p onClick={()=>switchTag('Road trip')} className={clsx('thumbnail','overlay-layer','is-clickable',tag==='Road trip'?'thumbnail-selected':'')} style={{
                  backgroundImage: "url(" + "/basic_logo.png" + ")",
                  backgroundPosition: 'center',
                  backgroundSize: 'cover'
                }}></p>
                
                <p className={clsx('button','has-text-weight-bold', 'is-small', 'is-ghost', tag === 'Road trip' ?['has-text-success','has-text-weight-bold'] : 'has-text-gray')}  onClick={() => switchTag('Road trip')}>Road trip</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
            <div>
                <p onClick={()=>switchTag('Train')} className={clsx('thumbnail','overlay-layer','is-clickable',tag==='Train'?'thumbnail-selected':'')} style={{
                  backgroundImage: "url(" + "/travel-theme.jpg" + ")",
                  backgroundPosition: 'center',
                  backgroundSize: 'cover'
                }}></p>
                
                <p className={clsx('button','has-text-weight-light', 'is-small', 'is-ghost', tag === 'Train' ? ['has-text-success','has-text-weight-bold'] : 'has-text-gray')} onClick={() => switchTag('Train')}>Train</p>
              </div>
            </div>
          </nav>

          <div className={clsx('container','p-2')}>
            <ul>
              {suggestions.map((value, index) => { ; return <li><SuggestionItem suggestion={value.suggestion} tags={value.tags}></SuggestionItem></li> })}
            </ul>
          </div>

        </section>
        <hr className="seperator"/>
        <footer class="columns has-background-white is-mobile mt-0"  >
                
          <button class="button mr-15 column is-half is-offset-one-quarter is-link is-centered is-full-width mb-5 has-text-weight-bold" onClick={onOk}>Done</button>

        </footer>
      </div>

    </div>

  }
);

export default SmartPicker;