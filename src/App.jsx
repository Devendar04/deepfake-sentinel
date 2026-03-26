import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Landing from "./pages/landing";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/"    element={<Landing />} />
          <Route path="/app" element={<Index />} />
          <Route path="*"    element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;