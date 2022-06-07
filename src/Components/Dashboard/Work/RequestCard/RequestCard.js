import React from 'react';
import styles from './RequestCard.module.css';
import sstyles from '../../../Sign/Sign.module.css';

export default function RequestCard(props) {
  return (
    <li className={`p-2 shadow bg-white rounded`}>
        <h5>{props.title}</h5>
        <div>Requested by {props.requester}</div>
        <div>Requested at {props.date}</div>
        <div className='d-flex justify-content-between mt-3'>
            <button className={`p-2 rounded ${sstyles.inputs}`} type='button'>Accept</button>
            <button className={`p-2 rounded ${sstyles.inputs}`} type='button'>Decline</button>
        </div>
    </li>
  )
}
