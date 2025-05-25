import Link from "next/link"
import { getBookingById, cancelBooking } from "@/app/actions/booking-actions"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDate, formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { redirect } from "next/navigation"

export default async function BookingDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const bookingId = Number.parseInt(params.id)
  const { booking, success, message } = await getBookingById(bookingId)

  if (!success) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Booking Not Found</h1>
          <p className="text-muted-foreground">{message}</p>
        </div>
        <Button asChild>
          <Link href="/bookings">Back to Bookings</Link>
        </Button>
      </div>
    )
  }

  const handleCancelBooking = async () => {
    "use server"
    await cancelBooking(bookingId)
    redirect("/bookings")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Booking Details</h1>
        <p className="text-muted-foreground">View the details of your booking</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Booking #{booking.id}</CardTitle>
              <CardDescription>Booked on {formatDate(booking.booking_date)}</CardDescription>
            </div>
            <Badge
              variant={
                booking.status === "confirmed" ? "default" : booking.status === "cancelled" ? "destructive" : "outline"
              }
              className="text-sm"
            >
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Train Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Train Name</p>
                <p className="text-muted-foreground">{booking.train_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Route</p>
                <p className="text-muted-foreground">
                  {booking.source} to {booking.destination}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Departure Time</p>
                <p className="text-muted-foreground">{formatDate(booking.departure_time)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Arrival Time</p>
                <p className="text-muted-foreground">{formatDate(booking.arrival_time)}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Booking Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Journey Date</p>
                <p className="text-muted-foreground">{formatDate(booking.journey_date)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Number of Seats</p>
                <p className="text-muted-foreground">{booking.seats}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Price per Seat</p>
                <p className="text-muted-foreground">{formatCurrency(booking.price)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Total Price</p>
                <p className="text-muted-foreground">{formatCurrency(booking.total_price)}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/bookings">Back to Bookings</Link>
          </Button>

          {booking.status === "confirmed" && (
            <form action={handleCancelBooking}>
              <Button variant="destructive" type="submit">
                Cancel Booking
              </Button>
            </form>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
