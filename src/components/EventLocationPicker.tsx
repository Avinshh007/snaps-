import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EventLocation } from '../types';
import {
  MapPin,
  Navigation,
  Search,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Map as MapIcon,
  Compass,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Lock,
  Globe,
  Crosshair,
  MapPinOff,
} from 'lucide-react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useMap,
} from '@vis.gl/react-google-maps';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

interface EventLocationPickerProps {
  location: EventLocation | null;
  onChangeLocation: (loc: EventLocation) => void;
  onConfirmLocation: () => void;
}

// Default center: Jubilee Hills, Hyderabad
const DEFAULT_CENTER = { lat: 17.4325, lng: 78.4071 };

// Helper component to programmatically recenter Google Map
const MapRecenterHandler: React.FC<{ center: { lat: number; lng: number }; zoom: number }> = ({
  center,
  zoom,
}) => {
  const map = useMap();
  useEffect(() => {
    if (map) {
      map.panTo(center);
      map.setZoom(zoom);
    }
  }, [map, center, zoom]);
  return null;
};

export const EventLocationPicker: React.FC<EventLocationPickerProps> = ({
  location,
  onChangeLocation,
  onConfirmLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [gpsErrorType, setGpsErrorType] = useState<'denied' | 'unavailable' | 'timeout' | 'unsupported' | null>(null);
  const [accuracyMeters, setAccuracyMeters] = useState<number | null>(location?.accuracy || null);

  const [searchResults, setSearchResults] = useState<
    Array<{ place_id: string; description: string; main_text: string }>
  >([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Map state
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(
    location ? { lat: location.latitude, lng: location.longitude } : DEFAULT_CENTER
  );
  const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number }>(
    location ? { lat: location.latitude, lng: location.longitude } : DEFAULT_CENTER
  );
  const [mapZoom, setMapZoom] = useState<number>(17);

  // Geocoding helper using browser fetch or Google Geocoder
  const reverseGeocode = async (lat: number, lng: number) => {
    let venueName = 'Selected Event Location';
    let formattedAddress = `Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    let placeId = `pin-${Date.now()}`;
    let city = 'Hyderabad';
    let state = 'Telangana';
    let country = 'India';
    let postalCode = '';

    try {
      if (window.google && window.google.maps && window.google.maps.Geocoder) {
        const geocoder = new window.google.maps.Geocoder();
        const response = await geocoder.geocode({ location: { lat, lng } });
        if (response.results && response.results[0]) {
          const res = response.results[0];
          formattedAddress = res.formatted_address;
          placeId = res.place_id;

          const comps = res.address_components || [];

          const establishmentComp = comps.find((c) =>
            c.types.some((t) =>
              ['establishment', 'point_of_interest', 'premise', 'sublocality_level_1', 'route'].includes(t)
            )
          );
          venueName = establishmentComp ? establishmentComp.long_name : comps[0]?.long_name || 'Selected Venue';

          const localityComp = comps.find(
            (c) => c.types.includes('locality') || c.types.includes('administrative_area_level_2')
          );
          if (localityComp) city = localityComp.long_name;

          const stateComp = comps.find((c) => c.types.includes('administrative_area_level_1'));
          if (stateComp) state = stateComp.long_name;

          const countryComp = comps.find((c) => c.types.includes('country'));
          if (countryComp) country = countryComp.long_name;

          const postalComp = comps.find((c) => c.types.includes('postal_code'));
          if (postalComp) postalCode = postalComp.long_name;

          return { venueName, formattedAddress, placeId, city, state, country, postalCode };
        }
      }

      // Fallback reverse geocoding via OpenStreetMap Nominatim
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      if (data && data.display_name) {
        formattedAddress = data.display_name;
        const addr = data.address || {};
        venueName = addr.amenity || addr.building || addr.road || data.display_name.split(',')[0];
        city = addr.city || addr.town || addr.village || addr.county || 'Hyderabad';
        state = addr.state || 'Telangana';
        country = addr.country || 'India';
        postalCode = addr.postcode || '';
        placeId = `osm-${data.place_id || Date.now()}`;
        return { venueName, formattedAddress, placeId, city, state, country, postalCode };
      }
    } catch (err) {
      console.warn('Reverse geocode fallback used:', err);
    }

    return { venueName, formattedAddress, placeId, city, state, country, postalCode };
  };

  // Primary GPS Location Request Handler
  const requestCurrentGPSLocation = () => {
    if (!navigator.geolocation) {
      setGpsErrorType('unsupported');
      setLocationError('Geolocation is not supported by your browser. Please search or select location manually.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);
    setGpsErrorType(null);
    setLocationStatus('Requesting location...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLocationStatus('Locating...');
        const { latitude, longitude, accuracy } = position.coords;
        const roundedAccuracy = Math.round(accuracy || 15);

        setMapCenter({ lat: latitude, lng: longitude });
        setMarkerPos({ lat: latitude, lng: longitude });
        setAccuracyMeters(roundedAccuracy);
        setMapZoom(17);

        setLocationStatus('Getting address...');
        const geoResult = await reverseGeocode(latitude, longitude);

        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

        onChangeLocation({
          venueName: geoResult.venueName,
          formattedAddress: geoResult.formattedAddress,
          latitude,
          longitude,
          placeId: geoResult.placeId,
          googleMapsUrl: mapsUrl,
          city: geoResult.city,
          state: geoResult.state,
          country: geoResult.country,
          postalCode: geoResult.postalCode,
          accuracy: roundedAccuracy,
          confirmed: false,
          verified: true,
        });

        setIsLocating(false);
        setLocationStatus('Location detected.');
      },
      (error) => {
        setIsLocating(false);
        setLocationStatus(null);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsErrorType('denied');
          setLocationError('Location access helps our creator reach your shoot location quickly.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setGpsErrorType('unavailable');
          setLocationError('Unable to detect your location. Please choose your location manually.');
        } else {
          setGpsErrorType('timeout');
          setLocationError('Unable to detect your location. Please choose your location manually.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Requirement 1: Auto-request location permission as soon as the Location step opens
  const autoTriggered = useRef(false);
  useEffect(() => {
    if (!autoTriggered.current) {
      autoTriggered.current = true;
      if (!location || !location.latitude || !location.longitude) {
        requestCurrentGPSLocation();
      }
    }
  }, []);

  // Search Autocomplete Handler (Google Places / Nominatim Fallback)
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        if (window.google && window.google.maps && window.google.maps.places) {
          const service = new window.google.maps.places.AutocompleteService();
          service.getPlacePredictions({ input: searchQuery }, (predictions, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
              setSearchResults(
                predictions.map((p) => ({
                  place_id: p.place_id,
                  description: p.description,
                  main_text: p.structured_formatting.main_text,
                }))
              );
            } else {
              setSearchResults([]);
            }
          });
        } else {
          // OpenStreetMap Nominatim search fallback
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              searchQuery
            )}&limit=5`
          );
          const data = await response.json();
          if (Array.isArray(data)) {
            setSearchResults(
              data.map((item: any) => ({
                place_id: item.place_id ? String(item.place_id) : `osm-${Math.random()}`,
                description: item.display_name,
                main_text: item.name || item.display_name.split(',')[0],
              }))
            );
          }
        }
      } catch (e) {
        console.warn('Search autocomplete error:', e);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Select Search Result Handler
  const handleSelectPlace = async (placeId: string, description: string, mainText: string) => {
    setSearchResults([]);
    setSearchQuery(mainText || description);
    setLocationError(null);
    setGpsErrorType(null);
    setLocationStatus('Updating location...');

    try {
      if (window.google && window.google.maps && window.google.maps.places) {
        const dummyDiv = document.createElement('div');
        const service = new window.google.maps.places.PlacesService(dummyDiv);
        service.getDetails({ placeId, fields: ['name', 'formatted_address', 'geometry', 'address_components'] }, async (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place && place.geometry?.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            setMapCenter({ lat, lng });
            setMarkerPos({ lat, lng });
            setMapZoom(17);

            const geo = await reverseGeocode(lat, lng);
            const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

            onChangeLocation({
              venueName: place.name || mainText || geo.venueName,
              formattedAddress: place.formatted_address || description || geo.formattedAddress,
              latitude: lat,
              longitude: lng,
              placeId,
              googleMapsUrl: mapsUrl,
              city: geo.city,
              state: geo.state,
              country: geo.country,
              postalCode: geo.postalCode,
              accuracy: accuracyMeters || 15,
              confirmed: false,
              verified: true,
            });

            setLocationStatus('Location selected from search.');
            return;
          }
        });
      } else {
        // Fallback geocode search
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(description)}&limit=1`
        );
        const data = await res.json();
        if (data && data[0]) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);

          setMapCenter({ lat, lng });
          setMarkerPos({ lat, lng });
          setMapZoom(17);

          const geo = await reverseGeocode(lat, lng);
          const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

          onChangeLocation({
            venueName: mainText || geo.venueName,
            formattedAddress: data[0].display_name || geo.formattedAddress,
            latitude: lat,
            longitude: lng,
            placeId,
            googleMapsUrl: mapsUrl,
            city: geo.city,
            state: geo.state,
            country: geo.country,
            postalCode: geo.postalCode,
            accuracy: accuracyMeters || 15,
            confirmed: false,
            verified: true,
          });
          setLocationStatus('Location selected from search.');
        }
      }
    } catch (err) {
      console.warn('Place selection detail error:', err);
    }
  };

  // Drag Marker End Handler
  const handleMarkerDragEnd = async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerPos({ lat, lng });
      setIsUpdatingAddress(true);
      setLocationStatus('Updating address...');

      const geo = await reverseGeocode(lat, lng);
      const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

      onChangeLocation({
        venueName: geo.venueName,
        formattedAddress: geo.formattedAddress,
        latitude: lat,
        longitude: lng,
        placeId: geo.placeId,
        googleMapsUrl: mapsUrl,
        city: geo.city,
        state: geo.state,
        country: geo.country,
        postalCode: geo.postalCode,
        accuracy: accuracyMeters || 15,
        confirmed: false,
        verified: true,
      });

      setIsUpdatingAddress(false);
      setLocationStatus('Location updated from map pin.');
    }
  };

  // Map Click Handler (Click anywhere on map to drop pin)
  const handleMapClick = async (e: any) => {
    let lat = markerPos.lat;
    let lng = markerPos.lng;
    if (e.detail?.latLng) {
      lat = e.detail.latLng.lat;
      lng = e.detail.latLng.lng;
    } else if (e.latLng) {
      lat = typeof e.latLng.lat === 'function' ? e.latLng.lat() : e.latLng.lat;
      lng = typeof e.latLng.lng === 'function' ? e.latLng.lng() : e.latLng.lng;
    }

    setMarkerPos({ lat, lng });
    setMapCenter({ lat, lng });
    setIsUpdatingAddress(true);
    setLocationStatus('Updating location from map pin...');

    const geo = await reverseGeocode(lat, lng);
    const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

    onChangeLocation({
      venueName: geo.venueName,
      formattedAddress: geo.formattedAddress,
      latitude: lat,
      longitude: lng,
      placeId: geo.placeId,
      googleMapsUrl: mapsUrl,
      city: geo.city,
      state: geo.state,
      country: geo.country,
      postalCode: geo.postalCode,
      accuracy: accuracyMeters || 15,
      confirmed: false,
      verified: true,
    });

    setIsUpdatingAddress(false);
    setLocationStatus('Location updated from map pin.');
  };

  return (
    <div className="space-y-4">
      {/* 1. Loading & Geolocation Status Notifications */}
      {isLocating && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center space-x-2.5 animate-pulse">
          <RefreshCw className="w-4 h-4 animate-spin text-amber-400 shrink-0" />
          <span>{locationStatus || 'Requesting location...'}</span>
        </div>
      )}

      {locationStatus && !isLocating && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-inter flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>✅ Great! We've detected your shoot location.</span>
          </div>
          {accuracyMeters && (
            <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
              Accuracy: ±{accuracyMeters}m
            </span>
          )}
        </div>
      )}

      {/* 2. Permission Denied or GPS Failure Notification Cards */}
      {gpsErrorType === 'denied' && (
        <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-500/40 space-y-3">
          <div className="flex items-start space-x-3">
            <MapPinOff className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="font-space font-bold text-xs text-white">Location Access Notice</h5>
              <p className="text-xs text-amber-200/90 font-inter">
                Location access helps our creator reach your shoot location quickly. You can enable location or search your address manually below.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={requestCurrentGPSLocation}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-black font-space font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition flex items-center space-x-1.5"
            >
              <Navigation className="w-3.5 h-3.5 fill-black" />
              <span>Enable Location</span>
            </button>
            <button
              type="button"
              onClick={() => searchInputRef.current?.focus()}
              className="px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-space font-bold text-xs hover:border-neutral-500 transition flex items-center space-x-1.5"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>Search Address</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setLocationError(null);
                setGpsErrorType(null);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-300 font-space font-bold text-xs hover:text-white transition flex items-center space-x-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-orange-400" />
              <span>Manual Pin</span>
            </button>
          </div>
        </div>
      )}

      {(gpsErrorType === 'unavailable' || gpsErrorType === 'timeout' || gpsErrorType === 'unsupported') && (
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center space-x-2 text-xs text-neutral-300">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-semibold text-white">Unable to detect your location. Please choose your location manually.</span>
          </div>
          <p className="text-[11px] text-neutral-400 font-inter">
            Use the search box below or drag the pin on the map to mark your venue location.
          </p>
        </div>
      )}

      {/* 3. Primary Controls Bar */}
      <div className="flex items-center justify-between gap-2">
        {/* Use Current Location Button */}
        <button
          type="button"
          onClick={requestCurrentGPSLocation}
          disabled={isLocating}
          className="flex-1 py-3 px-4 rounded-2xl bg-neutral-900 border border-amber-500/40 hover:border-amber-500 hover:bg-neutral-800 transition text-left flex items-center space-x-3 group relative overflow-hidden shadow-lg"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400 group-hover:scale-110 transition-transform">
            {isLocating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
          </div>
          <div className="min-w-0">
            <div className="font-space font-bold text-xs text-white uppercase tracking-wider truncate flex items-center space-x-1.5">
              <span>📍 Use Current Location</span>
            </div>
            <div className="text-[10px] text-neutral-400 font-inter truncate">
              Auto-detect via Live GPS
            </div>
          </div>
        </button>

        {/* Manual Pin Selector */}
        <button
          type="button"
          onClick={() => {
            const mapsUrl = `https://www.google.com/maps?q=${markerPos.lat},${markerPos.lng}`;
            if (!location) {
              onChangeLocation({
                venueName: 'Pin-Selected Event Venue',
                formattedAddress: `Coordinates: ${markerPos.lat.toFixed(6)}, ${markerPos.lng.toFixed(6)}`,
                latitude: markerPos.lat,
                longitude: markerPos.lng,
                googleMapsUrl: mapsUrl,
                confirmed: false,
              });
            }
            setLocationStatus('Move the marker on the map to set exact spot.');
          }}
          className="py-3 px-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition text-left flex items-center space-x-2.5 group"
        >
          <Compass className="w-4 h-4 text-orange-400 shrink-0 group-hover:rotate-45 transition-transform" />
          <span className="font-space font-bold text-xs text-neutral-200 uppercase tracking-wider hidden sm:inline">
            Drag Map Pin
          </span>
        </button>
      </div>

      {/* 4. Google Places Autocomplete Search Box */}
      <div className="relative">
        <label className="text-[10px] font-mono text-amber-400 uppercase font-bold block mb-1">
          🔎 Search Address / Apartment / Building / Landmark
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search venue name, street, apartment, landmark, or city..."
            className="w-full bg-black/90 border border-neutral-800 rounded-2xl pl-10 pr-10 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition shadow-inner"
          />
          {isSearching && (
            <RefreshCw className="w-4 h-4 text-amber-400 animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
          )}
        </div>

        {/* Autocomplete Dropdown List */}
        {searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-[#161616] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
            {searchResults.map((res) => (
              <button
                key={res.place_id}
                type="button"
                onClick={() => handleSelectPlace(res.place_id, res.description, res.main_text)}
                className="w-full text-left px-4 py-2.5 border-b border-neutral-800/60 hover:bg-neutral-800 transition flex items-start space-x-2.5"
              >
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-space font-bold text-xs text-white">{res.main_text}</div>
                  <div className="text-[10px] text-neutral-400 line-clamp-1">{res.description}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 5. Google Map Container with Draggable Marker */}
      <div className="relative w-full h-64 sm:h-72 rounded-3xl border border-neutral-800 overflow-hidden bg-neutral-950 shadow-2xl">
        {isUpdatingAddress && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-amber-500 text-black px-3.5 py-1 rounded-full text-[11px] font-space font-bold shadow-lg flex items-center space-x-1.5 animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Updating address...</span>
          </div>
        )}

        {hasValidKey ? (
          <APIProvider apiKey={API_KEY} version="weekly">
            <Map
              defaultCenter={mapCenter}
              center={mapCenter}
              defaultZoom={mapZoom}
              zoom={mapZoom}
              onClick={handleMapClick}
              mapId="SNAP_STORIES_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              style={{ width: '100%', height: '100%' }}
            >
              <MapRecenterHandler center={mapCenter} zoom={mapZoom} />
              <AdvancedMarker
                position={markerPos}
                draggable={true}
                onDragEnd={handleMarkerDragEnd}
                title={location?.venueName || 'Shoot Location'}
              >
                <Pin background="#FF3B00" glyphColor="#FFFFFF" borderColor="#FFA800" />
              </AdvancedMarker>
            </Map>
          </APIProvider>
        ) : (
          /* Interactive Fallback Map Visualizer when API Key is pending */
          <div className="w-full h-full relative bg-neutral-950 flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="absolute inset-0 bg-[radial-gradient(#ff3b00_1px,transparent_1px)] [background-size:18px_18px] opacity-25" />

            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400 z-10 shadow-lg">
              <MapPin className="w-6 h-6 animate-bounce" />
            </div>

            <div className="z-10 space-y-1">
              <h4 className="font-space font-bold text-sm text-white">Interactive Pin Selected</h4>
              <p className="text-xs text-neutral-400 font-mono">
                Lat: <span className="text-amber-400 font-bold">{markerPos.lat.toFixed(6)}</span> | Lng:{' '}
                <span className="text-amber-400 font-bold">{markerPos.lng.toFixed(6)}</span>
              </p>
            </div>

            <div className="z-10 text-[11px] text-neutral-200 bg-neutral-900/90 border border-neutral-800 px-4 py-2 rounded-2xl max-w-md line-clamp-2">
              📍 {location?.formattedAddress || 'Selected Venue Location'}
            </div>
          </div>
        )}

        <div className="absolute bottom-3 left-3 right-3 z-10 bg-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-neutral-800 text-[10px] font-mono text-neutral-300 flex items-center justify-between">
          <span>🎯 Drag marker to fine-tune exact shoot spot</span>
          {accuracyMeters && <span>Accuracy ±{accuracyMeters}m</span>}
        </div>
      </div>

      {/* 6. Location Confirmation Card */}
      {location && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-5 rounded-3xl border transition space-y-3.5 ${
            location.confirmed
              ? 'bg-emerald-500/10 border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.15)]'
              : 'bg-neutral-900/90 border-amber-500/50 shadow-[0_0_25px_rgba(255,176,0,0.15)]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Crosshair className={`w-5 h-5 ${location.confirmed ? 'text-emerald-400' : 'text-amber-400'}`} />
              <h4 className="font-space font-bold text-xs uppercase tracking-wider text-white">
                📍 Is this your exact shoot location?
              </h4>
            </div>

            {location.confirmed ? (
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono px-3 py-0.5 rounded-full font-bold flex items-center space-x-1">
                <Check className="w-3.5 h-3.5" />
                <span>LOCATION CONFIRMED</span>
              </span>
            ) : (
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
                CONFIRMATION REQUIRED
              </span>
            )}
          </div>

          <div className="space-y-1.5 text-xs">
            <div>
              <span className="text-neutral-400 font-mono text-[10px] uppercase">Venue Name: </span>
              <span className="font-bold text-white">{location.venueName || 'Selected Venue'}</span>
            </div>
            <div>
              <span className="text-neutral-400 font-mono text-[10px] uppercase">Full Address: </span>
              <span className="text-neutral-200 font-inter">{location.formattedAddress}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono text-neutral-400 pt-1">
              <div>
                <span className="text-neutral-500">City: </span>
                <span className="text-neutral-200">{location.city || 'N/A'}</span>
              </div>
              <div>
                <span className="text-neutral-500">State: </span>
                <span className="text-neutral-200">{location.state || 'N/A'}</span>
              </div>
              <div>
                <span className="text-neutral-500">Postal Code: </span>
                <span className="text-neutral-200">{location.postalCode || 'N/A'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 pt-2 border-t border-neutral-800">
              <span>
                Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
              </span>
              <a
                href={location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline flex items-center space-x-1"
              >
                <span>Open Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Location Confirmation Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {!location.confirmed ? (
              <>
                <button
                  type="button"
                  onClick={onConfirmLocation}
                  className="py-3 rounded-2xl bg-gradient-brand text-white font-space font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,59,0,0.4)] hover:brightness-110 transition flex items-center justify-center space-x-2 col-span-1 sm:col-span-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>Confirm Location</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onChangeLocation({ ...location, confirmed: false });
                }}
                className="py-2.5 px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white font-space text-xs transition flex items-center justify-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                <span>Choose Different Location</span>
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* 7. Privacy Notice Banner */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-3 flex items-start space-x-2.5 text-xs text-neutral-400 font-inter">
        <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <span>
          Your location is only used to help our creator reach your shoot location. We never share your location with anyone else.
        </span>
      </div>
    </div>
  );
};
