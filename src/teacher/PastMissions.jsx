import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TeacherButton from './TeacherButton';

function PastMissions() {
  const [pastMissions, setPastMissions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // axios.get('https://drp-belgium.onrender.com/api/past-missions/')
    axios.get('http://localhost:8000/api/past-missions/')
      .then(res => {
        setPastMissions(res.data.missions)
        console.log(res.data)
      })
      .catch(err => {
        setError('Failed to fetch quizzes.');
        console.error(err);
        console.error(err.error)
      });
  }, []);

  const handleViewReport = () => {
    console.log('Selected mission:', selected);
    navigate('/teacher/report', {
      state: { room_id: selected }
    });
  };

  const handleRelaunchMission = () => {
    const selectedMission = pastMissions.find(mission => mission.room_id === selected);
    if (selectedMission) {
      console.log('Relaunching mission with quiz ID:', selectedMission.quiz_id);
      navigate('/teacher/dashboard', {
        state: { quizId: selectedMission.quiz_id }
      });
    }
  };

  if (error) {
    return (
      <div style={{ 
        padding: '30px', 
        textAlign: 'center',
        color: '#ff4d4d',
        fontSize: '18px',
        fontFamily: 'sans-serif'
      }}>
        {error}
      </div>
    );
  }

  if (!pastMissions.length) {
    return (
      <div style={{ 
        padding: '30px', 
        textAlign: 'center',
        color: '#aefeff',
        fontSize: '18px',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ marginBottom: '20px' }}>Loading past missions...</div>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(174, 254, 255, 0.3)',
          borderTop: '4px solid #00f0ff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }}></div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '30px', 
      maxWidth: '800px',
      margin: '0 auto',
      minHeight: '100vh'
    }}>
      <h2 style={{ 
        marginBottom: '30px',
      }}>
        Past Missions:
      </h2>

      <div style={{ marginBottom: '40px' }}>
        {pastMissions.map((mission, index) => (
          <label
            key={index}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: '20px',
              background: selected === mission.room_id 
                ? 'rgba(0, 240, 255, 0.1)' 
                : 'rgba(255, 255, 255, 0.05)',
              padding: '20px',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: selected === mission.room_id 
                ? '2px solid rgba(0, 240, 255, 0.5)' 
                : '2px solid transparent',
              boxShadow: selected === mission.room_id  
                ? '0 0 20px rgba(0, 240, 255, 0.2)' 
                : '0 4px 6px rgba(0, 0, 0, 0.1)',
              transform: 'translateY(0)',
            }}
            onMouseEnter={e => {
              if (selected !== mission.room_code ) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
              }
            }}
            onMouseLeave={e => {
              if (selected !== mission.room_code) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }
            }}
          >
            <input
              type="radio"
              name="quiz-selection"
              checked={selected === mission.room_id }
              onChange={() => setSelected(mission.room_id)}
              style={{
                width: '20px',
                height: '20px',
                marginTop: '4px',
                accentColor: '#00f0ff',
                cursor: 'pointer',
                transform: 'scale(1.2)',
              }}
            />
            <div style={{
              marginLeft: '20px',
              textAlign: 'left',
              flex: 1,
            }}>
              <div style={{ 
                fontSize: '20px', 
                color: '#aefeff',
                fontWeight: '600',
                marginBottom: '8px',
                letterSpacing: '0.5px'
              }}>
                {mission.room_code} : Created at {mission.created_at.split("T")
    .map((part, index) => index === 0 ? part.split("-").reverse().join("-") : part.split(".")[0])
    .join(", ")}
              </div>
              <div style={{ 
                display: 'flex',
                gap: '20px',
                flexWrap: 'wrap'
              }}>
                <div style={{ 
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ 
                    fontWeight: '1000',
                    textTransform: 'capitalize'
                  }}>
                    Quiz title:<strong> {mission.quiz_title}</strong>
                    <br />
                    Total groups:<strong>  {mission.total_groups} </strong>  
                  </span>
                </div>
                <div style={{ 
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ color: '#aefeff', fontWeight: '500' }}>
                    Subject: {mission.quiz_subject}
                    <br />
                    Difficulty: {mission.quiz_difficulty}
                    <br />
                    Total questions: {mission.total_questions} <strong> </strong>
                    <br />
                    Total time: {mission.total_time} minutes
                  </span>
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>

      <div style={{
        display: 'flex',
        gap: '15px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => navigate('/teacher')}
          style={{
            padding: '14px 30px',
            fontSize: '16px',
            fontWeight: '600',
            borderRadius: '8px',
            border: '2px solid #666',
            background: 'transparent',
            color: '#aefeff',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            minWidth: '120px'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = '#aefeff';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = '#666';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Back
        </button>
        
        <button
          onClick={handleRelaunchMission}
          disabled={!selected}
          style={{
            padding: '14px 30px',
            fontSize: '16px',
            fontWeight: '600',
            borderRadius: '8px',
            border: selected ? '2px solid #ff6b35' : '2px solid #444',
            background: selected ? '#ff6b35' : '#333',
            color: selected ? '#fff' : '#666',
            cursor: selected ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            minWidth: '180px',
            boxShadow: selected ? '0 0 20px rgba(255, 107, 53, 0.3)' : 'none',
            opacity: selected ? 1 : 0.6
          }}
          onMouseEnter={e => {
            if (selected) {
              e.currentTarget.style.background = '#ff8c66';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(255, 107, 53, 0.4)';
            }
          }}
          onMouseLeave={e => {
            if (selected) {
              e.currentTarget.style.background = '#ff6b35';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 107, 53, 0.3)';
            }
          }}
        >
          Relaunch Mission
        </button>

        <button
          onClick={handleViewReport}
          disabled={!selected}
          style={{
            padding: '14px 30px',
            fontSize: '16px',
            fontWeight: '600',
            borderRadius: '8px',
            border: selected ? '2px solid #00f0ff' : '2px solid #444',
            background: selected ? '#00f0ff' : '#333',
            color: selected ? '#000' : '#666',
            cursor: selected ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            minWidth: '180px',
            boxShadow: selected ? '0 0 20px rgba(0, 240, 255, 0.3)' : 'none',
            opacity: selected ? 1 : 0.6
          }}
          onMouseEnter={e => {
            if (selected) {
              e.currentTarget.style.background = '#33f3ff';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 240, 255, 0.4)';
            }
          }}
          onMouseLeave={e => {
            if (selected) {
              e.currentTarget.style.background = '#00f0ff';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 240, 255, 0.3)';
            }
          }}
        >
          View Report
        </button>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default PastMissions;