import React, { useEffect, useState, useReducer } from 'react';
import axios from 'axios';
//import { BrowserRouter, NavLink, Route, Switch } from 'react-router-dom';
import './App.css';
import Movie from './components/Movie';
//import Series from './components/Series';

const FEATURED_API = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1";
const SEARCH_API = "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query="
//const IMG_API = "https://image.tmdb.org/t/p/w1280";
const reducer = (state, action) => {
  switch (action.type) {
    case 'MOVIE_REQUEST':
      return { ...state, loading: true };
    case 'MOVIE_SUCCESS':
      return { ...state, loading: false, movies: action.payload, error: '' };
    case 'MOVIE_FAILS':
      return { ...state, error: action.payload, loading: false };
    case 'SERIES_REQUEST':
      return { ...state, loadingSeries: true };
    case 'SERIES_SUCCESS':
      return { ...state, loadingSeries: false, movies: action.payload, errorSeries: '' };
    case 'SERIES_FAILS':
      return { ...state, errorSeries: action.payload, loadingSeries: false };
    default: return state;
  }
}
function App() {
  const [state, dispatch] = useReducer(reducer, { loading: false, error: '', movies: [], loadSeries: false, errorSeries: '', series: [] });
  const { loading, error, movie } = state;
  //const { loading, error, movie, loadingSeries, errorSeries, series } = state;
  const [movies, setmovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const loadmovie = async () => {
    dispatch({ type: 'MOVIE_REQUEST' });
    try {
      const { data } = await axios.get('https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1');
      dispatch({ type: 'MOVIE_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'MOVIE_FAILS', payload: err.message });
    }
  }

  const loadSeries = async () => {
    dispatch({ type: 'SERIES_REQUEST' });
    try {
      const { data } = await axios.get('https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1');
      dispatch({ type: 'SERIES_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'SERIES_FAILS', payload: err.message });
    }
  }
  useEffect(() => {
    getMovies(FEATURED_API);
    loadmovie();
    loadSeries();
  }, []);

  const getMovies = (API) => {
    fetch(API).then(res => res.json())
      .then(data => {
        console.log(data);
        setmovies(data.results);
      });
  }
  const handleonSubmit = (e) => {
    e.preventDefault();
    if (searchTerm) {
      getMovies(SEARCH_API + searchTerm);

      setSearchTerm('');
    }
  };

  const handleonChange = (e) => {
    setSearchTerm(e.target.value);
  }

  return (
    <div>
      <header>
        <form onSubmit={handleonSubmit}>
          <input className="search" type="search" placeholder="Search ..." value={searchTerm} onChange={handleonChange} />
        </form>
      </header>
      <div className="movie-container">
        {movies.length > 0 && movies.map((movie) =>
          <Movie key={movie.id} {...movie} />)}
      </div>
      {/* <div className="blog">
        <div className="content">
          {loading ? (<div>Loading...</div>
          ) : error ? (<div>Error: {error}</div>
          ) : movies.length === 0 ? (<div>No movies found</div>
          ) : (<ul>{movies.map(movie => <li key={movie.id}>
            <h2>{movie.title}</h2>
            <h4>{movie.release_date}</h4>
            <h2>Overview:</h2>
            <p>{movie.overview}</p>
            <p>{movie.body}</p>
          </li>)}</ul>
          )}

        </div>
      </div> */}
    </div>
  );
}

export default App;
