import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { UnifiedWalletProvider } from '@jup-ag/wallet-adapter';
import LandingPage from './components/Landing';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import ContactPage from './components/ContactPage';
import { Demo } from './components/Demo';
import { CreatePortfolioPage } from './components/CreatePortfolio';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from './trpc';
import { CongratsPortfolio } from './components/CongratsPortfolio';
import { ViewPortfolioPage } from './components/PortfolioView';

const baseUrl = 'https://trpc-1037883282783.us-east4.run.app';

function App() {
  const queryClient = new QueryClient();
  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: `${baseUrl}/trpc`,
        // async headers() {
        //   const auth = getAuth();
        //   const jwt = await auth.currentUser?.getIdToken();
        //   if (jwt) {
        //     return {
        //       Authorization: jwt,
        //     };
        //   } else {
        //     return {};
        //   }
        // },
      }),
    ],
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <UnifiedWalletProvider
          wallets={[]}
          config={{
            autoConnect: true,
            env: 'devnet',
            // env: "mainnet-beta",
            metadata: {
              name: 'UnifiedWallet',
              description: 'UnifiedWallet',
              url: 'https://jup.ag',
              iconUrls: ['https://jup.ag/favicon.ico'],
            },
            // notificationCallback: {},
            walletlistExplanation: {
              href: 'https://station.jup.ag/docs/additional-topics/wallet-list',
            },
            theme: 'dark',
            lang: 'en',
          }}
        >
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/demo" element={<Demo />} />
              <Route
                path="/portfolio/:accountKey"
                element={<ViewPortfolioPage />}
              />
              <Route
                path="/create-portfolio"
                element={<CreatePortfolioPage />}
              />
              <Route
                path="/congrats-portfolio"
                element={<CongratsPortfolio />}
              />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </Router>
        </UnifiedWalletProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
