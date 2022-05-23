import { initializeApp } from 'firebase/app';
import 'bootstrap/dist/css/bootstrap.css';
import styles from './App.module.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {useContext} from 'react';
import { deviceWidth } from './Contexts/DeviceWidth';
import Header from './Components/Header/Header';
import Welcome from './Components/Welcome/Welcome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Employees from './Components/Guides/Employees';
import Employers from './Components/Guides/Employers';

initializeApp({
  apiKey: "AIzaSyDQE01TMc74eoeHEmQjglYVN137SEXaqV4",
  authDomain: "alexandru-matei.firebaseapp.com",
  projectId: "alexandru-matei",
  storageBucket: "alexandru-matei.appspot.com",
  messagingSenderId: "884673360520",
  appId: "1:884673360520:web:f27a157cb6412fb64b653d"
});

function App() {

  const dw = useContext(deviceWidth);
  
  return (
      <>
        <div>
          <Router>
            <Header/>
            <Routes>
              <Route exact path='/' element={<Welcome/>}/>
              <Route exact path='/guides/employees' element={<Employees/>}/>
              <Route exact path='/guides/employers' element={<Employers/>}/>
            </Routes>
          </Router>
        </div>

        {dw < 320 && (

        
        <div className={`d-flex flex-column justify-content-center align-items-center position-fixed bg-white w-100 h-100 ${styles.unsupported_device_container}`}>

          <div className={`d-flex p-1 shadow flex-column align-items-center position-relative ${styles.unsupported_device}`}>
            <div className={`my-1 ${styles.unsupported_device_header}`}></div>
            <div className={`h-100 w-100 ${styles.unsupported_device_screen}`}></div>
            <div className={`rounded-circle my-1 ${styles.unsupported_device_footer}`}></div>
            <div className='position-absolute w-100 h-100 d-flex flex-column justify-content-center align-items-center'>
              <div className='w-50'>
                <div className={`d-flex rounded-circle justify-content-center align-items-center text-center text-white ${styles.unsupported_device_forbidden}`}>{dw}</div>
                <div className='d-flex justify-content-between'>
                  <div className={`text-white ${styles.unsupported_device_arrows}`}><FontAwesomeIcon icon={faArrowLeft}/></div>
                  <div className={`text-white ${styles.unsupported_device_arrows}`}><FontAwesomeIcon icon={faArrowRight}/></div>
                </div>
              </div>
            </div>
          </div>

          <div className='text-center fw-bold mt-2'>We are not supporting devices with a width smaller than 320px, please use a larger device</div>  
        </div>

        )}
      </>
  );
}

export default App;
