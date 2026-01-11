import { useState, useEffect } from 'react'
import { taskTemplateApi, stepTemplateApi } from '@/services/maintenance'

export default function TestPage() {
  const [data, setData] = useState<unknown>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('Fetching task templates...')
        const result = await taskTemplateApi.list()
        console.log('Task templates result:', result)
        setData(result)
      } catch (err) {
        console.error('Error:', err)
        setError(err instanceof Error ? err.message : String(err))
      }
    }
    fetchData()
  }, [])

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>
  }

  if (!data) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Task Templates Test</h1>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}
