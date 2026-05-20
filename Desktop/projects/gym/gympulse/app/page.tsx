import Hero from '../components/Hero'
import { HowItWorks } from '../components/HowItWorks'
import { RecentMemorials } from '../components/RecentMemorials'
import { AboutUs} from '../components/AboutUs'
import { Pricing } from '../components/Pricing'
export default function Home() {
  return (
    <>
       <Hero />
     <HowItWorks />
     <RecentMemorials />
     <AboutUs />
     <Pricing />
     
    </>
  );
}
