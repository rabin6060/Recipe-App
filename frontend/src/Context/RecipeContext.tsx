
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define a type for the context value
interface RecipeContextType {
  recipe: RecipeData | undefined ;
  setRecipe: (recipe: RecipeData ) => void;
  loading: boolean | false;
  setLoading:(recipe: boolean | false) => void;
  recipes: RecipeData[] | undefined;
  setRecipes: (recipes: RecipeData[]) => void;
}

// Create the context with a default value
const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

// Create a provider component
const RecipeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  
  const [loading, setLoading] = useState<boolean>(true);
  const [recipe, setRecipe] = useState<RecipeData>();
  const [recipes, setRecipes] = useState<RecipeData[]>();

  

  return <RecipeContext.Provider value={{ recipe, setRecipe, loading,setLoading, recipes, setRecipes }}>{children}</RecipeContext.Provider>;
};

// Create a custom hook to use the RecipeContext
const useRecipe = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipe must be used within a RecipeProvider');
  }
  return context;
};

export { RecipeProvider, useRecipe };
