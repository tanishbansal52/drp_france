import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Card, Spinner, Button } from 'react-bootstrap'
import NavBar from '../NavBar'
import { useNavigate, useLocation } from 'react-router-dom'
import TeacherButton from './TeacherButton';

function ShowAllQuestions() {
  const navigate = useNavigate()
  const location = useLocation()
  const quizId = location.state?.quizId
  console.log('Quiz ID:', quizId)
  localStorage.setItem('quizId', quizId);
  const quizTitle = location.state?.quizTitle
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAnswers, setShowAnswers] = useState(false)

  // const location = useLocation()
  // const quizTitle = location.state?.quizTitle || 'Quiz'
  // const quizId = location.state?.quizId || null

  console.log(quizId)

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      setError(null)

      const apiEndpoint = `https://drp-belgium.onrender.com/api/questions-data/${quizId}/`
      // const apiEndpoint = `http://localhost:8000/api/questions-data/${quizId}/`
      const res = await fetch(apiEndpoint)
      if (res.status === 404) {
        setQuestions([])
        setLoading(false)
        return
      }
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
    if (quizId) {
      fetchQuestions()
    }
  }, [quizId])

  return (
    <>
      <NavBar />
      <div className="bg-primary text-white text-center py-3 mb-4">
        <h1 className="m-0 display-5">All Questions - {quizTitle} </h1>
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
            {questions.length === 0 ? (
              <>
                <div className="text-center my-5">
                  <h4>No mission yet - something exciting is on the way!</h4>
                </div>
                <div className="text-center mt-4">
                  <TeacherButton
                    variant="primary"
                    className="me-3"
                    onClick={() => navigate('/teacher/choosequiz', { state: { quizId, quizTitle } })}
                  >
                    Back
                  </TeacherButton>
                  <TeacherButton variant="secondary" className="me-3" disabled>
                    Show Answers
                  </TeacherButton>
                  <TeacherButton variant="secondary" disabled>
                    Continue to Mission Code
                  </TeacherButton>
                </div>
              </>
            ) : (
              <>
                {questions.map((q, index) => (
                  <Card key={index} className="mb-3 shadow-sm">
                    <Card.Body>
                      <div style={{ whiteSpace: 'pre-wrap' }}>
                        <h5>{q.question_text}</h5>
                      </div>
                      {showAnswers && (
                        <h5 className=" text-success">
                          <strong>Answer:  {q.answer || 'No answer available.'}</strong>
                        </h5>
                      )}
                    </Card.Body>
                  </Card>
                ))}

                <div className="text-center mt-4">
                  <TeacherButton
                    variant="primary"
                    className="me-3"
                    onClick={() => navigate('/teacher/choosequiz', { state: { quizId, quizTitle } })}
                  >
                    Back
                  </TeacherButton>
                  <TeacherButton
                    variant={showAnswers ? 'secondary' : 'success'}
                    className="me-3"
                    onClick={() => setShowAnswers(!showAnswers)}
                  >
                    {showAnswers ? 'Hide Answers' : 'Show Answers'}
                  </TeacherButton>
                  <TeacherButton variant="primary" onClick={() => navigate('/teacher/dashboard', { state: { quizTitle, quizId } })}>
                    Continue to Mission Code
                  </TeacherButton>
                </div>
              </>
            )}
          </>
        )}
      </Container>
    </>
  )
}

export default ShowAllQuestions
