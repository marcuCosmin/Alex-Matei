import React, {useState} from 'react'
import WelcomeDropdown from './WelcomeDropdown';
import styles from './Welcome.module.css';
import { Link } from 'react-router-dom';

export default function Welcome() {
  const [dropdowns, setDropDowns] = useState({
    about: false,
    howto: false,
    pricing: false,
    faq: false
  });

  console.log(dropdowns);
  return (
    <div className='mt-4 d-flex justify-content-center'>

      <ul className={`p-0 m-0 ${styles.wl_list}`}>
        <li>
          <WelcomeDropdown contentHeight={300} value={dropdowns.about} update={function() {setDropDowns({...dropdowns, about: !dropdowns.about})}} title="About"
          content={`
           Papery offers an online customizable HR platform for its users. An organization's employees can directly send different requests (eg. days off, work from home, extra working hours, etc.) with only a few clicks to the HR team. The requests can be accepted / denied based on the customized cirteria of each company. The employees can also review their monthly income, view how many available days off they have left and ask for support from the HR team when needed. This concept's pourpose is to save the employees' time regarding the back and forth that they are experiencing regarding those requests and to discourage the waste of paper that is made.
          `}/>
        </li>
        <li>
          <WelcomeDropdown contentHeight={170} value={dropdowns.howto} update={function() {setDropDowns({...dropdowns, howto: !dropdowns.howto})}} title="How to use" content={
            <>
              <div>Papery is relatively easy to use, but for users that encounter any kind of difficulties while using this platform, please see below the 2 guides, for both employers and employees.</div>
              <div className='d-flex justify-content-between mt-2'>
                <Link tabIndex={dropdowns.howto ? '0' : '-1'} className='ms-3' exact="true" to="/guides/employers">Employers</Link>
                <Link tabIndex={dropdowns.howto ? '0' : '-1'} className='me-3' exact="true" to="/guides/employees">Employees</Link>
              </div>
            </>
          }/>
        </li>
        <li>
          <WelcomeDropdown contentHeight={300} value={dropdowns.pricing} update={function() {setDropDowns({...dropdowns, pricing: !dropdowns.pricing})}} title="Pricing" content="Content"/>
        </li>
        <li>
          <WelcomeDropdown contentHeight={300} value={dropdowns.faq} update={function() {setDropDowns({...dropdowns, faq: !dropdowns.faq})}} title="FAQ" content="Content"/>
        </li>
        <li>
          <WelcomeDropdown value={dropdowns.contact} update={function() {setDropDowns({...dropdowns, contact: !dropdowns.contact})}} title="Contact us" content="Form"/>
        </li>
      </ul>
    </div>
  )
}
