import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import Articles from "../components/Articles/Articles";
import Assessments from "../components/Assessments/Assessments";
import Videos from "../components/Videos/Videos";
import styles from '../styles/resources.module.css';

const LIMIT = 9;
const articlesURL = `https://api.theinnerhour.com/v1/blogposts?`;
const videosURL = "https://api.theinnerhour.com/v1/ihvideoslist?";
const assessmentsURL = "https://api.theinnerhour.com/v1/assessmentslisting?";

export default function Resources() {
  const [state, setState] = useState([]);
  const [last, setLast] = useState(null);
  const [page, setPage] = useState(1);
  const [current, setCurrent] = useState('Articles');
  const observer = useRef();
  useEffect(() => {
    (async() => {
      await fetchNewResources(articlesURL);
    })();
    
    observer.current = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) {
        console.log(state.length);
        fetchNewResources(articlesURL);
      }
    })
  },[]);
  useEffect(() => {
    const currentObserver = observer.current;
    if (last) {
      currentObserver.observe(last);
    }
    return () => {
      if (last) {
        currentObserver.unobserve(last);
      }
    }
  }, [last]);
  //  not able to access the latest state values
  const fetchNewResources = async (url) => {
    const searchParams = new URLSearchParams({
      page: page,
      limit: LIMIT
    });
    const fetchResult = await fetch(url + searchParams);
    const data = await fetchResult.json();
    console.log(data.list);
    setState((prev)=> [...new Set([...prev, ...data.list])]);
    setPage((prev) => prev + 1);
  }
  const handleNavigation = (e, url) => {
    setState([]);
    setPage(1);
    const dataValue = e.target.dataset.value
    setCurrent(dataValue)
    fetchNewResources(url);
    const navigationBtns = document.querySelectorAll("#navigation > button");
    navigationBtns.forEach(btn => btn.style.borderBottom = 'none');
    const btn = document.querySelector(`[data-value=${dataValue}`);
    btn.style.borderBottom = '4px solid rgb(78, 97, 55)';
  }
  return(
    <div>
      <Head>
        <title>Mental Health Resources</title>
      </Head>
      <div className={styles.navigation} id="navigation"> 
        <button 
          data-value="Articles"
          onClick={(e) => handleNavigation(e, articlesURL)}
          style={{borderBottom: '4px solid rgb(78, 97, 55)'}}  
        >Article</button>
        <button data-value="Videos" onClick={(e) => handleNavigation(e, videosURL)}>Videos</button>
        <button data-value="Assessments" onClick={(e) => handleNavigation(e, assessmentsURL)}>Assesssments</button>
      </div>
      <div>
        <div className={styles.grid}>
          {
            !!(state.length) && 
            current === 'Articles' 
              ? <Articles state={state} ref={observer} setLast={setLast} /> 
              : current === 'Videos' 
                ? <Videos state={state} ref={observer} setLast={setLast} /> 
                : <Assessments state={state} /> }
        </div>
      </div>
    </div>
  )
}