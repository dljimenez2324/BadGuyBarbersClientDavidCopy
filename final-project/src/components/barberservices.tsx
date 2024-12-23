import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import placeholder from '../assets/man silhouette.jpg';
import AnimatedPage from './AnimatedPage';
import Breadcrumb from './Breadcrumb';
import Skeleton, { ServiceCardSkeleton } from './Skeleton';
import NavBar from './NavBar';

interface Service {
  name: string;
  duration: string;
  price: number;
}

interface LocationState {
  barber: {
    name: string;
    availability: string;
    image: string;
  };
}

const BarberServices: React.FC = () => {
  const navigate = useNavigate();
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [primaryService, setPrimaryService] = useState<Service | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const selectedBarber = (location.state as LocationState)?.barber;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const services: Service[] = [
    {
      name: 'Haircut',
      duration: '45 mins',
      price: 35
    },
    {
      name: 'Haircut & Beard Groom',
      duration: '1 hr',
      price: 45
    },
    {
      name: 'Kids cut 12 & under',
      duration: '30 min',
      price: 30
    },
    {
      name: 'Razor Fade',
      duration: '45 mins',
      price: 40
    },
    {
      name: 'Beard Groom/Line Up',
      duration: '30 mins',
      price: 25
    },
    {
      name: 'Senior',
      duration: '30 mins',
      price: 25
    }
  ];

  const handleServiceSelection = (service: Service): void => {
    if (!primaryService) {
      setPrimaryService(service);
      setSelectedServices([service]);
    } else {
      if (service.name === primaryService.name) {
        setPrimaryService(null);
        setSelectedServices([]);
        return;
      }
      
      if (selectedServices.find(s => s.name === service.name)) {
        setSelectedServices(selectedServices.filter(s => s.name !== service.name));
      } else {
        setSelectedServices([...selectedServices, service]);
      }
    }
  };
  const handleTimeSelection = () => {
    // preserve the current services and barber info
    const navigationState = {
      barber: selectedBarber,
      services: selectedServices,
      total: calculateTotal()
    };
  
    navigate('/time', { state: navigationState });
  };

  const calculateTotal = (): number => {
    return selectedServices.reduce((total, service) => total + service.price, 0);
  };

  const handlePrimaryServiceUnselect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPrimaryService(null);
    setSelectedServices([]);
  };

  const renderCheckmark = () => (
    <div 
      className="check-mark hoverable"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handlePrimaryServiceUnselect}
    >
      {isHovering ? (
        <X className="h-4 w-4" />
      ) : (
        <Check className="h-4 w-4" />
      )}
    </div>
  );

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="pt-32 px-8">
          <Breadcrumb />
          {isLoading ? (
            <>
              <h1 className="title">Choose a service</h1>
              <div className="content-wrapper">
                <div className="flex-1">
                  <div className="service-cards">
                    {[...Array(6)].map((_, index) => (
                      <ServiceCardSkeleton key={index} />
                    ))}
                  </div>
                </div>
                
                <div className="info-card">
                  <h2 className="mb-1">Your order</h2>
                  <p className="text-sm text-gray-400 mb-6">Bad Guy Barbers</p>
                  <div className="flex items-center gap-3 mb-6">
                    <Skeleton className="w-8 h-8 rounded-sm" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <h1 className={`title ${primaryService ? 'text-gray-400' : 'text-gray-900'}`}>
                Choose a service
              </h1>

              <div className="content-wrapper">
                <div className="flex-1">
                  {primaryService && (
                    <div>
                      <div className="service-cards">
                        <div className="service-card bg-black">
                          {renderCheckmark()}
                          <div className="service-details">
                            <h2 className="text-white">{primaryService.name}</h2>
                            <p className="text-white">{primaryService.duration}</p>
                          </div>
                          <div className="service-price text-white bg-white/10">
                            ${primaryService.price}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {primaryService && (
                    <div>
                      <h2 className="text-xl font-semibold mb-6 mt-8">Anything you wish to add?</h2>
                      <div className="service-cards">
                        {services
                          .filter(service => service.name !== primaryService.name)
                          .map((service, index) => {
                            const isSelected = selectedServices.find(s => s.name === service.name);
                            return (
                              <div
                                key={index}
                                onClick={() => handleServiceSelection(service)}
                                className={`service-card ${isSelected ? 'bg-black' : ''}`}
                              >
                                <div className="service-details">
                                  <h2 className={isSelected ? 'text-white' : ''}>
                                    {service.name}
                                  </h2>
                                  <p className={isSelected ? 'text-white' : ''}>
                                    {service.duration}
                                  </p>
                                </div>
                                <div className={`service-price ${isSelected ? 'text-white bg-white/10' : ''}`}>
                                  ${service.price}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {!primaryService && (
                    <div className="service-cards">
                      {services.map((service, index) => (
                        <div
                          key={index}
                          onClick={() => handleServiceSelection(service)}
                          className="service-card"
                        >
                          <div className="service-details">
                            <h2>{service.name}</h2>
                            <p>{service.duration}</p>
                          </div>
                          <div className="service-price">
                            ${service.price}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="info-card">
                  <h2 className="mb-1">Your order</h2>
                  <p className="text-sm text-gray-400 mb-6">Bad Guy Barbers</p>
                  
                  <div className="flex items-center gap-3 mb-6">
                    <img
                      src={selectedBarber?.image || placeholder}
                      alt="Barber profile"
                      className="w-8 h-8 rounded-sm object-cover"
                    />
                    <span className="text-gray-900">{selectedBarber?.name || 'Tony F.'}</span>
                  </div>

                  {selectedServices.length > 0 && (
                    <div className="space-y-4">
                      {selectedServices.map((service, index) => (
                        <div key={index} className="flex justify-between items-start">
                          <div>
                            {index === 0 ? (
                              <p className="text-gray-900">{service.name}</p>
                            ) : (
                              <p className="text-gray-900">+ {service.name}</p>
                            )}
                            <p className="text-sm text-gray-500">{service.duration}</p>
                          </div>
                          <p className="text-gray-900">${service.price}</p>
                        </div>
                      ))}

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Subtotal</span>
                          <span className="font-medium">${calculateTotal()}</span>
                        </div>
                      </div>

                      <button 
                      className="choose-time-button"
                      onClick={handleTimeSelection}
                      >
                      Choose a time
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default BarberServices;