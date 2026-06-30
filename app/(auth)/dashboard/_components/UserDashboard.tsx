"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin, ChevronRight } from "lucide-react";
import Navbar from "../../_components/Navbar";

const FEATURED_EVENTS = [
    {
        id: "1",
        title: "Johns & The Locals Live",
        date: "15 May, 2026",
        price: "Rs. 1,000",
        time: "3:00 PM Onwards",
        location: "Sa:Sa Twa, Kirtipur",
        image: "/event1.png",
    },
    {
        id: "2",
        title: "MOTO ENDURO - 2026",
        date: "15 May, 2026",
        price: "Rs. 15,000",
        time: "1:00 PM Onwards",
        location: "Pokhara, Nepal",
        image: "/event2.png",
    },
    {
        id: "3",
        title: "National Basketball League 2026",
        date: "3 May, 2026",
        price: "Rs. 1,000",
        time: "3:00 PM Onwards",
        location: "KCM, Gwarko",
        image: "/event3.png",
    },
    {
        id: "4",
        title: "Social Masquerade Festival",
        date: "Fri, 15 May",
        price: "Rs. 1,000",
        time: "7:00 PM Onwards",
        location: "Club 10x, Thamel",
        image: "/event4.png",
    },
];

const CATEGORIES = [
    {
        name: "MUSIC & CONCERTS",
        count: "20+ Events",
        image: "/category_music.png",
        subColor: "text-blue-400",
    },
    {
        name: "SPORTS",
        count: "20+ Events",
        image: "/category_sports.png",
        subColor: "text-blue-400",
    },
    {
        name: "ACT & THEATRES",
        count: "20+ Events",
        image: "/category_theater.png",
        subColor: "text-blue-400",
    },
    {
        name: "ART EXHIBITIONS",
        count: "20+ Events",
        image: "/category_art.png",
        subColor: "text-blue-400",
    },
    {
        name: "StandUp Comedy",
        count: "20+ Events",
        image: "/category_comedy.png",
        subColor: "text-blue-400",
        hasViewAll: true,
    },
];

export default function UserDashboard() {
    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans flex flex-col justify-between">
            <div>
                {/* Navbar */}
                <Navbar />

                {/* Hero Banner */}
                <div className="mx-4 md:mx-10 mt-6 relative rounded-3xl overflow-hidden shadow-md">
                    <div className="relative h-64 sm:h-80 md:h-[450px] w-full">
                        <Image
                            src="/gbc_banner.png"
                            alt="GBC Boxing Championship"
                            fill
                            priority
                            className="object-cover"
                            onError={(e) => {
                                // Fallback in case image is missing
                                const target = e.target as HTMLImageElement;
                                target.src = "/event-bg.jpg";
                            }}
                        />
                    </div>
                </div>

                {/* Featured Events */}
                <section className="px-6 md:px-10 mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Featured Events
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURED_EVENTS.map((event) => (
                            <div
                                key={event.id}
                                className="group bg-white rounded-3xl border border-gray-150 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
                            >
                                <div className="relative h-48 w-full bg-gray-100">
                                    <Image
                                        src={event.image}
                                        alt={event.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-center text-xs font-bold text-red-600 mb-2">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={13} className="shrink-0" />
                                                {event.date}
                                            </span>
                                            <span>{event.price}</span>
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-sm group-hover:text-purple-600 transition leading-snug mb-3">
                                            {event.title}
                                        </h3>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <Clock size={13} className="shrink-0" />
                                            {event.time}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <MapPin size={13} className="shrink-0" />
                                            {event.location}
                                        </div>
                                        <button className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl text-xs tracking-wider transition">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Browse By Categories */}
                <section className="px-6 md:px-10 mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Browse By Categories
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {CATEGORIES.map((cat, idx) => (
                            <div
                                key={idx}
                                className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-gray-900 group cursor-pointer border border-gray-100 shadow-sm"
                            >
                                <Image
                                    src={cat.image}
                                    alt={cat.name}
                                    fill
                                    className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-300"
                                    onError={(e) => {
                                        // Fallback
                                        const target = e.target as HTMLImageElement;
                                        target.src = "/event-bg.jpg";
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-4">
                                    <h3 className="font-bold text-white text-xs md:text-sm tracking-wide uppercase leading-tight">
                                        {cat.name}
                                    </h3>
                                    <p className={`text-[10px] md:text-xs font-semibold mt-1 ${cat.subColor}`}>
                                        {cat.count}
                                    </p>
                                    {cat.hasViewAll && (
                                        <div className="absolute top-4 right-4 flex items-center justify-center bg-black/60 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ChevronRight size={16} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Popular Events */}
                <section className="px-6 md:px-10 mt-16 mb-20">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Popular Events
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURED_EVENTS.map((event) => (
                            <div
                                key={`popular-${event.id}`}
                                className="group bg-white rounded-3xl border border-gray-150 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
                            >
                                <div className="relative h-48 w-full bg-gray-100">
                                    <Image
                                        src={event.image}
                                        alt={event.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-center text-xs font-bold text-red-600 mb-2">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={13} className="shrink-0" />
                                                {event.date}
                                            </span>
                                            <span>{event.price}</span>
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-sm group-hover:text-purple-600 transition leading-snug mb-3">
                                            {event.title}
                                        </h3>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <Clock size={13} className="shrink-0" />
                                            {event.time}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <MapPin size={13} className="shrink-0" />
                                            {event.location}
                                        </div>
                                        <button className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl text-xs tracking-wider transition">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer className="bg-black text-gray-400 py-12 px-6 md:px-12 border-t border-zinc-900">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* EventLoop Brand column */}
                    <div>
                        <Link href="/dashboard" className="flex items-center gap-2 mb-4">
                            <div className="relative h-6 w-6">
                                <Image
                                    src="/eventloop-logo.png"
                                    alt="EventLoop"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-white font-bold tracking-wide text-md">
                                EVENTLOOP
                            </span>
                        </Link>
                        <p className="text-xs leading-relaxed max-w-sm">
                            Host your events and sell tickets. <br />
                            Your Event, Your tickets, Your Way
                        </p>
                    </div>

                    {/* Help Column */}
                    <div>
                        <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-4">
                            Help
                        </h4>
                        <ul className="space-y-2.5 text-xs">
                            <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
                            <li><Link href="/support" className="hover:text-white transition">Help Center</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
                            <li><Link href="/reviews" className="hover:text-white transition">Write a Review</Link></li>
                        </ul>
                    </div>

                    {/* Important Links Column */}
                    <div>
                        <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-4">
                            Important Links
                        </h4>
                        <ul className="space-y-2.5 text-xs">
                            <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                            <li><Link href="/careers" className="hover:text-white transition">Work with Us</Link></li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    );
}
