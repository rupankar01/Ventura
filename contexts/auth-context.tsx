"use client"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { signIn, signOut, getCurrentUser, demoSignIn, signUp } from "@/app/actions/auth"
import type { User } from "@/app/actions/auth"

type AuthContextType = {
  user: User | null
  isLoading: boolean
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>
  signInWithDemo: () => Promise<void>
  signOutUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await getCurrentUser()
        setUser(user)
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadUser()
  }, [])

  const signInWithEmail = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await signIn(email, password)
      const user = await getCurrentUser()
      setUser(user)
      router.push("/dashboard")
      toast({
        title: "Signed in",
        description: "You have been successfully signed in.",
      })
    } catch (error) {
      console.error("Error signing in:", error)
      toast({
        title: "Error",
        description: "Invalid email or password.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      await signUp(email, password, name)
      const user = await getCurrentUser()
      setUser(user)
      router.push("/dashboard")
      toast({
        title: "Account created",
        description: "Your account has been successfully created.",
      })
    } catch (error: any) {
      console.error("Error signing up:", error)
      toast({
        title: "Error",
        description: error.message || "There was an error creating your account.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithDemo = async () => {
    setIsLoading(true)
    try {
      await demoSignIn()
      const user = await getCurrentUser()
      setUser(user)
      router.push("/dashboard")
      toast({
        title: "Signed in",
        description: "You have been successfully signed in as a demo user.",
      })
    } catch (error) {
      console.error("Error signing in with demo:", error)
      toast({
        title: "Error",
        description: "There was an error signing in with the demo account.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const signOutUser = async () => {
    setIsLoading(true)
    try {
      await signOut()
      setUser(null)
      router.push("/")
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      })
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "There was an error signing out.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      signInWithEmail, 
      signUpWithEmail, 
      signInWithDemo, 
      signOutUser 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
