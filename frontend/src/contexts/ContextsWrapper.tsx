import React, { ReactNode } from 'react'
import { ThemeProvider } from './theme-provider'

interface ContextsWrapperProps {
  children: ReactNode
}

export const ContextsWrapper = ({ children }: ContextsWrapperProps) => {
  return (
    <div>
        {children}
    </div>
  )
}