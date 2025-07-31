import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import React from 'react'

type GeneratedTFType = {
  result: string;
};

const GeneratedTF = ({ result }: GeneratedTFType) => {
  return (
    <div>
      {result && (
        <Card>
          <CardContent className='whitespace-pre-wrap text-xs'>
            <Textarea>
              {result}
            </Textarea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default GeneratedTF