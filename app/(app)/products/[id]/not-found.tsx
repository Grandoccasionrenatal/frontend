import React from 'react';

export default function NotFound() {
  return (
    <main className="w-full h-[100vh] flex items-center justify-center gap-4">
      <span className="font-[700]">Not Found</span>
      <div className="h-[2rem] border-l-4 border-l-orange-1" />
      <span className="font-[700]">404</span>
    </main>
  );
}
