// File: src/data/infoText.js
// Description:
// Contains static explanatory text blocks for each tab in the app.
// These are used to provide contextual information when the user taps on the info icon in each screen.

export const infoTexts = {
  myocedex: `This is your personal catalog of species.
Every time you upload a photo and the app identifies a new fish, it gets added here.
You can browse your discoveries and track your progress.`,

  upload: `Upload a photo from your gallery to identify a fish species using the app's offline model.
If the species is recognized and not yet in your catalog, it will be added as a new discovery.

You can also synchronize with your dive computer to retrieve dive logs and link a depth/timestamp to the photo —
helping you remember where and when the sighting occurred.`,

  search: `Use this tab to explore all species available in the app.

Search by species name to find where that fish can be seen,
or search by location to discover what species live in a particular dive site.

Great for planning your dives or learning more about marine life.`,

  map: `Browse a map of available dive sites.
In future versions, this tab will help you see which regions are connected to your discoveries,
and help plan your next dive based on species distributions.`,

  profile: `Check your progress here.
You'll see how many species you've discovered out of the total catalog.
You can also reset your discoveries and start over if needed.`,
};
