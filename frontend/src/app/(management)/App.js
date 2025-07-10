// src/App.js
import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import AssessmentConfigPage from './components/AssessmentConfigPage';
import ReportPage from './components/ReportPage';
import './App.css';

function App() {
  const [appState, setAppState] = useState('login'); // 'login', 'configure', 'report'
  const [currentReportData, setCurrentReportData] = useState(null); // Stores { config: {...}, report: [...] }

  const handleLoginSuccess = () => {
    setAppState('configure');
  };

  // UPDATED: This function now expects an object with 'config' and 'report'
  const handleStartAssessment = (data) => {
    setCurrentReportData(data); // Store the combined data
    setAppState('report');
  };

  const handleBackToConfig = () => {
    setAppState('configure');
    setCurrentReportData(null); // Clear report data
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Cloud Compliance Dashboard</h1>
      </header>
      <main>
        {appState === 'login' && <LoginPage onLoginSuccess={handleLoginSuccess} />}
        {appState === 'configure' && <AssessmentConfigPage onStartAssessmentProcess={handleStartAssessment} />}
        {appState === 'report' && currentReportData && (
          // UPDATED: Pass the entire currentReportData which now contains both config and report
          <ReportPage assessmentResult={currentReportData} onBackToConfig={handleBackToConfig} />
        )}
      </main>
    </div>
  );
}

export default App;