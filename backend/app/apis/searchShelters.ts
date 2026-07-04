import { Request, Response } from "express";

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const PLACES_ENDPOINT = "https://places.googleapis.com/v1/places:searchText";
const GEOCODE_ENDPOINT = "https://maps.googleapis.com/maps/api/geocode/json";
const SEARCH_RADIUS_METERS = 40000;
const SEARCH_TERM = "cat rescue";

const PLACES_FIELD_MASK =
  "places.id,places.displayName,places.formattedAddress,places.location,places.websiteUri,places.editorialSummary,nextPageToken";

const DOG_TERMS = ["dog", "dogs", "canine", "puppy", "puppies", "k9", "k-9"];
const CAT_TERMS = ["cat", "cats", "kitten", "kittens", "feline", "kitty"];

const STRICT_CAT_ONLY = false;

function textHasWord(text: string, terms: string[]) {
  const lower = text.toLowerCase();
  return terms.some((term) =>
    new RegExp(`(^|[^a-z])${term}([^a-z]|$)`).test(lower),
  );
}

function isLikelyDogOnly(text: string) {
  return textHasWord(text, DOG_TERMS) && !textHasWord(text, CAT_TERMS);
}

function shouldKeepShelter(text: string) {
  if (isLikelyDogOnly(text)) return false;
  if (STRICT_CAT_ONLY && !textHasWord(text, CAT_TERMS)) return false;
  return true;
}

const LOCALITY_TYPES = [
  "locality",
  "postal_code",
  "postal_town",
  "sublocality",
  "neighborhood",
  "administrative_area_level_1",
  "administrative_area_level_2",
  "administrative_area_level_3",
];

// Geocodes user's input, meaning it converts it into coordinates
// Also checks whether it is a city or zipcode
async function geocodePlace(query: string) {
  try {
    const url = `${GEOCODE_ENDPOINT}?address=${encodeURIComponent(query)}&components=country:US&key=${GOOGLE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.results?.[0]) {
      const result = data.results[0];
      const types: string[] = result.types ?? [];
      const isLocality = types.some((t: string) => LOCALITY_TYPES.includes(t));
      const loc = result.geometry.location;
      return { latitude: loc.lat, longitude: loc.lng, isLocality };
    }
    console.log("Geocode returned no result:", data.status);
    return null;
  } catch (error) {
    console.log("Geocode error:", error);
    return null;
  }
}

export type ShelterResult = {
  id: string;
  name: string;
  address: string;
  website: string;
  latitude: number;
  longitude: number;
};

// Uses geocodePlace function to find out what data type user inputted (city, zip, or shelter name)
// Ask API for the shelters
// Returns list of shelters after filtering
export async function searchShelters(req: Request, res: Response) {
  if (!GOOGLE_API_KEY) {
    console.log("Missing GOOGLE_MAPS_API_KEY");
    return res.status(500).json({ error: "Missing API key" });
  }

  const { query = "", lat, lng } = req.query as Record<string, string>;
  const trimmed = query.trim();

  const userCoords =
    lat && lng
      ? { latitude: parseFloat(lat), longitude: parseFloat(lng) }
      : null;

  let textQuery = SEARCH_TERM;
  let biasCoords: { latitude: number; longitude: number } | null = null;
  let searchedLocality: string | null = null;

  if (!trimmed) {
    biasCoords = userCoords;
  } else {
    const place = await geocodePlace(trimmed);
    if (place && place.isLocality) {
      biasCoords = { latitude: place.latitude, longitude: place.longitude };
      searchedLocality = trimmed;
    } else {
      textQuery = `${SEARCH_TERM} ${trimmed}`;
    }
  }

  const body: any = { textQuery };
  if (biasCoords) {
    body.locationBias = {
      circle: {
        center: {
          latitude: biasCoords.latitude,
          longitude: biasCoords.longitude,
        },
        radius: SEARCH_RADIUS_METERS,
      },
    };
  }

  const allPlaces: any[] = [];
  let pageToken: string | null = null;
  let pagesFetched = 0;

  // Get shelters from Google API
  try {
    do {
      const requestBody: Record<string, unknown> = pageToken ? { ...body, pageToken } : body;
      const response: globalThis.Response = await fetch(PLACES_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_API_KEY,
          "X-Goog-FieldMask": PLACES_FIELD_MASK,
        },
        body: JSON.stringify(requestBody),
      });

      const data: any = await response.json();

      if (!response.ok) {
        console.log("Places API error:", data);
        if (allPlaces.length === 0) {
          return res
            .status(500)
            .json({ error: "Places API error", detail: data });
        }
        break;
      }

      if (data.places) {
        allPlaces.push(...data.places);
      }
      pageToken = data.nextPageToken ?? null;
      pagesFetched += 1;
    } while (pageToken && pagesFetched < 3);

    // Filter shelters and return them
    const shelters: ShelterResult[] = allPlaces
      .filter((place: any) => {
        const text = `${place.displayName?.text ?? ""} ${place.editorialSummary?.text ?? ""}`;
        return shouldKeepShelter(text);
      })
      .map((place: any) => ({
        id: place.id,
        name: place.displayName?.text ?? "Unknown shelter",
        address: place.formattedAddress ?? "",
        website: place.websiteUri ?? "",
        latitude: place.location?.latitude ?? 0,
        longitude: place.location?.longitude ?? 0,
      }));

    res.json({ shelters, searchedLocality });
  } catch (error) {
    console.log("Shelter fetch error:", error);
    res.status(500).json({ error: "Shelter fetch failed" });
  }
}