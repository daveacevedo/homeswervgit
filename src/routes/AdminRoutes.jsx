import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import Users from '../pages/admin/Users';
import Providers from '../pages/admin/Providers';
import Settings from '../pages/admin/Settings';
import ContentPages from '../pages/admin/ContentPages';
import PageEditor from '../pages/admin/PageEditor';
import NotFound from '../pages/NotFound';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="providers" element={<Providers />} />
        <Route path="settings" element={<Settings />} />
        <Route path="content" element={<ContentPages />} />
        <Route path="content/new" element={<PageEditor />} />
        <Route path="content/:pageId/edit" element={<PageEditor />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
