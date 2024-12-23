import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedPage from './AnimatedPage';
import placeholder from '../assets/man silhouette.jpg';
import Breadcrumb from './Breadcrumb';
import Skeleton, { BarberCardSkeleton } from './Skeleton';
import NavBar from "./NavBar";

interface Barber {
  name: string;
  availability: string;
  image: string;
}

const BarberSelection: React.FC = () => {
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();

  // function to get next available time for a barber
  const getNextAvailability = (offset: number = 0) => {
    const now = new Date();
    let nextDate = new Date(now);
    
    // add offset days to distribute barbers' availability
    nextDate.setDate(nextDate.getDate() + offset);
    
    // keep adding days until we find a weekday
    while (nextDate.getDay() === 0 || nextDate.getDay() === 6) {
      nextDate.setDate(nextDate.getDate() + 1);
    }

    // if it's past business hours, move to next day
    if (now.getHours() >= 17 || (now.getHours() === 17 && now.getMinutes() >= 30)) {
      nextDate.setDate(nextDate.getDate() + 1);
      // reset time to 9 AM
      nextDate.setHours(9, 0, 0, 0);
    } else if (now.getHours() < 9) {
      // if it's before business hours, set to 9 AM
      nextDate.setHours(9, 0, 0, 0);
    }

    // format the date and time
    const formattedDate = nextDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    
    const formattedTime = nextDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });

    return `Available ${formattedDate} at ${formattedTime}`;
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const barbers = [
    {
      name: 'David J.',
      availability: getNextAvailability(0), 
      image: placeholder,
    },
    {
      name: 'Sam L.',
      availability: getNextAvailability(1), 
      image: placeholder,
    },
    {
      name: 'Tony F.',
      availability: getNextAvailability(2), 
      image: placeholder,
    },
  ];

  const handleBarberSelect = (barber: Barber) => {
    setSelectedBarber(barber);
    setIsNavigating(true);
    
    const navigationState = {
      barber: barber
    };
    
    setTimeout(() => {
      navigate('/barberservices', { state: navigationState });
    }, 500);
  };

  return (
    <AnimatedPage>
      <div className={`min-h-screen bg-gray-50 ${isNavigating ? 'fade-out' : ''}`}>
        <NavBar />
        <div className="pt-32 px-8">
          <Breadcrumb />
          <h1 className="title">Choose a professional</h1>
          <div className="content-wrapper">
            {isLoading ? (
              <>
                <div className="barber-cards">
                  {[...Array(3)].map((_, index) => (
                    <BarberCardSkeleton key={index} />
                  ))}
                </div>
                
                <div className="info-card">
                  <Skeleton className="h-8 w-3/4 mb-4" />
                  <div className="info-content">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="barber-cards">
                  {barbers.map((barber, index) => (
                    <motion.div
                      key={index}
                      className={`barber-card ${selectedBarber?.name === barber.name ? 'bg-black' : ''}`}
                      onClick={() => handleBarberSelect(barber)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      layout
                    >
                      <div className="image-container">
                        <img src={barber.image} alt={`${barber.name}'s profile`} />
                      </div>
                      <h2 className={selectedBarber?.name === barber.name ? 'text-white' : ''}>
                        {barber.name}
                      </h2>
                      <p className={selectedBarber?.name === barber.name ? 'text-white' : ''}>
                        {barber.availability}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <div className="info-card">
                  <h2>Bad Guy Barbers</h2>
                  <div className="info-content">
                    {selectedBarber ? (
                      <>
                        <p><strong>Name:</strong> {selectedBarber.name}</p>
                        <p><strong>Availability:</strong> {selectedBarber.availability}</p>
                      </>
                    ) : (
                      <p>Select a barber to view details.</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default BarberSelection;