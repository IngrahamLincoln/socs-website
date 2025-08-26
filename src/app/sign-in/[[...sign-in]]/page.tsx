import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-primary-600 hover:bg-primary-700',
            footerActionLink: 'text-primary-600 hover:text-primary-700',
          }
        }}
      />
    </div>
  )
}