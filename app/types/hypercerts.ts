// app/types/hypercerts.ts

export interface HypercertFractionMetadata {
  id: string;
  name: string;
  description: string;
  external_url?: string; 
  impact_scope: string[];
  impact_timeframe_from: number;
  impact_timeframe_to: number;
  work_timeframe_from: number;
  work_timeframe_to: number;
}

export interface HypercertFraction {
  fraction_id?: string; // Optional: present in contributions query
  metadata: HypercertFractionMetadata | null; 
  units: string; 
}

export interface HypercertData {
  contract: {
    chain_id: number;
  };
  creator_address: string;
  hypercert_id: string;
  fractions: {
    count: number;
    data: HypercertFraction[];
  };
  units: string; 
  totalUnits?: number; 
}

export interface HypercertQueryResponse {
  hypercerts: {
    data: HypercertData[];
  };
} 