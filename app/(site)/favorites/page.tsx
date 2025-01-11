import React, { Suspense } from "react";
import FavoritePage from "./FavoritePage";


const Favorites = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <div className="w-full min-h-screen py-24">
        <FavoritePage />
        </div>
    </Suspense>
  );
};

export default Favorites;
