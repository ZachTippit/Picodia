import { useState } from 'react';
import PreviewGrid from './PreviewGrid';
import LandingContent from './LandingContent';
import { cn } from '@utils/cn';

const LandingScreen = () => {
  const [isClosing, setIsClosing] = useState(false);

  return (
    <div
      className={cn(
        'absolute top-0 right-0 left-0 bottom-0 z-20 flex flex-col items-center bg-gray-200 transition-opacity duration-500 ease-in-out',
        isClosing ? 'opacity-0 pointer-events-none' : 'opacity-100'
      )}
    >
      <div className="relative flex h-full w-full max-w-sm flex-col items-center px-4 py-6 gap-y-12">
        <h1 className="mb-4 text-2xl">PICODIA</h1>
        <PreviewGrid />
        <LandingContent
          setIsClosing={setIsClosing}
        />
      </div>
    </div>
  );
};

export default LandingScreen;
