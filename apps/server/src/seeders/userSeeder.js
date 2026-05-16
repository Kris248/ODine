import bcrypt from "bcryptjs";
import { USER_ROLES } from "@odine/shared";
import { User } from "../models.js";

export async function seedUsers(restaurant) {
  const passwordHash = await bcrypt.hash("password123", 10);

  return User.create([
    {
      name: "Owner Demo",
      email: "owner@odine.test",
      passwordHash,
      role: USER_ROLES.OWNER,
      restaurantId: restaurant._id
    },
    {
      name: "Manager Demo",
      email: "manager@odine.test",
      passwordHash,
      role: USER_ROLES.MANAGER,
      restaurantId: restaurant._id
    },
    {
      name: "Chef Demo",
      email: "chef@odine.test",
      passwordHash,
      role: USER_ROLES.CHEF,
      restaurantId: restaurant._id
    },
    {
      name: "Platform Demo",
      email: "superadmin@odine.test",
      passwordHash,
      role: USER_ROLES.SUPERADMIN,
      restaurantId: null
    }
  ]);
}
