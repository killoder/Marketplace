import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Sold } from './pages/Sold';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'sold', Component: Sold },
      { path: '*', Component: () => <Navigate to="/" replace /> },
    ],
  },
]);
