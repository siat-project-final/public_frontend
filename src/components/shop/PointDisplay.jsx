import React from 'react';

const PointDisplay = ({ point }) => {
  return (
    <div className="inline-block px-5 py-2 bg-white dark:bg-neutral-700 text-zinc-800 dark:text-white rounded-full shadow-md border border-zinc-200 dark:border-neutral-600">
      🪙 내 포인트: <span className="font-bold text-green-600 dark:text-green-300">{point}P</span>
    </div>
  );
};

export default PointDisplay;
