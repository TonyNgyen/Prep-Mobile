import { InventoryIngredient, InventoryRecipe, Recipe, UserInventory } from '~/types';
import { supabase } from '~/utils/supabase';

type ItemsToAdd = Record<string, InventoryIngredient | InventoryRecipe>;

const fetchUserInventory = async (userId: string | undefined) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('inventory')
      .eq('uid', userId)
      .single();
    if (!data) {
      return {};
    }
    if (error) console.log(error);
    return data['inventory'];
  } catch (error) {
    console.log(error);
  }
};

const addIngredientToInventory = (
  inventory: Record<string, InventoryIngredient | InventoryRecipe>,
  inventoryIngredient: InventoryIngredient
) => {
  try {
    if (inventoryIngredient.id in inventory) {
      inventory[inventoryIngredient.id].totalAmount =
        inventory[inventoryIngredient.id].totalAmount + inventoryIngredient.totalAmount;
    } else {
      inventory[inventoryIngredient.id] = inventoryIngredient;
    }
    console.log(inventory);
    return inventory;
  } catch (error) {
    console.log(error);
  }
};

const addRecipeToInventory = (
  inventory: Record<string, InventoryIngredient | InventoryRecipe>,
  recipe: Recipe,
  inventoryRecipe: InventoryRecipe,
  updateIngredients: boolean,
  zeroOutIngredients: boolean
): [boolean, string] => {
  if (updateIngredients) {
    for (const [key, value] of Object.entries(recipe.ingredientList)) {
      if (!(key in inventory)) {
        console.log('key does not exist');
        if (!zeroOutIngredients) {
          console.log('Returning false since no ingredient to update and no zeroing out');
          return [false, 'Ingredient is not in inventory'];
        }
      } else {
        console.log('key does exist');
        let newAmount = inventory[key].totalAmount - value.servingSize * value.numberOfServings;
        if (newAmount < 0) {
          if (!zeroOutIngredients) {
            console.log('Returning false since insufficient ingredient amount and no zeroing out');
            return [false, `Insufficient amount of ${inventory[key].name}`];
          } else {
            newAmount = 0;
          }
        }
        inventory[key].totalAmount = newAmount;
      }
    }
  }

  if (inventoryRecipe.id in inventory) {
    (inventory[inventoryRecipe.id] as InventoryRecipe).totalAmount += inventoryRecipe.totalAmount;
  } else {
    inventory[inventoryRecipe.id] = inventoryRecipe;
  }

  console.log('INVENTORY: ', inventory);
  return [true, 'Successful'];
};

const updateInventoryItem = async (
  inventory: ItemsToAdd,
  inventoryItem: InventoryIngredient | InventoryRecipe
) => {
  try {
    if (inventoryItem.id in inventory) {
      let currentInventoryItem = inventory[inventoryItem.id];
      let updatedTotalAmount = currentInventoryItem.totalAmount - inventoryItem.totalAmount;
      if (updatedTotalAmount == 0) {
        delete inventory[inventoryItem.id];
      } else {
        inventory[inventoryItem.id].totalAmount = updatedTotalAmount;
      }
    } else {
      inventory[inventoryItem.id] = inventoryItem;
    }

    return inventory;
  } catch (error) {
    console.log(error);
  }
};

const updateUserInventory = async (inventory: UserInventory, userId: string | undefined) => {
  try {
    const { error: updateError } = await supabase
      .from('users')
      .update({ inventory })
      .eq('uid', userId);

    if (updateError) {
      console.log(updateError);
      return false;
    }
    return true;
  } catch (error) {}
};

const updateUserInventoryItems = async (itemsToUpdate: ItemsToAdd, userId: string | undefined) => {
  let inventory = await fetchUserInventory(userId);

  for (const item of Object.values(itemsToUpdate)) {
    inventory = await updateInventoryItem(inventory, item);
  }
  await updateUserInventory(inventory, userId);
  return inventory;
};

export {
  fetchUserInventory,
  addIngredientToInventory,
  addRecipeToInventory,
  updateUserInventory,
  updateUserInventoryItems,
};
