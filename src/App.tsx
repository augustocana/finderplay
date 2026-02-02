import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { AuthModal } from "./components/AuthModal";
import HomePage from "./pages/HomePage";
import GamesPage from "./pages/GamesPage";
import GameDetailsPage from "./pages/GameDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Componente de loading enquanto verifica sessão
const LoadingWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <>
      <Routes>
        {/* Home - página principal */}
        <Route path="/" element={<HomePage />} />

        {/* Lista de jogos */}
        <Route path="/games" element={<GamesPage />} />

        {/* Detalhes do jogo */}
        <Route path="/game/:gameId" element={<GameDetailsPage />} />

        {/* Perfil */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Modal de autenticação global */}
      <AuthModal />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <LoadingWrapper>
            <AppRoutes />
          </LoadingWrapper>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
