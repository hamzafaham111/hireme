import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { BlogDataProvider } from './context/BlogDataContext'
import { OperationsDataProvider } from './context/OperationsDataContext'
import DashboardShell from './layouts/DashboardShell'
import { BlogFormPage } from './pages/blog/BlogFormPage'
import { BlogListPage } from './pages/blog/BlogListPage'
import { LoginPage } from './pages/LoginPage'
import { OverviewPage } from './pages/OverviewPage'
import { RolesPage } from './pages/RolesPage'
import { JobDetailPage } from './pages/jobs/JobDetailPage'
import { JobFormPage } from './pages/jobs/JobFormPage'
import { JobsListPage } from './pages/jobs/JobsListPage'
import { WorkerDetailPage } from './pages/workers/WorkerDetailPage'
import { WorkerFormPage } from './pages/workers/WorkerFormPage'
import { UserDetailPage } from './pages/users/UserDetailPage'
import { UserFormPage } from './pages/users/UserFormPage'
import { UsersListPage } from './pages/users/UsersListPage'
import { SiteServiceFormPage } from './pages/site-services/SiteServiceFormPage'
import { SiteServicesListPage } from './pages/site-services/SiteServicesListPage'
import { WorkersListPage } from './pages/workers/WorkersListPage'
import { ProtectedRoute } from './routes/ProtectedRoute'

export default function App() {
  return (
    <AuthProvider>
      <OperationsDataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <BlogDataProvider>
                    <DashboardShell />
                  </BlogDataProvider>
                </ProtectedRoute>
              }
            >
              <Route index element={<OverviewPage />} />
              <Route path="users/new" element={<UserFormPage />} />
              <Route path="users/:userId/edit" element={<UserFormPage />} />
              <Route path="users/:userId" element={<UserDetailPage />} />
              <Route path="users" element={<UsersListPage />} />
              <Route path="workers/new" element={<WorkerFormPage />} />
              <Route path="workers/:workerId/edit" element={<WorkerFormPage />} />
              <Route path="workers/:workerId" element={<WorkerDetailPage />} />
              <Route path="workers" element={<WorkersListPage />} />
              <Route path="jobs/new" element={<JobFormPage />} />
              <Route path="jobs/:jobId/edit" element={<JobFormPage />} />
              <Route path="jobs/:jobId" element={<JobDetailPage />} />
              <Route path="jobs" element={<JobsListPage />} />
              <Route path="roles" element={<RolesPage />} />
              <Route path="blog/new" element={<BlogFormPage />} />
              <Route path="blog/:postId/edit" element={<BlogFormPage />} />
              <Route path="blog" element={<BlogListPage />} />
              <Route path="site-services/new" element={<SiteServiceFormPage />} />
              <Route path="site-services/:serviceId/edit" element={<SiteServiceFormPage />} />
              <Route path="site-services" element={<SiteServicesListPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </OperationsDataProvider>
    </AuthProvider>
  )
}
