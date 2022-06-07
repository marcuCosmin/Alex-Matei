import React from 'react';
import styles from './UserCard.module.css';

export default function UserCard(props) {
  return (
    <div className={`p-3 shadow bg-white rounded`}>
        <div>
            <h4>{props.displayName}</h4>
            <h6>{props.title}</h6>
            <div>Joined: {props.joined}</div>
        </div>
    </div>
  )
}
