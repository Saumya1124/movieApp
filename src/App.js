import React , {useEffect, useState , useCallback} from 'react';
import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from './components/AddMovie';

function App() {

  const [movies , setMovies] = useState([]);

  const [error , setError] = useState(null);

  const [isLoading , setIsLoading] = useState(false);


  
  const fetchMoviesHandler = useCallback( async () => {

    setError(null)

    setIsLoading(true)

    try{
      const response = await fetch('https://movie-app-8ad01-default-rtdb.firebaseio.com/movies.json')

      if(!response.ok){
        throw new Error('Something went wrong ... Retrying')
        
      }

      setIsLoading(false)

      const data = await response.json()

      console.log(data)

      const loadedMovies = []

      for (const key in data){
        loadedMovies.push({
            id : key,
            title : data[key].title,
            openingText : data[key].openingText,
            releaseDate : data[key].releaseDate
        })
      }
  
      
        
        setMovies(loadedMovies)
    }
    catch (error) {

      setError(error.message)
      setIsLoading(false)
      
      
      
      

    }
   
  } , [])

  const stopLoading = ()=> {
    // setError(null)
  }

  useEffect( ()=> {

    fetchMoviesHandler()

  } , [fetchMoviesHandler])


  async function addMovieHandler(movie) {
    console.log(movie);
    const response = await fetch('https://movie-app-8ad01-default-rtdb.firebaseio.com/movies.json' , {
        method : 'POST',
        body : JSON.stringify(movie),
        headers : {
          'Content-Type' : 'application/json'
        }
      })
    const data = await response.json()
    console.log(data)
  }

  async function removeHandler (e) {
    e.preventDefault()
    const li = e.target.parentElement;
    const id = li.id
    console.log(id)
    const del = await fetch(`https://movie-app-8ad01-default-rtdb.firebaseio.com/movies/${id}.json`,{
      method : 'DELETE'
    })
    

  }


  let content = <p>Found no movies</p>

  if (movies.length>0){
    content = <MoviesList movies={movies} remove={removeHandler}/>
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
        <AddMovie onAddMovie={addMovieHandler}></AddMovie>
        <br />
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
