"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import Map, { Marker, MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface LocationPickerProps {
    latitude: number | null;
    longitude: number | null;
    onLocationChange: (lat: number, lng: number, address?: string) => void;
    searchInputRef?: React.Ref<HTMLInputElement>;
}

interface SearchResult {
    id: string;
    place_name: string;
    center: [number, number];
}

export default function LocationPicker({
    latitude,
    longitude,
    onLocationChange,
    searchInputRef,
}: LocationPickerProps) {
    const mapRef = useRef<MapRef>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close results dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setShowResults(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const searchAddress = useCallback(async (query: string) => {
        if (query.length < 3) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                    query
                )}.json?access_token=${MAPBOX_TOKEN}&country=us&types=address,place,locality,neighborhood&limit=5`
            );
            const data = await response.json();
            if (data.features) {
                setSearchResults(
                    data.features.map(
                        (f: { id: string; place_name: string; center: [number, number] }) => ({
                            id: f.id,
                            place_name: f.place_name,
                            center: f.center,
                        })
                    )
                );
                setShowResults(true);
            }
        } catch (error) {
            console.error("Geocoding error:", error);
        } finally {
            setIsSearching(false);
        }
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            searchAddress(value);
        }, 350);
    };

    const handleSelectResult = (result: SearchResult) => {
        const [lng, lat] = result.center;
        onLocationChange(lat, lng, result.place_name);
        setSearchQuery(result.place_name);
        setShowResults(false);

        mapRef.current?.flyTo({
            center: [lng, lat],
            zoom: 16,
            duration: 1500,
        });
    };

    const handleMapClick = useCallback(
        (event: { lngLat: { lng: number; lat: number } }) => {
            const { lng, lat } = event.lngLat;
            onLocationChange(lat, lng);
        },
        [onLocationChange]
    );

    const clearSearch = () => {
        setSearchQuery("");
        setSearchResults([]);
        setShowResults(false);
    };

    return (
        <div className="space-y-3 p-1" ref={containerRef}>
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-olive/50 pointer-events-none z-10" />
                <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search for a property address..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => searchResults.length > 0 && setShowResults(true)}
                    className="w-full pl-10 pr-10 py-2.5 h-11 bg-white border border-brand-gray/50 rounded-lg text-sm text-brand-olive placeholder:text-brand-olive/40 focus-visible:ring-brand-olive/50 hover:bg-zinc-50 transition-all shadow-none"
                />
                {searchQuery && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-olive/40 hover:text-brand-olive transition-colors z-10"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}

                {/* Search Results Dropdown */}
                {showResults && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-brand-gray/30 rounded-lg shadow-xl shadow-brand-olive/5 z-50 overflow-hidden">
                        {searchResults.map((result) => (
                            <button
                                key={result.id}
                                onClick={() => handleSelectResult(result)}
                                className="w-full text-left px-4 py-3 text-sm hover:bg-zinc-50 transition-colors border-b border-brand-gray/20 last:border-b-0 flex items-start gap-3"
                            >
                                <MapPin className="h-4 w-4 mt-0.5 text-brand-olive shrink-0" />
                                <span className="text-brand-olive/90">{result.place_name}</span>
                            </button>
                        ))}
                    </div>
                )}

                {isSearching && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-brand-gray/30 rounded-lg shadow-xl shadow-brand-olive/5 z-50 px-4 py-3 text-sm text-brand-olive/50">
                        Searching...
                    </div>
                )}
            </div>

            {/* Map */}
            <div className="relative rounded-xl overflow-hidden border border-brand-gray/30 h-[280px]">
                <Map
                    ref={mapRef}
                    initialViewState={{
                        longitude: longitude ?? -98.5,
                        latitude: latitude ?? 39.8,
                        zoom: latitude ? 14 : 3.5,
                    }}
                    style={{ width: "100%", height: "100%" }}
                    mapStyle="mapbox://styles/mapbox/light-v11"
                    mapboxAccessToken={MAPBOX_TOKEN}
                    onClick={handleMapClick}
                    cursor="crosshair"
                >
                    {latitude !== null && longitude !== null && (
                        <Marker latitude={latitude} longitude={longitude} anchor="bottom">
                            <div className="relative animate-bounce">
                                <MapPin className="h-8 w-8 text-brand-olive drop-shadow-lg" fill="#333629" />
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 bg-brand-olive/30 rounded-full blur-sm" />
                            </div>
                        </Marker>
                    )}
                </Map>

                {/* Coordinate display overlay */}
                {latitude !== null && longitude !== null && (
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md rounded-lg px-3 py-1.5 text-xs font-mono text-brand-olive/80 border border-brand-gray/30 shadow-sm">
                        {latitude.toFixed(4)}°N, {Math.abs(longitude).toFixed(4)}°W
                    </div>
                )}

                {/* Instruction hint — bottom-left corner, non-intrusive */}
                {latitude === null && (
                    <div className="absolute bottom-3 left-3 pointer-events-none">
                        <div className="bg-brand-olive/80 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-[11px] text-white/90 flex items-center gap-1.5 shadow-md">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="hidden sm:inline">Search above or click map to pin</span>
                            <span className="sm:hidden">Search or tap map</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
