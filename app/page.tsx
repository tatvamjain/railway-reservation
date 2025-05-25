import Link from "next/link"
import { getTrains } from "@/app/actions/train-actions"
import { getUserBookings } from "@/app/actions/booking-actions"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDate, formatCurrency } from "@/lib/utils"

export default async function HomePage() {
  const trainsResult = await getTrains()
  const bookingsResult = await getUserBookings()

  const trains = trainsResult.trains || []
  const bookings = bookingsResult.bookings || []

  const upcomingTrains = trains.slice(0, 3)
  const recentBookings = bookings.slice(0, 3)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome to Railway Reservation System</h1>
        <p className="text-muted-foreground">Book train tickets and manage your bookings</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Trains</CardTitle>
            <CardDescription>Latest trains available for booking</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingTrains.length > 0 ? (
              <div className="space-y-4">
                {upcomingTrains.map((train) => (
                  <div key={train.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{train.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {train.source} to {train.destination}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(train.price)}</p>
                        <p className="text-sm text-muted-foreground">{train.available_seats} seats left</p>
                      </div>
                    </div>
                    <div className="mt-2 text-sm">
                      <p>Departure: {formatDate(train.departure_time)}</p>
                      <p>Arrival: {formatDate(train.arrival_time)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No upcoming trains available.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/trains">View All Trains</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Your latest train bookings</CardDescription>
          </CardHeader>
          <CardContent>
            {recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{booking.train_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {booking.source} to {booking.destination}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(booking.total_price)}</p>
                        <p
                          className={`text-sm ${booking.status === "confirmed" ? "text-green-600" : booking.status === "cancelled" ? "text-red-600" : "text-yellow-600"}`}
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 text-sm">
                      <p>Journey Date: {formatDate(booking.journey_date)}</p>
                      <p>Seats: {booking.seats}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No recent bookings found.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/bookings">View All Bookings</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Ready to Book a Train?</h2>
        <p className="text-muted-foreground mb-6">Explore available trains and book your tickets now.</p>
        <Button size="lg" asChild>
          <Link href="/book">Book a Ticket</Link>
        </Button>
      </div>
    </div>
  )
}
