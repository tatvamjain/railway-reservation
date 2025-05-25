import { getTrains, getTrainById } from "@/app/actions/train-actions"
import BookingForm from "./booking-form"

export default async function BookPage({
  searchParams,
}: {
  searchParams: { train_id?: string }
}) {
  const { trains } = await getTrains()

  let selectedTrain = null
  if (searchParams.train_id) {
    const { train } = await getTrainById(Number.parseInt(searchParams.train_id))
    selectedTrain = train
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Book a Ticket</h1>
        <p className="text-muted-foreground">Fill in the details to book your train ticket</p>
      </div>

      <BookingForm trains={trains || []} initialTrain={selectedTrain} />
    </div>
  )
}
