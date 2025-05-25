import Link from "next/link"
import { getTrains, deleteTrain } from "@/app/actions/train-actions"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDate, formatCurrency } from "@/lib/utils"
import { Pencil, Trash } from "lucide-react"

export default async function AdminTrainsPage() {
  const { trains } = await getTrains()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Trains</h1>
          <p className="text-muted-foreground">Add, edit, or delete trains</p>
        </div>
        <Button asChild>
          <Link href="/admin/trains/add">Add New Train</Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {trains && trains.length > 0 ? (
          trains.map((train) => (
            <Card key={train.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">{train.name}</h2>
                    <p className="text-muted-foreground">
                      {train.source} to {train.destination}
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">Departure: {formatDate(train.departure_time)}</p>
                      <p className="text-sm">Arrival: {formatDate(train.arrival_time)}</p>
                      <p className="text-sm">Total Seats: {train.total_seats}</p>
                      <p className="text-sm">Available Seats: {train.available_seats}</p>
                    </div>
                  </div>

                  <div className="md:text-right">
                    <p className="text-lg font-bold">{formatCurrency(train.price)}</p>
                    <div className="flex gap-2 mt-2 md:justify-end">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/trains/edit/${train.id}`}>
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <form
                        action={async () => {
                          "use server"
                          await deleteTrain(train.id)
                        }}
                      >
                        <Button variant="destructive" size="sm" type="submit">
                          <Trash className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p>No trains available. Add a new train to get started.</p>
              <Button className="mt-4" asChild>
                <Link href="/admin/trains/add">Add New Train</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
