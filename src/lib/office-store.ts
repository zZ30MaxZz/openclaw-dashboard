export type RoomStatus = 'available' | 'occupied' | 'maintenance';
export type RoomType = 'meeting' | 'focus' | 'war-room';

export interface OfficeRoomRecord {
  id: string;
  name: string;
  floor: string;
  type: RoomType;
  capacity: number;
  status: RoomStatus;
  temperature: number;
  noiseLevel: number;
  nextBooking?: string;
}

export interface OfficeBookingRecord {
  id: string;
  roomId: string;
  owner: string;
  purpose: string;
  startAt: string;
  endAt: string;
  status: 'scheduled' | 'active' | 'cancelled';
}

let roomStore: OfficeRoomRecord[] = [
  {
    id: 'room-1',
    name: 'Atlas',
    floor: 'Floor 4',
    type: 'war-room',
    capacity: 10,
    status: 'occupied',
    temperature: 22,
    noiseLevel: 58,
    nextBooking: isoDateTime(2),
  },
  {
    id: 'room-2',
    name: 'Nimbus',
    floor: 'Floor 3',
    type: 'meeting',
    capacity: 6,
    status: 'available',
    temperature: 21,
    noiseLevel: 34,
  },
  {
    id: 'room-3',
    name: 'Lumen Pods',
    floor: 'Floor 2',
    type: 'focus',
    capacity: 4,
    status: 'maintenance',
    temperature: 24,
    noiseLevel: 22,
  },
];

let bookingStore: OfficeBookingRecord[] = [
  {
    id: 'bk-1',
    roomId: 'room-1',
    owner: 'Nadia Ruiz',
    purpose: 'Incident sync',
    startAt: isoDateTime(0),
    endAt: isoDateTime(0, 90),
    status: 'active',
  },
  {
    id: 'bk-2',
    roomId: 'room-2',
    owner: 'Luis Vega',
    purpose: 'Sprint planning',
    startAt: isoDateTime(1),
    endAt: isoDateTime(1, 60),
    status: 'scheduled',
  },
];

export function getOfficeRooms(): OfficeRoomRecord[] {
  return roomStore.slice();
}

export function getOfficeBookings(): OfficeBookingRecord[] {
  return bookingStore
    .slice()
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
}

export function updateRoomStatus(roomId: string, status: RoomStatus) {
  const index = roomStore.findIndex((room) => room.id === roomId);
  if (index === -1) throw new Error(`Room ${roomId} not found`);
  roomStore = [
    ...roomStore.slice(0, index),
    { ...roomStore[index], status },
    ...roomStore.slice(index + 1),
  ];
}

export function createOfficeBooking(input: {
  roomId: string;
  owner: string;
  purpose: string;
  startAt: string;
  endAt: string;
}) {
  const booking: OfficeBookingRecord = {
    id: crypto.randomUUID(),
    roomId: input.roomId,
    owner: input.owner,
    purpose: input.purpose,
    startAt: input.startAt,
    endAt: input.endAt,
    status: 'scheduled',
  };

  bookingStore = [booking, ...bookingStore];
  roomStore = roomStore.map((room) =>
    room.id === input.roomId ? { ...room, nextBooking: input.startAt } : room,
  );
}

export function cancelOfficeBooking(bookingId: string) {
  const index = bookingStore.findIndex((booking) => booking.id === bookingId);
  if (index === -1) throw new Error(`Booking ${bookingId} not found`);

  bookingStore = [
    ...bookingStore.slice(0, index),
    { ...bookingStore[index], status: 'cancelled' },
    ...bookingStore.slice(index + 1),
  ];
}

function isoDateTime(dayOffset: number, minuteOffset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setMinutes(date.getMinutes() + minuteOffset);
  return date.toISOString();
}
