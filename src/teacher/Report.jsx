import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import '../css/Report.css';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Report = () => {
  const [reportData, setReportData] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedGroups, setExpandedGroups] = useState({});
  const location = useLocation();
  const roomId = location.state?.room_id || 1; // Default to 1 if not provided, or get from props/URL params

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportRes, leaderboardRes] = await Promise.all([
          axios.get(`https://drp-belgium.onrender.com/api/mission-report/${roomId}/`),
          axios.get(`https://drp-belgium.onrender.com/api/mission-leaderboard/${roomId}/`)
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
    switch (rating) {
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

  // PDF Download Function
  const downloadPDF = async () => {
    try {
      setPdfLoading(true);

      // Create a temporary container with all content
      const printContainer = document.createElement('div');
      printContainer.style.position = 'absolute';
      printContainer.style.left = '-9999px';
      printContainer.style.width = '210mm';
      printContainer.style.backgroundColor = 'black';
      printContainer.style.padding = '20px';

      // Generate PDF content
      printContainer.innerHTML = generatePDFContent();
      document.body.appendChild(printContainer);

      // Convert to canvas
      const canvas = await html2canvas(printContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      pdf.save(`Mission_Report_${reportData?.room_info.room_code}_${new Date().toISOString().split('T')[0]}.pdf`);

      // Clean up
      document.body.removeChild(printContainer);
      setPdfLoading(false);

    } catch (error) {
      console.error('Error generating PDF:', error);
      setPdfLoading(false);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // Generate clean PDF content
  const generatePDFContent = () => {
    return `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <style>
          * { color: #fff; }
        </style>
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0d6efd; padding-bottom: 20px;">
          <h1 style="color: #0d6efd; margin-bottom: 10px;">Mission Report</h1>
          <h2 style="color: #666; margin: 5px 0;">${reportData?.room_info.quiz_title}</h2>
          <p style="color: #888; margin: 5px 0;">Room Code: ${reportData?.room_info.room_code}</p>
          <p style="color: #888; margin: 5px 0;">Subject: ${reportData?.room_info.quiz_subject} | Duration: ${reportData?.room_info.total_time} minutes | Difficulty: ${reportData?.room_info.quiz_difficulty}</p>
        </div>

        <!-- Summary Statistics -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #0d6efd; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Summary Statistics</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 15px;">
            <div style="text-align: center; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
              <div style="font-size: 24px; font-weight: bold; color: #0d6efd;">${reportData?.summary_stats.average_score.toFixed(1)}</div>
              <div style="color: #666; font-size: 12px;">Average Score</div>
            </div>
            <div style="text-align: center; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
              <div style="font-size: 24px; font-weight: bold; color: #28a745;">+${reportData?.summary_stats.rating_improvement.toFixed(1)}</div>
              <div style="color: #666; font-size: 12px;">Rating Improvement</div>
            </div>
          </div>
        </div>

        <!-- Team Performance -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #0d6efd; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Team Performance</h3>
          <div style="margin-top: 15px;">
            ${reportData?.group_performance.map(group => `
              <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; page-break-inside: avoid;">
                <h4 style="color: #333; margin-bottom: 10px;">${group.group_name}</h4>
                <p style="color: #666; margin-bottom: 10px;">Students: ${group.student_names.join(', ')}</p>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
                  <div style="text-align: center;">
                    <div style="font-weight: bold; color: #0d6efd;">${group.total_score}</div>
                    <div style="font-size: 12px; color: #666;">Score</div>
                  </div>
                  <div style="text-align: center;">
                    <div style="font-weight: bold; color: #ffc107;">${group.accuracy_percentage}%</div>
                    <div style="font-size: 12px; color: #666;">Accuracy</div>
                  </div>
                  <div style="text-align: center;">
                    <div style="font-weight: bold; color: ${group.rating_change >= 0 ? '#28a745' : '#dc3545'};">${group.rating_change > 0 ? '+' : ''}${group.rating_change}</div>
                    <div style="font-size: 12px; color: #666;">Rating Change</div>
                  </div>
                  <div style="text-align: center;">
                    <div style="font-weight: bold; color: #17a2b8;">${group.average_response_time.toFixed(1)}s</div>
                    <div style="font-size: 12px; color: #666;">Avg Time</div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Leaderboard -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #0d6efd; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Leaderboard</h3>
          <div style="margin-top: 15px;">
            ${leaderboardData?.leaderboard.map((team, index) => `
              <div style="margin-bottom: 15px; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <div>
                    <span style="display: inline-block; width: 30px; height: 30px; border-radius: 50%; background-color: ${index === 0 ? '#ffc107' : index === 1 ? '#6c757d' : index === 2 ? '#dc3545' : '#0d6efd'}; color: white; text-align: center; line-height: 30px; font-weight: bold; margin-right: 15px;">
                      ${team.rank}
                    </span>
                    <strong>${team.group_name}</strong> - ${team.student_count} students (${team.student_names.join(', ')})
                  </div>
                  <div>
                    Score: <strong>${team.score}</strong> | Accuracy: <strong>${team.accuracy}%</strong> | Improvement: <strong style="color: #28a745;">+${team.rating_improvement}</strong>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Question Analysis -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #fff; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Question Analysis</h3>
          <div style="margin-top: 15px;">
            ${reportData.question_analysis.map((q, index) => `
              <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; page-break-inside: avoid;">
                <p style="color: #fff; font-weight: bold;">Q${index + 1}: ${q.question_text}</p>
                <p style="color: #fff; font-size: 12px; margin-top: 5px;">Correct Answer: ${q.correct_answer}</p>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">
                  <div style="text-align: center;"><div style="font-weight: bold; color: #fff;">${q.accuracy_percentage.toFixed(1)}%</div><div style="font-size: 12px; color: #fff;">Accuracy</div></div>
                  <div style="text-align: center;"><div style="font-weight: bold; color: #fff;">${q.average_response_time.toFixed(1)}s</div><div style="font-size: 12px; color: #fff;">Avg Time</div></div>
                  <div style="text-align: center;"><div style="font-weight: bold; color: #fff;">${q.total_attempts}</div><div style="font-size: 12px; color: #fff;">Attempts</div></div>
                  <div style="text-align: center;"><div style="font-weight: bold; color: #fff;">${q.difficulty_rating}</div><div style="font-size: 12px; color: #fff;">Difficulty</div></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
          <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    `;
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

  // Prepare question accuracy distribution data from backend response
  const questionAccuracyData = reportData?.question_analysis?.reduce((acc, q) => {
    const accuracy = q.accuracy_percentage;
    let category;
    if (accuracy >= 80) {
      category = '80%+ Accuracy';
    } else if (accuracy >= 50) {
      category = '50-79% Accuracy';
    } else {
      category = '<50% Accuracy';
    }
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {}) || {};

  const pieData = Object.entries(questionAccuracyData).map(([key, value]) => ({
    name: key,
    value,
    color: key === '80%+ Accuracy' ? '#198754' :
      key === '50-79% Accuracy' ? '#ffc107' : '#dc3545'
  }));

  return (
    <>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet" />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>

      <div className="min-vh-100 ">
        <div className="container-fluid py-4">
          <div className="d-flex justify-content-end mb-3">
            <button
              className="btn btn-outline-light"
              onClick={downloadPDF}
              disabled={pdfLoading}
            >
              {pdfLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Generating PDF...
                </>
              ) : (
                <>
                  <i className="bi bi-download me-2"></i>
                  Download Report as PDF
                </>
              )}
            </button>
          </div>
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
                  { id: 'questions', label: 'Question Analysis', icon: 'bi-award' }
                  // Removed leaderboard tab here
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
                              <CartesianGrid strokeDasharray="3 3" stroke="white" />
                              <XAxis dataKey="name" tick={{ fill: 'white' }}
                                axisLine={{ stroke: 'white' }}
                                tickLine={{ stroke: 'white' }} />
                              <YAxis tick={{ fill: 'white' }}
                                axisLine={{ stroke: 'white' }}
                                tickLine={{ stroke: 'white' }} />
                              <Tooltip />
                              <Bar dataKey="score" fill="#00ffff" radius={4} />
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Report;