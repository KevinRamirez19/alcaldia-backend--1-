export interface User {
  id: string
  email: string
  full_name: string
  role: "administrador" | "analitico" | "usuario"
  created_at: string
  updated_at: string
}

export interface Testimonio {
  id: string
  nombre: string
  email: string
  telefono?: string
  mensaje: string
  calificacion: number
  estado: "pendiente" | "aprobado" | "rechazado"
  created_at: string
  updated_at: string
  user_id?: string
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: User
  token?: string
}
