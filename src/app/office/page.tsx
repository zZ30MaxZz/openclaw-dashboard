import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getOfficeBookings, getOfficeRooms, OfficeBookingRecord, OfficeRoomRecord, RoomStatus } from '@/lib/office-store';
import { cancelOfficeBookingAction, createOfficeBookingAction, updateRoomStatusAction } from './actions';
import { cn } from '@/lib/utils';
import { Building2, DoorOpen, Users, Wrench, CalendarPlus, Ban } from 'lucide-react';
import type { ReactNode } from 'react';

const roomStatusStyle: Record<RoomStatus, string> = {
  available: 'border-green-500/40 text-green-300 bg-green-500/10',
  occupied: 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10',
  maintenance: 'border-yellow-500/40 text-yellow-300 bg-yellow-500/10',
};

export default function OfficePage() {
  const rooms = getOfficeRooms();
  const bookings = getOfficeBookings();
  const available = rooms.filter((room) => room.status === 'available').length;
  const maintenance = rooms.filter((room) => room.status === 'maintenance').length;
  const activeBookings = bookings.filter((booking) => booking.status === 'active' || booking.status === 'scheduled').length;

  return (
    <div className="p-6 lg:p-8 grid-bg min-h-screen space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Mission Control / Office</p>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Office Coordination</h1>
          <p className="text-muted-foreground max-w-3xl">
            Controla ocupación de salas, reservas y condiciones operativas del workspace.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <Pill icon={<Building2 className="w-4 h-4" />} label="Salas" value={rooms.length} />
          <Pill icon={<DoorOpen className="w-4 h-4" />} label="Disponibles" value={available} />
          <Pill icon={<Users className="w-4 h-4" />} label="Reservas" value={activeBookings} />
          <Pill icon={<Wrench className="w-4 h-4" />} label="Mantenimiento" value={maintenance} />
        </div>
      </header>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="glass-panel border border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarPlus className="w-4 h-4 text-primary" />
              Nueva reserva
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createOfficeBookingAction} className="space-y-3">
              <select name="roomId" className="w-full rounded-lg bg-background/60 border border-border/60 p-3" required>
                <option value="">Seleccionar sala</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} ({room.floor})
                  </option>
                ))}
              </select>
              <input type="text" name="owner" placeholder="Responsable" className="w-full rounded-lg bg-background/60 border border-border/60 p-3" required />
              <input type="text" name="purpose" placeholder="Propósito" className="w-full rounded-lg bg-background/60 border border-border/60 p-3" />
              <div className="grid grid-cols-1 gap-3">
                <input type="datetime-local" name="startAt" className="rounded-lg bg-background/60 border border-border/60 p-3" required />
                <input type="datetime-local" name="endAt" className="rounded-lg bg-background/60 border border-border/60 p-3" required />
              </div>
              <button type="submit" className="w-full rounded-lg bg-gradient-to-r from-primary to-secondary text-black font-semibold py-3">
                Programar reserva
              </button>
            </form>
          </CardContent>
        </Card>

        <Card className="glass-panel border border-border/60 xl:col-span-2">
          <CardHeader>
            <CardTitle>Estado de salas</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </CardContent>
        </Card>
      </section>

      <Card className="glass-panel border border-border/60">
        <CardHeader>
          <CardTitle>Agenda de reservas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {bookings.map((booking) => (
            <BookingRow key={booking.id} booking={booking} roomName={rooms.find((room) => room.id === booking.roomId)?.name || booking.roomId} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function RoomCard({ room }: { room: OfficeRoomRecord }) {
  return (
    <div className="rounded-xl border border-border/40 p-4 bg-background/40 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">{room.name}</p>
          <p className="text-xs text-muted-foreground">
            {room.floor} • {room.type} • cap {room.capacity}
          </p>
        </div>
        <span className={cn('px-3 py-1 rounded-full text-xs border', roomStatusStyle[room.status])}>
          {room.status}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <span>Temp: {room.temperature}°C</span>
        <span>Noise: {room.noiseLevel} dB</span>
      </div>
      <p className="text-xs text-muted-foreground">Próxima reserva: {room.nextBooking ? formatDateTime(room.nextBooking) : 'sin agenda'}</p>
      <form action={updateRoomStatusAction} className="grid grid-cols-2 gap-2">
        <input type="hidden" name="roomId" value={room.id} />
        <select name="status" defaultValue={room.status} className="rounded-lg bg-background/60 border border-border/60 p-2 text-xs">
          <option value="available">available</option>
          <option value="occupied">occupied</option>
          <option value="maintenance">maintenance</option>
        </select>
        <button type="submit" className="rounded-lg border border-border/40 py-2 text-xs">
          Actualizar
        </button>
      </form>
    </div>
  );
}

function BookingRow({ booking, roomName }: { booking: OfficeBookingRecord; roomName: string }) {
  return (
    <div className="rounded-lg border border-border/40 p-3 bg-background/30 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
      <div>
        <p className="font-semibold">{booking.purpose}</p>
        <p className="text-sm text-muted-foreground">
          {roomName} • {booking.owner}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDateTime(booking.startAt)} - {formatDateTime(booking.endAt)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="px-3 py-1 rounded-full border border-border/40 text-xs">{booking.status}</span>
        {booking.status !== 'cancelled' && (
          <form action={cancelOfficeBookingAction}>
            <input type="hidden" name="bookingId" value={booking.id} />
            <button type="submit" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-500/40 text-red-300 text-xs">
              <Ban className="w-3 h-3" />
              Cancelar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Pill({ icon, label, value }: { icon: ReactNode; label: string; value: string | number }) {
  return (
    <div className="px-4 py-2 rounded-full border border-border/60 text-sm flex items-center gap-2">
      {icon}
      <span className="font-semibold text-foreground">{value}</span>
      {label}
    </div>
  );
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('es-PE', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}
