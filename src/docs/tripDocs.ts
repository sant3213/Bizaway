import { deleteTripDocs } from './deleteTripDocs.js';
import { getTripDocs } from './getTripDocs.js';
import { listTripsDocs } from './tripsDoc.js';

export const tripDocs = {
  ...getTripDocs,
  ...deleteTripDocs,
  ...listTripsDocs
};
