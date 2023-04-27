import { Client } from '@googlemaps/google-maps-services-js';

export const GoogleMapsClientProvider = {
  provide: Client,
  useValue: new Client({}),
};
