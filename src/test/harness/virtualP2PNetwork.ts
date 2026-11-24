/**
 * src/test/harness/virtualP2PNetwork.ts
 *
 * In-memory deterministic P2P network simulation harness for Chomu Who?
 * Simulates Trystero P2P signaling, 5 action channels, WebRTC media streams,
 * peer lifecycles, and fault injection with 100% deterministic async delivery.
 */

import { P2PRealtimeService } from '../../services/multiplayer/p2pRealtimeService';
import { PlayerAvatarId } from '../../types/game';

export type DeliveryMode = 'microtask' | 'manual' | 'delayed';

export interface VirtualNetworkOptions {
  deliveryMode?: DeliveryMode;
  defaultLatencyMs?: number;
  packetLossRate?: number; // 0.0 to 1.0
  debugLogging?: boolean;
}

export interface MessageTask {
  id: string;
  channel: string;
  senderId: string;
  targetId?: string;
  data: any;
  timestamp: number;
  deliver: () => void | Promise<void>;
}

export type PeerJoinListener = (peerId: string) => void;
export type PeerLeaveListener = (peerId: string) => void;
export type PeerStreamListener = (stream: any, context: { peerId: string }) => void;
export type StreamListener = (stream: any, peerId: string) => void;
export type ActionMessageHandler<T = any> = (data: T, peerId: string) => void;

/**
 * In-memory action channel implementing Trystero's Action interface.
 */
export class VirtualActionChannel<T = any> {
  private listeners: Set<ActionMessageHandler<T>> = new Set();

  constructor(
    public readonly name: string,
    public readonly peerId: string,
    private readonly room: VirtualRoom
  ) {}

  public async send(data: T, targetOrOptions?: string | { target?: string }): Promise<void> {
    const targetPeerId =
      typeof targetOrOptions === 'string'
        ? targetOrOptions
        : targetOrOptions?.target;

    await this.room.routeAction(this.name, this.peerId, data, targetPeerId);
  }

  public onMessage(handler: ActionMessageHandler<T>): () => void {
    this.listeners.add(handler);
    return () => {
      this.listeners.delete(handler);
    };
  }

  public dispatchIncoming(data: T, senderPeerId: string): void {
    for (const handler of Array.from(this.listeners)) {
      try {
        handler(data, senderPeerId);
      } catch (err) {
        console.error(`[VirtualActionChannel:${this.name}] Handler error:`, err);
      }
    }
  }

  public clear(): void {
    this.listeners.clear();
  }
}

/**
 * Virtual Trystero Room instance mock attached to a specific peer.
 */
export class VirtualPeerRoomInstance {
  private channels: Map<string, VirtualActionChannel> = new Map();
  private peerJoinListeners: Set<PeerJoinListener> = new Set();
  private peerLeaveListeners: Set<PeerLeaveListener> = new Set();
  private peerStreamListeners: Set<PeerStreamListener> = new Set();
  private streamListeners: Set<StreamListener> = new Set();
  public localStreams: Set<any> = new Set();
  public isConnected: boolean = true;

  constructor(
    public readonly roomCode: string,
    public peerId: string,
    public readonly room: VirtualRoom,
    public readonly appId: string = 'chomu-who-party-v1'
  ) {}

  public makeAction(namespace: string): {
    send: (data: any, target?: any) => Promise<void>;
    onMessage: (handler: (data: any, peerId: string) => void) => () => void;
    [0]: (data: any, target?: any) => Promise<void>;
    [1]: (handler: (data: any, peerId: string) => void) => () => void;
  } {
    let channel = this.channels.get(namespace);
    if (!channel) {
      channel = new VirtualActionChannel(namespace, this.peerId, this.room);
      this.channels.set(namespace, channel);
    }

    const sendFn = (data: any, target?: any) => channel!.send(data, target);
    const onMessageFn = (handler: (data: any, peerId: string) => void) =>
      channel!.onMessage(handler);

    const actionObj = {
      send: sendFn,
      onMessage: onMessageFn,
      [0]: sendFn,
      [1]: onMessageFn,
    };

    return actionObj;
  }

  public onPeerJoin(handler: PeerJoinListener): () => void {
    this.peerJoinListeners.add(handler);
    return () => this.peerJoinListeners.delete(handler);
  }

  public onPeerLeave(handler: PeerLeaveListener): () => void {
    this.peerLeaveListeners.add(handler);
    return () => this.peerLeaveListeners.delete(handler);
  }

  public onPeerStream(handler: PeerStreamListener): () => void {
    this.peerStreamListeners.add(handler);
    return () => this.peerStreamListeners.delete(handler);
  }

  public onStream(handler: StreamListener): () => void {
    this.streamListeners.add(handler);
    return () => this.streamListeners.delete(handler);
  }

  public async addStream(stream: any, optionsOrTarget?: string | { target?: string }): Promise<void> {
    this.localStreams.add(stream);
    const targetPeerId =
      typeof optionsOrTarget === 'string'
        ? optionsOrTarget
        : optionsOrTarget?.target;
    await this.room.routeStream(this.peerId, stream, targetPeerId);
  }

  public removeStream(stream: any, _optionsOrTarget?: string | { target?: string }): void {
    this.localStreams.delete(stream);
  }

  public async leave(): Promise<void> {
    this.isConnected = false;
    this.room.unregisterPeer(this.peerId);
    this.channels.forEach((ch) => ch.clear());
    this.channels.clear();
    this.peerJoinListeners.clear();
    this.peerLeaveListeners.clear();
    this.peerStreamListeners.clear();
    this.streamListeners.clear();
  }

  public async ping(_targetPeerId: string): Promise<number> {
    return 1; // 1ms simulated RTT
  }

  public triggerPeerJoin(remotePeerId: string): void {
    if (!this.isConnected) return;
    for (const listener of Array.from(this.peerJoinListeners)) {
      listener(remotePeerId);
    }
  }

  public triggerPeerLeave(remotePeerId: string): void {
    if (!this.isConnected) return;
    for (const listener of Array.from(this.peerLeaveListeners)) {
      listener(remotePeerId);
    }
  }

  public triggerPeerStream(stream: any, senderPeerId: string): void {
    if (!this.isConnected) return;
    for (const listener of Array.from(this.peerStreamListeners)) {
      listener(stream, { peerId: senderPeerId });
    }
    for (const listener of Array.from(this.streamListeners)) {
      listener(stream, senderPeerId);
    }
  }

  public getChannel(namespace: string): VirtualActionChannel | undefined {
    return this.channels.get(namespace);
  }
}

/**
 * Virtual Room managing multi-peer routing for a single room code.
 */
export class VirtualRoom {
  public peers: Map<string, VirtualPeerRoomInstance> = new Map();

  constructor(
    public readonly roomCode: string,
    public readonly network: VirtualP2PNetwork
  ) {}

  public registerPeer(peerId: string, instance: VirtualPeerRoomInstance): void {
    const existingPeerIds = Array.from(this.peers.keys());
    this.peers.set(peerId, instance);

    // Bi-directional peer discovery notification (deferred via microtask)
    queueMicrotask(() => {
      if (!instance.isConnected) return;
      for (const existingId of existingPeerIds) {
        const existingPeer = this.peers.get(existingId);
        if (existingPeer && existingPeer.isConnected) {
          existingPeer.triggerPeerJoin(peerId);
          instance.triggerPeerJoin(existingId);
        }
      }
    });
  }

  public unregisterPeer(peerId: string): void {
    this.peers.delete(peerId);
    for (const remainingPeer of Array.from(this.peers.values())) {
      if (remainingPeer.isConnected) {
        queueMicrotask(() => {
          remainingPeer.triggerPeerLeave(peerId);
        });
      }
    }
  }

  public disconnectPeer(peerId: string): void {
    const instance = this.peers.get(peerId);
    if (instance) {
      instance.isConnected = false;
      for (const remainingPeer of Array.from(this.peers.values())) {
        if (remainingPeer.peerId !== peerId && remainingPeer.isConnected) {
          queueMicrotask(() => {
            remainingPeer.triggerPeerLeave(peerId);
          });
        }
      }
    }
  }

  public reconnectPeer(peerId: string): void {
    const instance = this.peers.get(peerId);
    if (instance) {
      instance.isConnected = true;
      for (const otherPeer of Array.from(this.peers.values())) {
        if (otherPeer.peerId !== peerId && otherPeer.isConnected) {
          queueMicrotask(() => {
            otherPeer.triggerPeerJoin(peerId);
            instance.triggerPeerJoin(otherPeer.peerId);
          });
        }
      }
    }
  }

  public async routeAction(
    channelName: string,
    senderId: string,
    data: any,
    targetId?: string
  ): Promise<void> {
    if (this.network.isChannelDropped(channelName)) return;
    if (this.network.isMessageDropped(channelName, senderId, targetId)) return;

    if (targetId) {
      if (this.network.arePeersPartitioned(senderId, targetId)) return;
      const targetInstance = this.peers.get(targetId);
      if (targetInstance && targetInstance.isConnected) {
        this.network.scheduleDelivery({
          id: `${Date.now()}-${Math.random()}`,
          channel: channelName,
          senderId,
          targetId,
          data,
          timestamp: Date.now(),
          deliver: () => {
            if (!targetInstance.isConnected) return;
            const ch = targetInstance.getChannel(channelName);
            ch?.dispatchIncoming(data, senderId);
          },
        });
      }
    } else {
      // Broadcast to all other peers in the room
      for (const [peerId, peerInstance] of this.peers.entries()) {
        if (peerId === senderId || !peerInstance.isConnected) continue;
        if (this.network.arePeersPartitioned(senderId, peerId)) continue;

        this.network.scheduleDelivery({
          id: `${Date.now()}-${Math.random()}`,
          channel: channelName,
          senderId,
          targetId: peerId,
          data,
          timestamp: Date.now(),
          deliver: () => {
            if (!peerInstance.isConnected) return;
            const ch = peerInstance.getChannel(channelName);
            ch?.dispatchIncoming(data, senderId);
          },
        });
      }
    }
  }

  public async routeStream(senderId: string, stream: any, targetId?: string): Promise<void> {
    if (targetId) {
      const targetPeer = this.peers.get(targetId);
      if (targetPeer && targetPeer.isConnected) {
        targetPeer.triggerPeerStream(stream, senderId);
      }
    } else {
      for (const [peerId, peerInstance] of this.peers.entries()) {
        if (peerId === senderId || !peerInstance.isConnected) continue;
        peerInstance.triggerPeerStream(stream, senderId);
      }
    }
  }
}

export interface DropMessageRule {
  channel: string;
  senderId?: string;
  targetId?: string;
}

/**
 * Top-level Virtual P2P Network broker.
 */
export class VirtualP2PNetwork {
  private rooms: Map<string, VirtualRoom> = new Map();
  private pendingQueue: MessageTask[] = [];
  private droppedChannels: Set<string> = new Set();
  private droppedMessageRules: DropMessageRule[] = [];
  private partitions: Array<Set<string>> = [];
  public options: VirtualNetworkOptions;

  constructor(options: VirtualNetworkOptions = {}) {
    this.options = {
      deliveryMode: 'microtask',
      defaultLatencyMs: 0,
      packetLossRate: 0,
      debugLogging: false,
      ...options,
    };
  }

  public getOrCreateRoom(roomCode: string): VirtualRoom {
    const code = roomCode.toUpperCase();
    let room = this.rooms.get(code);
    if (!room) {
      room = new VirtualRoom(code, this);
      this.rooms.set(code, room);
    }
    return room;
  }

  public getRoom(roomCode: string): VirtualRoom | undefined {
    return this.rooms.get(roomCode.toUpperCase());
  }

  /**
   * Generates a Trystero-compatible joinRoom function bound to this virtual network.
   */
  public createJoinRoomFn(
    explicitPeerId?: string
  ): (config: any, roomCode: string) => VirtualPeerRoomInstance {
    return (config: any, roomCode: string) => {
      const room = this.getOrCreateRoom(roomCode);
      const peerId = explicitPeerId || `virt_${Math.random().toString(36).slice(2, 8)}`;
      const peerInstance = new VirtualPeerRoomInstance(roomCode, peerId, room, config?.appId);
      room.registerPeer(peerId, peerInstance);
      return peerInstance;
    };
  }

  /**
   * Helper to spawn a multi-client mesh for testing.
   */
  public async createMesh(
    roomCode: string,
    participants: Array<{
      name: string;
      avatar: PlayerAvatarId;
      isHost?: boolean;
      service?: P2PRealtimeService;
    }>
  ): Promise<{
    host: P2PRealtimeService;
    clients: P2PRealtimeService[];
    all: P2PRealtimeService[];
  }> {
    const code = roomCode.toUpperCase();
    const services: P2PRealtimeService[] = [];
    let hostService: P2PRealtimeService | null = null;
    const clientServices: P2PRealtimeService[] = [];

    for (const p of participants) {
      const service = p.service || new P2PRealtimeService();
      const peerId = service.getMyPeerId();
      const joinFn = this.createJoinRoomFn(peerId);

      if (p.isHost) {
        await service.createRoom(code, p.name, p.avatar, { joinRoomFn: joinFn });
        hostService = service;
      } else {
        await service.joinRoom(code, p.name, p.avatar, { joinRoomFn: joinFn });
        clientServices.push(service);
      }
      services.push(service);
      await this.flush();
    }

    if (!hostService) {
      throw new Error('createMesh requires at least one participant with isHost: true');
    }

    return {
      host: hostService,
      clients: clientServices,
      all: services,
    };
  }

  public scheduleDelivery(task: MessageTask): void {
    if (this.options.packetLossRate && Math.random() < this.options.packetLossRate) {
      return; // Dropped packet
    }

    if (this.options.deliveryMode === 'manual') {
      this.pendingQueue.push(task);
    } else if (this.options.deliveryMode === 'delayed' && (this.options.defaultLatencyMs ?? 0) > 0) {
      setTimeout(() => task.deliver(), this.options.defaultLatencyMs);
    } else {
      // Default: Microtask delivery (fast, asynchronous, deterministic)
      queueMicrotask(() => task.deliver());
    }
  }

  /**
   * Deterministically flushes all pending in-memory message tasks and microtasks.
   */
  public async flush(): Promise<void> {
    for (let i = 0; i < 20; i++) {
      while (this.pendingQueue.length > 0) {
        const task = this.pendingQueue.shift();
        if (task) {
          try {
            await task.deliver();
          } catch (err) {
            console.error('[VirtualP2PNetwork] Delivery task error:', err);
          }
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 5));
      if (this.pendingQueue.length === 0) {
        await new Promise((resolve) => setTimeout(resolve, 5));
        if (this.pendingQueue.length === 0) break;
      }
    }
  }

  // Fault Injection API
  public dropChannel(channelName: string): void {
    this.droppedChannels.add(channelName);
  }

  public restoreChannel(channelName: string): void {
    this.droppedChannels.delete(channelName);
  }

  public isChannelDropped(channelName: string): boolean {
    return this.droppedChannels.has(channelName);
  }

  public dropMessages(channel: string, senderId?: string, targetId?: string): void {
    this.droppedMessageRules.push({ channel, senderId, targetId });
  }

  public restoreDroppedMessages(): void {
    this.droppedMessageRules = [];
  }

  public isMessageDropped(channel: string, senderId: string, targetId?: string): boolean {
    return this.droppedMessageRules.some((rule) => {
      if (rule.channel !== channel) return false;
      if (rule.senderId && rule.senderId !== senderId) return false;
      if (rule.targetId && targetId && rule.targetId !== targetId) return false;
      return true;
    });
  }

  public disconnectPeer(roomCode: string, peerId: string): void {
    const room = this.rooms.get(roomCode.toUpperCase());
    room?.disconnectPeer(peerId);
  }

  public reconnectPeer(roomCode: string, peerId: string): void {
    const room = this.rooms.get(roomCode.toUpperCase());
    room?.reconnectPeer(peerId);
  }

  public partition(groupA: string[], groupB: string[]): void {
    this.partitions.push(new Set(groupA));
    this.partitions.push(new Set(groupB));
  }

  public healPartitions(): void {
    this.partitions = [];
  }

  public arePeersPartitioned(peerA: string, peerB: string): boolean {
    for (const group of this.partitions) {
      if (group.has(peerA) && !group.has(peerB)) return true;
      if (group.has(peerB) && !group.has(peerA)) return true;
    }
    return false;
  }

  public async cleanup(): Promise<void> {
    for (const room of this.rooms.values()) {
      for (const peer of room.peers.values()) {
        await peer.leave().catch(() => {});
      }
    }
    this.rooms.clear();
    this.pendingQueue = [];
    this.droppedChannels.clear();
    this.droppedMessageRules = [];
    this.partitions = [];
  }

  public reset(): void {
    this.rooms.clear();
    this.pendingQueue = [];
    this.droppedChannels.clear();
    this.droppedMessageRules = [];
    this.partitions = [];
  }
}

// Media Mocks for WebRTC Testing
export function createMockTrack(kind: 'audio' | 'video' = 'audio', enabled = true) {
  const listeners: Record<string, Array<() => void>> = {};
  const mockTrack = {
    kind,
    enabled,
    readyState: 'live' as const,
    stop: () => {
      mockTrack.readyState = 'ended' as any;
      listeners['ended']?.forEach((fn) => fn());
    },
    addEventListener: (evt: string, fn: () => void) => {
      listeners[evt] = listeners[evt] || [];
      listeners[evt].push(fn);
    },
    removeEventListener: (evt: string, fn: () => void) => {
      if (listeners[evt]) {
        listeners[evt] = listeners[evt].filter((cb) => cb !== fn);
      }
    },
  };
  return mockTrack;
}

export function createMockMediaStream(tracks: any[] = []): MediaStream {
  const allTracks = [...tracks];
  const listeners: Record<string, Array<() => void>> = {};

  return {
    getTracks: () => allTracks,
    getAudioTracks: () => allTracks.filter((t) => t.kind === 'audio'),
    getVideoTracks: () => allTracks.filter((t) => t.kind === 'video'),
    addTrack: (track: any) => {
      allTracks.push(track);
      listeners['addtrack']?.forEach((fn) => fn());
    },
    removeTrack: (track: any) => {
      const idx = allTracks.indexOf(track);
      if (idx !== -1) {
        allTracks.splice(idx, 1);
        listeners['removetrack']?.forEach((fn) => fn());
      }
    },
    addEventListener: (evt: string, fn: () => void) => {
      listeners[evt] = listeners[evt] || [];
      listeners[evt].push(fn);
    },
    removeEventListener: (evt: string, fn: () => void) => {
      if (listeners[evt]) {
        listeners[evt] = listeners[evt].filter((cb) => cb !== fn);
      }
    },
  } as unknown as MediaStream;
}

/**
 * Isolated sessionStorage mock for session persistence testing across refreshes.
 */
export class MockSessionStorage implements Storage {
  private store: Map<string, string> = new Map();

  public get length(): number {
    return this.store.size;
  }

  public clear(): void {
    this.store.clear();
  }

  public getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  public key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  public removeItem(key: string): void {
    this.store.delete(key);
  }

  public setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
}
