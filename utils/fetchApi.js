// Demo data layer. The original app called the Bayut RapidAPI, which is no longer available,
// so this module answers the same URLs from a bundled sample dataset (utils/properties.json).
// No API key is needed.
import properties from './properties.json';

export const baseUrl = '/api';

const LOCATIONS = [
  { id: 1, externalID: '5002', name: 'Dubai' },
  { id: 2, externalID: '5001', name: 'Abu Dhabi' },
  { id: 3, externalID: '5003', name: 'Sharjah' },
];

export const fetchApi = async (url) => {
  const u = new URL(url, 'http://local');
  const path = u.pathname.replace(/^\/api/, '');
  const q = Object.fromEntries(u.searchParams);

  if (path.includes('auto-complete')) {
    const term = (q.query || '').toLowerCase();
    return { hits: LOCATIONS.filter((l) => l.name.toLowerCase().includes(term)) };
  }

  if (path.includes('detail')) {
    return properties.find((p) => p.externalID === q.externalID) || properties[0];
  }

  let hits = properties.filter((p) => !q.purpose || p.purpose === q.purpose);
  if (q.priceMin) hits = hits.filter((p) => p.price >= Number(q.priceMin));
  if (q.priceMax) hits = hits.filter((p) => p.price <= Number(q.priceMax));
  if (q.roomsMin) hits = hits.filter((p) => p.rooms >= Number(q.roomsMin));
  if (q.bathsMin) hits = hits.filter((p) => p.baths >= Number(q.bathsMin));
  if (q.areaMax) hits = hits.filter((p) => p.area <= Number(q.areaMax));
  hits = [...hits].sort((a, b) => (q.sort === 'price-asc' ? a.price - b.price : b.price - a.price));
  if (q.hitsPerPage) hits = hits.slice(0, Number(q.hitsPerPage));
  return { hits };
};
