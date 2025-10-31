import React from 'react'
import Image from 'next/image'
import { ProjectForm } from '@/modules/home/ui/components/project-form'
import ProjectList from '@/modules/home/ui/components/project-list'
const Page = () => {
  return (
    <div className='flex flex-col max-w-5xl mx-auto w-full' >
      <section className='space-y-6 py-[16vh]' >
        <div className='flex flex-col items-center' >
          <Image src="/logo.svg" alt='Codex' width={75} height={75} className='hidden hover:animate-pulse md:block' />
        </div>
        <h1 className='text-2xl md:text-5xl font-bold text-center' >
          Build Something with Codex
        </h1>
        <p className='text-lg md:text-xl text-muted-foreground text-center' >
          Create apps and websites by chatting with AI
        </p>
        <div className='max-w-2xl mx-auto w-full' >
          <ProjectForm/>
        </div>
      </section>
      <ProjectList/>
    </div>
  )
}

export default Page