'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { apiFetch } from '@/lib/api'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const botReplies: Record<string, string> = {
  default: "Thanks for reaching out! A support agent will respond to your message shortly. You can also check your ticket status in the Support section of your dashboard.",
  deposit: "For deposit issues, please ensure you've sent funds to the correct wallet address shown on the deposit page. Deposits are credited after admin approval. If it's been over 24 hours, please describe your issue below.",
  withdraw: "Withdrawals are processed after admin review. Profit withdrawals are available based on your plan's withdrawal schedule. Describe your issue and we'll look into it.",
  kyc: "KYC verification usually takes 24-48 hours. Make sure all documents are clear and valid. If rejected, you'll see a reason in your KYC section.",
  investment: "Investment plans are activated after admin approval. Your daily ROI begins from the activation date. Describe any issue below and we'll assist.",
  login: "If you're having login issues, try resetting your password using the 'Forgot Password' link. If the problem persists, describe it below.",
}

function getBotReply(text: string): string {
  const t = text.toLowerCase()
  if (t.includes('deposit')) return botReplies.deposit
  if (t.includes('withdraw')) return botReplies.withdraw
  if (t.includes('kyc') || t.includes('verification')) return botReplies.kyc
  if (t.includes('invest') || t.includes('plan')) return botReplies.investment
  if (t.includes('login') || t.includes('password') || t.includes('sign in')) return botReplies.login
  return botReplies.default
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [ticketCreated, setTicketCreated] = useState(false)
  const [unread, setUnread] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        text: "Hi! Welcome to Emax Protocol support. How can we help you today? Type your question and we'll create a support ticket for you.",
        sender: 'bot',
        timestamp: new Date(),
      }])
    }
    if (isOpen) setUnread(0)
  }, [isOpen])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || sending) return
    const text = input.trim()
    setInput('')
    setSending(true)

    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    }])

    try {
      // Create or update support ticket
      if (!ticketCreated) {
        await apiFetch('/api/support', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject: text.slice(0, 80),
            message: text,
          }),
        })
        setTicketCreated(true)
      }

      // Bot reply
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          text: getBotReply(text),
          sender: 'bot',
          timestamp: new Date(),
        }])
        if (!isOpen) setUnread(u => u + 1)
        setSending(false)
      }, 800)

    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: 'Message sent. Our team will get back to you soon.',
        sender: 'bot',
        timestamp: new Date(),
      }])
      setSending(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ height: '480px' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Emax Support</p>
                <p className="text-white/70 text-xs">We typically reply within 24h</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && (
                  <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-1">
                    <Bot size={14} className="text-white" />
                  </div>
                )}
                <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-gray-800 text-gray-100 rounded-bl-sm'
                }`}>
                  {msg.text}
                  <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {msg.sender === 'user' && (
                  <div className="h-7 w-7 rounded-full bg-gray-700 flex items-center justify-center shrink-0 mt-1">
                    <User size={14} className="text-gray-300" />
                  </div>
                )}
              </div>
            ))}
            {sending && (
              <div className="flex gap-2 justify-start">
                <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          {messages.length <= 1 && (
            <div className="px-4 py-2 border-t border-gray-800 flex flex-wrap gap-1">
              {['Deposit issue', 'Withdrawal help', 'KYC status', 'Investment query'].map(q => (
                <button
                  key={q}
                  onClick={() => { setInput(q); }}
                  className="text-xs px-3 py-1 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors border border-gray-700"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-gray-800 flex gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 text-sm"
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || sending}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white px-3"
            >
              <Send size={15} />
            </Button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className="relative h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
      >
        {isOpen ? <X size={22} className="text-white" /> : <MessageCircle size={22} className="text-white" />}
        {unread > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
            {unread}
          </span>
        )}
      </button>
    </div>
  )
}
