import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <section className='min-h-screen flex items-center justify-center bg-background'>
      <div className='container flex max-w-3xl items-center justify-center'>
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary: "bg-primary hover:bg-primary/90",
              card: "bg-card border-border",
              headerTitle: "text-foreground",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton: "border-border text-foreground hover:bg-muted",
              formFieldLabel: "text-foreground",
              formFieldInput: "bg-input border-border text-foreground",
              footerActionLink: "text-primary hover:text-primary/90",
            },
          }}
        />
      </div>
    </section>
  )
}
