import { ZodTypeAny, z } from 'zod';

export const numericString = (schema: ZodTypeAny) =>
  z.preprocess((a) => {
    if (typeof a === 'string') {
      return parseInt(a, 10);
    } else if (typeof a === 'number') {
      return a;
    } else {
      return undefined;
    }
  }, schema);

export function sluggify(input: string): string {
  return input
    ?.toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-'); // Replace multiple hyphens with a single hyphen
}

export function desluggify(input: string): string {
  return input
    .replace(/-/g, ' ') // Replace hyphens with spaces
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .trim(); // Remove leading and trailing spaces
}

export function capitalizeText(input: string, capitalizeOption: 'firstWord' | 'allWords'): string {
  if (capitalizeOption === 'firstWord') {
    return input.replace(/^(.)/, (_, match) => match.toUpperCase());
  } else if (capitalizeOption === 'allWords') {
    return input.replace(/\b\w/g, (match) => match.toUpperCase());
  } else {
    return input; // Return original input if option is not recognized
  }
}

export function getInitials(input: string): string {
  // Split the input string into words
  const words = input.split(' ');

  // Initialize an empty string to store the initials
  let initials = '';

  // Iterate through the words and add the first character of each word to the initials string
  for (const word of words) {
    if (word.length > 0) {
      initials += word[0].toUpperCase();
    }
  }

  return initials;
}

export function isImageOrVideo(src: string): 'image' | 'video' | null {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];
  const videoExtensions = ['mp4', 'webm', 'ogg', 'mov'];

  const extension = src.split('.').pop()?.toLowerCase();

  if (extension && imageExtensions.includes(extension)) {
    return 'image';
  } else if (extension && videoExtensions.includes(extension)) {
    return 'video';
  } else {
    return null;
  }
}

export function formatNumberWithOneDecimalPlace(input: number): string {
  if (input) {
    const numberString = input.toString();
    const decimalIndex = numberString.indexOf('.');

    if (decimalIndex !== -1 && numberString.length - decimalIndex === 2) {
      // Add a trailing zero if there is exactly one decimal place
      return numberString + '0';
    }

    return numberString;
  }
  return `${input}`;
}

export function formatPrice(input: number): string {
  const res = formatNumberWithOneDecimalPlace(input);
  return res;
}

export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log('User location:', [latitude, longitude]);
          resolve([latitude, longitude]);
        },
        (error) => {
          console.error('Error getting user location:', error.message);
          reject(error);
        }
      );
    } else {
      console.error('Geolocation is not supported by your browser');
      reject(new Error('Geolocation not supported'));
    }
  });
};

const degToRad = (deg: any) => deg * (Math.PI / 180);

export const getUserDistanceOffsetInKm = (userLocation: string[]) => {
  const hostLocation = process.env.NEXT_PUBLIC_HOST_LOCATION?.split(',');

  if (hostLocation && hostLocation.length === 2) {
    const [hostLatitude, hostLongitude] = hostLocation.map(parseFloat);
    const [userLatitude, userLongitude] = userLocation.map(parseFloat);

    const earthRadius = 6371;
    const dLat = degToRad(userLatitude - hostLatitude);
    const dLon = degToRad(userLongitude - hostLongitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degToRad(hostLatitude)) *
        Math.cos(degToRad(userLatitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    console.log('Distance between user and host:', distance, 'km');
    return distance;
  } else {
    console.error('Invalid host location');
    throw new Error('Invalid host location');
  }
};

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface Geometry {
  location: {
    lat: number;
    lng: number;
  };
  location_type: string;
  viewport: {
    south: number;
    west: number;
    north: number;
    east: number;
  };
}

export interface AddressObject {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  types: string[];
}

export function extractAddressComponents(addressObject: AddressObject) {
  let country: string | null = null;
  let state: string | null = null;
  let city: string | null = null;
  let line1: string | null = null;

  for (const component of addressObject.address_components) {
    const types = component.types;
    const longName = component.long_name;

    if (types.includes('country')) {
      country = longName;
    } else if (types.includes('administrative_area_level_1') || types.includes('political')) {
      state = longName;
    } else if (types.includes('locality') || types.includes('political')) {
      city = longName;
    } else if (types.includes('street_number') || types.includes('route')) {
      if (line1) {
        line1 += ' ' + longName;
      } else {
        line1 = longName;
      }
    }
  }

  return { country, state, city, line1 };
}
