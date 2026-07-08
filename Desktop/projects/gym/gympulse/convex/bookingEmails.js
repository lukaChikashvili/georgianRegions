import { v } from "convex/values";
import { internalAction, internalQuery } from "./_generated/server";
import { Resend } from "resend";
import { internal } from "./_generated/api";


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



  export const sendBookingNotificationEmail = internalAction({
    args: { bookingId: v.id("bookings") },
    handler: async (ctx, { bookingId }) => {
      const data = await ctx.runQuery(
        internal.bookingEmails.getBookingWithFuneralHome,
        { bookingId }
      );
      if (!data) return;
  
      const { booking, funeralHome } = data;
      const resend = new Resend(process.env.RESEND_API_KEY);
  
      const formattedPrice = booking.servicePrice
        ? `${booking.servicePrice.toLocaleString("ka-GE")} ₾`
        : "შეთანხმებით";
  
      await resend.emails.send({
        from: "GoldenMemorial <noreply@goldenmemorial.ge>",
        to: funeralHome.email,
        subject: `📋 ახალი ჯავშანი — ${booking.serviceName}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
            <div style="background: #1a1209; padding: 24px; text-align: center;">
              <h1 style="color: #D4AF37; margin: 0; font-size: 22px;">GoldenMemorial.ge</h1>
              <p style="color: #c1a362; margin: 8px 0 0; font-size: 13px;">ახალი ჯავშნის შეტყობინება</p>
            </div>
  
            <div style="padding: 32px 24px; background: #fafafa; border: 1px solid #e5e0d8;">
              <h2 style="color: #1a1209; margin: 0 0 24px; font-size: 18px;">
                ${funeralHome.name}, თქვენ გაქვთ ახალი ჯავშანი!
              </h2>
  
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e0d8; color: #666; width: 40%; font-size: 14px;">სერვისი</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e0d8; font-weight: bold; font-size: 14px;">${booking.serviceName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e0d8; color: #666; font-size: 14px;">ფასი</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e0d8; font-size: 14px; color: #D4AF37; font-weight: bold;">${formattedPrice}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e0d8; color: #666; font-size: 14px;">მომხმარებელი</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e0d8; font-size: 14px;">${booking.customerName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e0d8; color: #666; font-size: 14px;">ტელეფონი</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e0d8; font-size: 14px;">${booking.customerPhone}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e0d8; color: #666; font-size: 14px;">ელ-ფოსტა</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e0d8; font-size: 14px;">${booking.customerEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e0d8; color: #666; font-size: 14px;">მოთხოვნილი თარიღი</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e0d8; font-size: 14px;">${booking.requestedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e0d8; color: #666; font-size: 14px;">გადახდის მეთოდი</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e0d8; font-size: 14px;">${booking.paymentMethod === "online" ? "ონლაინ 💳" : "ადგილზე 💵"}</td>
                </tr>
                ${booking.note ? `
                <tr>
                  <td style="padding: 10px 0; color: #666; font-size: 14px; vertical-align: top;">შენიშვნა</td>
                  <td style="padding: 10px 0; font-size: 14px; font-style: italic;">${booking.note}</td>
                </tr>` : ""}
              </table>
  
              <div style="margin-top: 28px; text-align: center;">
                <a href="https://goldenmemorial.ge/dashboard/bookings"
                   style="background: #D4AF37; color: #1a1209; padding: 12px 28px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px; display: inline-block;">
                  ჯავშნის მართვა →
                </a>
              </div>
            </div>
  
            <div style="padding: 16px 24px; text-align: center; color: #999; font-size: 12px; background: #f5f0e8;">
              GoldenMemorial.ge · support@goldenmemorial.ge
            </div>
          </div>
        `,
      });
    },
  });



  export const sendBookingGroupNotificationEmail = internalAction({
    args: { bookingGroupId: v.string() },
    handler: async (ctx, { bookingGroupId }) => {
   
      const bookings = await ctx.runQuery(
        internal.bookingEmails.getBookingsByGroup,
        { bookingGroupId }
      );
      if (!bookings || bookings.length === 0) return;
  
      const funeralHome = await ctx.runQuery(
        internal.bookingEmails.getBookingWithFuneralHome,
        { bookingId: bookings[0]._id }
      );
      if (!funeralHome) return;
  
      const { funeralHome: fh, booking: firstBooking } = funeralHome;
      const resend = new Resend(process.env.RESEND_API_KEY);
  
      const totalPrice = bookings.reduce((s, b) => s + (b.servicePrice || 0), 0);
  
      const serviceRows = bookings
        .map(
          (b) => `
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e5e0d8; font-size: 14px;">${b.serviceName}</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e5e0d8; font-size: 14px; text-align: right; color: #D4AF37; font-weight: bold;">
              ${b.servicePrice ? `${b.servicePrice.toLocaleString("ka-GE")} ₾` : "შეთანხმებით"}
            </td>
          </tr>`
        )
        .join("");
  
      await resend.emails.send({
        from: "GoldenMemorial <noreply@goldenmemorial.ge>",
        to: fh.email,
        subject: `📋 ახალი ჯავშანი (${bookings.length} სერვისი) — ${firstBooking.customerName}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
            <div style="background: #1a1209; padding: 24px; text-align: center;">
              <h1 style="color: #D4AF37; margin: 0; font-size: 22px;">GoldenMemorial.ge</h1>
              <p style="color: #c1a362; margin: 8px 0 0; font-size: 13px;">ახალი ჯავშნის შეტყობინება</p>
            </div>
  
            <div style="padding: 32px 24px; background: #fafafa; border: 1px solid #e5e0d8;">
              <h2 style="color: #1a1209; margin: 0 0 8px; font-size: 18px;">${fh.name}, თქვენ გაქვთ ახალი ჯავშანი!</h2>
              <p style="color: #666; font-size: 14px; margin: 0 0 24px;">მომხმარებელმა შეარჩია ${bookings.length} სერვისი.</p>
  
              <h3 style="font-size: 14px; color: #888; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px;">შერჩეული სერვისები</h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                ${serviceRows}
                <tr>
                  <td style="padding: 12px 0 0; font-weight: bold; font-size: 15px;">სულ</td>
                  <td style="padding: 12px 0 0; text-align: right; font-weight: bold; font-size: 15px; color: #D4AF37;">
                    ${totalPrice > 0 ? `${totalPrice.toLocaleString("ka-GE")} ₾` : "შეთანხმებით"}
                  </td>
                </tr>
              </table>
  
              <h3 style="font-size: 14px; color: #888; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px;">მომხმარებლის ინფო</h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e0d8; color: #666; width: 40%; font-size: 14px;">სახელი</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e0d8; font-size: 14px;">${firstBooking.customerName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e0d8; color: #666; font-size: 14px;">ტელეფონი</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e0d8; font-size: 14px;">${firstBooking.customerPhone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e0d8; color: #666; font-size: 14px;">ელ-ფოსტა</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e0d8; font-size: 14px;">${firstBooking.customerEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e0d8; color: #666; font-size: 14px;">თარიღი</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e0d8; font-size: 14px;">${firstBooking.requestedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px;">გადახდა</td>
                  <td style="padding: 8px 0; font-size: 14px;">${firstBooking.paymentMethod === "online" ? "ონლაინ 💳" : "ადგილზე 💵"}</td>
                </tr>
              </table>
  
              ${firstBooking.note ? `<p style="background: #f0ece3; padding: 12px 16px; border-left: 3px solid #D4AF37; font-size: 14px; font-style: italic; margin: 0 0 24px;">${firstBooking.note}</p>` : ""}
  
              <div style="text-align: center;">
                <a href="https://goldenmemorial.ge/dashboard/bookings"
                   style="background: #D4AF37; color: #1a1209; padding: 12px 28px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px; display: inline-block;">
                  ჯავშნის მართვა →
                </a>
              </div>
            </div>
  
            <div style="padding: 16px 24px; text-align: center; color: #999; font-size: 12px; background: #f5f0e8;">
              GoldenMemorial.ge · support@goldenmemorial.ge
            </div>
          </div>
        `,
      });
    },
  });
  
  export const sendStatusEmailToCustomerEmail = internalAction({
    args: {
      bookingId: v.id("bookings"),
      newStatus: v.string(),
    },
    handler: async (ctx, { bookingId, newStatus }) => {
      const data = await ctx.runQuery(
        internal.bookingEmails.getBookingWithFuneralHome,
        { bookingId }
      );
      if (!data) return;
  
      const { booking, funeralHome } = data;
      if (!booking.customerEmail) return;
  
      const resend = new Resend(process.env.RESEND_API_KEY);
  
      const statusConfig = {
        confirmed: {
          emoji: "✅",
          subject: `თქვენი ჯავშანი დადასტურდა — ${booking.serviceName}`,
          headline: "თქვენი ჯავშანი დადასტურდა!",
          message: `${funeralHome.name}-მა დაადასტურა თქვენი ჯავშანი. ისინი მალე დაგიკავშირდებიან.`,
          color: "#2d7a2d",
        },
        cancelled: {
          emoji: "❌",
          subject: `ჯავშანი გაუქმდა — ${booking.serviceName}`,
          headline: "სამწუხაროდ, ჯავშანი გაუქმდა",
          message: `${funeralHome.name}-მა ვერ შეძლო თქვენი ჯავშნის დადასტურება.${booking.declineReason ? ` მიზეზი: ${booking.declineReason}` : ""}`,
          color: "#c0392b",
        },
      };
  
      const cfg = statusConfig[newStatus];
      if (!cfg) return;
  
      await resend.emails.send({
        from: "GoldenMemorial <noreply@goldenmemorial.ge>",
        to: booking.customerEmail,
        subject: `${cfg.emoji} ${cfg.subject}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
            <div style="background: #1a1209; padding: 24px; text-align: center;">
              <h1 style="color: #D4AF37; margin: 0; font-size: 22px;">GoldenMemorial.ge</h1>
            </div>
  
            <div style="padding: 32px 24px; background: #fafafa; border: 1px solid #e5e0d8;">
              <div style="text-align: center; margin-bottom: 24px;">
                <span style="font-size: 48px;">${cfg.emoji}</span>
                <h2 style="color: ${cfg.color}; margin: 12px 0 8px; font-size: 20px;">${cfg.headline}</h2>
                <p style="color: #555; font-size: 15px; margin: 0;">${cfg.message}</p>
              </div>
  
              <table style="width: 100%; border-collapse: collapse; margin-top: 24px;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e0d8; color: #666; width: 40%; font-size: 14px;">სერვისი</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e0d8; font-size: 14px; font-weight: bold;">${booking.serviceName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e0d8; color: #666; font-size: 14px;">ბიურო</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #e5e0d8; font-size: 14px;">${funeralHome.name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666; font-size: 14px;">თარიღი</td>
                  <td style="padding: 10px 0; font-size: 14px;">${booking.requestedDate}</td>
                </tr>
              </table>
  
              <div style="margin-top: 28px; text-align: center;">
                <a href="https://goldenmemorial.ge/my-bookings"
                   style="background: #D4AF37; color: #1a1209; padding: 12px 28px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px; display: inline-block;">
                  ჩემი ჯავშნები →
                </a>
              </div>
            </div>
  
            <div style="padding: 16px 24px; text-align: center; color: #999; font-size: 12px; background: #f5f0e8;">
              GoldenMemorial.ge · support@goldenmemorial.ge
            </div>
          </div>
        `,
      });
    },
  });


  export const getBookingsByGroup = internalQuery({
    args: { bookingGroupId: v.string() },
    handler: async (ctx, { bookingGroupId }) => {
      return await ctx.db
        .query("bookings")
        .withIndex("by_bookingGroupId", (q) => q.eq("bookingGroupId", bookingGroupId)) 
        .collect();
    },
  });
