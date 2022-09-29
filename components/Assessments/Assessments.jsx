import React from 'react';
import styles from '../Articles/articles.module.css';

export default function Assessments({ state }) {
  return state.map((item) => (
    <div key={item.id} className={styles.assessments}>
      <img src={item.icon} alt={item.name} className={styles.img} />
      <h4 className={styles.title}>{item.name}</h4>
      <button type="button" className={styles.assessmentsBtn}>TAKE ASSESSMENT</button>
    </div>
  ));
}
