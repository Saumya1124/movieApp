import React , {useState} from 'react';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {

  const [movies , setMovies] = useState([]);

  const [error , setError] = useState(null);

  const [isLoading , setIsLoading] = useState(false);

  
  async function fetchMoviesHandler () {

    setError(null)

    setIsLoading(true)

    try{
      const response = await fetch('https://swapi.dev/api/film/')

      if(!response.ok){
        throw new Error('Something went wrong ... Retrying')
        
      }

      setIsLoading(false)

      const data = await response.json()
  
      

      
      
      
        const transformedMovies = data.results.map( movieData => {
          return {
            id : movieData.episode_id,
            title : movieData.title,
            openingText : movieData.opening_crawl,
            releaseDate : movieData.release_date
          }
        })
        setMovies(transformedMovies)
    }
    catch (error) {

      setError(error.message)
      setIsLoading(false)
      
      setTimeout(()=>(fetchMoviesHandler() ),5000)
      
      
      

    }
   
  }

  const stopLoading = ()=> {
    setError(null)
  }

  

  let content = <p>Found no movies</p>

  if (movies.length>0){
    content = <MoviesList movies={movies} />
  }

  if (error != null){
    content = error
  }

  if (isLoading){
    content = <p>Loading ...</p>
  }
  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>        
      </section>
      <section>
          {content} 
          <button onClick={stopLoading}>Stop</button>          
      </section>
      
    </React.Fragment>
  );
}

export default App;
