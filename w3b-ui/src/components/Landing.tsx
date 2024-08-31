import { FC } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, BarChart2, Lock, RefreshCw } from "lucide-react"

const LandingPage: FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <header className="px-4 lg:px-6 h-16 flex items-center">
        <a className="flex items-center justify-center" href="#">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/w3Balance_text-jHC4RJAFISZ79tg2SEirFiILEPsQmC.png"
            alt="w3Balance Logo"
            width={150}
            height={40}
            className="mr-2"
          />
          <span className="sr-only">w3Balance</span>
        </a>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Features
          </a>
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Pricing
          </a>
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            About
          </a>
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Contact
          </a>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Optimize Your Crypto Portfolio
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                  Automated rebalancing for your cryptocurrency investments.
                  Stay ahead of the market with w3Balance.
                </p>
              </div>
              <div className="space-x-4">
                {/* <Button className="bg-black text-white hover:bg-gray-800">
                  Get Started
                </Button>
                <Button variant="outline">Learn More</Button> */}
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <BarChart2 className="h-12 w-12 text-black" />
                <h2 className="text-2xl font-bold">Smart Allocation</h2>
                <p className="text-gray-600">
                  Our AI-driven algorithms optimize your portfolio based on
                  market trends and your risk profile.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <RefreshCw className="h-12 w-12 text-black" />
                <h2 className="text-2xl font-bold">Automatic Rebalancing</h2>
                <p className="text-gray-600">
                  Keep your portfolio balanced with automated adjustments,
                  saving you time and maximizing returns.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <Lock className="h-12 w-12 text-black" />
                <h2 className="text-2xl font-bold">Secure Platform</h2>
                <p className="text-gray-600">
                  Your assets are protected with industry-leading security
                  measures and encryption.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Start Balancing Today
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-600 md:text-xl">
                  Join thousands of investors who trust w3Balance for their
                  crypto portfolio management.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button
                    className="bg-black text-white hover:bg-gray-800"
                    type="submit"
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Sign Up
                  </Button>
                </form>
                <p className="text-xs text-gray-600">
                  By signing up, you agree to our{" "}
                  <a className="underline underline-offset-2" href="#">
                    Terms & Conditions
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-300">
        <p className="text-xs text-gray-600">
          © 2023 w3Balance. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </a>
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </a>
        </nav>
      </footer>
    </div>
  )
}

export default LandingPage
