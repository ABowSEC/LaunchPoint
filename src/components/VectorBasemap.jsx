import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "@maplibre/maplibre-gl-leaflet";
import "maplibre-gl/dist/maplibre-gl.css";

// OpenFreeMap is free for commercial use (MIT, no key, no request limits),
// unlike the CARTO basemaps it replaced. Fiord is their dark navy style.
const STYLE_URL = "https://tiles.openfreemap.org/styles/fiord";

const ATTRIBUTION =
  '<a href="https://openfreemap.org">OpenFreeMap</a> &copy; <a href="https://www.openmaptiles.org/">OpenMapTiles</a> ' +
  'data from <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

/**
 * Dark vector basemap for react-leaflet maps. Drop inside a MapContainer
 * in place of a TileLayer; markers, popups and polylines are unaffected.
 */
export default function VectorBasemap() {
  const map = useMap();

  useEffect(() => {
    const layer = L.maplibreGL({ style: STYLE_URL, attribution: ATTRIBUTION });
    layer.addTo(map);
    return () => {
      map.removeLayer(layer);
    };
  }, [map]);

  return null;
}
