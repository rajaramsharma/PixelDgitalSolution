const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`
  console.log(`API Request: ${options.method || 'GET'} ${url}`)

  const token = localStorage.getItem("token")
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    const contentType = response.headers.get("content-type")

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || data.message || "Something went wrong")
      }
      return data
    } else {
      // Handle non-JSON response (likely HTML error page)
      const text = await response.text()
      console.error("Non-JSON API Response:", text.substring(0, 200))
      throw new Error(`Server returned ${response.status}: Please check if the backend is running correctly.`)
    }
  } catch (error) {
    console.error("API Request Failed:", error)
    throw error
  }
}
