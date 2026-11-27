# Chomu Who? — $0/Month Zero-Cost Architecture Reference

> **Purpose**: Practical engineering reference for running **Chomu Who?** online multiplayer (real-time game state + WebRTC audio/video) at **$0/month** across free-tier infrastructure, with offline **Pass & Play** as an always-available zero-dependency fallback.

---

## 1. $0/Month Architecture Overview

The system separates **authoritative game state**, **media transport**, **static hosting**, and **offline play** so no single service bears unnecessary load or cost:

| Layer | Service & Tier | Responsibility | Free-Tier Limits |
| :--- | :--- | :--- | :--- |
| **Frontend Hosting** | **Vercel Free (Hobby)** | Serves static React + Vite SPA (`dist/`) with SPA fallback rewrites (`vercel.json`). Zero SSR/compute needed. | 100 GB bandwidth / month |
| **Backend, Auth & State** | **Supabase Free** | Postgres + strict RLS (`rooms`, `room_players`, `room_player_credentials`, `player_secrets`, `room_round_secrets`, `votes`, `lobby_chat`), Anonymous Auth, Edge Functions (Deno) for authoritative transitions & LiveKit JWT minting, and Realtime for state/chat sync. | 500 MB DB, 2 GB egress, 50,000 MAU, 500K Edge Function invocations / month; **pauses after 7 days inactivity** |
| **WebRTC Audio / Video** | **LiveKit Cloud (Build Free)** | Managed SFU for reliable NAT traversal across mobile/cellular networks with simulcast + `AdaptiveStream`. | **5,000 participant-minutes / month**, **50 GB egress / month** |
| **Offline Fallback** | **Local Pass & Play (PWA)** | 100% client-side single-device game mode precached by service worker. | Unlimited ($0, zero network) |

### High-Level Request & Media Flow

```text
Browser (Vercel Static SPA)
  ├──► Supabase Auth (signInAnonymously -> auth.uid() JWT)
  ├──► Supabase Edge Functions (create/join room, cast vote, advance turn, mint LiveKit JWT)
  │       └──► Postgres + RLS + FOR UPDATE RPCs (authoritative state_version)
  ├──► Supabase Realtime (phase, turn_index, votes count, lobby_chat)
  └──► LiveKit Cloud SFU (WebRTC audio + simulcast video, AdaptiveStream)
```

---

## 2. Bandwidth & Resource Calculations

### 2.1 Media Profile & Overhead Assumptions

Each participant with camera and microphone enabled publishes:
- **High simulcast layer**: `360p @ 20 fps` $\approx 350\text{ kbps}$
- **Low (thumbnail) simulcast layer**: `180p @ 15 fps` $\approx 140\text{ kbps}$
- **Opus audio**: $\approx 32\text{ kbps}$
- **Transport overhead**: **~10%** for DTLS/SRTP/RTP headers and FEC/retransmission

**Per-participant uplink (camera + mic on)**:
$$(350 + 140 + 32)\text{ kbps} \times 1.10 = 522 \times 1.10 \approx \mathbf{574.2\text{ kbps}}$$

### 2.2 AdaptiveStream Egress (Spotlight + Filmstrip Default)

With LiveKit `AdaptiveStream` enabled in the default **Spotlight + Filmstrip** layout:
- Each viewer subscribes to **1 active-speaker / spotlight** stream at High (`360p @ 20 fps`, $350\text{ kbps}$)
- Each viewer subscribes to **$N - 2$ filmstrip thumbnails** at Low (`180p @ 15 fps`, $140\text{ kbps}$ each)
- Each viewer subscribes to **$N - 1$ remote audio tracks** (`32 kbps` each, worst-case continuous without DTX silence suppression)

$$\text{Egress}_{\text{viewer}}(N) = \Big[350 + 140(N - 2) + 32(N - 1)\Big] \times 1.10\text{ kbps}$$
$$\text{Total SFU Egress}(N) = N \times \text{Egress}_{\text{viewer}}(N)$$

> **Why Spotlight + Filmstrip is the default**: Switching to full Gallery Grid upgrades multiple tiles to `360p` simultaneously, multiplying SFU egress and rapidly exhausting the 50 GB monthly cap for 6–8 player lobbies.

#### Video + Audio Egress Table (Worst-Case All Cameras & Mics Active)

| Players ($N$) | Per-Viewer Raw (kbps) | Per-Viewer +10% OH (kbps) | Total SFU Egress (Mbps) | Data Rate (MB/min) | Data Rate (GB/hr) | 20-Min Session (GB) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **3** | $350 + 140 + 64 = 554$ | $609.4$ | **1.83 Mbps** | $13.71\text{ MB/min}$ | $0.82\text{ GB/hr}$ | **0.27 GB** |
| **5** | $350 + 420 + 128 = 898$ | $987.8$ | **4.94 Mbps** | $37.04\text{ MB/min}$ | $2.22\text{ GB/hr}$ | **0.74 GB** |
| **6** | $350 + 560 + 160 = 1{,}070$ | $1{,}177.0$ | **7.06 Mbps** | $52.97\text{ MB/min}$ | $3.18\text{ GB/hr}$ | **1.06 GB** |
| **8** | $350 + 840 + 224 = 1{,}414$ | $1{,}555.4$ | **12.44 Mbps** | $93.32\text{ MB/min}$ | $5.60\text{ GB/hr}$ | **1.87 GB** |

*(Conversion: $\text{MB/min} = \text{Mbps} \times 60 / 8$. With Opus DTX enabled, average audio is typically 1–2 active talkers at a time, reducing 8-player egress by ~10–12%.)*

#### Audio-Only Fallback Egress ($32\text{ kbps} \times 1.10 = 35.2\text{ kbps}$ per remote peer)

| Players ($N$) | Total SFU Egress (Mbps) | Data Rate (MB/min) | 20-Min Session (GB) |
| :---: | :---: | :---: | :---: |
| **3** | $0.21\text{ Mbps}$ | $1.58\text{ MB/min}$ | $0.03\text{ GB}$ |
| **5** | $0.70\text{ Mbps}$ | $5.28\text{ MB/min}$ | $0.11\text{ GB}$ |
| **6** | $1.06\text{ Mbps}$ | $7.92\text{ MB/min}$ | $0.16\text{ GB}$ |
| **8** | $1.97\text{ Mbps}$ | $14.78\text{ MB/min}$ | $0.30\text{ GB}$ |

### 2.3 LiveKit Participant-Minutes & Monthly Capacity

**Critical billing rule**: LiveKit counts **participant-minutes** for the entire time a client is connected to the LiveKit room — including **lobby waiting, role reveal, discussion, voting, results, and rematch/idle time**, not just active clue rounds.

$$\text{Participant-Minutes per Session} = N \times \text{Total Connected Minutes}$$

Assuming a typical **20-minute session** (e.g., 3 min lobby + two 7-min rounds + 3 min results/rematch):

| Players ($N$) | Part.-Min / Session | Max Sessions / Mo (5,000 min cap) | Max Sessions / Mo (50 GB cap, Video) | **Binding Free-Tier Bottleneck** |
| :---: | :---: | :---: | :---: | :--- |
| **3** | $60\text{ min}$ | **83 sessions** | ~182 sessions | **Participant-minutes** (5,000 min) |
| **5** | $100\text{ min}$ | **50 sessions** | ~67 sessions | **Participant-minutes** (5,000 min) |
| **6** | $120\text{ min}$ | **41 sessions** | ~47 sessions | **Participant-minutes** (5,000 min) |
| **8** | $160\text{ min}$ | **31 sessions** | **~26 sessions** | **Egress bandwidth** (50 GB) |

### 2.4 Warning Thresholds (70% Budget Guardrails)

Set monitoring/telemetry alerts at **70% of monthly LiveKit Free quotas** so the app can warn hosts or auto-recommend **Audio-Only** mode before a hard cutoff:

- **Participant-Minutes Warning (70%)**: **3,500 participant-minutes / month**
  - Equivalent to: **58** (3p), **35** (5p), **29** (6p), or **21** (8p) 20-minute sessions.
- **Egress Bandwidth Warning (70%)**: **35 GB / month**
  - For 8-player video sessions, 35 GB is reached at **~18–19 sessions** (~373 MB/min × 20 min × 18.7).
- **Mitigations when approaching 70%**:
  1. Default large lobbies ($N \ge 6$) to **mic-only** unless players explicitly toggle cameras on.
  2. Disconnect LiveKit media on prolonged lobby idle (>10 min) while keeping Supabase Realtime room state alive.
  3. Surface a non-blocking banner offering **Audio-Only** or **Local Pass & Play**.

---

## 3. Guest Identity & Rejoin Model

Chomu Who requires **zero sign-up** while preventing seat hijacking and secret leakage.

### 3.1 Identity & Token Lifecycle

1. **Supabase Anonymous Auth**:
   - On entering online mode, the client calls `supabase.auth.signInAnonymously()` if no active session exists.
   - This issues a standard Supabase JWT with a unique `auth.uid()`, enabling Postgres RLS (`auth.uid() = user_id`) on `player_secrets`.
2. **Opaque Random Rejoin Token (Hashed Server-Side)**:
   - When an Edge Function admits a player into `room_players`, it generates a cryptographically random opaque token (e.g., 32 bytes from `crypto.getRandomValues()`).
   - The **plaintext token** is returned **once** to the client and stored in `localStorage` (keyed by room code).
   - Only `SHA-256(rejoin_token)` is stored in `room_player_credentials.rejoin_token_hash`, which has **zero client SELECT RLS policies** (`service_role` only).
3. **Standard Reconnect (Same Browser)**:
   - On page refresh or brief network drop, the existing Supabase Anonymous session (`auth.uid()`) + stored `rejoin_token` re-authenticates the player transparently and restores their seat, score, and `player_secrets` row.

### 3.2 Cleared Browser Storage or Device Switching

If a player clears browser storage, uses an incognito window that was closed, or switches from phone to laptop:
- `supabase.auth.signInAnonymously()` creates a **new** `auth.uid()`.
- The client no longer has the original `rejoin_token` in `localStorage`.

**Transparent UX Behavior**:
- **Never** match or overwrite an existing `room_players` seat by display name alone (prevents trivial seat/secret hijacking).
- **If the user has a recovery/rejoin link** (optional copyable URL containing the opaque token): the Edge Function hashes the presented token, compares it in constant time against `room_player_credentials.rejoin_token_hash`, rebinds `room_players.user_id` to the new `auth.uid()`, and **rotates** `rejoin_token_hash`.
- **If no token is available** (standard cleared-storage / new-device case):
  1. Clearly inform the user: *"Previous session credentials weren't found on this device."*
  2. If `phase === 'LOBBY'`, allow them to join as a **new guest seat** immediately.
  3. If a round is already in progress, keep them in a **spectator / waiting-for-next-round** state while the host can kick the orphaned disconnected seat.

---

## 4. Manual Resume Procedure for Paused Supabase Free Projects

Supabase Free-tier projects automatically **pause after 7 consecutive days of inactivity** (zero database/API traffic).

### Operator Runbook (2–3 Minutes)

1. Open [https://supabase.com/dashboard](https://supabase.com/dashboard) and sign in to the project owner account.
2. Select the **Chomu Who** project.
3. On the project overview, locate the **"Project is paused"** banner and click **Restore project** (or **Resume project**).
4. Wait **1–3 minutes** for Postgres, Auth, Realtime, and Edge Functions to finish provisioning.
5. Verify recovery:
   - Confirm **Database**, **Auth**, **Realtime**, and **Edge Functions** indicators are healthy/green.
   - Open the live Vercel URL and test **Create Room** to confirm anonymous sign-in + room creation + LiveKit token minting succeed.

> **Operational Note**: Do not deploy artificial keep-alive cron jobs just to defeat the 7-day pause. The client detects paused/unreachable backends immediately and directs players to **Pass & Play** until a maintainer restores the project.

---

## 5. Graceful Error Handling Matrix

| Failure Scenario | Detection Signal | User-Facing Behavior | Recovery / Fallback Action |
| :--- | :--- | :--- | :--- |
| **Paused Supabase Backend** | `503 Service Unavailable`, network timeout, or connection refused on Auth / Edge Function | Show clear card: *"Online servers are currently sleeping."* Never show raw stack traces. | Offer 1-click **"Play Local Pass & Play"** fallback; notify maintainer to run Section 4 restore. |
| **Realtime Disconnect** | Supabase Realtime channel `CLOSED` / `CHANNEL_ERROR` / `TIMED_OUT` | Non-blocking top banner: *"Reconnecting to room…"* Preserve local card/UI state. | Exponential backoff reconnect; on rejoin, fetch latest `rooms` + `room_players` state if `state_version` advanced. |
| **LiveKit Quota Exhausted** | Edge Function returns `429` / `503` or LiveKit returns quota/room-create error (at 5,000 min or 50 GB) | Non-blocking toast: *"In-app voice/video quota reached for this month. Game room is still active!"* | Keep **Supabase Realtime game loop** (roles, turns, voting, results) running normally; suggest external voice (Discord/FaceTime) or **Pass & Play**. |
| **Failed Media (Mic/Cam)** | `NotAllowedError`, `NotFoundError`, `OverconstrainedError`, or track `ended` event | Gracefully render `PlayerAvatar` tile (camera off) and/or muted/listen-only badge. | Show concise browser permission tip; allow full participation in turns, chat, and voting without media. |
| **Expired / Invalid Rejoin Credential** | Edge Function rejects `rejoin_token` (expired, rotated, or mismatched `auth.uid()`) | Clear stale local token; show *"Your room session expired or was opened on a new device."* | Offer **"Join as New Guest"** (if in `LOBBY`) or **"Back to Home / Pass & Play"** without exposing any prior round secrets. |
