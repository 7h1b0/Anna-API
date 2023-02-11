import React from 'react';
import { Outlet, redirect } from 'react-router-dom';

import Navigation from 'components/navigation';

function Layout() {
  return (
    <div className="h-full flex justify-end flex-col xl:flex-row-reverse bg-gray-900">
      <main className="relative flex-1 px-2 xl:px-4 max-w-1200 overflow-y-auto">
        <Outlet />
      </main>
      <Navigation />
    </div>
  );
}

export default Layout;

export const loaderLayout = async () => {
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');

  if (!token) {
    return redirect('/login');
  }

  const headers: Record<string, string> = {
    'x-access-token': token ?? '',
  };
  const { isAway } = await fetch('/api/user', { method: 'GET', headers }).then(
    (res) => res.json(),
  );

  return { username, token, isAway };
};
