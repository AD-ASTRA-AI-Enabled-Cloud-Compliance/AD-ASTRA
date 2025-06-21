// src/components/ReportPage.js
import React from 'react';
import './ReportPage.css'; // Make sure this CSS file is present

function ReportPage({ assessmentResult, onBackToConfig }) {
  if (!assessmentResult || !assessmentResult.report) {
    return (
      <div className="report-container">
        <h2>No Assessment Data Available</h2>
        <p>Please go back and run an assessment.</p>
        <button onClick={onBackToConfig} className="back-button">Back to Configuration</button>
      </div>
    );
  }

  const { config, report } = assessmentResult;

  const selectedFrameworks = config.frameworks ? config.frameworks.join(', ') : 'N/A';
  const selectedResourceTypes = config.resourceTypes ? config.resourceTypes.map(type => type.split('::').pop()).join(', ') : 'N/A';
  const cloudProvider = config.cloudProvider || 'N/A';

  const getStatusClass = (status) => {
    switch (status) {
      case 'COMPLIANT':
        return 'status-compliant';
      case 'NON_COMPLIANT':
        return 'status-non-compliant';
      case 'NOT_APPLICABLE':
        return 'status-not-applicable';
      default:
        return '';
    }
  };

  // --- NEW: Download Functions ---
  const formatReportForDownload = (format) => {
    const header = `Cloud Compliance Assessment Report\n` +
                   `Provider: ${cloudProvider}\n` +
                   `Frameworks: ${selectedFrameworks}\n` +
                   `Resource Types: ${selectedResourceTypes}\n\n`;

    if (format === 'json') {
      return JSON.stringify(assessmentResult, null, 2); // Pretty print JSON
    } else if (format === 'text') {
      let textContent = header;
      textContent += "--- Detailed Results ---\n\n";

      if (report.length === 0) {
        textContent += "No resources found or assessed.\n";
      } else {
        report.forEach((item, index) => {
          textContent += `Resource ${index + 1}:\n`;
          textContent += `  ID: ${item.resourceId}\n`;
          textContent += `  Name: ${item.name || 'N/A'}\n`;
          textContent += `  Type: ${item.resourceType}\n`;
          textContent += `  Region: ${item.region || 'N/A'}\n`;
          textContent += `  Status: ${item.complianceStatus.replace('_', ' ')}\n`;

          if (item.failedRules && item.failedRules.length > 0) {
            textContent += `  Failed Rules:\n`;
            item.failedRules.forEach(rule => {
              textContent += `    - [${rule.framework}] ${rule.ruleName}: ${rule.details}\n`;
            });
          }

          if (item.passedRules && item.passedRules.length > 0) {
            textContent += `  Passed Rules:\n`;
            item.passedRules.forEach(rule => {
              textContent += `    - [${rule.framework}] ${rule.ruleName}\n`;
            });
          }
          textContent += `\n`; // Add a blank line between resources
        });
      }
      return textContent;
    }
    return '';
  };

  const handleDownload = (format) => {
    const content = formatReportForDownload(format);
    const filename = `compliance_report_${cloudProvider.toLowerCase()}_${new Date().toISOString().slice(0,10)}.${format}`;
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up the URL object
  };
  // --- END: Download Functions ---


  return (
    <div className="report-container">
      <h2>Compliance Assessment Report</h2>

      <div className="assessment-summary">
        <h3>Assessment Summary</h3>
        <p><strong>Cloud Provider:</strong> {cloudProvider}</p>
        <p><strong>Selected Frameworks:</strong> {selectedFrameworks}</p>
        <p><strong>Assessed Resource Types:</strong> {selectedResourceTypes}</p>
      </div>

      <div className="report-actions">
        <button onClick={() => handleDownload('json')} className="download-button json">Download JSON</button>
        <button onClick={() => handleDownload('text')} className="download-button text">Download Text</button>
      </div>

      <div className="report-table-container"> {/* NEW: Container for table */}
        <h3>Detailed Results ({report.length} Resources)</h3>
        {report.length === 0 ? (
          <p>No resources found for the selected criteria, or no compliance issues detected.</p>
        ) : (
          <table className="compliance-table"> {/* NEW: Table structure */}
            <thead>
              <tr>
                <th>Resource Name</th>
                <th>Type</th>
                <th>Region</th>
                <th>Status</th>
                <th>Failed Rules</th>
                <th>Passed Rules</th>
                {/* Add more headers if needed */}
              </tr>
            </thead>
            <tbody>
              {report.map((item) => (
                <tr key={item.resourceId}>
                  <td>{item.name || item.resourceId.split('/').pop()}</td> {/* Display name or last part of ID */}
                  <td>{item.resourceType.split('::').pop()}</td> {/* Display just the resource type name */}
                  <td>{item.region || 'N/A'}</td>
                  <td className={getStatusClass(item.complianceStatus)}>{item.complianceStatus.replace('_', ' ')}</td>
                  <td>
                    {item.failedRules && item.failedRules.length > 0 ? (
                      <ul className="rule-list">
                        {item.failedRules.map((rule, index) => (
                          <li key={index}>
                            [{rule.framework}] {rule.ruleName}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      'None'
                    )}
                  </td>
                  <td>
                    {item.passedRules && item.passedRules.length > 0 ? (
                      <ul className="rule-list">
                        {item.passedRules.map((rule, index) => (
                          <li key={index}>
                            [{rule.framework}] {rule.ruleName}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      'None'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <button onClick={onBackToConfig} className="back-button">Back to Configuration</button>
    </div>
  );
}

export default ReportPage;