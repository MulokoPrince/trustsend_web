import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Pricing } from "./pages/Pricing";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { RequireAuth } from "./components/RequireAuth";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import { Overview } from "./pages/dashboard/Overview";
import { TransactionsPage } from "./pages/dashboard/TransactionsPage";
import { WalletPage } from "./pages/dashboard/WalletPage";
import { AddWalletPage } from "./pages/dashboard/AddWalletPage";
import { DepositPage } from "./pages/dashboard/DepositPage";
import { WithdrawPage } from "./pages/dashboard/WithdrawPage";
import { ApiKeysPage } from "./pages/dashboard/ApiKeysPage";
import { CardsPage } from "./pages/dashboard/CardsPage";
import { CreateCardPage } from "./pages/dashboard/CreateCardPage";
import { CardDetailPage } from "./pages/dashboard/CardDetailPage";
import { WebhooksPage } from "./pages/dashboard/WebhooksPage";
import { ProfilePage } from "./pages/dashboard/ProfilePage";
import { NotificationsPage } from "./pages/dashboard/NotificationsPage";
import { KycPage } from "./pages/dashboard/KycPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Overview />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="wallet" element={<WalletPage />} />
        <Route path="wallet/new" element={<AddWalletPage />} />
        <Route path="deposit" element={<DepositPage />} />
        <Route path="withdraw" element={<WithdrawPage />} />
        <Route path="cards" element={<CardsPage />} />
        <Route path="cards/new" element={<CreateCardPage />} />
        <Route path="cards/:id" element={<CardDetailPage />} />
        <Route path="api-keys" element={<ApiKeysPage />} />
        <Route path="webhooks" element={<WebhooksPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="kyc" element={<KycPage />} />
      </Route>
    </Routes>
  );
}

export default App;
