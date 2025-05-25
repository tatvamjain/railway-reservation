import { testConnection } from "@/lib/db"

export default async function TestConnectionPage() {
  const result = await testConnection()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      {result.success ? (
        <div className="bg-green-100 p-4 rounded">
          <p className="text-green-800">Connection successful!</p>
          <pre className="mt-2 bg-gray-100 p-2 rounded overflow-auto">{JSON.stringify(result.result, null, 2)}</pre>
        </div>
      ) : (
        <div className="bg-red-100 p-4 rounded">
          <p className="text-red-800">Connection failed!</p>
          <pre className="mt-2 bg-gray-100 p-2 rounded overflow-auto">{JSON.stringify(result.error, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
