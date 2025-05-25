import { redirect } from "next/navigation"
import Link from "next/link"
import { addTrain } from "@/app/actions/train-actions"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default async function AddTrainPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Add New Train</h1>
        <p className="text-muted-foreground">Create a new train in the system</p>
      </div>

      <Card>
        <form
          action={async (formData) => {
            "use server"
            const result = await addTrain(formData)
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
            <div className="space-y-2">
              <Label htmlFor="name">Train Name</Label>
              <Input id="name" name="name" required />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">Source Station</Label>
                <Input id="source" name="source" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination Station</Label>
                <Input id="destination" name="destination" required />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departure_time">Departure Time</Label>
                <Input id="departure_time" name="departure_time" type="datetime-local" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="arrival_time">Arrival Time</Label>
                <Input id="arrival_time" name="arrival_time" type="datetime-local" required />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total_seats">Total Seats</Label>
                <Input id="total_seats" name="total_seats" type="number" min="1" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price per Seat</Label>
                <Input id="price" name="price" type="number" min="0" step="0.01" required />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/admin/trains">Cancel</Link>
            </Button>
            <Button type="submit">Add Train</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
