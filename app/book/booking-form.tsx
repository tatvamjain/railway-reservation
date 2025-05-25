"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookingPreview } from "@/components/booking-preview"
import { createBooking } from "@/app/actions/booking-actions"
import type { Train } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface BookingFormProps {
  trains: Train[]
  initialTrain: Train | null
}

export default function BookingForm({ trains, initialTrain }: BookingFormProps) {
  const router = useRouter()
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(initialTrain)
  const [seats, setSeats] = useState<number>(1)
  const [journeyDate, setJourneyDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialTrain) {
      setSelectedTrain(initialTrain)
    }
  }, [initialTrain])

  const handleTrainChange = (trainId: string) => {
    const train = trains.find((t) => t.id.toString() === trainId) || null
    setSelectedTrain(train)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (!selectedTrain) {
      setError("Please select a train")
      setIsSubmitting(false)
      return
    }

    const formData = new FormData()
    formData.append("train_id", selectedTrain.id.toString())
    formData.append("journey_date", journeyDate)
    formData.append("seats", seats.toString())

    try {
      const result = await createBooking(formData)

      if (result.success) {
        router.push(`/bookings/${result.bookingId}`)
      } else {
        setError(result.message || "Failed to create booking")
      }
    } catch (err) {
      setError("An error occurred while creating the booking")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="md:col-span-2">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="train">Select Train</Label>
              <Select value={selectedTrain?.id.toString() || ""} onValueChange={handleTrainChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a train" />
                </SelectTrigger>
                <SelectContent>
                  {trains.map((train) => (
                    <SelectItem key={train.id} value={train.id.toString()}>
                      {train.name} - {train.source} to {train.destination}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="journey_date">Journey Date</Label>
              <Input
                id="journey_date"
                type="date"
                value={journeyDate}
                onChange={(e) => setJourneyDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seats">Number of Seats</Label>
              <Input
                id="seats"
                type="number"
                min="1"
                max={selectedTrain?.available_seats || 1}
                value={seats}
                onChange={(e) => setSeats(Number.parseInt(e.target.value))}
              />
              {selectedTrain && (
                <p className="text-sm text-muted-foreground">{selectedTrain.available_seats} seats available</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting || !selectedTrain}>
              {isSubmitting ? "Processing..." : "Book Ticket"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className="md:col-span-1">
        <BookingPreview train={selectedTrain} seats={seats} journeyDate={journeyDate} />
      </div>
    </div>
  )
}
