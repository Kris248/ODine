import { connectDb } from "../db.js";
import { CheckoutSession, MenuItem, MenuCategory, Order, PaymentEvent, Restaurant, Table, User } from "../models.js";
import { seedRestaurant } from "./restaurantSeeder.js";
import { seedTables } from "./tableSeeder.js";
import { seedMenuCategories } from "./menuCategorySeeder.js";
import { seedMenuItems } from "./menuItemSeeder.js";
import { seedUsers } from "./userSeeder.js";
import { seedDemoOrder } from "./orderSeeder.js";

export async function runSeed() {
  await connectDb();

  await Promise.all([
    PaymentEvent.deleteMany({}),
    Order.deleteMany({}),
    CheckoutSession.deleteMany({}),
    MenuItem.deleteMany({}),
    MenuCategory.deleteMany({}),
    Table.deleteMany({}),
    User.deleteMany({}),
    Restaurant.deleteMany({})
  ]);

  const restaurant = await seedRestaurant();
  await seedUsers(restaurant);
  const tables = await seedTables(restaurant);
  const categories = await seedMenuCategories(restaurant._id);
  const menuItems = await seedMenuItems(restaurant._id, categories);
  await seedDemoOrder({ restaurant, tables, menuItems });

  console.log("Seed complete");
  console.log("Owner login: owner@odine.test / password123");
  console.log("Chef login: chef@odine.test / password123");
  console.log(`Restaurant slug: ${restaurant.slug}`);
  console.log(`Demo table route: /table/${restaurant.slug}/${tables[0].code}?seat=seat-1`);
  console.log("Customer app example: open this in your browser after starting customer app:");
  console.log(`${process.env.CLIENT_URL_CUSTOMER || "http://localhost:5174"}/table/${restaurant.slug}/${tables[0].code}?seat=seat-1`);
}
