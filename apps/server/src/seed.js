import bcrypt from "bcryptjs";
import { USER_ROLES } from "@odine/shared";
import { connectDb } from "./db.js";
import { MenuCategory, MenuItem, Order, Restaurant, Table, User } from "./models.js";
import { createQrCode } from "./utils.js";

async function run() {
  await connectDb();

  await Promise.all([
    Order.deleteMany({}),
    MenuItem.deleteMany({}),
    MenuCategory.deleteMany({}),
    Table.deleteMany({}),
    User.deleteMany({}),
    Restaurant.deleteMany({})
  ]);

  const restaurant = await Restaurant.create({
    name: "Cafe Horizon",
    slug: "cafe-horizon"
  });

  const hashedPassword = await bcrypt.hash("password123", 10);

  await User.create([
    {
      name: "Owner Demo",
      email: "owner@odine.test",
      passwordHash: hashedPassword,
      role: USER_ROLES.OWNER,
      restaurantId: restaurant._id
    },
    {
      name: "Manager Demo",
      email: "manager@odine.test",
      passwordHash: hashedPassword,
      role: USER_ROLES.MANAGER,
      restaurantId: restaurant._id
    },
    {
      name: "Chef Demo",
      email: "chef@odine.test",
      passwordHash: hashedPassword,
      role: USER_ROLES.CHEF,
      restaurantId: restaurant._id
    },
    {
      name: "Platform Demo",
      email: "superadmin@odine.test",
      passwordHash: hashedPassword,
      role: USER_ROLES.SUPERADMIN,
      restaurantId: null
    }
  ]);

  const tables = [];
  for (let index = 1; index <= 6; index += 1) {
    const table = await Table.create({
      restaurantId: restaurant._id,
      tableNumber: `${index}`,
      qrCodeUrl: "placeholder"
    });
    table.qrCodeUrl = await createQrCode(restaurant._id, table._id);
    await table.save();
    tables.push(table);
  }

  const [starters, mains] = await MenuCategory.create([
    { restaurantId: restaurant._id, name: "Starters", displayOrder: 1 },
    { restaurantId: restaurant._id, name: "Mains", displayOrder: 2 }
  ]);

  await MenuItem.create([
    {
      restaurantId: restaurant._id,
      categoryId: starters._id,
      name: "Smoky Paneer Tikka",
      description: "Charred paneer with mint chutney.",
      price: 280,
      isVeg: true,
      spiceLevel: 2
    },
    {
      restaurantId: restaurant._id,
      categoryId: mains._id,
      name: "Butter Chicken Bowl",
      description: "Creamy tomato gravy with rice.",
      price: 360,
      isVeg: false,
      spiceLevel: 1
    },
    {
      restaurantId: restaurant._id,
      categoryId: mains._id,
      name: "Masala Alfredo Pasta",
      description: "Indian-spiced alfredo sauce over penne.",
      price: 320,
      isVeg: true,
      spiceLevel: 1
    }
  ]);

  console.log("Seed complete");
  console.log("Owner login: owner@odine.test / password123");
  console.log("Manager login: manager@odine.test / password123");
  console.log("Chef login: chef@odine.test / password123");
  console.log(`Restaurant: ${restaurant._id}`);
  console.log(`Demo table: ${tables[0]._id}`);
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
