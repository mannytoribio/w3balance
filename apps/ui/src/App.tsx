import "./App.css"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import {
  UnifiedWalletButton,
  UnifiedWalletProvider,
} from "@jup-ag/wallet-adapter"
import LandingPage from "./components/Landing"
import Dashboard from "./components/Dashboard"
import Navbar from "./components/Navbar"

function App() {
  return (
    <UnifiedWalletProvider
      wallets={[]}
      config={{
        autoConnect: false,
        env: "devnet",
        // env: "mainnet-beta",
        metadata: {
          name: "UnifiedWallet",
          description: "UnifiedWallet",
          url: "https://jup.ag",
          iconUrls: ["https://jup.ag/favicon.ico"],
        },
        // notificationCallback: {},
        walletlistExplanation: {
          href: "https://station.jup.ag/docs/additional-topics/wallet-list",
        },
        theme: "dark",
        lang: "en",
      }}
    >
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </UnifiedWalletProvider>
  )
}

export default App
