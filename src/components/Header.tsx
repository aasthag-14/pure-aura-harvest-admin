import React from "react";

const Header = () => {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-gray-100 shadow-md">
      <h1 className="text-xl font-bold text-gray-800">Pure Aura Harvest</h1>
      <button className="text-blue-600 font-medium hover:underline">
        Login
      </button>
    </div>
  );
};

export default Header;
