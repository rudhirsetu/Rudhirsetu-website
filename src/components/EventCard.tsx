'use client';

import { MapPin, Users, ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';
import { urlFor } from '../lib/sanity';
import { getEventDateParts } from './events/format';
import { Event } from '../types/sanity';
import { usePageTransition } from '../context/PageTransitionContext';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import type { MouseEvent } from 'react';

interface EventCardProps {
  event: Event;
  variant?: 'upcoming' | 'past';
  layoutStyle?: 'grid' | 'list';
}

const EventCard = ({ event, variant = 'upcoming' }: EventCardProps) => {
    const isUpcoming = variant === 'upcoming';
    const { startTransition } = usePageTransition();
    const router = useRouter();
    const cardRef = useRef<HTMLAnchorElement>(null);
    const href = `/event/${event._id}`;
    // Dates are always shown in IST so server and client render identical text.
    const date = getEventDateParts(event.date);

    const handleCardClick = (e: MouseEvent<HTMLAnchorElement>) => {
        // Let modified clicks (new tab/window) behave like a normal link.
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();

        if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            startTransition(event._id, rect);
            
            // Small delay to ensure transition state is set
            setTimeout(() => {
                router.push(href);
            }, 100);
        }
    };
    
    return (
        <Link
            ref={cardRef}
            href={href}
            onClick={handleCardClick}
            className="group h-full w-full flex flex-col bg-white rounded-3xl border border-red-900/10 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(69,10,10,0.35)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-700"
        >
            {event.image && (
                <div className="p-2.5">
                    <div className="relative h-56 rounded-2xl overflow-hidden bg-paper">
                        <img
                            src={urlFor(event.image).width(800).height(450).url()}
                            width={800}
                            height={450}
                            decoding="async"
                            alt={event.title}
                            loading="lazy"
                            className={`w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        <span className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${isUpcoming ? 'bg-red-600 text-white' : 'bg-white/95 text-gray-700'}`}>
                            {isUpcoming && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                            {isUpcoming ? 'Upcoming' : 'Completed'}
                        </span>
                        <div className="absolute bottom-3 left-3 rounded-xl bg-white px-3 py-1.5 text-center leading-none shadow-sm">
                            <span className="block text-[0.65rem] font-semibold uppercase tracking-wider text-red-700">
                                {date?.monthShort}
                            </span>
                            <span className="block font-display text-xl font-bold text-gray-900">
                                {date?.day}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col flex-grow px-5 sm:px-6 pt-3 pb-5 sm:pb-6">
                <h3 className={`font-display text-xl font-bold tracking-tight leading-snug line-clamp-2 transition-colors ${isUpcoming ? 'text-gray-900 group-hover:text-red-700' : 'text-gray-800 group-hover:text-gray-900'}`}>
                    {event.title}
                </h3>

                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 shrink-0 text-red-700/70" />
                        <span>{date ? `${date.weekday.slice(0, 3)}, ${date.short} · ${date.time}` : ''}</span>
                    </li>
                    {event.location && (
                        <li className="flex items-center gap-2.5 min-w-0">
                            <MapPin className="w-4 h-4 shrink-0 text-red-700/70" />
                            <span className="truncate">{event.location}</span>
                        </li>
                    )}
                    {event.expectedParticipants && (
                        <li className="flex items-center gap-2.5 min-w-0">
                            <Users className="w-4 h-4 shrink-0 text-red-700/70" />
                            <span className="truncate">
                                {isUpcoming ? `${event.expectedParticipants} expected` : event.expectedParticipants}
                            </span>
                        </li>
                    )}
                </ul>

                <div className="mt-auto pt-5">
                    <div className="flex items-center justify-between border-t border-red-900/10 pt-4">
                        <span className="font-semibold text-gray-900 group-hover:text-red-700 transition-colors">View details</span>
                        <span className="flex w-9 h-9 items-center justify-center rounded-full bg-paper text-red-700 transition-colors group-hover:bg-red-700 group-hover:text-white">
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default EventCard;