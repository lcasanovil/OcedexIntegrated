/**
 * File: mock-model/mockZonesBySpecies.js
 * Description:
 * Mock data mapping each species to a list of dive zones where it can be found.
 * Used for the "Search by Species" feature in the app.
 * Each zone includes an ID, name, location, and a flag to optionally open the map.
 */

export const mockZonesBySpecies = {
  Clownfish: [
    {
      id: 1,
      name: 'Nusa Penida',
      location: 'Bali, Indonesia',
      openMap: true, // This zone opens the map when tapped
    },
    {
      id: 2,
      name: 'Tulamben',
      location: 'Bali, Indonesia',
      openMap: false,
    },
    {
      id: 3,
      name: 'Bunaken',
      location: 'North Sulawesi, Indonesia',
      openMap: false,
    },
  ],

  'Manta Ray': [
    {
      id: 4,
      name: 'Manta Point',
      location: 'Nusa Penida, Indonesia',
      openMap: false,
    },
    {
      id: 5,
      name: 'Komodo National Park',
      location: 'Flores, Indonesia',
      openMap: false,
    },
  ],

  'Ribbon Eel': [
    {
      id: 6,
      name: 'Amed',
      location: 'Bali, Indonesia',
      openMap: false,
    },
    {
      id: 7,
      name: 'Padang Bai',
      location: 'Bali, Indonesia',
      openMap: false,
    },
  ],
};
