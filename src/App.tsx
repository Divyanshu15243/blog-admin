import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/contexts/AuthContext';

import AdminLayout from '@/layouts/AdminLayout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/admin/Dashboard';
import BlogList from '@/pages/admin/BlogList';
import BlogEditor from '@/pages/admin/BlogEditor';
import Categories from '@/pages/admin/Categories';
import Tags from '@/pages/admin/Tags';
import Comments from '@/pages/admin/Comments';
import MediaLibrary from '@/pages/admin/MediaLibrary';
import SEOSettings from '@/pages/admin/SEOSettings';
import UserManagement from '@/pages/admin/UserManagement';
import AdminSettings from '@/pages/admin/AdminSettings';
import Sites from '@/pages/admin/Sites';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="blogs" element={<BlogList />} />
              <Route path="blogs/new" element={<BlogEditor />} />
              <Route path="blogs/:id/edit" element={<BlogEditor />} />
              <Route path="categories" element={<Categories />} />
              <Route path="tags" element={<Tags />} />
              <Route path="comments" element={<Comments />} />
              <Route path="media" element={<MediaLibrary />} />
              <Route path="seo" element={<SEOSettings />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="sites" element={<Sites />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
