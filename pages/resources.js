import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import styles from '../styles/resources.module.css';

const LIMIT = 9;
const articlesURL = `https://api.theinnerhour.com/v1/blogposts?`;
const videosURL = "https://api.theinnerhour.com/v1/ihvideoslist?";
const assessmentsURL = "https://api.theinnerhour.com/v1/assessmentslisting";

export default function Resources() {
  const [state, setState] = useState([]);
  const loader = useRef(null);
  let page = 1;
  const fetchNewResources = async (url) => {
    if (state.length !== 201) {
      const searchParams = new URLSearchParams({
        page: page,
        limit: LIMIT
      });
      const fetchResult = await fetch(url + searchParams);
      const data = await fetchResult.json();
      console.log(data, page);
      setState([...state, ...data.list]);
      page+=1;
    } else {
      console.log('all resources on web');
    }
  }
  useEffect(() => {
    (async() => {
      await fetchNewResources(articlesURL);
    })();
    const callback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          console.log('fetching');
          fetchNewResources(articlesURL);
        }
      })
    }
    let observer = new IntersectionObserver(callback);
    if (loader.current) {
      console.log('something');
      observer.observe(loader.current);
    }
  },[]);
  return(
    <div>
      <Head>
        <title>Mental Health Resources</title>
      </Head>
      <div>
        <button onClick={() => fetchNewResources(articlesURL)}>Article</button>
      </div>
      <div id="observer">
        {
          state.length && (<>
            <div className={styles.grid}>
              {state.map((item) => {
                return (
                  <div key={item._id}>
                    <img src={item.thumb} alt={item.title} className={styles.img} />
                    <h4>{item.title}</h4>
                  </div>);
              })}
            </div>
            <div ref={loader}>loading</div>
          </>)}
      </div>
    </div>
  )
}