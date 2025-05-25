import { getAllBookings } from "@/app/actions/booking-actions"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate, formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export default async function AdminBookingsPage() {
  const { bookings } = await getAllBookings()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">All Bookings</h1>
        <p className="text-muted-foreground">View all bookings in the system</p>
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
                    <div className="mt-2">
                      <p className="text-sm font-medium">User: {booking.user_name || "Guest User"}</p>
                      <p className="text-sm text-muted-foreground">{booking.user_email || "guest@example.com"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p>No bookings found in the system.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
