import Link from "next/link"
import { getTrains } from "@/app/actions/train-actions"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDate, formatCurrency } from "@/lib/utils"

export default async function TrainsPage() {
  const { trains } = await getTrains()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Available Trains</h1>
        <p className="text-muted-foreground">Browse and book available trains</p>
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
                    </div>
                  </div>

                  <div className="md:text-right">
                    <p className="text-lg font-bold">{formatCurrency(train.price)}</p>
                    <p className="text-sm text-muted-foreground">{train.available_seats} seats available</p>
                    <Button className="mt-2" asChild>
                      <Link href={`/book?train_id=${train.id}`}>Book Now</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p>No trains available at the moment.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
