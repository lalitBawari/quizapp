import React, { useEffect, useState } from 'react';
import ErrorBoundary from './ErrorBoundary';
import ScoreGraph from './ScoreGraph';

const API_URL =
  'https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple';

const shuffleArray = (array) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [timer, setTimer] = useState(60);
  const [redLight, setRedLight] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        const updatedQuestions = data.results.map((question) => ({
          ...question,
          options: shuffleArray([...question.incorrect_answers, question.correct_answer]),
        }));
        setQuestions(updatedQuestions);
      });
  }, []);

  useEffect(() => {
    if (timer === 0 && !showScore) {
      handleAnswerOptionClick(false);
    } else if (currentQuestion < questions.length && !showScore && quizStarted) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 10) {
            setRedLight(true);
          } else if (prevTimer === 0) {
            clearInterval(countdown);
            setRedLight(false);
            const nextQuestion = currentQuestion + 1;
            if (nextQuestion < questions.length) {
              setCurrentQuestion(nextQuestion);
              setTimer(60);
            } else {
              setShowScore(true);
            }
          }
          return prevTimer - 1;
        });
      }, 1000);

      return () => {
        clearInterval(countdown);
      };
    }
  }, [timer, currentQuestion, questions.length, showScore, quizStarted]);

  useEffect(() => {
    setRedLight(false);
  }, [currentQuestion]);

  const handleAnswerOptionClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setTimer(60);
    } else {
      setShowScore(true);
    }
  };

  const resetQuiz = () => {
    setShowScore(false);
    setScore(0);
    setCurrentQuestion(0);
    setTimer(60);
    setQuizStarted(false);
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  return (
    <>
      <div className="corner-text">Quiz App</div>

      <div className="app">
        <ErrorBoundary>
          {!quizStarted ? (
            <div className="start-section">
              <h2>Welcome to the Quiz</h2>
              <button onClick={startQuiz}>Start Quiz</button>
            </div>
          ) : showScore ? (
            <>
              <div className="score-section">
                <h2>
                  You scored {score} out of {questions.length}
                </h2>
                <button onClick={resetQuiz}>Restart Quiz</button>
              </div>
              <ScoreGraph score={score} totalQuestions={questions.length} />
            </>
          ) : (
            <div className="question-section">
              <h2>Question {currentQuestion + 1}</h2>
              <h3>{questions[currentQuestion]?.question}</h3>
              <div className="answer-section">
                {questions[currentQuestion]?.options.map((answer, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      handleAnswerOptionClick(answer === questions[currentQuestion]?.correct_answer)
                    }
                  >
                    {answer}
                  </button>
                ))}
              </div>
              <div className={`timer ${redLight ? 'red-light' : ''}`}>
                Time remaining: {timer} seconds
              </div>
            </div>
          )}
        </ErrorBoundary>
      </div>
    </>
  );
};

export default App;
