// File: src/data/mapHtml.js
// Description:
// Contains the raw HTML string used to render a Leaflet map inside a WebView.
// The map is initialized with dive site markers and uses OpenStreetMap tiles.

const leafletHtml = `
<!DOCTYPE html>
<html>
  <head>
    <!-- Ensures proper scaling on mobile devices -->
    <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
    
    <!-- Basic CSS to make map fill the screen -->
    <style>
      html, body, #map { height: 100%; margin: 0; padding: 0; }
    </style>
    
    <!-- Leaflet CSS and JS from CDN -->
    <link
      rel="stylesheet"
      href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
    />
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
  </head>
  <body>
    <!-- Map container -->
    <div id="map"></div>
    <script>
      // Initialize the map centered on Indonesia
      var map = L.map('map').setView([-2, 118], 5);

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © OpenStreetMap contributors'
      }).addTo(map);

      // Hardcoded list of Indonesian dive sites with coordinates
      const diveSites = [
        { name: "Nusa Penida", lat: -8.7275, lng: 115.5444 },
        { name: "Lembeh Strait", lat: 1.4407, lng: 125.2292 },
        { name: "Raja Ampat", lat: -0.2333, lng: 130.5167 },
        { name: "Komodo", lat: -8.551, lng: 119.489 },
        { name: "Bunaken", lat: 1.6257, lng: 124.7574 }
      ];

      // Add a marker and popup for each dive site
      diveSites.forEach(site => {
        L.marker([site.lat, site.lng])
          .addTo(map)
          .bindPopup(site.name);
      });
    </script>
  </body>
</html>
`;

export default leafletHtml;
