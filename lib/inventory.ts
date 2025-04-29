import { InventoryIngredient, InventoryRecipe } from '~/types';
import { supabase } from '~/utils/supabase';

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

export { fetchUserInventory, addIngredientToInventory };
