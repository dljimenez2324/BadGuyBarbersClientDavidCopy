import { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from "./NavBar";
import Breadcrumb from "./Breadcrumb";
import AnimatedPage from "./AnimatedPage";
import { Datepicker } from "flowbite-react";
import { 
  TimeSlotSkeleton, 
  CalendarSkeleton, 
  TimeInfoCardSkeleton, 
  BreadcrumbSkeleton 
} from "./Skeleton";

interface TimeSlot {
  id: number;
  time: string;
  available: boolean;
  duration: number;
}

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
  services: Service[];
  total: number;
}

interface Appointment {
  barber: {
    name: string;
    image: string;
  };
  services: Service[];
  date: Date;
  time: string;
  total: number;
}

const ChooseTimePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { barber, services, total } = (location.state as LocationState) || {};

  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsInitialLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setTimeSlots(generateTimeSlots());
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedDate && !isInitialLoading) {
      setTimeSlots(generateTimeSlots());
    }
  }, [selectedDate, barber]); 

  const handleCardClick = (slot: TimeSlot) => {
    setSelectedCard(slot.id);
    setSelectedSlot(slot);
  };

  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startTime = new Date();
    startTime.setHours(9, 0, 0);
    const endTime = new Date();
    endTime.setHours(17, 30, 0);
    let id = 1;

    const generateSeed = (str: string) => {
      let seed = 0;
      for (let i = 0; i < str.length; i++) {
        seed += str.charCodeAt(i);
      }
      return seed;
    };

    const seed = generateSeed(barber?.name || '');
    
    const unavailableSlots = new Set();
    const numUnavailableSlots = 5;
    
    for (let i = 0; i < numUnavailableSlots; i++) {
      const unavailableId = ((seed * (i + 1)) % 17) + 1;
      unavailableSlots.add(unavailableId);
    }

    while (startTime < endTime) {
      const timeString = startTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      const hour = startTime.getHours();
      const isPopularTime = hour >= 11 && hour <= 14;
      const isPeakDay = selectedDate?.getDay() === 5 || selectedDate?.getDay() === 6;

      if (isPopularTime && isPeakDay && Math.sin(seed * id) > 0.3) {
        unavailableSlots.add(id);
      }

      slots.push({
        id: id,
        time: timeString,
        available: !unavailableSlots.has(id),
        duration: 30,
      });

      startTime.setMinutes(startTime.getMinutes() + 30);
      id++;
    }

    return slots;
  };

  const handleGoHome = () => {
    navigate('/home');
  };

  const submitBooking = async () => {
    if (selectedDate && selectedSlot) {
      setIsBooking(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newAppointment: Appointment = {
          barber,
          services,
          date: selectedDate,
          time: selectedSlot.time,
          total
        };

        setAppointments(prev => [...prev, newAppointment]);
        setIsConfirmed(true);
      } catch (error) {
        console.error("Booking failed:", error);
      } finally {
        setIsBooking(false);
      }
    }
  };

  const renderTimeSlot = (slot: TimeSlot) => {
    const isSelected = selectedCard === slot.id;
    const isUnavailable = !slot.available;

    return (
      <button
        key={slot.id}
        onClick={() => slot.available && handleCardClick(slot)}
        disabled={isUnavailable}
        className={`
          text-center rounded-2xl p-4 transition-all duration-200 ease-in-out
          ${isUnavailable 
            ? 'bg-gray-200 cursor-not-allowed' 
            : isSelected
              ? 'bg-black shadow-lg transform scale-[1.02]'
              : 'bg-white hover:shadow-md hover:scale-[1.01]'
          }
          relative
        `}
      >
        <h3 className={`
          text-base font-medium transition-colors
          ${isSelected 
            ? 'text-white' 
            : isUnavailable
              ? 'text-gray-400'
              : 'text-gray-900'
          }
        `}>
          {slot.time}
        </h3>
        <p className={`
          text-sm transition-colors
          ${isSelected
            ? 'text-white'
            : isUnavailable
              ? 'text-gray-400'
              : 'text-gray-500'
          }
        `}>
          {slot.available ? 'Available' : 'Unavailable'}
        </p>
      </button>
    );
  };

  const renderInfoCard = () => (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-1">
        {isConfirmed ? "Reservation Complete" : "Your order"}
      </h2>
      <p className="text-sm text-gray-400 mb-6">Bad Guy Barbers</p>
      
      {isConfirmed ? (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">Your Appointment</h3>
            {appointments.map((apt, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={apt.barber.image}
                    alt={apt.barber.name}
                    className="w-8 h-8 rounded-sm object-cover"
                  />
                  <span className="font-medium">{apt.barber.name}</span>
                </div>
                <p className="text-sm text-gray-600">
                  {apt.date.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                  {" at "}
                  {apt.time}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Total: ${apt.total}
                </p>
              </div>
            ))}
          </div>
          
          <button
            onClick={handleGoHome}
            className="w-full py-3 rounded-lg text-white font-medium bg-black hover:bg-gray-900"
          >
            Go back home
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <img
              src={barber?.image}
              alt={barber?.name}
              className="w-8 h-8 rounded-sm object-cover"
            />
            <span className="text-gray-900">{barber?.name}</span>
          </div>

          {services?.map((service, index) => (
            <div key={index} className="flex justify-between items-start">
              <div>
                <p className="text-gray-900">
                  {index === 0 ? service.name : `+ ${service.name}`}
                </p>
                <p className="text-sm text-gray-500">{service.duration}</p>
              </div>
              <p className="text-gray-900">${service.price}</p>
            </div>
          ))}

          {selectedDate && selectedSlot && (
            <div className="py-4 border-y border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-900">Appointment</p>
                  <p className="text-sm text-gray-500">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                    {" at "}
                    {selectedSlot.time}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total</span>
              <span className="font-medium">${total}</span>
            </div>
          </div>

          <button
            onClick={submitBooking}
            disabled={!selectedDate || !selectedSlot || isBooking}
            className={`
              w-full py-3 rounded-lg text-white font-medium transition-colors mt-4
              ${(!selectedDate || !selectedSlot) 
                ? "bg-gray-200 cursor-not-allowed" 
                : "bg-black hover:bg-gray-900"
              }
            `}
          >
            {isBooking ? "Booking..." : "Confirm booking"}
          </button>
        </div>
      )}
    </div>
  );

  const renderDesktopLayout = () => {
    if (isConfirmed) {
      return (
        <div className="hidden lg:flex h-[calc(100vh-200px)] relative justify-center">
          <div className="w-[500px] bg-white rounded-xl shadow-sm p-6">
            {renderInfoCard()}
          </div>
        </div>
      );
    }

    return (
      <div className="hidden lg:flex h-[calc(100vh-200px)] relative">
        <div className="flex-1 flex gap-8 pr-[400px]">
          {/* Time slots grid */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-6">Choose a time</h2>
            {isInitialLoading ? (
              <div className="grid grid-cols-3 gap-4">
                {[...Array(12)].map((_, index) => (
                  <TimeSlotSkeleton key={index} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {timeSlots.map((slot) => renderTimeSlot(slot))}
              </div>
            )}
          </div>

          {/* Calendar section */}
          <div className="w-[400px]">
            {isInitialLoading ? (
              <CalendarSkeleton />
            ) : (
              <Datepicker
                inline
                onChange={(date) => setSelectedDate(date as Date)}
              />
            )}
          </div>
        </div>

      
        <div className="fixed top-32 right-8 w-[380px] bg-white rounded-xl shadow-sm h-[calc(100vh-200px)] overflow-y-auto">
          {isInitialLoading ? (
            <TimeInfoCardSkeleton />
          ) : (
            renderInfoCard()
          )}
        </div>
      </div>
    );
  };

  const renderMobileLayout = () => {
    if (isConfirmed) {
      return (
        <div className="lg:hidden p-4">
          <div className="bg-white rounded-xl shadow-sm">
            {renderInfoCard()}
          </div>
        </div>
      );
    }

    return (
      <div className="lg:hidden space-y-6">
        {isInitialLoading ? (
          <>
            <CalendarSkeleton />
            <div className="grid grid-cols-2 gap-3 w-full">
              {[...Array(6)].map((_, index) => (
                <TimeSlotSkeleton key={index} />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="w-full">
              <Datepicker
                inline
                onChange={(date) => setSelectedDate(date as Date)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {timeSlots.map((slot) => renderTimeSlot(slot))}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              {renderInfoCard()}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="pt-32 px-8">
          {isInitialLoading ? (
            <BreadcrumbSkeleton />
          ) : (
            <Breadcrumb isDone={isConfirmed} />
          )}
          
          {renderDesktopLayout()}
          {renderMobileLayout()}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default ChooseTimePage;