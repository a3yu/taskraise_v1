export type searchQuery = {
  campaigns: {
    amt_raised: number;
    amt_goal: number;
    campaign_name: string;
  };
  created_at: string;
  delivery_type: "REMOTE" | "LOCAL" | null;
  id: number;
  location: unknown;
  location_text: string | null;
  orders_count: number;
  campaign: number;
  organization: number;
  organizations: {
    org_name: string;
  };
  price: number;
  service_description: string;
  service_title: string;
  thumbnail_path: string;
  service_type: string;
};

export type orderQuery = {
  created_at: string;
  customer_id: string;
  customer_username: string;
  hours: number | null;
  id: number;
  order_details: string;
  org_id: number;
  payment_intent: string | null;
  price: number;
  status: "REQUESTED" | "DISPUTED" | "COMPLETED" | "REJECTED" | "ONGOING";
  units: number | null;
  profiles: {
    username: string;
  };
};

export type orderQueryUser = {
  created_at: string;
  customer_id: string;
  customer_username: string;
  hours: number | null;
  id: number;
  order_details: string;
  org_id: number;
  payment_intent: string | null;
  price: number;
  status: "REQUESTED" | "DISPUTED" | "COMPLETED" | "REJECTED" | "ONGOING";
  units: number | null;
  service: number;
  organizations: {
    org_name: string;
  };
};
