'use client'

import { useState } from 'react'
import { Eye, EyeOff, Copy, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

type PasswordItem = {
  id: string
  website: string
  username: string
  password: string
}

const samplePasswords: PasswordItem[] = [
  {
    id: '1',
    website: '10minuteschool.com',
    username: 'muhammadsaif7717@gmail.com',
    password: 'password12345',
  },
]

export default function PasswordManager() {
  const [visible, setVisible] = useState<Record<string, boolean>>({})

  const toggleVisibility = (id: string) => {
    setVisible((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const copyToClipboard = (password: string) => {
    navigator.clipboard.writeText(password)
    alert('Password copied!')
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-foreground">
        <Lock className="w-6 h-6" />
        Password Manager
      </h2>

      {samplePasswords.map((item) => (
        <Card
          key={item.id}
          className="p-6 space-y-4 bg-muted text-muted-foreground rounded-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Username</label>
              <Input
                value={item.username}
                readOnly
                className="bg-background text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Sites</label>
              <a
                href={`https://${item.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-blue-500 hover:underline mt-1"
              >
                {item.website}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Input
                  type={visible[item.id] ? 'text' : 'password'}
                  value={item.password}
                  readOnly
                  className="pr-10 bg-background text-foreground"
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility(item.id)}
                  className="absolute right-10 top-2.5 text-muted-foreground"
                >
                  {visible[item.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <button
                  type="button"
                  onClick={() => copyToClipboard(item.password)}
                  className="absolute right-2 top-2.5 text-muted-foreground"
                >
                  <Copy size={18} />
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Note</label>
              <Input
                placeholder="No note added"
                readOnly
                className="bg-background text-foreground"
              />
            </div>
          </div>

          <div className="flex justify-between gap-4 pt-4">
            <Button variant="outline" className="">
              Edit
            </Button>
            <Button variant="destructive" className="">
              Delete
            </Button>
            <Button variant="secondary" className="">
              Share
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
