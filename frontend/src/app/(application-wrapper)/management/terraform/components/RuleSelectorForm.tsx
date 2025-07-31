'use client'
import React, { useState } from 'react'
import styles from './RuleSelectorForm.module.css'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

import { frameworks, providers } from '@/utils/commons'
import GeneratedResult from './GeneratedResult'


export default function RuleSelectorForm() {
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([])
  const [selectedProviders, setSelectedProviders] = useState<string[]>([])
  const [downloadLinks, setDownloadLinks] = useState<string[]>([])
  const [tf, setTF] = useState<string>()

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
    setTF('') 
    const res = await fetch('http://127.0.0.1:3001/generate_terraform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        frameworks: selectedFrameworks,
        providers: selectedProviders
      })
    })

    const data = await res.json()
    console.log(data)
    setDownloadLinks(data.files || [])
    setTF(data.terraform_content)
  }

  return (
    <div>
      <Card>
        <CardTitle>
          Generate Terraform Baselines
        </CardTitle>
        <CardContent>
          <p className=' fs-xs'>
            *Select the frameworks and cloud providers to generate Terraform baselines for.
          </p>

          <p className={styles.sectionTitle}>Select Framework(s)</p>
          <div className='flex flex-row gap-1 pb-1'>
            {frameworks.map((fw) => (
              <div key={fw} className='flex flex-row gap-1 pb-1'>
                <Checkbox
                  id={`${fw}-checkbox`}
                  checked={selectedFrameworks.includes(fw)}
                  onCheckedChange={() => handleToggle(fw, selectedFrameworks, setSelectedFrameworks)}
                />
                <Label htmlFor={`${fw}-checkbox`}>{fw}</Label>
              </div>
            ))}
          </div>

          <p className={styles.sectionTitle}>Select Framework(s)</p>
          <div className='flex flex-row gap-1 pb-1'>

            {providers.map((provider) => (
              <div key={provider} className='flex flex-row gap-1 pb-1'>
                <Checkbox
                  disabled={provider !== "azure"}
                  id={`${provider}-checkbox`}
                  checked={selectedProviders.includes(provider)}
                  onCheckedChange={() =>
                    handleToggle(provider, selectedProviders, setSelectedProviders)}
                />
                <Label htmlFor={`${provider}-checkbox`}>
                  {provider.toUpperCase()}
                  <span className='text-xs '>
                  {provider != "azure" ? "(Coming soon...)" : ""}

                  </span>
                </Label>
              </div>
            ))}
          </div>


          <Button onClick={handleSubmit}>
            Generate Terraform Baselines
          </Button>

        </CardContent>
      </Card>
      <GeneratedResult result={tf}/>
    </div>
  )
}
