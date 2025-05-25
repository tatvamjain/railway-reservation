export interface User {
  id: number
  name: string
  email: string
  role: "user" | "admin"
}

export interface Train {
  id: number
  name: string
  source: string
  destination: string
  departure_time: string
  arrival_time: string
  total_seats: number
  available_seats: number
  price: number
}

export interface Booking {
  id: number
  user_id: number
  train_id: number
  booking_date: string
  journey_date: string
  seats: number
  status: "confirmed" | "cancelled" | "pending"
  total_price: number
  train?: Train
  train_name?: string
  source?: string
  destination?: string
  departure_time?: string
  arrival_time?: string
  price?: number
  user_name?: string
  user_email?: string
}
