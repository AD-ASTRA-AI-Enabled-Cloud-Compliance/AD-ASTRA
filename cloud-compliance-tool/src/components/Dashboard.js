// src/components/Dashboard.js
import React from 'react';
import './Dashboard.css'; // We'll create this CSS file next

// We're expecting a new prop called 'onStartAssessment' from App.js
function Dashboard({ onStartAssessment }) {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome to Your Cloud Compliance Dashboard!</h1>
        <p>Manage your cloud assessments efficiently.</p>
      </header>

      <main className="dashboard-main">
        <section className="assessment-section">
          <h2>Start a New Assessment</h2>
          <p>Click the button below to configure and initiate a new compliance assessment.</p>
          <button
            className="start-assessment-button"
            onClick={onStartAssessment} // When clicked, call the function passed from App.js
          >
            Start Assessment
          </button>
        </section>

        {/* You can add more sections here later, e.g., for "Recent Reports" */}
        <section className="recent-reports-section">
          <h2>Recent Reports</h2>
          <p>No recent reports available. Start an assessment to generate your first report!</p>
          {/* This area will list past reports */}
        </section>
      </main>

      <footer className="dashboard-footer">
        <p>&copy; 2025 Cloud Compliance Tool. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Dashboard;