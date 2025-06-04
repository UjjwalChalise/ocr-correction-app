import { useState, useEffect } from "react"
import { Card, CardContent } from "./ui/card"
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export function APIStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')

  useEffect(() => {
    const checkAPIStatus = async () => {
      try {
        const response = await fetch('http://localhost:8000/health', {
          method: 'GET',
          timeout: 5000
        } as any)
        
        if (response.ok) {
          setStatus('connected')
        } else {
          setStatus('disconnected')
        }
      } catch (error) {
        setStatus('disconnected')
      }
    }

    checkAPIStatus()
    const interval = setInterval(checkAPIStatus, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'disconnected':
        return <XCircle className="w-4 h-4 text-red-500" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Checking API...'
      case 'connected':
        return 'API Connected'
      case 'disconnected':
        return 'API Disconnected'
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'text-gray-600'
      case 'connected':
        return 'text-green-600'
      case 'disconnected':
        return 'text-red-600'
    }
  }

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        {status === 'disconnected' && (
          <p className="text-xs text-gray-500 mt-1">
            Make sure the API server is running on localhost:8000
          </p>
        )}
      </CardContent>
    </Card>
  )
}