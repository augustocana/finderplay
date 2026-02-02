import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SimpleUserProvider, useSimpleUser } from "./hooks/useSimpleUser";
import { IdentificationModal } from "./components/IdentificationModal";
import HomePage from "./pages/HomePage";
import GamesPage from "./pages/GamesPage";
import GameDetailsPage from "./pages/GameDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Componente que só mostra loading enquanto verifica localStorage
const LoadingWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useSimpleUser();

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
        {/* Home - página principal (sempre acessível) */}
        <Route path="/" element={<HomePage />} />

        {/* Lista de jogos (sempre acessível) */}
        <Route path="/games" element={<GamesPage />} />

        {/* Detalhes do jogo (sempre acessível) */}
        <Route path="/game/:gameId" element={<GameDetailsPage />} />

        {/* Perfil (sempre acessível) */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Modal de identificação global */}
      <IdentificationModal />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SimpleUserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <LoadingWrapper>
            <AppRoutes />
          </LoadingWrapper>
        </BrowserRouter>
      </TooltipProvider>
    </SimpleUserProvider>
  </QueryClientProvider>
);

export default App;
