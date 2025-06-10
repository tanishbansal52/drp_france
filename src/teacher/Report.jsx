import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

const Report = () => {
  const [reportData, setReportData] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedGroups, setExpandedGroups] = useState({});
  const location = useLocation();
  const roomId = location.state?.room_id || 1; // Default to 1 if not provided, or get from props/URL params

  useEffect(() => {
  const fetchData = async () => {
    try {
      const [reportRes, leaderboardRes] = await Promise.all([
        axios.get(`http://localhost:8000/api/mission-report/${roomId}/`),
        axios.get(`http://localhost:8000/api/mission-leaderboard/${roomId}/`)
      ]);

      if (reportRes.data.success) {
        setReportData(reportRes.data.report);
      } else {
        console.error("Failed to fetch mission report:", reportRes.data.error);
      }

      if (leaderboardRes.data.success) {
        setLeaderboardData(leaderboardRes.data);
      } else {
        console.error("Failed to fetch leaderboard:", leaderboardRes.data.error);
      }

    } catch (err) {
      console.error("Error fetching mission report or leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [roomId]);


  const toggleGroupExpansion = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const getDifficultyColor = (rating) => {
    switch(rating) {
      case 'Easy': return 'badge bg-success';
      case 'Medium': return 'badge bg-warning text-dark';
      case 'Hard': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  };

  const getRatingColor = (change) => {
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-danger';
    return 'text-light';
  };

  if (loading) {
    return (
      <>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet" />
        <div className="min-vh-100 d-flex align-items-center justify-content-center">
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-light">Loading mission report...</p>
          </div>
        </div>
      </>
    );
  }

  const chartData = reportData?.group_performance.map(group => ({
    name: group.group_name,
    score: group.total_score,
    accuracy: group.accuracy_percentage,
    improvement: group.rating_change
  })) || [];

  const questionDifficultyData = reportData?.question_analysis.reduce((acc, q) => {
    const difficulty = q.difficulty_rating;
    acc[difficulty] = (acc[difficulty] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(questionDifficultyData || {}).map(([key, value]) => ({
    name: key,
    value,
    color: key === 'Easy' ? '#198754' : key === 'Medium' ? '#ffc107' : '#dc3545'
  }));

  return (
    <>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet" />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
      
      <div className="min-vh-100 ">
        <div className="container-fluid py-4">
          {/* Header */}
          <div className="card shadow-sm mb-4">
            <div className="card-body p-4">
              <div className="row text-start">
                <div className="col-md-8">
                  <h1 className="h2 mb-2">
                    Mission Report: {reportData?.room_info.room_code}
                  </h1>
                  <p className="h5 text-light mb-3">{reportData?.room_info.quiz_title}</p>
                  <div className="d-flex flex-wrap gap-3 text-center">
                    <span className="d-flex align-items-center gap-1 text-light">
                      <i className="bi bi-bullseye"></i>
                      {reportData?.room_info.quiz_subject}
                    </span>
                    <span className="d-flex align-items-center gap-1 text-loght">
                      <i className="bi bi-clock"></i>
                      {reportData?.room_info.total_time} minutes
                    </span>
                    <span className={getDifficultyColor(reportData?.room_info.quiz_difficulty)}>
                      {reportData?.room_info.quiz_difficulty}
                    </span>
                  </div>
                </div>
                <div className="col-md-4 text-end">
                  <div className="display-4 text-info fw-bold">{reportData?.summary_stats.total_groups}</div>
                  <div className="text-light">Teams Participated</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="card shadow-sm mb-4">
            <div className="card-header p-0">
              <ul className="nav nav-tabs nav-fill" role="tablist">
                {[
                  { id: 'overview', label: 'Overview', icon: 'bi-bullseye' },
                  { id: 'teams', label: 'Team Performance', icon: 'bi-people' },
                  { id: 'questions', label: 'Question Analysis', icon: 'bi-award' },
                  { id: 'leaderboard', label: 'Leaderboard', icon: 'bi-trophy' }
                ].map(tab => (
                  <li key={tab.id} className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                      onClick={() => setActiveTab(tab.id)}
                      type="button"
                    >
                      <i className={`${tab.icon} me-2`}></i>
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-body p-4">
              {activeTab === 'overview' && (
                <div>
                  {/* Summary Stats */}
                  <div className="row g-4 mb-5">
                    <div className="col-md-3">
                      <div className="card bg-dark text-white h-100">
                        <div className="card-body text-center">
                          <div className="display-5 fw-bold">{reportData?.summary_stats.average_score.toFixed(1)}</div>
                          <div className="opacity-75">Average Score</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card bg-dark text-white h-100">
                        <div className="card-body text-center">
                          <div className="display-5 fw-bold">{reportData?.summary_stats.average_before_rating.toFixed(1)}</div>
                          <div className="opacity-75">Before Rating</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card bg-dark text-white h-100">
                        <div className="card-body text-center">
                          <div className="display-5 fw-bold">{reportData?.summary_stats.average_after_rating.toFixed(1)}</div>
                          <div className="opacity-75">After Rating</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card bg-dark text-white h-100">
                        <div className="card-body text-center">
                          <div className="display-5 fw-bold d-flex align-items-center justify-content-center gap-2">
                            <i className="bi bi-trending-up"></i>
                            +{reportData?.summary_stats.rating_improvement.toFixed(1)}
                          </div>
                          <div className="opacity-75">Improvement</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Charts */}
                  <div className="row g-4">
                    <div className="col-lg-6">
                      <div className="card h-100">
                        <div className="card-header">
                          <h5 className="card-title mb-0">Team Performance</h5>
                        </div>
                        <div className="card-body">
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="score" fill="#0d6efd" radius={4} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="card h-100">
                        <div className="card-header">
                          <h5 className="card-title mb-0">Question Difficulty Distribution</h5>
                        </div>
                        <div className="card-body">
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}`}
                              >
                                {pieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'teams' && (
                <div>
                  {reportData?.group_performance.map(group => (
                    <div key={group.group_id} className="card mb-4">
                      <div className="card-body">
                        <div 
                          className="d-flex align-items-center justify-content-between cursor-pointer"
                          onClick={() => toggleGroupExpansion(group.group_id)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                              <i className="bi bi-people text-white fs-4"></i>
                            </div>
                            <div>
                              <h5 className="mb-1 text-start">{group.group_name}</h5>
                              <p className="text-light mb-0 text-start">{group.student_names.join(', ')}</p>
                            </div>
                          </div>
                          <div className="d-flex align-items-center gap-4">
                            <div className="text-center">
                              <div className="h3 text-primary fw-bold mb-0">{group.total_score}</div>
                              <small className="text-light">Score</small>
                            </div>
                            <div className="text-center">
                              <div className="h5 mb-0 text-warning">{group.accuracy_percentage}%</div>
                              <small className="text-light">Accuracy</small>
                            </div>
                            <div className="text-center">
                              <div className={`h5 mb-0 ${getRatingColor(group.rating_change)}`}>
                                {group.rating_change > 0 ? '+' : ''}{group.rating_change}
                              </div>
                              <small className="text-light">Rating Change</small>
                            </div>
                            <i className={`bi ${expandedGroups[group.group_id] ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                          </div>
                        </div>

                        {expandedGroups[group.group_id] && (
                          <div className="mt-4 pt-4 border-top">
                            <div className="row g-3 mb-4">
                              <div className="col-md-4">
                                <div className="card bg-light">
                                  <div className="card-body text-center">
                                    <small className="text-light">Before Rating</small>
                                    <div className="h4 mb-0">{group.before_rating}/10</div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="card bg-light">
                                  <div className="card-body text-center">
                                    <small className="text-light">After Rating</small>
                                    <div className="h4 mb-0">{group.after_rating}/10</div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="card bg-light">
                                  <div className="card-body text-center">
                                    <small className="text-light">Avg Response Time</small>
                                    <div className="h4 mb-0">{group.average_response_time.toFixed(1)}s</div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {group.question_responses.length > 0 && (
                              <div>
                                <h6 className="fw-bold mb-3">Question Responses</h6>
                                <div className="row g-3">
                                  {group.question_responses.map(response => (
                                    <div key={response.question_id} className="col-12">
                                      <div className="card border-start border-primary border-4">
                                        <div className="card-body">
                                          <div className="d-flex justify-content-between align-items-start mb-2">
                                            <p className="fw-semibold mb-1">{response.question_text}</p>
                                            <span className={`badge ${response.is_correct ? 'bg-success' : 'bg-danger'}`}>
                                              {response.points_earned}/{response.max_points} pts
                                            </span>
                                          </div>
                                          <div className="small text-light">
                                            <p className="mb-1"><strong>Answer:</strong> {response.submitted_answer}</p>
                                            {!response.is_correct && (
                                              <p className="mb-1"><strong>Correct:</strong> {response.correct_answer}</p>
                                            )}
                                            <p className="mb-0"><strong>Time:</strong> {response.response_time}s</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'questions' && (
                <div>
                  {reportData?.question_analysis.map(question => (
                    <div key={question.question_id} className="card mb-4">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div className="flex-grow-1">
                            <h5 className="card-title">{question.question_text}</h5>
                            <p className="text-light"><strong>Correct Answer:</strong> {question.correct_answer}</p>
                          </div>
                          <span className={getDifficultyColor(question.difficulty_rating)}>
                            {question.difficulty_rating}
                          </span>
                        </div>

                        <div className="row g-3">
                          <div className="col-md-3">
                            <div className="card">
                              <div className="card-body text-center">
                                <div className="h4 text-danger fw-bold mb-0">{question.accuracy_percentage}%</div>
                                <small className="text-light">Accuracy</small>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="card">
                              <div className="card-body text-center">
                                <div className="h4 text-success fw-bold mb-0">{question.correct_attempts}/{question.total_attempts}</div>
                                <small className="text-light">Correct</small>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="card">
                              <div className="card-body text-center">
                                <div className="h4 text-primary fw-bold mb-0">{question.average_response_time.toFixed(1)}s</div>
                                <small className="text-light">Avg Time</small>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="card">
                              <div className="card-body text-center">
                                <div className="h4 text-warning fw-bold mb-0">{question.average_points_earned.toFixed(1)}</div>
                                <small className="text-light">Avg Points</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'leaderboard' && (
                <div>
                  <div className="card bg-gradient mb-4" style={{ background: 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)' }}>
                    <div className="card-body text-white">
                      <h2 className="card-title d-flex align-items-center gap-2 mb-2">
                        <i className="bi bi-trophy fs-2 text-center"></i>
                        Mission Leaderboard
                      </h2>
                      <p className="card-text text-start">Top performing teams in this mission</p>
                    </div>
                  </div>

                  <div className="row g-4">
                    {leaderboardData?.leaderboard.map((team, index) => (
                      <div key={team.rank} className="col-12">
                        <div className={`card h-100 ${
                          index === 0 ? 'border-warning bg-warning bg-opacity-10' :
                          index === 1 ? 'border-secondary bg-secondary bg-opacity-10' :
                          index === 2 ? 'border-danger bg-danger bg-opacity-10' :
                          ''
                        }`}>
                          <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between">
                              <div className="d-flex align-items-center gap-3">
                                <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4 text-white ${
                                  index === 0 ? 'bg-warning' :
                                  index === 1 ? 'bg-secondary' :
                                  index === 2 ? 'bg-danger' :
                                  'bg-primary'
                                }`} style={{ width: '50px', height: '50px' }}>
                                  {team.rank}
                                </div>
                                <div>
                                  <h5 className="mb-1">{team.group_name}</h5>
                                  <p className="mb-0">{team.student_count} students</p>
                                </div>
                              </div>
                              <div className="d-flex align-items-center gap-4">
                                <div className="text-center">
                                  <div className="h3 text-primary fw-bold mb-0">{team.score}</div>
                                  <small className="text-light">Score</small>
                                </div>
                                <div className="text-center">
                                  <div className="h5 mb-0 text-secondary">{team.accuracy}%</div>
                                  <small className="text-light">Accuracy</small>
                                </div>
                                <div className="text-center">
                                  <div className={`h5 mb-0 ${getRatingColor(team.rating_improvement)}`}>
                                    +{team.rating_improvement}
                                  </div>
                                  <small className="text-light">Improvement</small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Report;