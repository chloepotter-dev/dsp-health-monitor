import React from "react";
import Dashboard from "./Dashboard";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="max-w-6xl mx-auto mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          System Operations & Health Monitoring
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Real-time DSP link reconciliation engine and automated incident reporting dashboard.
        </p>
      </header>
      
      <main className="max-w-6xl mx-auto">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
