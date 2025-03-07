import { useState } from "react";
import "./App.css";
import { useEffect } from "react";

const pokemons = [
  "pikachu",
  "bulbasaur",
  "charmander",
  "squirtle",
  "jigglypuff",
  "meowth",
  "psyduck",
  "snorlax",
  "eevee",
  "vulpix",
  "geodude",
  "onix",
  "gengar",
  "mewtwo",
  "mew",
  "lapras",
  "dragonite",
  "jolteon",
  "flareon",
  "umbreon",
];

export default function App() {
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [cards, setCards] = useState([]);
  useEffect(() => {
    Promise.all(
      pokemons.map((pokemon) => {
        return fetch("https://pokeapi.co/api/v2/pokemon/" + pokemon)
          .then((res) => res.json())
          .then((obj) => {
            return {
              id: obj.id,
              name: obj.name,
              sprite: obj.sprites.front_default,
              isClicked: false,
            };
          });
      })
    )
      .then((cardsData) => setCards(cardsData))
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);

  function handleClick(card) {
    if (card.isClicked) {
      if (score > bestScore) {
        setBestScore(score);
      }
      setScore(0);
      setCards(
        randomize(
          cards.map((c) => {
            c.isClicked = false;
            return c;
          })
        )
      );
    } else {
      setScore(score + 1);
      setCards(
        randomize(
          cards.map((c) => {
            if (c.id === card.id) {
              c.isClicked = true;
            }
            return c;
          })
        )
      );
    }
  }

  return (
    <>
      <div className="header">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg"
          alt="pokemon logo"
        />

        <h1>Memory Game</h1>
        <h2>Do not choose the same pokemon twice!</h2>
        <h3>Score: {score}</h3>
        <h3>Best Score: {bestScore}</h3>
      </div>
      <div className="cards">
        {cards.map((card) => (
          <Card key={card.id} card={card} handleClick={handleClick} />
        ))}
      </div>
    </>
  );
}

function Card({ card, handleClick }) {
  return (
    <div className="card" onClick={() => handleClick(card)}>
      <img src={card.sprite} alt={card.name} />
      <h3>{card.name}</h3>
    </div>
  );
}

function randomize(array) {
  let currentIndex = array.length;

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}
