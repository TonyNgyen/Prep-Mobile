import { InventoryIngredient } from "./inventoryIngredient";
import { InventoryRecipe } from "./inventoryRecipe";

export type UserInventory = Record<
  string,
  InventoryIngredient | InventoryRecipe
>;
