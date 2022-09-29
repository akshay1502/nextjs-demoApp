import Head from 'next/head';
import React, { useEffect, useRef, useState } from 'react';
import Articles from '../components/Articles/Articles';
import Assessments from '../components/Assessments/Assessments';
import Videos from '../components/Videos/Videos';
import styles from '../styles/resources.module.css';

const LIMIT = 9;
const articlesURL = 'https://api.theinnerhour.com/v1/blogposts?';
const videosURL = 'https://api.theinnerhour.com/v1/ihvideoslist?';
const assessmentsURL = 'https://api.theinnerhour.com/v1/assessmentslisting?';
let url = articlesURL;
let page = 1;

export default function Resources() {
  const [state, setState] = useState([]);
  const [last, setLast] = useState(null);
  const [current, setCurrent] = useState('Articles');
  const observer = useRef();
  const fetchNewResources = async (url) => {
    const searchParams = new URLSearchParams({
      page,
      limit: LIMIT,
    });
    const fetchResult = await fetch(url + searchParams);
    const data = await fetchResult.json();
    setState((prev) => [...new Set([...prev, ...data.list])]);
    page += 1;
  };
  const callBack = (entries) => {
    const first = entries[0];
    if (first.isIntersecting) {
      fetchNewResources(url);
    }
  };
  const handleNavigation = (e, urlToSet) => {
    setState([]);
    page = 1;
    const dataValue = e.target.dataset.value;
    setCurrent(dataValue);
    url = urlToSet;
    fetchNewResources(url);
    const navigationBtns = document.querySelectorAll('#navigation > button');
    navigationBtns.forEach((btn) => btn.style.borderBottom = 'none');
    const btn = document.querySelector(`[data-value=${dataValue}`);
    btn.style.borderBottom = '4px solid rgb(78, 97, 55)';
  };
  useEffect(() => {
    (async () => {
      await fetchNewResources(url);
    })();

    observer.current = new IntersectionObserver(callBack);
  }, []);
  useEffect(() => {
    const currentObserver = observer.current;
    if (last) {
      currentObserver.observe(last);
    }
    return () => {
      if (last) {
        currentObserver.unobserve(last);
      }
    };
  }, [last]);
  //  not able to access the latest state values
  return (
    <div>
      <Head>
        <title>Mental Health Resources</title>
      </Head>
      <div className={styles.navigation} id="navigation">
        <button
          role="button"
          data-value="Articles"
          onClick={(e) => handleNavigation(e, articlesURL)}
          style={{ borderBottom: '4px solid rgb(78, 97, 55)' }}
        >
          Article

        </button>
        <button role="button" data-value="Videos" onClick={(e) => handleNavigation(e, videosURL)}>Videos</button>
        <button role="button" data-value="Assessments" onClick={(e) => handleNavigation(e, assessmentsURL)}>Assesssments</button>
      </div>
      <div>
        <div className={styles.grid}>
          {
            !!(state.length)
            && current === 'Articles'
              ? <Articles state={state} ref={observer} setLast={setLast} />
              : current === 'Videos'
                ? <Videos state={state} ref={observer} setLast={setLast} />
                : <Assessments state={state} />
}
        </div>
      </div>
      <footer className={styles.footer}>
        If you didn't find what you were looking for, please reach out to us at support@amahahealth.com  or +912071171501. We're here for you - for anything you might need.
      </footer>
    </div>
  );
}
