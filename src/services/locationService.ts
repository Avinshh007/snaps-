import { EventLocation } from '../types';

export interface GeocodeResult {
  venueName: string;
  formattedAddress: string;
  placeId: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export class LocationService {
  /**
   * Generates official Google Maps URL for exact GPS coordinates
   */
  static generateGoogleMapsUrl(latitude: number, longitude: number): string {
    const latStr = latitude.toFixed(6);
    const lngStr = longitude.toFixed(6);
    return `https://www.google.com/maps?q=${latStr},${lngStr}`;
  }

  /**
   * Reverse Geocoding via Google Maps Geocoder API with fallback to Nominatim
   */
  static async reverseGeocode(lat: number, lng: number): Promise<GeocodeResult> {
    const fallbackResult: GeocodeResult = {
      venueName: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      formattedAddress: `Selected Shoot Location (${lat.toFixed(6)}, ${lng.toFixed(6)})`,
      placeId: `pin-${Date.now()}`,
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      postalCode: '500033',
    };

    // 1. Try Google Maps Geocoder if available on window
    if (typeof window !== 'undefined' && (window as any).google?.maps?.Geocoder) {
      try {
        const geocoder = new (window as any).google.maps.Geocoder();
        const response = await new Promise<any>((resolve, reject) => {
          geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
            if (status === 'OK' && results && results[0]) {
              resolve(results);
            } else {
              reject(status);
            }
          });
        });

        if (response && response[0]) {
          const first = response[0];
          let venueName = first.address_components?.[0]?.long_name || 'Selected Shoot Location';
          let city = '';
          let state = '';
          let country = '';
          let postalCode = '';

          for (const comp of first.address_components || []) {
            if (comp.types.includes('locality') || comp.types.includes('administrative_area_level_2')) {
              city = comp.long_name;
            }
            if (comp.types.includes('administrative_area_level_1')) {
              state = comp.long_name;
            }
            if (comp.types.includes('country')) {
              country = comp.long_name;
            }
            if (comp.types.includes('postal_code')) {
              postalCode = comp.long_name;
            }
            if (comp.types.includes('establishment') || comp.types.includes('point_of_interest')) {
              venueName = comp.long_name;
            }
          }

          return {
            venueName,
            formattedAddress: first.formatted_address || fallbackResult.formattedAddress,
            placeId: first.place_id || fallbackResult.placeId,
            city: city || 'Hyderabad',
            state: state || 'Telangana',
            country: country || 'India',
            postalCode: postalCode || '500033',
          };
        }
      } catch (err) {
        console.warn('Google Maps Geocoder error, using Nominatim fallback:', err);
      }
    }

    // 2. OpenStreetMap / Nominatim Fallback API
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (resp.ok) {
        const data = await resp.json();
        const addr = data.address || {};
        const venue =
          data.name ||
          addr.amenity ||
          addr.building ||
          addr.shop ||
          addr.leisure ||
          addr.road ||
          `Shoot Site (${lat.toFixed(4)}, ${lng.toFixed(4)})`;

        return {
          venueName: venue,
          formattedAddress: data.display_name || fallbackResult.formattedAddress,
          placeId: `osm-${data.place_id || Date.now()}`,
          city: addr.city || addr.town || addr.suburb || 'Hyderabad',
          state: addr.state || 'Telangana',
          country: addr.country || 'India',
          postalCode: addr.postcode || '500033',
        };
      }
    } catch (e) {
      console.warn('Nominatim reverse geocode fetch notice:', e);
    }

    return fallbackResult;
  }

  /**
   * Requests HTML5 Geolocation API with high accuracy
   */
  static getCurrentGPSLocation(): Promise<{ lat: number; lng: number; accuracy: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new Error('Geolocation is not supported by your browser.'));
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: Math.round(pos.coords.accuracy),
          });
        },
        (err) => reject(err),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }
}
