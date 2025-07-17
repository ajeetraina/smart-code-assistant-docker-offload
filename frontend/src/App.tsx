import React from 'react';
import CodeAssistant from './components/CodeAssistant';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <CodeAssistant />
      </main>
      <Footer />
    </div>
  );
}

export default App;