/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Client, Status, TravelMode, UnitSystem } from '@googlemaps/google-maps-services-js';

// Define the two coordinates
const origin = 'Toulouse'; // San Francisco, CA
const destination = '45.654795, 1.938118'; // New York, NY

// Create a new Google Maps API client using your API key
const client = new Client({});
client
  .directions({
    params: {
      origin,
      destination,
      mode: TravelMode.walking,
      units: UnitSystem.metric,
      key: 'AIzaSyDMC_6DlM8RicLOfCH-7Zll1aZUqC5Ir8g', // Replace with your API key
    },
  })
  .then((response) => {
    console.log(response.data);
    if (response.data.status === Status.OK) {
      const distance = response.data.routes[0].legs[0].distance.text;
      console.log(response.data.routes[0].legs);
      console.log(`The distance between ${origin} and ${destination} is ${distance}.`);
    } else {
      console.log(`Directions request failed: ${response.data.status}`);
    }
  })
  .catch((error) => {
    console.log(`Directions request failed: ${error}`);
  });
