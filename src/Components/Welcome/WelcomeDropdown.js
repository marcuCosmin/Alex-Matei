import React from 'react';
import styles from './Welcome.module.css';

export default function WelcomeDropdown(props) {
  return (
    <div className={`shadow mb-4 ${styles.wl_dropdown}`}>
        <h2 tabIndex="0" className={`text-center m-0 rounded-top p-2 ${styles.wl_title} ${props.value && styles.wl_title_open}`} onKeyUp={function(e) {e.key === 'Enter' && props.update()}} onClick={props.update}><span>{props.title}</span></h2>
        <article className={`rounded-bottom ${styles.wl_article} ${props.value && 'p-2'}`} style={{maxHeight: `${props.value ? props.contentHeight : 0}px`}} >{props.content}</article>
    </div>
  )
}
