import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const cards = [
  { title: "COP (Conference of the Parties)", text: "COP is the decision-making body of the UNFCCC. It meets annually to negotiate climate action and implementation." },
  { title: "Paris Agreement (2015)", text: "The Paris Agreement aims to limit global warming to well below 2°C, pursuing efforts toward 1.5°C." },
  { title: "Plastic pollution", text: "It can take up to 450 years for a plastic bottle to decompose; recycling and reuse reduce landfill waste." },
  { title: "Reforestation", text: "One mature tree can remove up to ~22 kg of CO2 per year (estimates vary)." },
  { title: "Renewables", text: "Wind and solar are the fastest-growing electricity sources globally and are key to decarbonization." }
];

export default function Flashcards() {
  const [index, setIndex] = useState(0);

  function prev() {
    setIndex((i) => (i - 1 + cards.length) % cards.length);
  }
  function next() {
    setIndex((i) => (i + 1) % cards.length);
  }

  return (
    <div className="flashcards-container">
      <h1 className="flashcards-title">Climate Change Info</h1>
      <div className="flashcards-viewer">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.35 }}
            className="flashcard"
          >
            <h2>{cards[index].title}</h2>
            <p>{cards[index].text}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flashcards-controls">
          <div className="flashcards-buttons">
            <button onClick={prev} className="flashcards-btn flashcards-btn-prev">Previous</button>
            <button onClick={next} className="flashcards-btn flashcards-btn-next">Next</button>
          </div>
          <div className="flashcards-counter">Card {index + 1} of {cards.length}</div>
        </div>
      </div>
    </div>
  );
}
