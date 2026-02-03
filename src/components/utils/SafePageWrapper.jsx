import React from "react";

export default function SafePageWrapper({ children }) {
  return (
    <div 
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        minHeight: '100vh'
      }}
    >
      {children}
    </div>
  );
}