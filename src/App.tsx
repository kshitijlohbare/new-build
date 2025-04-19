import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider, ToastViewport } from "./components/ui/toast";
import AppLayout from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Practices from "./pages/Practices";
import Progress from "./pages/Progress";
import Meditation from "./pages/Meditation";
import './App.css';

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <ToastProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Index />} />
              <Route path="dashboard" element={<Navigate to="/" replace />} />
              <Route path="practices" element={<Practices />} />
              <Route path="progress" element={<Progress />} />
              <Route path="meditation" element={<Meditation />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
      <ToastViewport />
    </ToastProvider>
  </ThemeProvider>
);

export default App;
