import Hero from '../components/Hero'
import { HowItWorks } from '../components/HowItWorks'
import { RecentMemorials } from '../components/RecentMemorials'
import { AboutUs} from '../components/AboutUs'
import { Pricing } from '../components/Pricing'
import {  VirtualCemetery } from '../components/VirtualCemetary'
import { FAQ } from '../components/FAQ'
import  ContactForm from '../components/ContactForm'
import { Footer } from '../components/Footer'

export default function Home() {
  return (
    <>
       <Hero />
     <HowItWorks />
     <RecentMemorials />
     <AboutUs />
     <Pricing />
     <VirtualCemetery />
     <FAQ />
     <ContactForm />
      <Footer />
     
    </>
  );
}
