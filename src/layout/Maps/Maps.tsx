import { useEffect, useState } from "react";
import {
  Container as MapDiv,
  Marker,
  NaverMap,
  useNavermaps,
} from "react-naver-maps";

interface MapProps {
  address: string;
}

const Maps = ({ address }: MapProps) => {
  const navermaps = useNavermaps();
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!address || !navermaps?.Service) return;

    navermaps.Service.geocode(
      { query: address },
      (status: any, response: any) => {
        if (status !== navermaps.Service.Status.OK) {
          console.error("Geocoding failed:", status);
          return;
        }

        const result = response?.v2?.addresses?.[0];
        if (!result) {
          console.error("No geocoding result");
          return;
        }

        setCoords({
          lat: parseFloat(result.y),
          lng: parseFloat(result.x),
        });
      }
    );
  }, [address, navermaps]);

  if (!coords) {
    return <div style={{ width: "100%", height: "300px" }}>지도를 불러오는 중...</div>;
  }

  return (
    <MapDiv style={{ width: "100%", height: "300px" }}>
      <NaverMap
        defaultCenter={new navermaps.LatLng(coords.lat, coords.lng)}
        defaultZoom={16}
      >
        <Marker position={new navermaps.LatLng(coords.lat, coords.lng)} />
      </NaverMap>
    </MapDiv>
  );
};

export default Maps;