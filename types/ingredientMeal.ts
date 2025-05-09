export type IngredientMeal = {
  id: string;
  name: string;
  containers: number;
  servingSize: number;
  numberOfServings: number;
  totalAmount: number;
  unit: string;
  type: "ingredient";
};
