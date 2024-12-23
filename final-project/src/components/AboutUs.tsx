import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import AnimatedPage from './AnimatedPage';
import { AboutUsSkeleton } from './Skeleton';

const AboutUs: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gray-50 p-8">
        <NavBar />
        
        {isLoading ? (
          <AboutUsSkeleton />
        ) : (
          <div className="max-w-4xl mx-auto mt-20">
            <div className="bg-white rounded-2xl shadow-sm p-16">
              <h1 className="text-4xl font-serif text-center mb-12">
                About Us
              </h1>
              <p className="text-xl leading-relaxed font-serif text-gray-800">
                Our story began when three master barbers, each with their own unique journey in 
                the craft, joined forces to create something special. With over four decades of 
                combined experience, our team brings together old-school precision with 
                contemporary style. The eldest among us learned his trade in his father's 
                barbershop in Italy, carrying forward time-honored techniques. Our second barber 
                honed his skills in London's most prestigious shops before bringing his 
                international flair stateside. The youngest of our trio made his name as an award-winning 
                competition stylist before deciding to focus on delivering everyday 
                excellence to our clients. Together, we share a singular passion: helping every 
                person who sits in our chairs feel like their best self. Whether you're looking for a 
                classic cut or a modern edge, our hands have mastered the art of both tradition and 
                trend.
              </p>
            </div>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default AboutUs;