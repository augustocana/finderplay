import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SimpleUserProvider, useSimpleUser } from "./hooks/useSimpleUser";
import { WelcomeScreen } from "./components/WelcomeScreen";
import GamesPage from "./pages/GamesPage";
import GameDetailsPage from "./pages/GameDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Componente que verifica se o usuário já se identificou
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, isFirstAccess } = useSimpleUser();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!user || isFirstAccess) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Componente que redireciona usuários já logados
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, isFirstAccess } = useSimpleUser();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (user && !isFirstAccess) {
    return <Navigate to="/games" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Página inicial - Welcome */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <WelcomeScreen />
          </PublicRoute>
        }
      />

      {/* Páginas protegidas */}
      <Route
        path="/games"
        element={
          <ProtectedRoute>
            <GamesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/game/:gameId"
        element={
          <ProtectedRoute>
            <GameDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SimpleUserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </SimpleUserProvider>
  </QueryClientProvider>
);

export default App;
