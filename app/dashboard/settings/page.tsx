import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { SettingsForm } from "@/components/settings-form"

export const metadata: Metadata = {
  title: "Settings | Ventura",
  description: "Manage your account settings and preferences",
}

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <SettingsForm />
      </main>
    </div>
  )
}
