"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function SettingsForm() {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [notifications, setNotifications] = useState({
    email: true,
    studyReminders: true,
    achievements: true,
  })
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setEmail(user.email || "")
      setAvatarUrl(user.avatar_url || "")
    }
  }, [user])

  const updateProfile = async () => {
    try {
      setLoading(true)

      // In a real app, this would update the user profile in the database
      // For now, we'll just show a success message

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveNotificationSettings = () => {
    // In a real app, this would save to the database
    toast({
      title: "Notification settings saved",
      description: "Your notification preferences have been updated.",
    })
  }

  if (!user) {
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded"></div>
          </CardContent>
          <CardFooter>
            <div className="h-10 bg-muted rounded w-1/4"></div>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <Tabs defaultValue="account">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your account settings and profile information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={avatarUrl || "/placeholder.svg"} />
                  <AvatarFallback>{name?.charAt(0) || user?.email?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="font-medium">Profile Picture</h3>
                  <p className="text-sm text-muted-foreground">Enter a URL for your profile picture</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar-url">Avatar URL</Label>
                <Input
                  id="avatar-url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} disabled placeholder="Your email" />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed. This is the email you used to sign up.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={updateProfile} disabled={loading}>
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how and when you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="study-reminders">Study Reminders</Label>
                  <p className="text-sm text-muted-foreground">Get reminders for scheduled study sessions</p>
                </div>
                <Switch
                  id="study-reminders"
                  checked={notifications.studyReminders}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, studyReminders: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="achievements">Achievement Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified when you earn achievements</p>
                </div>
                <Switch
                  id="achievements"
                  checked={notifications.achievements}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, achievements: checked })}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveNotificationSettings}>Save Notification Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
