import type { Strudel } from "./strudels.types";

export type SessionRole = "host" | "co-author" | "viewer";

export interface Participant {
  id: string;
  user_id?: string;
  display_name: string;
  role: SessionRole;
  is_anonymous: boolean;
  joined_at: string;
}

export interface Session {
  id: string;
  host_id: string;
  strudel_id?: string;
  code: string;
  is_active: boolean;
  participants: Participant[];
  created_at: string;
  updated_at: string;
}

export interface CreateSessionRequest {
  strudel_id?: string;
  code?: string;
}

export interface InviteRequest {
  role: SessionRole;
  max_uses?: number;
  expires_in_hours?: number;
}

export interface Invite {
  token: string;
  session_id: string;
  role: SessionRole;
  max_uses: number;
  uses: number;
  expires_at: string;
  created_at: string;
}

export interface TransferSessionRequest {
  session_id: string;
  title: string;
  description?: string;
  tags?: string[];
  is_public?: boolean;
}

export interface JoinSessionRequest {
  invite_token: string;
  display_name?: string;
}

export interface SessionsResponse {
  sessions: Session[];
  total: number;
}

export interface SessionResponse {
  session: Session;
}

export interface InviteResponse {
  invite: Invite;
  invite_url: string;
}

export interface TransferResponse {
  strudel: Strudel;
}
