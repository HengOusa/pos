import React from "react";

const WelcomePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-10 text-center max-w-md">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome 👋</h1>
        <p className="text-gray-600 mb-6">
          We're happy to see you here. Start building something amazing today.
        </p>

        <div className="flex gap-4 justify-center">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition">
            Get Started
          </button>
          <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded-xl hover:bg-blue-50 transition">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
