"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Train } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/utils"

interface BookingPreviewProps {
  train: Train | null
  seats: number
  journeyDate: string
}

export function BookingPreview({ train, seats, journeyDate }: BookingPreviewProps) {
  const [totalPrice, setTotalPrice] = useState<number>(0)

  useEffect(() => {
    if (train && seats) {
      setTotalPrice(train.price * seats)
    } else {
      setTotalPrice(0)
    }
  }, [train, seats])

  if (!train) {
    return null
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Booking Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Train Details</h3>
            <p className="text-sm">{train.name}</p>
            <p className="text-sm">
              {train.source} to {train.destination}
            </p>
            <p className="text-sm">Departure: {formatDate(train.departure_time)}</p>
          </div>
          <div>
            <h3 className="font-medium">Journey Details</h3>
            <p className="text-sm">Date: {journeyDate ? formatDate(journeyDate) : "Not selected"}</p>
            <p className="text-sm">Seats: {seats}</p>
          </div>
          <div>
            <h3 className="font-medium">Price Details</h3>
            <p className="text-sm">Price per seat: {formatCurrency(train.price)}</p>
            <p className="text-sm font-bold">Total: {formatCurrency(totalPrice)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
