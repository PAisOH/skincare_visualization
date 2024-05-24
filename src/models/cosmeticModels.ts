export interface Ingredient {
    ingredient_name: string;
    rating: 'BEST' | 'GOOD' | 'AVERAGE' | 'WORST' | 'NOT RATED';
    benefits: string;
    isPreservative: boolean
}

export interface Cosmetic {
    cosmetic_name: string;
    ingredients: Ingredient[];
}

export interface IngredientCount {
    ingredient: Ingredient;
    count: number;
  }