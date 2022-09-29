import React, { forwardRef } from 'react';
import styles from './articles.module.css';

function Articles({ state, setLast }, ref) {
  return state.map((item, index) => {
    if (state.length - 1 === index) {
    return (
      <div key={item._id} ref={setLast} className={styles.card}>
        <img src={item.thumb} alt={item.title} className={styles.img} />
        <h4 className={styles.title}>{item.title}</h4>
      </div>
    );
  }
  return (
    <div key={item._id} className={styles.card}>
      <img src={item.thumb} alt={item.title} className={styles.img} />
      <h4 className={styles.title}>{item.title}</h4>
    </div>
  );
})}

export default forwardRef(Articles);
