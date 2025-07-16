// 'use client' is necessary for client-side components in Next.js App Router
'use client';

import React, { useState } from 'react';
import axios from 'axios'; // Assuming axios is installed: npm install axios
import AssessmentConfigPage from './components/AssessmentConfigPage'; // Adjust path as needed
import ReportPage from './components/ReportPage'; // Adjust path as needed

export default function ResourceEvaluatorPage() {
  const [tenantId, setTenantId] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [subscriptionId, setSubscriptionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [validCreds, setValidCreds] = useState(false);
  const [error, setError] = useState('');

  // State to hold the assessment report and configuration once it's completed
  // This will store { config: {...}, report: [...] }
  const [assessmentResult, setAssessmentResult] = useState(null);
  // State to control which view is shown (login, config, or report)
  const [currentView, setCurrentView] = useState('login'); // 'login', 'config', 'report'

  const handleValidateCredentials = async () => {
    setLoading(true);
    setError('');
    setValidCreds(false); // Reset validCreds on new validation attempt

    // Basic client-side check for empty fields
    if (!tenantId || !clientId || !clientSecret || !subscriptionId) {
        setError('All Azure credential fields are required.');
        setLoading(false);
        return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/validate', {
        azureTenantId: tenantId,
        azureClientId: clientId,
        azureClientSecret: clientSecret,
        azureSubscriptionId: subscriptionId,
      });

      if (response.data.valid) {
        setValidCreds(true);
        setError(''); // Clear any previous error
        setCurrentView('config'); // Move to the configuration page
      } else {
        setError(response.data.error || 'Invalid Azure credentials. Please check your inputs.');
      }
    } catch (error: any) {
      // Catch network errors or errors with non-200 responses from backend
      setError('Validation failed: ' + (error.response?.data?.error || error.message));
      setValidCreds(false); // Ensure credentials are not marked as valid on error
    } finally {
      setLoading(false);
    }
  };

  // This function will be passed as a prop to AssessmentConfigPage
  // It receives the assessment configuration and the backend report
  const handleAssessmentProcessComplete = (result: any) => {
    console.log("Assessment configuration received:", result.config);
    console.log("Full assessment report received:", result.report);
    setAssessmentResult(result); // Store the full result object {config, report}
    setCurrentView('report'); // Switch to display the report
  };

  // Function to go back to the configuration page from the report
  const handleBackToConfig = () => {
    setAssessmentResult(null); // Clear previous report
    setCurrentView('config'); // Show the config page
  };

  // --- Conditional Rendering based on `currentView` ---
  if (currentView === 'config') {
    return (
      <AssessmentConfigPage
        // Pass the actual credentials as props to AssessmentConfigPage
        azureTenantId={tenantId}
        azureClientId={clientId}
        azureClientSecret={clientSecret}
        azureSubscriptionId={subscriptionId}
        // Pass the function to handle assessment completion
        onStartAssessmentProcess={handleAssessmentProcessComplete}
      />
    );
  }

  if (currentView === 'report') {
    return (
      <ReportPage
        assessmentResult={assessmentResult} // Pass the stored assessment result
        onBackToConfig={handleBackToConfig} // Pass function to go back
      />
    );
  }

  // Default view: Login/Credential input screen
  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-800">Azure Resource Assessment Login</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="subscriptionId" className="block text-gray-700 text-sm font-bold mb-2">
            Azure Subscription ID:
          </label>
          <input
            id="subscriptionId"
            type="text"
            placeholder="e.g., xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            value={subscriptionId}
            onChange={(e) => setSubscriptionId(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label htmlFor="tenantId" className="block text-gray-700 text-sm font-bold mb-2">
            Azure Tenant ID:
          </label>
          <input
            id="tenantId"
            type="text"
            placeholder="e.g., yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy"
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label htmlFor="clientId" className="block text-gray-700 text-sm font-bold mb-2">
            Azure Client ID:
          </label>
          <input
            id="clientId"
            type="text"
            placeholder="e.g., zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label htmlFor="clientSecret" className="block text-gray-700 text-sm font-bold mb-2">
            Azure Client Secret:
          </label>
          <input
            id="clientSecret"
            type="password" // Use type="password" for sensitive data
            placeholder="Enter your client secret"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      </div>

      {error && <p className="text-red-600 mt-4 text-center">{error}</p>}

      <button
        onClick={handleValidateCredentials}
        disabled={loading}
        className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
      >
        {loading ? 'Validating...' : 'Validate & Continue'}
      </button>
    </div>
  );
}