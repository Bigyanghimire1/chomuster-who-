# Chomu Who? — User Setup & Deployment Checklist ($0/Month Stack)

Everything in the codebase is ready. When you are ready to switch online multiplayer from the Trystero P2P fallback to **Option B (Supabase Free + LiveKit Cloud Build Free)**, complete these steps once:

---

## 1. Supabase Free Setup (~5 minutes)

1. Go to [supabase.com](https://supabase.com) and create a **Free** project (no credit card required).
2. **Enable Anonymous Sign-Ins**:
   - In Supabase Dashboard -> **Authentication** -> **Providers** -> **Anonymous Sign-Ins** -> enable it.
3. **Run the Database Migration**:
   - Open **SQL Editor** in Supabase Dashboard.
   - Paste the entire contents of `supabase/migrations/001_chomu_who_schema.sql` and click **Run**.
4. **Deploy the 5 Edge Functions**:
   - Install Supabase CLI (or use `npx supabase`):
     ```bash
     npx supabase login
     npx supabase link --project-ref <YOUR_PROJECT_REF>
     npx supabase functions deploy create-room
     npx supabase functions deploy join-room
     npx supabase functions deploy rejoin-room
     npx supabase functions deploy room-action
     npx supabase functions deploy mint-livekit-token
     ```

---

## 2. LiveKit Cloud Build Free Setup (~3 minutes)

1. Go to [cloud.livekit.io](https://cloud.livekit.io) and create a **Build (Free)** project.
2. Copy your:
   - `LIVEKIT_URL` (starts with `wss://...`)
   - `LIVEKIT_API_KEY`
   - `LIVEKIT_API_SECRET`
3. Set them as **Supabase Edge Function Secrets** (never in frontend `.env`!):
   ```bash
   npx supabase secrets set LIVEKIT_URL=wss://your-project.livekit.cloud LIVEKIT_API_KEY=your_key LIVEKIT_API_SECRET=your_secret
   ```

---

## 3. Frontend Environment Variables

1. For local testing, copy `.env.example` to `.env.local`:
   ```env
   VITE_MULTIPLAYER_BACKEND=supabase
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
2. For production hosting (Vercel / Netlify / Cloudflare Pages), add those exact 3 `VITE_*` variables in your hosting dashboard and redeploy.
3. Keep `VITE_MULTIPLAYER_BACKEND=trystero` anytime you want to fall back to peer-to-peer mode.

---

## 4. Ongoing Free-Tier Notes

- **7-day inactivity pause (Supabase Free)**: If no one plays for 7 days, Supabase pauses the project. Click **Restore** in the Supabase Dashboard to wake it up in ~1 minute.
- **Emergency media pause**: If you ever approach the LiveKit Build Free monthly quota, set `LIVEKIT_QUOTA_EXHAUSTED=true` in Supabase secrets — gameplay, roles, voting, and chat will continue working without media.
