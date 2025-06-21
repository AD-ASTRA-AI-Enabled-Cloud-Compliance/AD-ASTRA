// src/components/AssessmentConfigPage.js
import React, { useState } from 'react';
import './AssessmentConfigPage.css';

function AssessmentConfigPage({ onStartAssessmentProcess }) {
  const [selectedFrameworks, setSelectedFrameworks] = useState({
    HIPAA: false,
    PCI: false,
    ISO: false,
    NIST: false,
    Custom: false,
  });
  const [customRules, setCustomRules] = useState('');
  const [customRulesError, setCustomRulesError] = useState('');
  const [cloudProvider, setCloudProvider] = useState(''); // 'AWS' or 'Azure'
  const [selectedResourceTypes, setSelectedResourceTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);


  const handleFrameworkChange = (event) => {
    const { name, checked } = event.target;
    setSelectedFrameworks((prev) => ({
      ...prev,
      [name]: checked,
    }));
    if (name === 'Custom' && !checked) {
      setCustomRules('');
      setCustomRulesError('');
    }
  };

  const handleCustomRulesChange = (event) => {
    setCustomRules(event.target.value);
    setCustomRulesError('');
  };

  const handleCloudProviderChange = (event) => {
    setCloudProvider(event.target.value);
    setSelectedResourceTypes([]); // Clear resource types when provider changes
  };

  const handleResourceTypeChange = (event) => {
    const { value, checked } = event.target;
    setSelectedResourceTypes((prev) => {
      if (checked) {
        return [...prev, value];
      } else {
        return prev.filter((type) => type !== value);
      }
    });
  };

  const getAvailableResourceTypes = () => {
    if (cloudProvider === 'AWS') {
      return [
        { label: 'S3 Buckets', value: 'S3::Bucket' },
        { label: 'EC2 Instances', value: 'EC2::Instance' },
        { label: 'Lambda Functions', value: 'Lambda::Function' },
        { label: 'RDS Instances', value: 'RDS::DBInstance' },
        { label: 'Security Groups', value: 'EC2::SecurityGroup' },
      ];
    } else if (cloudProvider === 'Azure') {
      return [
        { label: 'Storage Accounts', value: 'Azure::Storage::StorageAccount' },
        { label: 'Virtual Machines', value: 'Azure::Compute::VirtualMachine' },
        { label: 'Key Vaults', value: 'Azure::KeyVault::Vault' },
        { label: 'Network Security Groups', value: 'Azure::Network::NetworkSecurityGroup' },
      ];
    }
    return [];
  };


  const handleStartAssessment = async () => {
    setSubmitError(null);
    setLoading(true);

    let isValid = true;
    let parsedCustomRules = null;

    if (selectedFrameworks.Custom) {
      if (!customRules.trim()) {
        setCustomRulesError('Custom rules cannot be empty if selected.');
        isValid = false;
      } else {
        try {
          parsedCustomRules = JSON.parse(customRules);
        } catch (e) {
          setCustomRulesError('Invalid JSON format for custom rules.');
          isValid = false;
        }
      }
    }

    const anyFrameworkSelected = Object.values(selectedFrameworks).some(Boolean);
    if (!anyFrameworkSelected) {
      alert('Please select at least one compliance framework.');
      isValid = false;
    }

    if (!cloudProvider) {
      alert('Please select a cloud provider (AWS or Azure).');
      isValid = false;
    }
    
    if (selectedResourceTypes.length === 0) {
        alert('Please select at least one resource type to assess.');
        isValid = false;
    }


    if (!isValid) {
      setLoading(false);
      return;
    }

    const assessmentDetailsToSend = {
      frameworks: Object.keys(selectedFrameworks).filter(key => selectedFrameworks[key]),
      customRules: selectedFrameworks.Custom ? parsedCustomRules : null,
      cloudProvider: cloudProvider,
      resourceTypes: selectedResourceTypes,
    };

    try {
      const response = await fetch('http://localhost:5000/api/assess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessmentDetailsToSend),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || `Backend error! Status: ${response.status}`);
      }

      const backendResponse = await response.json();
      console.log("Backend response:", backendResponse);

      // UPDATED: Pass both the config and the backend report
      onStartAssessmentProcess({
          config: assessmentDetailsToSend,
          report: backendResponse.report
      });
    } catch (err) {
      console.error("Error communicating with backend:", err);
      setSubmitError("Failed to start assessment. Is the backend running? Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assessment-config-container">
      <h2>Configure Your Compliance Assessment</h2>

      <div className="config-section">
        <h3>1. Choose Cloud Provider</h3>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="cloudProvider"
              value="AWS"
              checked={cloudProvider === 'AWS'}
              onChange={handleCloudProviderChange}
            /> AWS
          </label>
          <label>
            <input
              type="radio"
              name="cloudProvider"
              value="Azure"
              checked={cloudProvider === 'Azure'}
              onChange={handleCloudProviderChange}
            /> Azure
          </label>
        </div>
      </div>

      {cloudProvider && (
        <div className="config-section">
          <h3>2. Select Resource Types for {cloudProvider}</h3>
          <div className="checkbox-group">
            {getAvailableResourceTypes().map((type) => (
              <label key={type.value}>
                <input
                  type="checkbox"
                  value={type.value}
                  checked={selectedResourceTypes.includes(type.value)}
                  onChange={handleResourceTypeChange}
                /> {type.label}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="config-section">
        <h3>3. Select Compliance Frameworks</h3>
        <div className="checkbox-group">
          {['HIPAA', 'PCI', 'ISO', 'NIST'].map(framework => (
            <label key={framework}>
              <input
                type="checkbox"
                name={framework}
                checked={selectedFrameworks[framework]}
                onChange={handleFrameworkChange}
              /> {framework}
            </label>
          ))}
          <label>
            <input
              type="checkbox"
              name="Custom"
              checked={selectedFrameworks.Custom}
              onChange={handleFrameworkChange}
            /> Custom Organization Rules
          </label>
        </div>

        {selectedFrameworks.Custom && (
          <div className="custom-rules-group">
            <label htmlFor="customRules">Enter Custom Rules (JSON format):</label>
            <textarea
              id="customRules"
              value={customRules}
              onChange={handleCustomRulesChange}
              placeholder='Example: {"rule_name": "No Public S3 Buckets", "resource_type": "AWS::S3::Bucket", "property": "PublicAccessBlockConfiguration.BlockPublicAcls", "expected_value": true}'
              rows="8"
            ></textarea>
            {customRulesError && <p className="error-message">{customRulesError}</p>}
          </div>
        )}
      </div>


      {submitError && <p className="error-message">{submitError}</p>}

      <button className="start-assessment-button" onClick={handleStartAssessment} disabled={loading}>
        {loading ? 'Starting Assessment...' : 'Start Assessment'}
      </button>
    </div>
  );
}

export default AssessmentConfigPage;