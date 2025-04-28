import { Navbar } from "@/components/navbar"
import { StudyRoomContent } from "@/components/study-room-content"

export default function StudyRoomPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <StudyRoomContent roomId={params.id} />
    </div>
  )
}
