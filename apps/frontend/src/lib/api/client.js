import { API_BASE } from '@/lib/constants'

export class ApiError extends Error {
  constructor(message, { code, status, errors, details } = {}) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
    this.errors = errors
    this.details = details
  }
}

function parseError(status, body) {
  if (!body || typeof body !== 'object') {
    return new ApiError('Request failed', { status })
  }

  const message =
    body.message ??
    (Array.isArray(body.errors) ? body.errors[0]?.message : null) ??
    'Request failed'

  return new ApiError(message, {
    code: body.code,
    status,
    errors: body.errors,
    details: body.details,
  })
}

export async function apiRequest(path, options = {}) {
  const { method = 'GET', body, headers, ...rest } = options

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...rest,
  })

  if (response.status === 204) {
    return null
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw parseError(response.status, data)
  }

  return data
}

export function getErrorMessage(error, fallback = 'Something went wrong') {
  if (error instanceof ApiError) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return fallback
}
