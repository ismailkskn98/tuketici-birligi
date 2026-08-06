import { ProvinceMapClient } from "./province-map-client";

export function ProvinceMapSection({ data, compact = false }) {
  return <ProvinceMapClient compact={compact} data={data} />;
}

