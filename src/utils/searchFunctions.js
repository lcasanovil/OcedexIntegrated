/**
 * File: utils/searchFunctions.js
 * Description:
 * Helper functions for zone-based and species-based filtering.
 * Used in the Search screen to match species and dive sites.
 * Supports bidirectional lookup between species and locations.
 */

import speciesCatalog from '../data/speciesCatalog';
import diveSites from '../data/diveSites';

/**
 * Given a species name, returns the list of dive sites
 * that are likely associated with that species' location.
 *
 * @param {string} speciesName - Common name of the species
 * @returns {Array} - List of dive site objects
 */
export function findSitesForSpecies(speciesName) {
  const species = speciesCatalog.find(
    s => s.name.toLowerCase() === speciesName.toLowerCase(),
  );
  if (!species) return [];

  // Match dive sites that include the species location string
  return diveSites.filter(site =>
    site.name.toLowerCase().includes(species.location.toLowerCase()),
  );
}

/**
 * Given a dive site name, returns the species
 * that are associated with the site's location.
 *
 * @param {string} siteName - Name of the dive site
 * @returns {Array} - List of matching species
 */
export function findSpeciesForSite(siteName) {
  return speciesCatalog.filter(species =>
    species.location.toLowerCase().includes(siteName.toLowerCase()),
  );
}
