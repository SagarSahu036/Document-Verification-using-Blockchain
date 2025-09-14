import { useState } from "react";
import git from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import UploadZone from "./components/UploadZone";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="py-6 px-8 border-b border-gray-800">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-blue-400">🔐 Blockchain Document Verifier</h1>
          <nav className="space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white">Collaborate</a>
            <a href="#" className="text-gray-400 hover:text-white">FAQ</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Side - Info */}
        <div className="pl-8 lg:pl-16">
          <h2 className="text-3xl font-bold mb-4 text-center">An easy way to check and verify your documents</h2>
          <p className="text-gray-400 mb-8 text-center">
            Whether you are a student or an employer, verify any document here.
          </p>

          {/* What We Can Help You Do */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { title: "View", desc: "Easy way to view your certificate" },
              { title: "Check", desc: "Make sure it has not been tampered with" },
              { title: "Verify", desc: "Find out if it is from a recognised institution" }
            ].map((item, i) => (
              <div key={i} className="bg-gray-800 p-4 rounded-lg text-center">
                <div className="text-xl font-bold text-blue-400">{item.title}</div>
                <div className="text-gray-400 text-sm mt-1">{item.desc}</div>
              </div>
            ))}
          </div>

          {/* How It Works */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">How it works</h3>
            <p className="text-gray-400 mb-3">
              When a document is issued, a unique digital fingerprint (SHA-256 hash) is stored on the blockchain.
            </p>
            <p className="text-gray-400 mb-3">
              When you upload the file here, we generate its hash and compare it with what's on-chain.
            </p>
            <p className="text-gray-400">
              We'll check if the content matches and if it comes from a recognized issuer. That’s how you know it's valid.
            </p>
          </div>
        </div>

        {/* Right Side - Upload Zone */}
        <div className="flex items-center justify-center">
          <UploadZone />
        </div>
      </main>
    </div>
  );
}
export default App;
