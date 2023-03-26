import { useRef, useState } from 'react';
import './App.css'
import AsyncButton from './Components/Buttons/AsyncButton';
import Table from './Components/Table/Table';

type Pokemon = { name: string, stats: any[] };

function App() {
  const [pokeList, setPokeList] = useState<Pokemon[]>([]);
  const [pending, setPending] = useState(false);
  const [content, setContent] = useState('');
  var inputRef = useRef(null);

  const firstPokemon: number = 0;
  const headers = [
    {'label':'name', 'path': 'name', 'style': 'right' }, 
    {'label': 'attack', 'path': 'stats.1.base_stat', 'style': 'centered' },
    {'label': 'defense', 'path': 'stats.2.base_stat', 'style': 'centered'},
    {'label': 'speed', 'path': 'stats.5.base_stat', 'style': 'centered'},
  ];

  const apiCall: () => void = async () => {
    const nbPokemon: number = inputRef.current ? inputRef.current.value : 20;
    setPending(true);
    const promesesList = [];
    var index: number = 0;
    var n: number = Math.floor(nbPokemon / 20);
    var r: number = nbPokemon % 20;
    while (index <= n) {
      var offset = index * 20;
      if (index == n) {
        promesesList.push(fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}}&limit=${r}`).then(res => res.json()));
      } else {
        promesesList.push(fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}}&limit=${20}`).then(res => res.json()));
      }
      index++;
    }

    var objectList = (await Promise.all(promesesList)).flatMap(res => res.results);

    var newPromeseList = [];
    var index: number = 0;
    while (index < objectList.length) {
      var url = objectList[index].url;
      newPromeseList.push(fetch(url).then(res => res.json()));
      index++;
    }
    var newObjectList = (await Promise.all(newPromeseList)).map(pokemonProperties => { return { name: pokemonProperties.name, stats: pokemonProperties.stats } });

    setPending(false);
    setPokeList(newObjectList);
  }

  const APIfetchSimulation: () => void = async () => {
    const reception: () => void = () => {
      setContent('Received');
    }
    setTimeout(reception, 5000);
    setContent('Pending');
  }
  // CREER COMPONENT TABLE AVEC UNE LISTE DE HEADERS [{label, key},{'attack', stats[1].base_stat}...]
  return (
    <div>
      <input type='number' placeholder='20' style={{ width: '50px' }} ref={inputRef}></input>
      <button onClick={apiCall} disabled={pending}>{pending ? "pending" : "Click"}</button>
      <AsyncButton onClick={apiCall}>Fetch pokemon</AsyncButton>
      {/* <button onClick={()=>{console.log(pokeList)}}>CONSOLE</button> */}
      <Table liste={pokeList} headers={headers}/>

      <button onClick={APIfetchSimulation}>Wait5s</button>
      <p>{content}</p>
    </div>
  )
}

export default App