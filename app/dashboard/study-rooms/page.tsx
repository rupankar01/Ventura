import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { StudyRoomsList } from "@/components/study-rooms-list"
import { CreateRoomButton } from "@/components/create-room-button"

export const metadata: Metadata = {
  title: "Study Rooms | Ventura",
  description: "Join or create study rooms to study with others",
}

export default function StudyRoomsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Study Rooms</h1>
          <CreateRoomButton />
        </div>
        <StudyRoomsList />
      </main>
    </div>
  )
}
