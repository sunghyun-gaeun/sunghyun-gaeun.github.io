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
    if (!address) return;
    if (!(window as any).naver?.maps?.Service) {
      console.error("Naver Maps API is not ready");
      return;
    }

    const naverObj = (window as any).naver;

    naverObj.maps.Service.geocode({ query: address }, (status: any, response: any) => {
      if (status === naverObj.maps.Service.Status.OK) {
        const result = response.v2.addresses[0];
        if (result) {
          setCoords({
            lat: parseFloat(result.y),
            lng: parseFloat(result.x),
          });
        }
      } else {
        console.error("Geocoding failed:", status);
      }
    });
  }, [address]);

  if (!coords) {
    return (
      <MapDiv style={{ width: "100%", height: "300px" }}>
        <div style={{ padding: "1rem", textAlign: "center" }}>지도를 불러오는 중...</div>
      </MapDiv>
    );
  }

  return (
    <MapDiv style={{ width: "100%", height: "300px" }}>
      <NaverMap
        defaultCenter={new navermaps.LatLng(coords.lat, coords.lng)}
        defaultZoom={18}
        draggable={false}
        pinchZoom={false}
        scrollWheel={false}
        keyboardShortcuts={false}
      >
        <Marker position={new navermaps.LatLng(coords.lat, coords.lng)} />
      </NaverMap>
    </MapDiv>
  );
};

export default Maps;
