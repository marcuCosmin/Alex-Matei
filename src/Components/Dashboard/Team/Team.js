import React, {useState, useEffect} from 'react';
import styles from './Team.module.css';
import sstyles from '../../Sign/Sign.module.css';
import { getFirestore, doc, updateDoc, arrayUnion, onSnapshot, collection, setDoc, query, where } from "firebase/firestore";
import Loader from '../../Loader/Loader';
import Dropdown from '../../Dropdown/Dropdown';
import cloneDeep from 'lodash.clonedeep';
import UserCard from './UserCard/UserCard';

export default function Team() {

  const years = [];

  for (let i = new Date().getFullYear() - 18; i >= new Date().getFullYear() - 66; i--) {
    years.push(i);
  }

  const [userIds, setUserIds] = useState([]);

  function generateUid() {
    const genratedId = Math.random() * 999999999999999999999;
    return userIds.includes(genratedId) ? generateUid() : genratedId;
  }

  const [users, setUsers] = useState({
    loading: false,
    values: []
  });

  const [register, setRegister] = useState({
    age: {
      numberOfDays: new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate(),
      day: 1,
      month: 1,
      year: new Date().getFullYear() - 18,
      days: getDays(new Date().getFullYear(), new Date().getMonth() + 1),
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    },
    name: {
      last: {
        value: '',
        error: {
          visible: false,
          value: ''
        }
      },
      first: {
        value: '',
        error: {
          visible: false,
          value: ''
        }
      }
    },
    email: {
      value: '',
      error: {
        visible: false,
        value: ''
      }
    },
    title: {
      value: 'Job title',
      error: false,
      visible: false
    }
  });

  useEffect(function() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    let currentMonth = register.age.month;
    const days = [...getDays(register.age.year, months.findIndex(month => month === currentMonth) + 1)];

    if (register.age.year === years[years.length - 1] || register.age.year === years[0]) {
      if (register.age.year === years[years.length - 1]) {
        months.splice(0, months.findIndex(month => month === new Date().toLocaleString('default', {month: 'long'})));
      } else {
        months.splice(months.findIndex(month => month === new Date().toLocaleString('default', {month: 'long'})) + 1);
      }

      currentMonth = months.includes(currentMonth) ? currentMonth : months[0];

      if (currentMonth === months[0] || currentMonth === months[months.length - 1]) {
        if (currentMonth === months[0] && years[years.length - 1] === register.age.year) {
          days.splice(0, new Date().getDate());
        } else if (currentMonth === months[months.length - 1] && years[0] === register.age.year) {
          days.splice(new Date().getDate());
        }
        
      }
    }

    setRegister({...register, age: {...register.age, days: days, months: months, month: currentMonth}});
  }, [register.age.year, register.age.month])

  useEffect(function() {
    setUsers({...users, loading: true});

    onSnapshot(query(collection(getFirestore(), 'employees')), function(querySnapshot) {
      const users = []
      querySnapshot.forEach(function(doc) {
          users.push(doc.data());
      });
      setUsers({loading: false, values: users});
    });

    onSnapshot(doc(getFirestore(), 'employees', 'ids'), function(doc) {
      setUserIds(doc.data().values);
  });
  }, []);

  function getDays(year, month) {
    const toBeReturned = [];

    for (let i = 1; i <= new Date(year, month, 0).getDate(); i++) {
      toBeReturned.push(i)
    }

    return toBeReturned;
  }

  return (
    <div>
      {users.loading ? (
        <Loader text='Loading users info' absolute={true} size='250%'/>
      ) : (
        <div className='d-flex justify-content-end p-5'>
          {users.values.length === 0 ? (
              <div className='me-5'>There aren't any people in your team yet.</div>
            ) : (
              <ul className='me-5'>
                {users.values.map(function(user, index) {if (!user.hasOwnProperty('values')) {return <UserCard joined={user.joined} displayName={user.displayName} title={user.title} key={index}/>}})}
              </ul>
            )}

            <form className={`p-3 bg-white shadow rounded`} style={{userSelect: 'none'}} onSubmit={function(e) {
              e.preventDefault();
              const shallowRegister = cloneDeep(register);
              let failed = false;

              if (register.name.first.value.length < 3) {
                failed = true;
                shallowRegister.name.first.error.visible = true;
                if (register.name.first.value.length > 0) {
                  shallowRegister.name.first.error.value = 'The first name can not be shorter than 3 characters';
                }
              }

              if (register.name.last.value.length < 3) {
                failed = true;
                shallowRegister.name.last.error.visible = true;
                if (register.name.last.value.length > 0) {
                  shallowRegister.name.last.error.value = 'The last name can not be shorter than 3 characters';
                }
              }

              if (register.title.value === 'Job title') {
                failed = true;
                shallowRegister.title.error = true;
              }

              setRegister(shallowRegister);

              if (!failed) {
                setDoc(doc(collection(getFirestore(), 'employees'), generateUid().toString()), {
                  displayName: `${register.name.first.value} ${register.name.last.value}`,
                  email: `${register.name.first.value}.${register.name.last.value}@yahoo.com`,
                  directManager: '',
                  joined: `${new Date().toLocaleString('default', {month: 'long'})}/${new Date().getDate()}/${new Date().getFullYear()}`,
                  calendar: [],
                  title: register.title.value,
                  dateOfBirth: `${register.age.month}/${register.age.day}/${register.age.year}`
                });
              }
            }}>
              <h4 className={`text-center mb-3`}>Register an employee</h4>

              <div>

                <div className='d-flex'>
                  <input maxLength='15' className={`p-2 w-100 me-3 rounded ${sstyles.inputs} ${register.name.first.error.visible && sstyles.inputs_errors}`} type='text' placeholder='First name' value={register.name.first.value} onChange={function(e) {setRegister({...register, name: {...register.name, first: {value: e.target.value, error: {visible: false, value: ''}}}})}}/>
                  <input maxLength='15' className={`p-2 w-100 rounded ${sstyles.inputs} ${register.name.first.error.visible && sstyles.inputs_errors}`} type='text' placeholder='Last name' value={register.name.last.value} onChange={function(e) {setRegister({...register, name: {...register.name, last: {value: e.target.value, error: {visible: false, value: ''}}}})}}/>
                </div>

                <div className={`p-2 rounded mt-3 ${[sstyles.inputs, styles.disabled_input].join(' ')}`}>
                  {(register.name.first.value.length && register.name.last.value.length) ? `${register.name.first.value}.${register.name.last.value}@yahoo.com` : 'Email'}
                </div>

                <div className={`d-flex justify-content-between w-100 mt-3`}>
                  <ul className={`m-0 p-0 rounded ${styles.age_select}`}>
                    {years.map(year => <li className={`p-2 ${register.age.year === year && styles.age_select_current}`} tabIndex='0' key={year} data-year={year} onKeyUp={function(e) {e.key === 'Enter' && setRegister({...register, age: {...register.age, year: parseInt(e.target.dataset.year)}})}} onClick={function(e) {setRegister({...register, age: {...register.age, year: parseInt(e.target.dataset.year)}})}}>{year}</li>)}
                  </ul>

                  <ul className={`m-0 p-0 rounded  ${styles.age_select}`}>
                    {register.age.months.map((month, index) => <li className={`p-2 ${register.age.month === month && styles.age_select_current}`} key={index} tabIndex={0} data-month={month} onKeyUp={function(e) {e.key === 'Enter' && setRegister({...register, age: {...register.age, month: e.target.dataset.month}})}} onClick={function(e) {setRegister({...register, age: {...register.age, month: e.target.dataset.month}})}}>{month}</li>)}
                  </ul>

                  <ul className={`m-0 p-0 rounded ${styles.age_select}`}>
                    {register.age.days.map(day => <li className={`p-2 ${register.age.day === day && styles.age_select_current}`} tabIndex='0' key={day} data-day={day} onKeyUp={function(e) {e.key === 'Enter' && setRegister({...register, age: {...register.age, day: parseInt(e.target.dataset.day)}})}} onClick={function(e) {setRegister({...register, age: {...register.age, day: parseInt(e.target.dataset.day)}})}}>{day}</li>)}
                  </ul>
                </div>

                <Dropdown error={register.title.error} visible={register.title.visible} setVisibility={function() {setRegister({...register, title: {...register.title, visible: !register.title.visible, error: false}})}} items={['Scriptwriter', 'Quality Assurance', 'Project Manager', 'Team Leader', 'Manager', 'Vice President', 'Human Resources']} value={register.title.value} setValue={function(val) {setRegister({...register, title: {...register.title, value: val, error: false}, });}}/>

                <button className={`p-2 w-100 rounded mt-3 ${sstyles.inputs}`}>Submit</button>

              </div>
            </form>
          </div>
      )}
    </div>
  )
}
