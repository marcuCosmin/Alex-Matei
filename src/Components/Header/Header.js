import React, {useContext, useEffect, useState, useRef} from 'react';
import { Link, NavLink } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";
import styles from './Header.module.css';
import cstyles from '../../Common.module.css';
import {user} from '../../Contexts/Authentication';
import Logo from '../Logo/Logo';
import Checkbox from '../Checkbox/Checkbox';
import Loader from '../Loader/Loader';
import { deviceWidth } from '../../Contexts/DeviceWidth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEye, faEyeSlash, faTimes, faSignOutAlt, faCog, faDollarSign, faHistory, faPaperPlane, faUser, faQuestionCircle, faUsersCog, faBell } from '@fortawesome/free-solid-svg-icons';
import Dropdown from '../Dropdown/Dropdown';
import { userTiitle } from '../../Contexts/Ttile';

export default function Header() {

    const u = useContext(user);
    const dw = useContext(deviceWidth);
    const navDrop = useContext(userTiitle);

    const [navDropIsVisible, setNavDropIsVisisible] = useState(false);

    const [signDropdown, setSignDropdown] = useState(false);
    const signDropdownRef = useRef(null);

    function escapeDropdown(e) {
        if (signDropdownRef.current) {
            if (e.target !== signDropdownRef.current && !signDropdownRef.current.contains(e.target)) {
                setSignDropdown(false);
                window.removeEventListener('click', escapeDropdown);
            }
        }
    }


    useEffect(function() {

        if (signDropdown) {
            window.addEventListener('click', escapeDropdown);
        }

    }, [signDropdown]);
    
    return (
        <nav className='d-flex w-100 justify-content-end align-items-end navbar py-2 pt-0 ps-2 pe-4' style={{minHeight: '75px'}}>
            <div>

                <Dropdown titleStyle={{border: 'none', background: 'white'}} style={{width: '200px', marginRight: '2rem'}} items={['Scriptwriter', 'Quality Assurance', 'Project Manager', 'Team Leader', 'Manager', 'Human Resources']} visible={navDropIsVisible} setValue={navDrop.update} setVisibility={function() {setNavDropIsVisisible(!navDropIsVisible)}} value={navDrop.value} />
            </div>
            <div>  
                <div className={`position-relative ${styles.dropdown}`}>
                    <div tabIndex='0' className={`fw-bold ${styles.dropdown_title} ${signDropdown && styles.dropdown_title_active}`} onClick={function() {!signDropdown && setSignDropdown(true);}}>{u.displayName}</div>
                    <ul ref={signDropdownRef} className={`rounded ${[cstyles.list, styles.dropdown_list].join(' ')} ${signDropdown ? 'visible py-2 px-3' : 'invisible p-0'}`} style={{maxHeight: `${signDropdown ? 500 : 0}px`}}>
                        <li tabIndex='0' className={`text-nowrap mb-${dw <= 450 ? '3' : '2'}`}><FontAwesomeIcon className='me-2' icon={faBell}/>Notifications</li>
                        <li tabIndex='0' className={`text-nowrap mb-${dw <= 450 ? '3' : '2'}`}><FontAwesomeIcon className='me-2' icon={faCog}/>Settings</li>
                        <li tabIndex='0' className='text-nowrap' onKeyUp={function(e) {
                            if (e.key === 'Enter') {
                                signOut(getAuth()).then(function() {
                                    window.location.href = '/';
                                });
                            }
                        }} onClick={function() {
                            signOut(getAuth()).then(function() {
                                window.location.href = '/';
                            });
                        }}><FontAwesomeIcon className='me-2' icon={faSignOutAlt}/>Sign out</li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
