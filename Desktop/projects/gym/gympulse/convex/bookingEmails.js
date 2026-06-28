import { internalQuery } from "./_generated/server";


export const getBookingWithFuneralHome = internalQuery({
    args: { bookingId: v.id("bookings") },
    handler: async (ctx, { bookingId }) => {

      const booking = await ctx.db.get(bookingId);
      if (!booking) return null;
      const funeralHome = await ctx.db.get(booking.funeralHomeId);
      if (!funeralHome) return null;
      return { booking, funeralHome };
    },
  });

  