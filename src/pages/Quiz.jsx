import React, { useState } from "react";

const questions = [
  { q: "The Paris Agreement aims to limit global warming to:", options: ["Below 3°C", "Well below 2°C", "Below 4°C"], a: 1 },
  { q: "Which is a renewable energy source?", options: ["Coal", "Solar", "Natural Gas"], a: 1 },
  { q: "Plastic can take roughly how long to decompose?", options: ["10 years", "100 years", "Hundreds of years"], a: 2 }
];

export default function Quiz() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  function choose(i) {
    if (i === questions[index].a) setScore(s => s + 1);
    if (index + 1 < questions.length) setIndex(index + 1);
    else setDone(true);
  }

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">Quick Quiz</h1>
      {!done ? (
        <div>
          <div className="quiz-question">{questions[index].q}</div>
          <div className="quiz-options">
            {questions[index].options.map((opt, i) => (
              <button key={i} onClick={() => choose(i)} className="quiz-option-btn">{opt}</button>
            ))}
          </div>
        </div>
      ) : (
        <div className="quiz-done">
          <h2>Done!</h2>
          <p className="quiz-score">Your score: {score} / {questions.length}</p>
        </div>
      )}
    </div>
  );
}
