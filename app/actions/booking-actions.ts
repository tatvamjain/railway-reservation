"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"

const DEFAULT_USER_ID = 1

export async function createBooking(formData: FormData) {
  try {
    const train_id = Number.parseInt(formData.get("train_id") as string)
    const journey_date = formData.get("journey_date") as string
    const seats = Number.parseInt(formData.get("seats") as string)

    if (!train_id || !journey_date || isNaN(seats) || seats <= 0) {
      return { success: false, message: "All fields are required and seats must be greater than 0" }
    }

    const trainResult = await sql`SELECT * FROM trains WHERE id = ${train_id}`
    if (trainResult.length === 0) {
      return { success: false, message: "Train not found" }
    }

    const train = trainResult[0]

    if (train.available_seats < seats) {
      return { success: false, message: "Not enough seats available" }
    }

    const total_price = train.price * seats

    await sql`BEGIN`

    try {
      const bookingResult = await sql`
        INSERT INTO bookings (user_id, train_id, journey_date, seats, total_price) 
        VALUES (${DEFAULT_USER_ID}, ${train_id}, ${journey_date}, ${seats}, ${total_price}) 
        RETURNING id
      `

      await sql`UPDATE trains SET available_seats = available_seats - ${seats} WHERE id = ${train_id}`

      await sql`COMMIT`

      revalidatePath("/bookings")
      revalidatePath("/trains")

      return {
        success: true,
        message: "Booking created successfully",
        bookingId: bookingResult[0].id,
      }
    } catch (error) {
      await sql`ROLLBACK`
      throw error
    }
  } catch (error) {
    console.error("Error creating booking:", error)
    return { success: false, message: "Failed to create booking" }
  }
}

export async function getUserBookings() {
  try {
    const bookings = await sql`
      SELECT b.*, 
             t.name as train_name, 
             t.source, 
             t.destination, 
             t.departure_time, 
             t.arrival_time 
      FROM bookings b
      JOIN trains t ON b.train_id = t.id
      WHERE b.user_id = ${DEFAULT_USER_ID}
      ORDER BY b.booking_date DESC
    `

    return { success: true, bookings }
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return { success: false, message: "Failed to fetch bookings" }
  }
}

export async function getBookingById(id: number) {
  try {
    const booking = await sql`
      SELECT b.*, 
             t.name as train_name, 
             t.source, 
             t.destination, 
             t.departure_time, 
             t.arrival_time,
             t.price
      FROM bookings b
      JOIN trains t ON b.train_id = t.id
      WHERE b.id = ${id} AND b.user_id = ${DEFAULT_USER_ID}
    `

    if (booking.length === 0) {
      return { success: false, message: "Booking not found" }
    }

    return { success: true, booking: booking[0] }
  } catch (error) {
    console.error("Error fetching booking:", error)
    return { success: false, message: "Failed to fetch booking" }
  }
}

export async function cancelBooking(id: number) {
  try {
    await sql`BEGIN`

    try {
      const bookingResult = await sql`SELECT * FROM bookings WHERE id = ${id} AND user_id = ${DEFAULT_USER_ID}`

      if (bookingResult.length === 0) {
        await sql`ROLLBACK`
        return { success: false, message: "Booking not found" }
      }

      const booking = bookingResult[0]

      if (booking.status === "cancelled") {
        await sql`ROLLBACK`
        return { success: false, message: "Booking is already cancelled" }
      }

      await sql`UPDATE bookings SET status = 'cancelled' WHERE id = ${id}`
      await sql`UPDATE trains SET available_seats = available_seats + ${booking.seats} WHERE id = ${booking.train_id}`

      await sql`COMMIT`

      revalidatePath("/bookings")
      revalidatePath(`/bookings/${id}`)

      return { success: true, message: "Booking cancelled successfully" }
    } catch (error) {
      await sql`ROLLBACK`
      throw error
    }
  } catch (error) {
    console.error("Error cancelling booking:", error)
    return { success: false, message: "Failed to cancel booking" }
  }
}

export async function getAllBookings() {
  try {
    const bookings = await sql`
      SELECT b.*, 
             'Guest User' as user_name,
             'guest@example.com' as user_email,
             t.name as train_name, 
             t.source, 
             t.destination, 
             t.departure_time, 
             t.arrival_time 
      FROM bookings b
      JOIN trains t ON b.train_id = t.id
      ORDER BY b.booking_date DESC
    `

    return { success: true, bookings }
  } catch (error) {
    console.error("Error fetching all bookings:", error)
    return { success: false, message: "Failed to fetch bookings" }
  }
}
