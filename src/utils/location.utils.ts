import axios from 'axios';

/**
 * Extract coordinates from a Google Maps link using Google Places API.
 * @param {string} link - The Google Maps link.
 * @param {string} apiKey - Your Google Maps API key.
 * @returns {Promise<{ lat: number, lng: number }>} - The latitude and longitude.
 */
export async function getCoordinatesFromLink(link: string): Promise<{ lat: number, lng: number }> {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    let expandedLink = link;

    // Step 1: Expand shortened URLs
    if (link.includes('goo.gl')) {
        try {
            const response = await axios.get(link, { maxRedirects: 5 });
            expandedLink = response.request.res.responseUrl;
        } catch (error:any) {
            throw new Error(`Error expanding shortened URL: ${error.message}`);
        }
    }
    expandedLink= decodeURIComponent(expandedLink);
    // // Step 2: Extract coordinates directly if available
    // Pattern: !3d<lat>!4d<lng>
    const directCoordinatesRegex = /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/;
    const directCoordinatesMatch = expandedLink.match(directCoordinatesRegex);

    if (directCoordinatesMatch) {
        const rawCoords={
            lat:parseFloat(directCoordinatesMatch[1]),
            lng:parseFloat(directCoordinatesMatch[2])
        }
        let lat:string,lng:string;
        // Pattern: place/<place_title>
        const placeTitleRegex = /place\/([^\/\?]*)/;
        const placeTitleMatch = expandedLink.match(placeTitleRegex);

        if (placeTitleMatch && placeTitleMatch[1]) {
            const query = placeTitleMatch[1];

            try {
                const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
                    params: {
                        query,
                        key: apiKey,
                    },
                });

                if (response.data.status !== 'OK') {
                    throw new Error(`Places Text Search API Error: ${response.data.status}`);
                }

                const location = response.data.results[0].geometry.location;
                return { lat: location.lat, lng: location.lng };
            } catch (error:any) {
                // throw new Error(`Error fetching coordinates: ${error.message}`);
            }
        }
        else {

            return rawCoords;
        }
    }

    // Step 3: Extract place ID from the link
    // Pattern: /g/<place_id>>
    const placeIdRegex = /g\/([^?&>]+)/;    ;
    const placeIdMatch = expandedLink.match(placeIdRegex);

    if (placeIdMatch && placeIdMatch[0]) {
        const placeId = placeIdMatch[0];

        try {
            const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
                params: {
                    place_id: placeId,
                    key: apiKey,
                },
            });

            if (response.data.status !== 'OK') {
                throw new Error(`Places API Error: ${response.data.status}`);
            }

            const location = response.data.result.geometry.location;
            return { lat: location.lat, lng: location.lng };
        } catch (error:any) {
            
        }
    }



    // Step 4: Fallback to query resolution using Places Text Search API
    const queryRegex = /place\/([^\/\?]*)/;
    const queryMatch = expandedLink.match(queryRegex);

    if (queryMatch && queryMatch[1]) {
        const query = queryMatch[1].replace('+', ' ');

        try {
            const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
                params: {
                    query,
                    key: apiKey,
                },
            });

            if (response.data.status !== 'OK') {
                throw new Error(`Places Text Search API Error: ${response.data.status}`);
            }

            const location = response.data.results[0].geometry.location;
            return { lat: location.lat, lng: location.lng };
        } catch (error:any) {
            // throw new Error(`Error fetching coordinates: ${error.message}`);
        }
    }

    const coordinatesRegex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const coordinatesMatch = expandedLink.match(coordinatesRegex);

    if (coordinatesMatch) {
        const lat = parseFloat(coordinatesMatch[1]);
        const lng = parseFloat(coordinatesMatch[2]);
        return { lat, lng };
    }

    // Use geocoding api to get coordinates
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: expandedLink,
                key: apiKey,
            },
        });

        if (response.data.status !== 'OK') {
            throw new Error(`Geocoding API Error: ${response.data.status}`);
        }

        const location = response.data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
    } catch (error:any) {
    }

    throw new Error('Unable to extract coordinates from the provided link.');
}
