import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Card, Spinner, Button } from 'react-bootstrap'
import NavBar from '../NavBar'

function DisplayQuestion() {
  const [topic, setTopic] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')            // added to hold answer
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false) // toggle for showing answer

  const fetchQuestion = () => {                       // extracted fetch logic
    setLoading(true)
    setError(null)
    setShowAnswer(false)
    fetch('https://drp-belgium.onrender.com/api/data/')
      .then(res => res.json())
      .then(data => {
        if (data.quiz) setTopic(data.quiz)
        if (data.question_text) setQuestion(data.question_text)
        if (data.answer_text) setAnswer(data.answer_text)
        else setAnswer('No answer available.')
      })
      .catch(err => {
        console.error('Error fetching question:', err)
        setError('Failed to load question.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchQuestion()
  }, [])

  return (
    <>
      <NavBar />
      <div className="bg-primary text-white text-center py-3 mb-4">
        <h1 className="m-0 display-5">{topic}</h1>
      </div>
      <Container className="d-flex justify-content-center align-items-center min-vh-80">
        <Card className="shadow-lg p-5 text-center w-100">
          <Card.Body>
            {loading && <Spinner animation="border" variant="light" />}
            {!loading && error && (
              <p className="text-danger">{error}</p>
            )}
            {!loading && !error && (
              <>
                <h2 style={{ fontSize: '3rem', lineHeight: 1.2 }}>
                  {question}
                </h2>
                {showAnswer && (
                  <p 
                    className="mt-3 text-success" 
                    style={{ fontSize: '1.5rem', fontWeight: 500 }}
                  >
                    Answer: {answer}
                  </p>
                )}
                <div className="mt-4 d-flex justify-content-center gap-3">
                  <Button
                    variant="light"
                    onClick={() => setShowAnswer(prev => !prev)}
                  >
                    {showAnswer ? 'Hide Answer' : 'Show Answer'}
                  </Button>
                  <Button variant="light" onClick={fetchQuestion}>
                    Next Question
                  </Button>
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}

export default DisplayQuestion