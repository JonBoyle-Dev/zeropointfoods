import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OnboardingForm } from '../onboarding/OnboardingForm'
import { useUsers, useCreateUser } from '../../hooks/useUser'
import type { OnboardingInput } from '../../hooks/useUser'
import { useProfileContext } from '../../context/ProfileContext'

export function ProfilePicker() {
  const { data: profiles, isLoading } = useUsers()
  const { setCurrentProfileId } = useProfileContext()
  const createUser = useCreateUser()
  const navigate = useNavigate()
  const [addingProfile, setAddingProfile] = useState(false)

  function selectProfile(profileId: string) {
    setCurrentProfileId(profileId)
    navigate('/today')
  }

  function handleCreateProfile(input: OnboardingInput) {
    createUser.mutate(input, {
      onSuccess: (user) => selectProfile(user.id),
    })
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-xl font-semibold text-slate-900">
        zeropoint<span className="text-amber-600">foods</span>
      </h1>
      <p className="mt-1 text-sm text-slate-500">Who's tracking?</p>

      {isLoading && <p className="mt-4 text-sm text-slate-500">Loading…</p>}

      <div className="mt-6 grid grid-cols-2 gap-3">
        {profiles?.map((profile) => (
          <button
            key={profile.id}
            onClick={() => selectProfile(profile.id)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-6 text-center text-sm font-semibold text-slate-900 hover:border-slate-400"
          >
            {profile.name}
          </button>
        ))}
      </div>

      {!addingProfile ? (
        <button
          onClick={() => setAddingProfile(true)}
          className="mt-4 w-full rounded-xl border-[1.5px] border-dashed border-slate-400 py-3.5 text-center text-sm font-medium text-slate-600"
        >
          + Add a profile
        </button>
      ) : (
        <div className="mt-6 rounded-xl border border-slate-200 p-4">
          <h2 className="mb-3 text-sm font-medium text-slate-700">New profile</h2>
          <OnboardingForm onSubmit={handleCreateProfile} isSubmitting={createUser.isPending} />
          {createUser.isError && <p className="mt-3 text-sm text-red-600">{(createUser.error as Error).message}</p>}
        </div>
      )}
    </div>
  )
}
