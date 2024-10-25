import { postTripDocs } from './postTripDocs.js';
import { deleteTripDocs } from './deleteTripDocs.js';
import { getTripDocs } from './getTripDocs.js';
import { listTripsDocs } from './listTripsDoc.js';

export const tripDocs = {
  ...postTripDocs,
  ...getTripDocs,
  ...deleteTripDocs,
  ...listTripsDocs
};
