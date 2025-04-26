import { MapPin, Users, Heart, Clock, ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { urlFor } from '../lib/sanity';
import { Event } from '../types/sanity';

interface EventCardProps {
  event: Event;
  variant?: 'upcoming' | 'past';
  layoutStyle?: 'grid' | 'list';
}

const EventCard = ({ event, variant = 'upcoming', layoutStyle = 'grid' }: EventCardProps) => {
    const isUpcoming = variant === 'upcoming';
    const isList = layoutStyle === 'list';
    
    return (
        <motion.div 
            whileHover={{ y: -8 }}
            className={`bg-white rounded-2xl ${isUpcoming ? 'shadow-xl hover:shadow-2xl' : 'shadow-lg hover:shadow-xl'} 
                transition-all duration-300 overflow-hidden group ${isList ? 'flex flex-col md:flex-row' : 'flex flex-col'}`}
        >
            {event.image && (
                <div className={`relative ${isList ? 'h-48 md:h-auto md:w-2/5' : 'h-48 sm:h-56 md:h-64'} overflow-hidden`}>
                    <img
                        src={urlFor(event.image).width(800).height(400).url()}
                        alt={event.title}
                        className={`w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ${!isUpcoming && 'filter grayscale-[30%] group-hover:grayscale-0'}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 ${isUpcoming ? 'bg-emerald-500' : 'bg-gray-500'} text-white text-sm font-medium rounded-full`}>
                            {isUpcoming ? 'Upcoming' : 'Completed'}
                        </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <span className={`px-3 py-1.5 ${isUpcoming ? 'bg-red-600' : 'bg-gray-700'} text-white text-sm font-medium rounded-full inline-flex items-center`}>
                            <Calendar className="w-3.5 h-3.5 mr-1.5" />
                            {format(new Date(event.date), 'MMM d, yyyy')}
                        </span>
                    </div>
                </div>
            )}
            <div className={`p-4 sm:p-6 md:p-8 flex flex-col flex-grow ${isList && 'md:w-3/5'}`}>
                <h3 className={`text-lg sm:text-xl md:text-2xl font-bold mb-3 ${isUpcoming ? 'text-gray-900 group-hover:text-[#9B2C2C]' : 'text-gray-700 group-hover:text-gray-900'} transition-colors duration-300`}>
                    {event.title}
                </h3>
                
                <div className="space-y-3 mb-6">
                    <div className={`flex items-center ${isUpcoming ? 'text-gray-700' : 'text-gray-600'}`}>
                        <Clock className={`w-5 h-5 mr-3 ${isUpcoming ? 'text-[#9B2C2C]' : 'text-gray-500'} min-w-[20px] min-h-[20px]`} />
                        <span>{format(new Date(event.date), 'h:mm a')}</span>
                    </div>
                    <div className={`flex items-center ${isUpcoming ? 'text-gray-700' : 'text-gray-600'}`}>
                        <MapPin className={`w-5 h-5 mr-3 ${isUpcoming ? 'text-[#9B2C2C]' : 'text-gray-500'} min-w-[20px] min-h-[20px]`} />
                        <span className="line-clamp-1">{event.location}</span>
                    </div>
                    {isUpcoming && event.expectedParticipants && (
                        <div className="flex items-center text-gray-700">
                            <Users className="w-5 h-5 mr-3 text-[#9B2C2C] min-w-[20px] min-h-[20px]" />
                            <span>Expected: {event.expectedParticipants} participants</span>
                        </div>
                    )}
                </div>
                
                {event.desc && (
                    <div className={`${!isUpcoming ? 'flex items-start' : ''} text-gray-600 mb-6`}>
                        {!isUpcoming && <Heart className="w-5 h-5 mr-3 mt-1 text-gray-500 min-w-[20px] min-h-[20px]" />}
                        <p className={`${isList ? 'line-clamp-3' : 'line-clamp-2'} text-sm sm:text-base`}>{event.desc}</p>
                    </div>
                )}
                
                <div className="mt-auto">
                    <Link 
                        to={`/event/${event._id}`}
                        className={`inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 ${
                            isUpcoming 
                                ? 'bg-gradient-to-r from-[#9B2C2C] to-red-600 text-white' 
                                : 'bg-gray-700 text-white hover:bg-gray-600'
                        } font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg ${isUpcoming ? 'group-hover:shadow-xl' : ''} text-sm sm:text-base`}
                    >
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default EventCard;