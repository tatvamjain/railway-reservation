import Link from "next/link"
import { getTrains } from "@/app/actions/train-actions"
import { getAllBookings } from "@/app/actions/booking-actions"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function AdminPage() {
  const { trains } = await getTrains()
  const { bookings } = await getAllBookings()

  const totalTrains = trains?.length || 0
  const totalBookings = bookings?.length || 0
  const confirmedBookings = bookings?.filter((b) => b.status === "confirmed").length || 0
  const cancelledBookings = bookings?.filter((b) => b.status === "cancelled").length || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage trains, bookings, and view statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Trains</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalTrains}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Confirmed Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{confirmedBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cancelled Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{cancelledBookings}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Manage Trains</CardTitle>
            <CardDescription>Add, edit, or delete trains</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You have {totalTrains} trains in the system.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/admin/trains">Manage Trains</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>View Bookings</CardTitle>
            <CardDescription>View all bookings in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You have {totalBookings} bookings in the system.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/admin/bookings">View Bookings</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
