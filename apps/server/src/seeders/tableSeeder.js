import { Table } from "../models.js";
import { createQrCode } from "../utils.js";

export async function seedTables(restaurant) {
  const tables = [];

  for (let index = 1; index <= 6; index += 1) {
    const tableCode = `table-${index}`;
    const table = await Table.create({
      restaurantId: restaurant._id,
      outletId: "main",
      outletName: "Main Dining Room",
      code: tableCode,
      tableNumber: `${index}`,
      label: `Table ${index}`,
      qrCodeUrl: "pending",
      seats:
        index <= 3
          ? [
              { seatId: "seat-1", label: "Seat 1" },
              { seatId: "seat-2", label: "Seat 2" },
              { seatId: "seat-3", label: "Seat 3" },
              { seatId: "seat-4", label: "Seat 4" }
            ]
          : []
    });

    table.qrCodeUrl = await createQrCode(restaurant.slug, table.code);
    await table.save();
    tables.push(table);
  }

  return tables;
}
