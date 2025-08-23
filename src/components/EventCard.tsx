'use client';

import { MapPin, Users, ArrowRight, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { urlFor } from '../lib/sanity';
import { Event } from '../types/sanity';
import { usePageTransition } from '../context/PageTransitionContext';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

interface EventCardProps {
  event: Event;
  variant?: 'upcoming' | 'past';
  layoutStyle?: 'grid' | 'list';
}

const EventCard = ({ event, variant = 'upcoming', layoutStyle = 'list' }: EventCardProps) => {
    const isUpcoming = variant === 'upcoming';
    const isList = layoutStyle === 'list';
    const { startTransition } = usePageTransition();
    const router = useRouter();
    const cardRef = useRef<HTMLDivElement>(null);
    
    const handleCardClick = (e: React.MouseEvent) => {
        e.preventDefault();
        
        if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            startTransition(event._id, rect);
            
            // Small delay to ensure transition state is set
            setTimeout(() => {
                router.push(`/event/${event._id}`);
            }, 50);
        }
    };
    
    return (
        <div 
            ref={cardRef}
            className={`bg-white rounded-2xl border border-gray-200/60 ${isUpcoming ? 'shadow-xl hover:shadow-2xl' : 'shadow-lg hover:shadow-xl'} 
                transition-all duration-300 overflow-hidden group ${isList ? 'flex flex-col md:flex-col' : 'flex flex-col'} cursor-pointer hover:-translate-y-1`}
            onClick={handleCardClick}
        >
            {event.image && (
                <div 
                    className={`relative ${isList ? 'h-60 md:h-auto' : 'h-60 sm:h-60 md:h-60'} overflow-hidden p-3 bg-white`}
                >
                    <div className="relative w-full h-full rounded-xl overflow-hidden">
                        <img
                            src={urlFor(event.image).width(800).height(400).url()}
                            alt={event.title}
                            className={`w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ${!isUpcoming && 'filter grayscale-[30%] group-hover:grayscale-0'}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="absolute top-4 right-4">
                            <span className={`px-3 py-1.5 ${isUpcoming ? 'bg-red-600' : 'bg-gray-500'} text-white text-sm font-medium rounded-full border border-white/20`}>
                                {isUpcoming ? 'Upcoming' : 'Completed'}
                            </span>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                            <span className={`px-3 py-1.5 ${isUpcoming ? 'bg-red-600/90 backdrop-blur-sm' : 'bg-gray-700/90 backdrop-blur-sm'} text-white text-sm font-medium rounded-full inline-flex items-center border border-white/20`}>
                                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                {format(new Date(event.date), 'MMM d, yyyy')}
                            </span>
                        </div>
                    </div>
                </div>
            )}
            
            <div className={`flex flex-col flex-grow`}>
                {/* Title Section */}
                <div className="p-4 sm:p-5 md:p-6 pb-2">
                    <h3 
                        className={`text-lg sm:text-xl md:text-xl font-bold ${isUpcoming ? 'text-gray-900 group-hover:text-[#9B2C2C]' : 'text-gray-700 group-hover:text-gray-900'} transition-colors duration-300`}
                    >
                        {event.title.slice(0, 60)}
                    </h3>
                </div>

                    {/* Description Section */}
                    {event.desc && (
                    <div className="px-4 sm:px-5 md:px-6 pb-3">
                        <div className="text-gray-600">
                            <p className={`${isList ? 'line-clamp-2' : 'line-clamp-2'} text-sm leading-relaxed`}>{event.desc}</p>
                        </div>
                    </div>
                )}

                {/* Divider */}
                <div className="mx-4 sm:mx-5 md:mx-6">
                    <div className="h-px bg-gray-400/30"></div>
                </div>
                
                {/* Event Details Section */}
                <div className="px-4 sm:px-5 md:px-6 py-3">
                    {/* Date & Time, Participants, Location Row */}
                    <div className={`grid ${event.expectedParticipants ? 'grid-cols-3' : 'grid-cols-2'} gap-3`}>
                        <div className={`flex flex-col items-center ${isUpcoming ? 'text-gray-700' : 'text-gray-600'} p-3 rounded-lg border border-gray-100 bg-gray-50/50 text-center`}>
                            <Calendar className={`w-5 h-5 mb-2 ${isUpcoming ? 'text-[#9B2C2C]' : 'text-gray-500'}`} />
                            <span className="text-xs font-medium">{format(new Date(event.date), 'MMM d, yyyy')}</span>
                            <span className="text-xs text-gray-500">{format(new Date(event.date), 'h:mm a')}</span>
                        </div>
                        {event.expectedParticipants && (
                            <div className={`flex flex-col items-center ${isUpcoming ? 'text-gray-700' : 'text-gray-600'} p-3 rounded-lg border border-gray-100 bg-gray-50/50 text-center`}>
                                <Users className={`w-5 h-5 mb-2 ${isUpcoming ? 'text-[#9B2C2C]' : 'text-gray-500'}`} />
                                <span className="text-xs font-medium">
                                    {isUpcoming ? `${event.expectedParticipants} exp.` : `${event.expectedParticipants.slice(0, 25)} ...`}
                                </span>
                            </div>
                        )}
                        <div className={`flex flex-col items-center ${isUpcoming ? 'text-gray-700' : 'text-gray-600'} p-3 rounded-lg border border-gray-100 bg-gray-50/50 text-center`}>
                            <MapPin className={`w-5 h-5 mb-2 ${isUpcoming ? 'text-[#9B2C2C]' : 'text-gray-500'}`} />
                            <span className="text-xs font-medium text-center leading-tight">{event.location.slice(0, 25)}...</span>
                        </div>
                    </div>
                </div>
                
                {/* Action Button Section */}
                <div className="p-4 sm:p-5 md:p-6 mt-auto">
                    <div 
                        className={`inline-flex items-center justify-center w-full px-5 py-3 ${
                            isUpcoming 
                                ? 'bg-red-600 text-white border border-red-600 hover:bg-red-700' 
                                : 'bg-gray-700 text-white hover:bg-gray-600 border border-gray-600'
                        } font-medium rounded-md transition-all duration-300 shadow-md hover:shadow-lg ${isUpcoming ? 'group-hover:shadow-xl' : ''} text-base border`}
                    >
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventCard;