import { UnifiedWalletButton } from "@jup-ag/wallet-adapter"
import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center">
      <Link className="flex items-center justify-center" to="/">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/w3Balance_text-jHC4RJAFISZ79tg2SEirFiILEPsQmC.png"
          alt="w3Balance Logo"
          width={150}
          height={40}
          className="mr-2"
        />
        <span className="sr-only">w3Balance</span>
      </Link>
      <nav className="ml-auto flex items-center gap-4 sm:gap-6">
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          to="/dashboard"
        >
          Dashboard
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          to="/contact"
        >
          Contact
        </Link>
        <UnifiedWalletButton />
      </nav>
    </header>
  )
}
