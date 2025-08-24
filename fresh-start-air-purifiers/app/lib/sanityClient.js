// app/lib/sanityClient.js
import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: 'fz7ifike',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: true,
});