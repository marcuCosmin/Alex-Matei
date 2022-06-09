import React, {useState, useEffect, useRef} from 'react';
import styles from './Team.module.css';
import sstyles from '../../Sign/Sign.module.css';
import { getFirestore, doc, updateDoc, arrayUnion, onSnapshot, collection, setDoc, query, where } from "firebase/firestore";
import Loader from '../../Loader/Loader';
import Dropdown from '../../Dropdown/Dropdown';
import cloneDeep from 'lodash.clonedeep';
import Card from './Card/Card';

function getDays(year, month) {
  const toBeReturned = [];

  for (let i = 1; i <= new Date(year, month, 0).getDate(); i++) {
    toBeReturned.push(i)
  }

  return toBeReturned;
}

const createTeamInitial = {
  name: {
    value: '',
    error: {
      value: '',
      visible: false
    }
  },
  speciality: {
    value: 'Speciality',
    error: false,
    visible: false
  },
  addEmployee: {
    value: '',
    visible: false
  },
  addManager: {
    value: '',
    visible: false,
    id: ''
  },
  shift: true
};

const registerInitial = {
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
  },
  shift: true,
  loading: false
};

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

  const addManagerRef = useRef(null);
  const addMemberRef = useRef(null);

  const [createTeam, setCreateTeam] = useState(createTeamInitial);

  const [employees, setEmployees] = useState({
      humanresources: [],
      projectmanagers: [],
      qualityassurance: [],
      scriptwriters: [],
      managers: [],
      teamleaders: []
  });

  const [teams, setTeams] = useState({
      loading: false,
      values: {
        humanresourcesteams: [],
        projectmanagersteams: [],
        qualityassuranceteams: [],
        scriptwritersteams: []
      }
  });

  console.log(teams.values.scriptwritersteams);

  const [register, setRegister] = useState(registerInitial);

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
    setTeams({...teams, loading: true});

    const shallowTeams = cloneDeep(teams.values);

    for (const prop in shallowTeams) {
      onSnapshot(query(collection(getFirestore(), prop)), function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          if (!shallowTeams[prop].includes(doc.data())) {
            shallowTeams[prop].push(doc.data());
          }
        });
      });
    }

    setTeams({values: shallowTeams, loading: false});

    const shallowEmployees = cloneDeep(employees);

    for (const prop in shallowEmployees) {
      onSnapshot(query(collection(getFirestore(), prop)), function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          if (!shallowEmployees[prop].includes(doc.data())) {
            shallowEmployees[prop].push(doc.data());
          }
        });
      });
    }

    setEmployees(shallowEmployees);

    onSnapshot(query(collection(getFirestore(), 'ids')), function(querySnapshot) {
      const shallowIds = cloneDeep(userIds);
      querySnapshot.forEach(function(doc) {
        shallowIds.push(doc._key.path.segments[doc._key.path.segments.length - 1]);
      });
      setUserIds(shallowIds);
    });
  }, []);

  return (
    <div>
      {teams.loading ? (
        <Loader text='Loading teams info' absolute={true} size='250%'/>
      ) : (
        <div className='d-flex justify-content-end p-5'>
            <div className='d-flex flex-column align-items-end w-100 me-4'>

                <div className='w-75'>
                  <h5 className='text-center'>Project Managers</h5>
                  <ul className='d-flex flex-wrap justify-content-between'>{teams.values.projectmanagersteams.length === 0 ? <li className='w-100 text-center'>There are no teams for this category.</li> : teams.values.projectmanagersteams.map((u, index) => <Card created={u.created} manager={u.manager} displayName={u.displayName} key={index}/>)}</ul>
                </div>

                <div className='w-75'>
                  <h5 className='text-center'>Human Resources</h5>
                  <ul className='d-flex flex-wrap justify-content-between'>{teams.values.humanresourcesteams.length === 0 ? <li className='w-100 text-center'>There are no teams for this category.</li> : teams.values.humanresourcesteams.map((u, index) => <Card manager={u.manager} displayName={u.displayName}  key={index}/>)}</ul>
                </div>

                <div className='w-75'>
                  <h5 className='text-center'>Scriptwriters</h5>
                  <ul className='d-flex flex-wrap justify-content-between'>{teams.values.scriptwritersteams.length === 0 ? <li className='w-100 text-center'>There are no teams for this category.</li> : teams.values.scriptwritersteams.map((u, index) => <Card created={u.created} manager={u.manager} displayName={u.displayName} key={index}/>)}</ul>
                </div>

                <div className='w-75'>
                  <h5 className='text-center'>Quality Assurance</h5>
                  <ul className='d-flex flex-wrap justify-content-between'>{teams.values.qualityassuranceteams.length === 0 ? <li className='w-100 text-center'>There are no teams for this category.</li> : teams.values.qualityassuranceteams.map((u, index) => <Card created={u.created} manager={u.manager} displayName={u.displayName}  key={index}/>)}</ul>
                </div>
              
            </div>

            <form className={`p-3 bg-white shadow rounded me-3 d-flex flex-column ${styles.form}`} style={{userSelect: 'none'}} onSubmit={function(e) {
              e.preventDefault();

              let failed = false;

              const shallowCreateTeam = cloneDeep(createTeam);

              if (shallowCreateTeam.name.value.length < 4) {
                if (shallowCreateTeam.name.value.length > 0) {
                  shallowCreateTeam.name.error.value = 'The password can not be shorter than 3 characters';
                }

                shallowCreateTeam.name.error.visible = true;
                failed = true;
              }

              if (shallowCreateTeam.speciality.value === 'Speciality') {
                shallowCreateTeam.speciality.error = true;
                failed = true;
              }

              if (!failed) {
                const generatedId = generateUid();
                setDoc(doc(collection(getFirestore(), shallowCreateTeam.speciality.value.toLowerCase().replace(' ', '') + 'teams'), generatedId.toString()), {
                  displayName: shallowCreateTeam.name.value,
                  created: `${new Date().toLocaleString('default', {month: 'long'})}/${new Date().getDate()}/${new Date().getFullYear()}`,
                  id: generatedId.toString(),
                  shift: `${shallowCreateTeam.shift ? 'Morning' : 'Night'} Shift`,
                  members: [],
                  speciality: shallowCreateTeam.speciality.value,
                  manager: shallowCreateTeam.addManager.id
                }).then(setDoc(doc(collection(getFirestore(), `ids`), generatedId.toString()), {value: generatedId.toString()})).then(function() {
                  setCreateTeam(createTeamInitial);
                });
              }

            }}>
              <h4 className='text-center mb-3'>Create a team</h4>

              <div className='d-flex flex-column h-100'>
                <input maxLength='15' className={`p-2 w-100 me-3 rounded ${sstyles.inputs} ${createTeam.name.error.visible && sstyles.inputs_errors}`} type='text' placeholder='Team name' value={createTeam.name.value} onChange={function(e) {setCreateTeam({...createTeam, name: {...createTeam.name, value: e.target.value}})}}/>

                <Dropdown
                error={createTeam.speciality.error}
                visible={createTeam.speciality.visible}
                setVisibility={function() {setCreateTeam({...createTeam, speciality: {...createTeam.speciality, visible: !createTeam.speciality.visible, error: false}})}}
                items={['Scriptwriters', 'Project Managers', 'Quality Assurance', 'Human Resources']}
                value={createTeam.speciality.value}
                setValue={function(val) {setCreateTeam({...createTeam, speciality: {...createTeam.speciality, value: val, error: false}});}}/>

                <div className='position-relative'>
                  <input onBlur={function(e) {if (!addManagerRef.current.contains(e.relatedTarget)) {setCreateTeam({...createTeam, addManager: {...createTeam.addManager, visible: false}})}}} onFocus={function() {setCreateTeam({...createTeam, addManager: {...createTeam.addManager, visible: true}})}} disabled={employees.teamleaders.length === 0} maxLength='15' className={`p-2 w-100 mt-3 me-3 rounded ${sstyles.inputs} ${employees.teamleaders.length === 0 && styles.disabled_input} ${createTeam.addManager.visible && styles.searchbox_active}`} type='text' placeholder={employees.teamleaders.length === 0 ? 'No managers available' : 'Add a manager to the team'} value={createTeam.addManager.value} onChange={function(e) {setCreateTeam({...createTeam, addManager: {...createTeam.addManager, value: e.target.value}})}}/>
                  {(createTeam.addManager.visible && <ul ref={addManagerRef} className={`position-absolute bg-white shadow rounded-bottom p-2 m-0 ${styles.search_dropdown}`}>

                  {employees.teamleaders.some(em => em.displayName.toLowerCase().includes(createTeam.addManager.value.toLowerCase())) ? (
                    
                    employees.teamleaders.map(function(emp, index) {

                      return emp.displayName.toLowerCase().includes(createTeam.addManager.value.toLowerCase()) && <li onBlur={function(e) {if (!addManagerRef.current.contains(e.relatedTarget)) {setCreateTeam({...createTeam, addManager: {...createTeam.addManager, visible: false, id: emp.id}})}}} tabIndex='0' onClick={function() {setCreateTeam({...createTeam, addManager: {...createTeam.addManager, value: emp.displayName}})}} key={index}>{emp.displayName}</li>

                    })

                  ) : <li>No users match the input</li>}

                  </ul>)}
                </div>

                {createTeam.speciality.value !== 'Speciality' && 

                <div className='position-relative'>
                  <input onBlur={function(e) {if (!addMemberRef.current.contains(e.relatedTarget)) {setCreateTeam({...createTeam, addEmployee: {...createTeam.addEmployee, visible: false}})}}} onFocus={function() {setCreateTeam({...createTeam, addEmployee: {...createTeam.addEmployee, visible: true}})}} disabled={employees.teamleaders.length === 0} maxLength='15' className={`p-2 w-100 mt-3 me-3 rounded ${sstyles.inputs} ${employees.teamleaders.length === 0 && styles.disabled_input} ${createTeam.addEmployee.visible && styles.searchbox_active}`} type='text' placeholder={employees.teamleaders.length === 0 ? 'No employees available' : 'Add a member to the team'} value={createTeam.addEmployee.value} onChange={function(e) {setCreateTeam({...createTeam, addEmployee: {...createTeam.addEmployee, value: e.target.value}})}}/>
                  {(createTeam.addEmployee.visible && <ul ref={addMemberRef} className={`position-absolute bg-white shadow rounded-bottom p-2 m-0 ${styles.search_dropdown}`}>

                  {employees[createTeam.speciality.value.toLowerCase().replace(' ', '')].some(em => em.displayName.toLowerCase().includes(createTeam.addEmployee.value.toLowerCase())) ? (
                    
                    employees[createTeam.speciality.value.toLowerCase().replace(' ', '')].map(function(emp, index) {

                      return emp.displayName.toLowerCase().includes(createTeam.addEmployee.value.toLowerCase()) && <li onBlur={function(e) {if (!addMemberRef.current.contains(e.relatedTarget)) {setCreateTeam({...createTeam, addEmployee: {...createTeam.addEmployee, visible: false}})}}} tabIndex='0' onClick={function() {setCreateTeam({...createTeam, addEmployee: {...createTeam.addEmployee, value: emp.displayName}})}} key={index}>{emp.displayName}</li>

                    }) 

                  ) : <li className='fw-normal'>No users found</li>}

                  </ul>)}

                </div>}

                <div className='mt-3'>
                  <div className={`text-center ${styles.toggle_text}`}>Shift</div>

                  <div className='d-flex justify-content-between align-items-center mt-2 mb-3'>
                    <div className={`${styles.toggle_text} ${createTeam.shift && styles.toggle_active_text}`}>Morning</div>
                    <div tabIndex='0' className={`mx-2 ${styles.toggle}`} onClick={function() {setCreateTeam({...createTeam, shift: !createTeam.shift})}}>
                      <div className={`${styles.toggle_circle}`} style={{transform: `translateX(${createTeam.shift ? 0 : 100}%) scale(1.1)`}}/>
                    </div>
                    <div className={`${styles.toggle_text} ${!createTeam.shift && styles.toggle_active_text}`}>Night</div>
                  </div>

                </div>

                <button className={`p-2 w-100 rounded mt-3 mt-auto ${sstyles.inputs}`}>Submit</button>
              </div>
            </form>

            <form className={`p-3 bg-white shadow rounded position-relative ${styles.form}`} onSubmit={function(e) {
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
                const generatedId = generateUid();

                setRegister({...register, loading: true});      

                setDoc(doc(collection(getFirestore(), `${register.title.value.toLowerCase().replace(' ', '')}${register.title.value === 'Quality Assurance' ? '' : 's'}`), generatedId.toString()), {
                  displayName: `${register.name.first.value} ${register.name.last.value}`,
                  email: `${register.name.first.value}.${register.name.last.value}@yahoo.com`,
                  joined: `${new Date().toLocaleString('default', {month: 'long'})}/${new Date().getDate()}/${new Date().getFullYear()}`,
                  title: register.title.value,
                  dateOfBirth: `${register.age.month}/${register.age.day}/${register.age.year}`,
                  requestsIDs: [],
                  id: generatedId.toString(),
                  shift: `${register.shift ? 'Morning' : 'Night'} Shift` 
                }).then(setDoc(doc(collection(getFirestore(), `ids`), generatedId.toString()), {value: generatedId.toString()})).then(function() {
                  setRegister(registerInitial);
                });
              }
            }}>
              {register.loading && <Loader text='Creating user' absolute={true} size='250%' background={true}/>}
              <h4 className='text-center mb-3'>Register an employee</h4>

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

              <Dropdown error={register.title.error} visible={register.title.visible} setVisibility={function() {setRegister({...register, title: {...register.title, visible: !register.title.visible, error: false}})}} items={['Scriptwriter', 'Quality Assurance', 'Project Manager', 'Team Leader', 'Manager', 'Human Resources']} value={register.title.value} setValue={function(val) {setRegister({...register, title: {...register.title, value: val, error: false}, });}}/>

              <div className='mt-3'>
                <div className={`text-center ${styles.toggle_text}`}>Shift</div>

                <div className='d-flex justify-content-between align-items-center mt-2 mb-3'>
                  <div className={`${styles.toggle_text} ${register.shift && styles.toggle_active_text}`}>Morning</div>
                  <div tabIndex='0' className={`mx-2 ${styles.toggle}`} onClick={function() {setRegister({...register, shift: !register.shift})}}>
                    <div className={`${styles.toggle_circle}`} style={{transform: `translateX(${register.shift ? 0 : 100}%) scale(1.1)`}}/>
                  </div>
                  <div className={`${styles.toggle_text} ${!register.shift && styles.toggle_active_text}`}>Night</div>
                </div>

              </div>

              <button className={`p-2 w-100 rounded mt-3 ${sstyles.inputs}`}>Submit</button>

            </form>
          </div>
      )}
    </div>
  )
}
