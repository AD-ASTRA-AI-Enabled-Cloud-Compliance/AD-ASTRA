'use client'
import React, { useState } from 'react'
import styles from './RuleSelectorForm.module.css'

const frameworks = ['GDPR', 'PCI', 'HIPAA', 'NIST']
const providers = ['aws', 'azure', 'gcp']

export default function RuleSelectorForm() {
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([])
  const [selectedProviders, setSelectedProviders] = useState<string[]>([])
  const [downloadLinks, setDownloadLinks] = useState<string[]>([])

  const handleToggle = (
    value: string,
    group: string[],
    setGroup: (group: string[]) => void
  ) => {
    const updatedGroup = group.includes(value)
      ? group.filter((item) => item !== value)
      : [...group, value]
    setGroup(updatedGroup)
  }

  const handleSubmit = async () => {
    const res = await fetch('http://127.0.0.1:3001/generate_terraform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        frameworks: selectedFrameworks,
        providers: selectedProviders
      })
    })

    const data = await res.json()
    setDownloadLinks(data.files || [])
  }

  return (
    <div className={styles.formContainer}>
      {/* Framework selection */}
      <div>
        <p className={styles.sectionTitle}>Select Framework(s)</p>
        <div className={styles.checkboxGroup}>
          {frameworks.map((fw) => (
            <label key={fw} className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={selectedFrameworks.includes(fw)}
                onChange={() => handleToggle(fw, selectedFrameworks, setSelectedFrameworks)}
              />
              {fw}
            </label>
          ))}
        </div>
      </div>

      {/* Provider selection */}
      <div>
        <p className={styles.sectionTitle}>Select Cloud Provider(s)</p>
        <div className={styles.checkboxGroup}>
          {providers.map((provider) => (
            <label key={provider} className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={selectedProviders.includes(provider)}
                onChange={() =>
                  handleToggle(provider, selectedProviders, setSelectedProviders)
                }
              />
              {provider.toUpperCase()}
            </label>
          ))}
        </div>
      </div>

      {/* Format selection – Temporarily Disabled */}
      {/* 
      <div>
        <p className={styles.sectionTitle}>Select Output Format(s)</p>
        <div className={styles.checkboxGroup}>
          {formats.map((fmt) => (
            <label key={fmt.value} className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={selectedFormats.includes(fmt.value)}
                onChange={() =>
                  handleToggle(fmt.value, selectedFormats, setSelectedFormats)
                }
              />
              {fmt.label}
            </label>
          ))}
        </div>
      </div>
      */}

      {/* Submit Button */}
      <button className={styles.button} onClick={handleSubmit}>
        Generate Cloud-Specific Rules
      </button>

      {/* Download links */}
      {downloadLinks.length > 0 && (
        <div className={styles.downloadList}>
          <strong>Download Files:</strong>
          <ul>
            {downloadLinks.map((link, idx) => {
              const filename = link.split('/').pop()
              return (
                <li key={idx}>
                  <a
                    href={`http://localhost:3001/${link}`}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {filename}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
