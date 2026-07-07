import type { NextAuthConfig } from "next-auth";

// Edge-safe base config (no bcrypt/Prisma) — shared by the full server config and by
// middleware, which runs on the Edge runtime and cannot load Node-only providers.
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
};
