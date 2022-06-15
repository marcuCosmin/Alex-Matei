import React, {useEffect, useState} from 'react';
import styles from './Card.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import userImg from '../../../../User Standard Img.jpg';
import { getFirestore, doc, updateDoc, arrayUnion, onSnapshot, collection, setDoc, query, where } from "firebase/firestore";
import { faUsers } from '@fortawesome/free-solid-svg-icons';

export default function Card(props) {

  const [values, setValues] = useState({
    manager: {

    },
    members: []
  });

  useEffect(function() {
    if (props.manager) {
      onSnapshot(doc(getFirestore(), 'teamleaders', props.manager), function(doc) {
        setValues({...values, manager: doc.data()})
      });
    }
  }, []);

  // types:
  // 1 - Team
  // 2 - Employee
  // 3 - Employee create Team

   return (
    <div className={`p-3 shadow bg-white rounded`}>
        <div>
            {props.type === 1 && (
              <div className='text-center'>
                <h4>{props.name}</h4>
              </div>
            )}

            <div className='text-center'>
              {props.type === 1 ? <FontAwesomeIcon className={styles.team_logo} icon={faUsers}/> : <img className={`rounded-circle ${styles.image}`} style={{width: '50px'}} src={userImg}/>}
              {props.type === 3 ? <h6 className={`text-center mt-2 ${styles.sub}`}>{props.displayName}</h6>  : <h4 className={`text-center mt-2 ${styles.sub}`}>{props.displayName}</h4>}
              {props.type === 2 && <h5>{props.title}</h5>}
              {props.type === 2 && <div className='mb-2'>{props.email}</div>}
            </div>


            {props.type !== 3 && <div className={`${styles.sub}`}>Created: {props.created}</div>}

            {props.type !== 3 && <div className={`${styles.sub}`}>Manager: {values.manager.displayName ? values.manager.displayName : 'None'}</div>}
            {props.type === 2 && <div className={`${styles.sub}`}>Shift: {props.shift}</div>}
            {props.type === 1 && (
              <div>
                <h5 className='text-center mt-2'>Members</h5>
                <ul>
                  <li></li>
                </ul>
              </div>
            )}

        </div>
        <div className='d-flex justify-content-center mt-3'>
          <FontAwesomeIcon className={`${props.type !== 3 && 'me-4'} ${styles.svgs}`} onClick={props.delete} icon={faTrash}/>
          {props.type !== 3 && <FontAwesomeIcon className={`${styles.svgs}`} icon={faPen}/>}
        </div>
    </div>
  )
}
