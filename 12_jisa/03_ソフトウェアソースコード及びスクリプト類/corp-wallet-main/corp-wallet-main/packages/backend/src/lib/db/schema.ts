export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      credential: {
        Row: {
          id: number;
          format: string;
          vc: string;
          manifest: Json;
          type: string[];
          credentialSubject: Json;
          vcHistory: Json[];
          relatedTransactions: Json[];
          credentialID: string;
        };
        Insert: {
          id?: number;
          format: string;
          vc: string;
          manifest: Json;
          type: string[];
          credentialSubject: Json;
          vcHistory: Json[];
          relatedTransactions: Json[];
          credentialID?: string;
        };
        Update: {
          id?: number;
          format?: string;
          vc?: string;
          manifest?: Json;
          type?: string[];
          credentialSubject?: Json;
          vcHistory?: Json[];
          relatedTransactions?: Json[];
          credentialID?: string;
        };
      };
      key: {
        Row: {
          id: number;
          publicJwk: Json;
          privateJwk: Json | null;
        };
        Insert: {
          id?: number;
          publicJwk: Json;
          privateJwk?: Json | null;
        };
        Update: {
          id?: number;
          publicJwk?: Json;
          privateJwk?: Json | null;
        };
      };
      transaction: {
        Row: {
          id: number;
          transactionID: string;
          title: string;
          status: string;
          updatedAt: string | null;
          vendor: Json;
          industryAssociation: Json;
          theSmallAndMediumEnterpriseAgency: Json;
          maker: string;
        };
        Insert: {
          id?: number;
          transactionID?: string;
          title: string;
          status: string;
          updatedAt?: string | null;
          vendor: Json;
          industryAssociation: Json;
          theSmallAndMediumEnterpriseAgency: Json;
          maker: string;
        };
        Update: {
          id?: number;
          transactionID?: string;
          title?: string;
          status?: string;
          updatedAt?: string | null;
          vendor?: Json;
          industryAssociation?: Json;
          theSmallAndMediumEnterpriseAgency?: Json;
          maker?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
