import type { SessionMember } from "$interfaces/session/member.interface"
import type { MusicSessionQueue } from "$interfaces/session/queue.interface"
import type { MusicSession } from "$interfaces/session/session.interface"

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      session: {
        Row: {
          id: number
          name: 'session'
          data: MusicSession
        }
      },
      session_member: {
        Row: {
          id: number
          name: 'session_member'
          data: SessionMember
        }
      },
      session_queue: {
        Row: {
          id: number
          name: 'session_queue'
          data: MusicSessionQueue
        }
      },
    }
  }
}