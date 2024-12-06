import { mdiAccount, mdiAccountCircle, mdiCheck, mdiCheckBold, mdiClose } from "@mdi/js";
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
        <a style={{ display: "flex", alignContent: "center" }} className={clsx('box', 'is-radiusless', 'is-shadowless', 'is-borderless', 'mt-0.5', 'is-active', selected ? 'active-suggestion' : 'inactive-suggestion')}

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
      <div class="modal-background" onClick={onCancel}></div>
      <div className={clsx('modal-card', 'has-background-white', 'trypsmart-picker')}>
        <nav class="level is-mobile">

          <div class="level-left">
            <div class="level-item ml-5 mt-5">
              <div>
              <p className={clsx('is-size-4','has-text-link')}><strong>Suggestions</strong></p>
                <p class="is-size-6">Select the items to add to your checklist.</p>

              </div>
            </div>

          </div>

          <div class="level-right">
          <button class="button is-ghost" onClick={onCancel} >
                              <span className={clsx('has-text-link')} ><Icon path={mdiClose} size={1.5}></Icon></span>
                            </button>
            <p class="level-item mr-5 mt-5"><a class="is-link"><Icon path={mdiCheckBold}></Icon></a></p>
          </div>
        </nav>
        <section class="modal-card-body p-2">
          <nav className={clsx('level','is-mobile')}>
            <div class="level-item has-text-centered">
              <div>
                <span className={clsx('button','has-text-weight-bold', 'is-small', 'is-link', 'is-rounded', tag === 'All' ? '' : 'is-outlined')} onClick={() => switchTag('All')}>All</span>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <span className={clsx('button','has-text-weight-bold', 'is-small',  'is-link', 'is-rounded', tag === 'Lighter' ? '' : 'is-outlined')} onClick={() => switchTag('Lighter')}>Lighter</span>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <span className={clsx('button', 'has-text-weight-bold', 'is-small', 'is-link', 'is-rounded', tag === 'Greener' ? '' : 'is-outlined')} onClick={() => switchTag('Greener')}>Greener</span>
              </div>
            </div>
          </nav>
          <div className={clsx('container')}>
            <ul>
              {suggestions.map((value, index) => { ; return <li><SuggestionItem suggestion={value.suggestion} tags={value.tags}></SuggestionItem></li> })}
            </ul>
          </div>

        </section>
        <footer class="columns has-background-white"  >

            <button class="button mr-15 column is-half is-offset-one-quarter is-success is-centered is-full-width mb-5" onClick={onOk}>Done</button>

        </footer>
      </div>

    </div>

  }
);

export default SmartPicker;