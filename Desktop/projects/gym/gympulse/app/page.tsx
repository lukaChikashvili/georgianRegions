"use client"
import Hero from '../components/Hero'
import { HowItWorks } from '../components/HowItWorks'
import { RecentMemorials } from '../components/RecentMemorials'
import { AboutUs} from '../components/AboutUs'
import { Pricing } from '../components/Pricing'
import {  VirtualCemetery } from '../components/VirtualCemetary'
import { FAQ } from '../components/FAQ'
import  ContactForm from '../components/ContactForm'
import { Footer } from '../components/Footer'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

export default function Home() {

  const premiumCount = useQuery(api.pricing.getPremiumCount);
  const spotsLeft = premiumCount !== undefined
    ? Math.max(0, 100 - premiumCount)
    : 100; 


  return (
    <>
    
       <Hero />
     <HowItWorks />
     <RecentMemorials />
     <AboutUs />
     <Pricing spotsLeft={spotsLeft}  />
     <VirtualCemetery />
     <FAQ />
     <ContactForm />
     
     
    </>
  );
}
