import { env } from './env'
import { AuthService } from './auth.service'

export class ToolError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message)
    this.name = 'ToolError'
  }
}

export interface Tool {
  id: string
  title: string
  description: string
  imageUrl: string
  ownerId: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateToolDto {
  title: string
  description: string
}

export interface UpdateToolDto {
  title?: string
  description?: string
}

export class ToolService {
  private static getHeaders() {
    const token = AuthService.getToken()
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  }

  static async createTool(tool: CreateToolDto): Promise<Tool> {
    try {
      const response = await fetch(`${env.VITE_API_URL}/api/tools`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(tool),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new ToolError(errorData.message || 'Failed to create tool', response.status)
      }

      return response.json()
    } catch (error) {
      if (error instanceof ToolError) throw error
      throw new ToolError('Failed to create tool: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  static async updateTool(id: string, tool: UpdateToolDto): Promise<Tool> {
    try {
      const response = await fetch(`${env.VITE_API_URL}/api/tools/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(tool),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new ToolError(errorData.message || 'Failed to update tool', response.status)
      }

      return response.json()
    } catch (error) {
      if (error instanceof ToolError) throw error
      throw new ToolError('Failed to update tool: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  static async deleteTool(id: string): Promise<void> {
    try {
      const response = await fetch(`${env.VITE_API_URL}/api/tools/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new ToolError(errorData.message || 'Failed to delete tool', response.status)
      }
    } catch (error) {
      if (error instanceof ToolError) throw error
      throw new ToolError('Failed to delete tool: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  static async getMyTools(): Promise<Tool[]> {
    try {
      const response = await fetch(`${env.VITE_API_URL}/api/tools/my-tools`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new ToolError(errorData.message || 'Failed to fetch tools', response.status)
      }

      return response.json()
    } catch (error) {
      if (error instanceof ToolError) throw error
      throw new ToolError('Failed to fetch tools: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  static async getTool(id: string): Promise<Tool> {
    try {
      const response = await fetch(`${env.VITE_API_URL}/api/tools/${id}`, {
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new ToolError(errorData.message || 'Failed to fetch tool', response.status)
      }

      return response.json()
    } catch (error) {
      if (error instanceof ToolError) throw error
      throw new ToolError('Failed to fetch tool: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }
}