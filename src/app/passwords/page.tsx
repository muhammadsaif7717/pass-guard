'use client'
import PasswordsList from '@/components/PasswordsList'
import React from 'react'

export default function PasswordsPage() {
  return (
    <div className='flex justify-center h-screen'>
      <div className='w-full md:w-7/12 lg:w-5/12 p-4'>
      <PasswordsList/>
      </div>
    </div>
  )
}
