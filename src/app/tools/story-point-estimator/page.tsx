
'use client'

import StoryPointsEstimator from '@/components/story-point-estimator';
import Image from 'next/image';

const HomePage = () => {
  

  return (
    <main className='mx-auto mt-6  px-3 font-[family-name:var(--font-geist-sans)] sm:mt-3 sm:gap-12 sm:px-0'>
        <StoryPointsEstimator />
    </main>
  );
};

export default HomePage;