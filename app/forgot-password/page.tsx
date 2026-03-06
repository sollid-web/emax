"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setError("Please type your username or email!")
      return
    }

    setIsLoading(true)
    setError("")

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
      console.log("Password reset request for:", email)
    }, 1000)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/5 rounded-full animate-pulse"
              style={{
                width: `${Math.random() * 300 + 50}px`,
                height: `${Math.random() * 300 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 w-full max-w-md mx-4">
          <Card className="backdrop-blur-md bg-white/10 border-white/20 text-white">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-green-400">Email Sent!</CardTitle>
              <CardDescription className="text-white/80">
                Check your email for password reset instructions
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-white/80 mb-6">
                We've sent a password reset link to your email address. Please check your inbox and follow the
                instructions to reset your password.
              </p>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="/login">Back to Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/5 rounded-full animate-pulse"
            style={{
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Top Navigation */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto">
          <nav className="flex flex-col lg:flex-row-wrap gap-4 text-sm text-white/80">
            <Link href="/" className="hover:text-white transition-colors">
              🏠 Home
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              📖 About Us
            </Link>
            <Link href="/trading" className="hover:text-white transition-colors">
              📊 Trading
            </Link>
            <Link href="/affiliate" className="hover:text-white transition-colors">
              📢 Affiliate Program
            </Link>
            <Link href="/get-started" className="hover:text-white transition-colors">
              🚀 Get Started
            </Link>
            <Link href="/faq" className="hover:text-white transition-colors">
              ❓ FAQ
            </Link>
            <Link href="/news" className="hover:text-white transition-colors">
              📰 News
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              📝 Terms & Conditions
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              📞 Contact Us
            </Link>
          </nav>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <Card className="backdrop-blur-md bg-white/10 border-white/20 text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Recover my account</CardTitle>
            <CardDescription className="text-white/80">Please complete the following form.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Username or Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="text"
                  placeholder="Enter your Username or E-mail"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError("")
                  }}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                />
                {error && (
                  <Alert variant="destructive" className="bg-red-500/20 border-red-500/50">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
                {isLoading ? "Sending..." : "Reset my password"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/80">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-300 hover:text-blue-200 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="mt-6 text-center text-sm text-white/60">
          <Link href="/" className="hover:text-white transition-colors">
            Home Page
          </Link>
          <span className="mx-2">•</span>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <span className="mx-2">•</span>
          <Link href="/contact" className="hover:text-white transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
