import jwtDecode from 'jwt-decode'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { Session, User, UserJWT } from '@/api'

export type AuthState = {
  session: Session
  user: User | null
  isAuth: boolean
  is2FA: boolean
  logout: () => void
  login: (session: Session) => void
}

export const guestSession: Session = {
  access_token: '',
  refresh_token: '',
}

export const useAuth = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        session: guestSession,
        user: null,
        isAuth: false,
        is2FA: false,
        logout: () => set(() => ({ session: guestSession, user: null, isAuth: false, is2FA: false })),
        login: (session: Session) => {
          try {
            const user = jwtDecode<UserJWT>(session.access_token)

            if (user) {
              set({ session, user, isAuth: true, is2FA: user.otp })
            }
          } catch {
            /* empty */
          }
        },
      }),
      { name: 'rumors.auth', version: 1 }
    )
  )
)
