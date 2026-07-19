import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RecipeBuilder } from '../components/recipes/RecipeBuilder'
import { LogRecipeModal } from '../components/recipes/LogRecipeModal'
import { useCreateRecipe, useRecipes } from '../hooks/useRecipes'
import type { RecipeWithIngredients } from '../hooks/useRecipes'
import { useFoods } from '../hooks/useFoods'
import { useUser } from '../hooks/useUser'
import { todayDateInputValue } from '../lib/dates'

export function RecipesPage() {
  const { data: user } = useUser()
  const { data: foods } = useFoods()
  const { data: recipes, isLoading } = useRecipes(user?.id)
  const createRecipe = useCreateRecipe()
  const [loggingRecipe, setLoggingRecipe] = useState<RecipeWithIngredients | null>(null)

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-900">Recipes</h1>
        <Link to="/log" className="text-xs font-medium text-slate-500">
          ← Back to log
        </Link>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 p-4">
        <h2 className="text-sm font-medium text-slate-700">Build a recipe</h2>
        <div className="mt-3">
          {user && foods && (
            <RecipeBuilder userId={user.id} foods={foods} onSubmit={(input) => createRecipe.mutate(input)} isSubmitting={createRecipe.isPending} />
          )}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-sm font-medium text-slate-700">Your recipes</h2>
        {isLoading && <p className="mt-2 text-sm text-slate-500">Loading…</p>}
        <ul className="mt-2 divide-y divide-slate-200 rounded-xl border border-slate-200">
          {recipes?.map((recipe) => (
            <li key={recipe.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <div>
                <p className="font-medium text-slate-900">{recipe.name}</p>
                <p className="text-slate-500">{recipe.recipe_ingredients.length} ingredients</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-700">{recipe.total_points} pts</span>
                <button
                  onClick={() => setLoggingRecipe(recipe)}
                  className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Log
                </button>
              </div>
            </li>
          ))}
          {recipes?.length === 0 && <li className="px-4 py-3 text-sm text-slate-500">No recipes yet — build one above.</li>}
        </ul>
      </div>

      {loggingRecipe && user && (
        <LogRecipeModal
          recipe={loggingRecipe}
          userId={user.id}
          loggedDate={todayDateInputValue()}
          dailyPointsAllowance={user.daily_points_allowance}
          onClose={() => setLoggingRecipe(null)}
        />
      )}
    </div>
  )
}
