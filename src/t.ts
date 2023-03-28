import { Client, Status, TravelMode, UnitSystem } from '@googlemaps/google-maps-services-js';

const client = new Client({});

// temp hardcoded (will be change)
const GOOGLE_API_KEY = 'AIzaSyDMC_6DlM8RicLOfCH-7Zll1aZUqC5Ir8g';

async function travelBetween(): Promise<any | null> {
  const response = await client.directions({
    params: {
      origin: 'Paris' ?? '',
      destination: 'Paris' ?? '',
      mode: TravelMode.driving,
      units: UnitSystem.metric,
      key: GOOGLE_API_KEY,
    },
  });

  if (response.data.status === Status.OK) {
    const duration = response.data.routes[0].legs[0].duration.value;
    return { duration };
  }
  return null;
}

travelBetween()
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
