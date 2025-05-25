"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getTrains() {
  try {
    const trains = await sql`SELECT * FROM trains ORDER BY departure_time`
    return { success: true, trains }
  } catch (error) {
    console.error("Error fetching trains:", error)
    return { success: false, message: "Failed to fetch trains" }
  }
}

export async function getTrainById(id: number) {
  try {
    const train = await sql`SELECT * FROM trains WHERE id = ${id}`
    if (train.length === 0) {
      return { success: false, message: "Train not found" }
    }
    return { success: true, train: train[0] }
  } catch (error) {
    console.error("Error fetching train:", error)
    return { success: false, message: "Failed to fetch train" }
  }
}

export async function addTrain(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const source = formData.get("source") as string
    const destination = formData.get("destination") as string
    const departure_time = formData.get("departure_time") as string
    const arrival_time = formData.get("arrival_time") as string
    const total_seats = Number.parseInt(formData.get("total_seats") as string)
    const price = Number.parseFloat(formData.get("price") as string)

    if (!name || !source || !destination || !departure_time || !arrival_time || isNaN(total_seats) || isNaN(price)) {
      return { success: false, message: "All fields are required" }
    }

    await sql`
      INSERT INTO trains (name, source, destination, departure_time, arrival_time, total_seats, available_seats, price) 
      VALUES (${name}, ${source}, ${destination}, ${departure_time}, ${arrival_time}, ${total_seats}, ${total_seats}, ${price})
    `

    revalidatePath("/trains")
    revalidatePath("/admin/trains")

    return { success: true, message: "Train added successfully" }
  } catch (error) {
    console.error("Error adding train:", error)
    return { success: false, message: "Failed to add train" }
  }
}

export async function updateTrain(formData: FormData) {
  try {
    const id = Number.parseInt(formData.get("id") as string)
    const name = formData.get("name") as string
    const source = formData.get("source") as string
    const destination = formData.get("destination") as string
    const departure_time = formData.get("departure_time") as string
    const arrival_time = formData.get("arrival_time") as string
    const total_seats = Number.parseInt(formData.get("total_seats") as string)
    const available_seats = Number.parseInt(formData.get("available_seats") as string)
    const price = Number.parseFloat(formData.get("price") as string)

    if (
      !id ||
      !name ||
      !source ||
      !destination ||
      !departure_time ||
      !arrival_time ||
      isNaN(total_seats) ||
      isNaN(available_seats) ||
      isNaN(price)
    ) {
      return { success: false, message: "All fields are required" }
    }

    await sql`
      UPDATE trains 
      SET name = ${name}, 
          source = ${source}, 
          destination = ${destination}, 
          departure_time = ${departure_time}, 
          arrival_time = ${arrival_time}, 
          total_seats = ${total_seats}, 
          available_seats = ${available_seats}, 
          price = ${price} 
      WHERE id = ${id}
    `

    revalidatePath("/trains")
    revalidatePath("/admin/trains")
    revalidatePath(`/trains/${id}`)

    return { success: true, message: "Train updated successfully" }
  } catch (error) {
    console.error("Error updating train:", error)
    return { success: false, message: "Failed to update train" }
  }
}

export async function deleteTrain(id: number) {
  try {
    await sql`DELETE FROM trains WHERE id = ${id}`

    revalidatePath("/trains")
    revalidatePath("/admin/trains")

    return { success: true, message: "Train deleted successfully" }
  } catch (error) {
    console.error("Error deleting train:", error)
    return { success: false, message: "Failed to delete train" }
  }
}
