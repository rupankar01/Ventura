"use client"
import type React from "react"
import { useState } from "react"
import { Github } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("signin")
  
  // Sign in state
  const [signInEmail, setSignInEmail] = useState("demo@example.com")
  const [signInPassword, setSignInPassword] = useState("demopassword")
  
  // Sign up state
  const [signUpEmail, setSignUpEmail] = useState("")
  const [signUpPassword, setSignUpPassword] = useState("")
  const [name, setName] = useState("")
  
  const { signInWithEmail, signInWithDemo, signUpWithEmail } = useAuth()
  
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signInWithEmail(signInEmail, signInPassword)
    } catch (error) {
      // Error is handled in the auth context
    }
  }
  
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signUpWithEmail(signUpEmail, signUpPassword, name)
    } catch (error) {
      // Error is handled in the auth context
    }
  }
  
  const handleDemoSignIn = async () => {
    try {
      await signInWithDemo()
    } catch (error) {
      // Error is handled in the auth context
    }
  }
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="signin" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="signin" className="space-y-4">
          <form onSubmit={handleEmailSignIn} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="signin-email">Email</Label>
              <Input
                id="signin-email"
                type="email"
                placeholder="name@example.com"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-password">Password</Label>
              <Input
                id="signin-password"
                type="password"
                placeholder="••••••••"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>
          
          <Button variant="outline" onClick={handleDemoSignIn} className="w-full">
            <Github className="mr-2 h-4 w-4" />
            Continue with Demo Account
          </Button>
          
          <p className="text-xs text-center text-muted-foreground mt-4">
            This is a demo app. You can use the pre-filled credentials or click the demo button.
          </p>
        </TabsContent>
        
        <TabsContent value="signup" className="space-y-4">
          <form onSubmit={handleEmailSignUp} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="name@example.com"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="••••••••"
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Create account
            </Button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>
          
          <Button variant="outline" onClick={handleDemoSignIn} className="w-full">
            <Github className="mr-2 h-4 w-4" />
            Continue with Demo Account
          </Button>
          
          <p className="text-xs text-center text-muted-foreground mt-4">
            Create a new account to get started with Ventura.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
