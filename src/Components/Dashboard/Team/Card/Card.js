import React, {useEffect, useState} from 'react';
import styles from './Card.module.css';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import userImg from '../../../../User Standard Img.jpg';
import { getFirestore, doc, updateDoc, arrayUnion, onSnapshot, collection, setDoc, query, where } from "firebase/firestore";

export default function Card(props) {

  console.log(props.name);

  const [values, setValues] = useState({
    manager: {

    },
    members: []
  });

  useEffect(function() {
    onSnapshot(doc(getFirestore(), 'teamleaders', props.manager), function(doc) {
      setValues({...values, manager: doc.data()})
  });
  }, []);

  // displayName: createTeam.team.value,
  // created: `${new Date().toLocaleString('default', {month: 'long'})}/${new Date().getDate()}/${new Date().getFullYear()}`,
  // id: generatedId.toString(),
  // shift: `${createTeam.shift ? 'Morning' : 'Night'} Shift`,
  // members: [],
  // speciality: createTeam.speciality.value,
  // manager: createTeam.addManager.id
   return (
    <div className={`p-3 shadow bg-white rounded`}>
        <div>
          <div className='text-center'>
            <h4>{props.name}</h4>
          </div>
            <h2 className={`text-center ${styles.sub}`}>{props.displayName}</h2>
            <div className={`${styles.sub}`}>Created: {props.created}</div>
            <div className={`${styles.sub}`}>
              Manager: {values.manager.displayName}
            </div>
            <div>
              <h5 className='text-center mt-2'>Members</h5>
              <ul>
                <li></li>
              </ul>
            </div>
        </div>
    </div>
  )
}
