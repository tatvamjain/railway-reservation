import Link from "next/link"
import { getUserBookings } from "@/app/actions/booking-actions"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDate, formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export default async function BookingsPage() {
  const { bookings } = await getUserBookings()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
        <p className="text-muted-foreground">View and manage your train bookings</p>
      </div>

      <div className="grid gap-6">
        {bookings && bookings.length > 0 ? (
          bookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold">{booking.train_name}</h2>
                      <Badge
                        variant={
                          booking.status === "confirmed"
                            ? "default"
                            : booking.status === "cancelled"
                              ? "destructive"
                              : "outline"
                        }
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">
                      {booking.source} to {booking.destination}
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">Journey Date: {formatDate(booking.journey_date)}</p>
                      <p className="text-sm">Departure: {formatDate(booking.departure_time)}</p>
                      <p className="text-sm">Seats: {booking.seats}</p>
                    </div>
                  </div>

                  <div className="md:text-right">
                    <p className="text-lg font-bold">{formatCurrency(booking.total_price)}</p>
                    <p className="text-sm text-muted-foreground">Booked on {formatDate(booking.booking_date)}</p>
                    <Button className="mt-2" asChild>
                      <Link href={`/bookings/${booking.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p>You don't have any bookings yet.</p>
              <Button className="mt-4" asChild>
                <Link href="/book">Book a Ticket</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
