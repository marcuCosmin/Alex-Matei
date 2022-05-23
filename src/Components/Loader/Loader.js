import React from 'react';
import styles from './Loader.module.css';

export default function Loader({text}) {
  return (
    <div className={`position-absolute w-100 h-100 rounded d-flex align-items-center justify-content-center flex-column ${styles.loader}`}>
        <div>Loading</div>
    </div>
  )
}
