import { initializeApp } from 'firebase/app';
import 'bootstrap/dist/css/bootstrap.css';
import styles from './App.module.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {useContext} from 'react';
import { deviceWidth } from './Contexts/DeviceWidth';
import Header from './Components/Header/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { user } from './Contexts/Authentication';
import Sign from './Components/Sign/Sign';
import Dashboard from './Components/Dashboard/Dashboard';
import Calendar from './Components/Dashboard/Calendar/Calendar';
import Team from './Components/Dashboard/Team/Team';
import Work from './Components/Dashboard/Work/Work';
import Confidential from './Components/Dashboard/Confidential/Confidential';
import Requests from './Components/Dashboard/Requests/Requests';
import Loader from './Components/Loader/Loader';

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
  const u = useContext(user);

  return (
      <>
        <div>
          {u.completed ? (
            <Router>
              {u.isSignedIn && (
                  <>
                    <Header/>
                    <Dashboard/>
                  </>
              )}
              <Routes>
                <Route exact path='/' element={u.isSignedIn ? <Dashboard/> : <Sign/>}/>
                <Route exact path='/team' element={<Team/>}/>
                <Route exact path='/calendar' element={<Calendar/>}/>
                <Route exact path='/requests' element={<Requests/>}/>
                <Route exact path='/work' element={<Work/>}/>
                <Route exact path='/confidential' element={<Confidential/>}/>
              </Routes>
            </Router>
          ) : <Loader text='Loading' absolute={true} size='250%'/>}
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
