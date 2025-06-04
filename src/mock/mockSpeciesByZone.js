/**
 * File: src/data/mockSpeciesByZone.js
 * Description:
 * Mock data that maps dive zones to a list of species found in each zone.
 * Used for the "Search by Zone" feature in the app to simulate real data.
 * Each species object contains a name, ID, and associated image.
 */

const mockSpeciesByZone = {
  'Nusa Penida': [
    {
      id: 1,
      name: 'Clownfish',
      image: {uri: 'clownfish'}, // refers to drawable/clownfish.jpg
    },
    {
      id: 2,
      name: 'Unknown Fish',
      image: {uri: 'placeholder'}, // refers to drawable/placeholder.png
    },
  ],
};

export {mockSpeciesByZone};
