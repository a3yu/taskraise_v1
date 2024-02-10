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
};
