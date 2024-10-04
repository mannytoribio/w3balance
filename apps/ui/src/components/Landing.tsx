import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, ScrollText, ShieldCheck, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage: FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-24 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Automatic Porftolio Optimization.
                  <br /> Easy. Safe. OPOS.
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                  Automated rebalancing for your cryptocurrency investments.
                  <br />
                  Stay ahead of the market with w3Balance.
                </p>
              </div>
              <div className="space-x-4">
                <Link to="/demo">
                  <Button className="bg-black text-white hover:bg-gray-800">
                    Try Devnet Demo
                  </Button>
                </Link>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-24 bg-gray-100 rounded-[10px] shadow-custom-shadow">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <ScrollText className="h-12 w-12 text-black" />
                <h2 className="text-2xl font-bold">Smart Contract</h2>
                <p className="text-gray-600">
                  Solana's first smart contract driven secure, non-custodial,
                  allocation management tool.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <Scale className="h-12 w-12 text-black" />
                <h2 className="text-2xl font-bold">Automatic Rebalancing</h2>
                <p className="text-gray-600">
                  Keep your portfolio balanced with automated adjustments,
                  saving you time and maximizing returns.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <ShieldCheck className="h-12 w-12 text-black" />
                <h2 className="text-2xl font-bold">Secure Platform</h2>
                <p className="text-gray-600">
                  Your assets can only ever be withdrawn to your original
                  wallet.
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
                  By signing up, you agree to our{' '}
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
          © 2024 w3Balance. All rights reserved.
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
  );
};

export default LandingPage;
