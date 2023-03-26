/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Client, Status } from '@googlemaps/google-maps-services-js';
import { inspect } from 'util';

// Create a new Google Maps API client using your API key
const client = new Client({});

// Define a string that may be a coordinate or an address
const query = '45.654795, 1.938118'; // San Francisco, CA

// Call the geocode method with the query string
client
  .geocode({
    params: {
      address: query,
      key: 'AIzaSyDMC_6DlM8RicLOfCH-7Zll1aZUqC5Ir8g', // Replace with your API key
    },
  })
  .then((response) => {
    if (response.data.status === Status.OK) {
      // The query string was a valid address
      console.log(inspect(response.data, false, 3));
      console.log(`${query} is a valid address.`);
    } else if (/^-?\d+\.\d+,-?\d+\.\d+$/.test(query)) {
      // The query string was a valid coordinate
      console.log(`${query} is a valid coordinate.`);
    } else {
      // The query string was not a valid address or coordinate
      console.log(`${query} is not a valid address or coordinate.`);
    }
  })
  .catch((error) => {
    console.log(`Geocode request failed: ${error}`);
  });
