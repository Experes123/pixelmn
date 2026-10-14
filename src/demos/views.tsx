import type { ComponentType } from "react";
import { CodeSite, CodeAdmin } from "./code";
import { BarberSite, BarberAdmin } from "./barber";
import { CompanySite, CompanyAdmin } from "./company";
import { RestaurantSite, RestaurantAdmin } from "./restaurant";
import { ShopSite, ShopAdmin } from "./shop";
import { PcSite, PcAdmin } from "./pccafe";
import { StreamSite, StreamAdmin } from "./stream";

export const views: Record<string, { Site: ComponentType; Admin: ComponentType }> = {
  code: { Site: CodeSite, Admin: CodeAdmin },
  barber: { Site: BarberSite, Admin: BarberAdmin },
  company: { Site: CompanySite, Admin: CompanyAdmin },
  restaurant: { Site: RestaurantSite, Admin: RestaurantAdmin },
  shop: { Site: ShopSite, Admin: ShopAdmin },
  pccafe: { Site: PcSite, Admin: PcAdmin },
  stream: { Site: StreamSite, Admin: StreamAdmin },
};
