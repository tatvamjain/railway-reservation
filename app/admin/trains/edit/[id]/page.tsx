import { redirect } from "next/navigation"
import Link from "next/link"
import { getTrainById, updateTrain } from "@/app/actions/train-actions"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default async function EditTrainPage({
  params,
}: {
  params: { id: string }
}) {
  const trainId = Number.parseInt(params.id)
  const { train, success } = await getTrainById(trainId)

  if (!success) {
    redirect("/admin/trains")
  }

  // Format dates for datetime-local input
  const departureTime = new Date(train.departure_time).toISOString().slice(0, 16)
  const arrivalTime = new Date(train.arrival_time).toISOString().slice(0, 16)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Edit Train</h1>
        <p className="text-muted-foreground">Update train details</p>
      </div>

      <Card>
        <form
          action={async (formData) => {
            "use server"
            const result = await updateTrain(formData)
            if (result.success) {
              redirect("/admin/trains")
            }
            return result
          }}
        >
          <CardHeader>
            <CardTitle>Train Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input type="hidden" name="id" value={train.id} />

            <div className="space-y-2">
              <Label htmlFor="name">Train Name</Label>
              <Input id="name" name="name" defaultValue={train.name} required />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">Source Station</Label>
                <Input id="source" name="source" defaultValue={train.source} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination Station</Label>
                <Input id="destination" name="destination" defaultValue={train.destination} required />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departure_time">Departure Time</Label>
                <Input
                  id="departure_time"
                  name="departure_time"
                  type="datetime-local"
                  defaultValue={departureTime}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="arrival_time">Arrival Time</Label>
                <Input
                  id="arrival_time"
                  name="arrival_time"
                  type="datetime-local"
                  defaultValue={arrivalTime}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total_seats">Total Seats</Label>
                <Input
                  id="total_seats"
                  name="total_seats"
                  type="number"
                  min="1"
                  defaultValue={train.total_seats}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="available_seats">Available Seats</Label>
                <Input
                  id="available_seats"
                  name="available_seats"
                  type="number"
                  min="0"
                  max={train.total_seats}
                  defaultValue={train.available_seats}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price per Seat</Label>
                <Input id="price" name="price" type="number" min="0" step="0.01" defaultValue={train.price} required />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/admin/trains">Cancel</Link>
            </Button>
            <Button type="submit">Update Train</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
