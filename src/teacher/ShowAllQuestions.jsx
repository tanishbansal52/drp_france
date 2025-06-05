import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Card, Spinner, Button } from 'react-bootstrap'
import NavBar from '../NavBar'
import { useNavigate } from 'react-router-dom'

function ShowAllQuestions() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAnswers, setShowAnswers] = useState(false)

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch('https://drp-belgium.onrender.com/api/questions')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()

      if (!Array.isArray(data)) throw new Error('Invalid response format, expected an array')

      setQuestions(data)
    } catch (err) {
      console.error('Error fetching questions:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  return (
    <>
      <NavBar />
      <div className="bg-primary text-white text-center py-3 mb-4">
        <h1 className="m-0 display-5">All Questions - Algebra Basics </h1>
      </div>
      <Container className="pb-5">
        {loading && (
          <div className="d-flex justify-content-center my-5">
            <Spinner animation="border" variant="primary" />
          </div>
        )}

        {!loading && error && (
          <p className="text-danger text-center">{error}</p>
        )}

        {!loading && !error && (
          <>
            {questions.slice(1).map((q, index) => (
              <Card key={index} className="mb-3 shadow-sm">
                <Card.Body>
                  <h5>{q.question_text}</h5>
                  {showAnswers && (
                    <h5 className=" text-success">
                      <strong>Answer:  {q.answer || 'No answer available.'}</strong>
                    </h5>
                  )}
                </Card.Body>
              </Card>
            ))}

            <div className="text-center mt-4">
              <Button
                variant={showAnswers ? 'secondary' : 'success'}
                className="me-3"
                onClick={() => setShowAnswers(!showAnswers)}
              >
                {showAnswers ? 'Hide Answers' : 'Show Answers'}
              </Button>
              <Button variant="primary" onClick={() => navigate('/teacher/dashboard')}>
                Continue to Mission Code
              </Button>
            </div>
          </>
        )}
      </Container>
    </>
  )
}

export default ShowAllQuestions
