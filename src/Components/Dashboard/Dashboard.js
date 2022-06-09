import React, {useContext} from 'react';
import styles from './Dashboard.module.css';
import Logo from '../Logo/Logo';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faCalendarAlt, faReceipt, faUsers } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { userTiitle } from '../../Contexts/Ttile';
import {user} from '../../Contexts/Authentication';

export default function Dashboard() {

  const title = useContext(userTiitle);
  const u = useContext(user);

  return (
    <div className={`position-fixed h-100 ${styles.dashboard}`}>
      <div>
        <Logo className='m-3' isLink={true}/>
        <ul className={`p-0 m-0 text-white rounded ${styles.dashboard_list}`}>
          <li className={`d-flex align-items-center ${useLocation().pathname.includes('team') && styles.dashboard_current}`}>
            <Link className='p-3 w-100' exact='true' to='/team'><FontAwesomeIcon className='me-2' icon={faUsers}/> Teams</Link>
          </li>
          <li className={`d-flex align-items-center ${useLocation().pathname.includes('calendar') && styles.dashboard_current}`}>
            <Link className='p-3 w-100' exact='true' to='/calendar'><FontAwesomeIcon className='me-2' icon={faCalendarAlt}/> Calendar</Link>
          </li>
          <li className={`d-flex align-items-center ${useLocation().pathname.includes('requests') && styles.dashboard_current}`}>
            <Link className='p-3 w-100' exact='true' to='/requests'><FontAwesomeIcon className='me-2' icon={faReceipt}/> Requests</Link>
          </li>
          <li className={`d-flex align-items-center ${useLocation().pathname.includes('work') && styles.dashboard_current} ${title.value === 'Human Resources' ? 'd-block' : 'd-none'}`}>
            <Link className='p-3 w-100' to={`/work`}><FontAwesomeIcon className='me-2' icon={faBriefcase}/> Work</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
