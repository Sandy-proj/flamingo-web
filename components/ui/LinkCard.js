import clsx from 'clsx';
import { isValidElement, useState } from 'react';
import {Icon} from '@mdi/react'
import {mdiLink, mdiCheckBold, mdiHeadQuestion} from '@mdi/js'
import { CONSTANTS } from '../Util/Constants';

export default  function LinkCard({url,label}){
    return<a href={url} target="_blank" rel="noopener noreferrer"><div className={clsx('card')} href={url}>
      
      <div class="card-content">
        <div class="media">
          <div class="media-left">
            <figure class="image is-48x48">
              <Icon path={mdiLink} color={'#00f'}></Icon>
            </figure>
          </div>
          <div class="media-content">
            <p class="title is-5">{label?label:'Link'}</p>
            <p class="subtitle is-6">{url.length>100?url.substring(0,10)+"...":url}</p>
          </div>
        </div>
      </div>
    </div>
    </a>
  }