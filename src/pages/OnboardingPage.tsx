import { OnboardingForm } from '../components/onboarding/OnboardingForm'
import { useCreateUser } from '../hooks/useUser'

export function OnboardingPage() {
  const createUser = useCreateUser()

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-xl font-semibold text-slate-900">Welcome to zeropointfoods</h1>
      <p className="mt-1 text-sm text-slate-500">
        A few details to work out your personal daily points allowance.
      </p>
      <div className="mt-6">
        <OnboardingForm onSubmit={(input) => createUser.mutate(input)} isSubmitting={createUser.isPending} />
      </div>
      {createUser.isError && (
        <p className="mt-3 text-sm text-red-600">{(createUser.error as Error).message}</p>
      )}
    </div>
  )
}
