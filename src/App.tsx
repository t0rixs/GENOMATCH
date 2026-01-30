import { useState, useEffect } from 'react';
import { generateProfiles } from './utils/profileGenerator';
import { Header } from './components/Header';
import { Card } from './components/Card';
import { DetailView } from './components/DetailView';
import { OnboardingModal } from './components/OnboardingModal';
import { AnimatePresence } from 'framer-motion';
import type { Profile } from './types';


function App() {
  // Handle both standard JSON import and ESM module default export
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  useEffect(() => {
    // Generate random profiles on mount
    setProfiles(generateProfiles(128));
  }, []);

  const handleSwipe = (id: number, direction: 'left' | 'right') => {
    // Remove the card immediately as the exit animation has completed in Card component
    console.log(`Swiped ${direction} on profile ${id}`);
    setProfiles((prev) => prev.filter((p) => p.id !== id));
  };

  const openGenomeDetail = (profile: Profile) => {
    setSelectedProfile(profile);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      <Header />

      <main className="relative w-full h-full pt-[80px] px-4 flex justify-center">
        <AnimatePresence>
          {profiles.slice(0, 2).map((profile, index) => {
            // Index 0 is the top card (active), Index 1 is the next card (behind)
            // We need to render them in reverse order of index so Index 0 is on top of Index 1 in the DOM?
            // Or use z-index.
            // If we use z-index, we can map naturally.

            return (
              <Card
                key={profile.id}
                profile={profile}
                onSwipe={(dir) => handleSwipe(profile.id, dir)}
                onTap={() => openGenomeDetail(profile)}
                isFront={index === 0}
                style={{
                  zIndex: 100 - index, // Top card (index 0) gets z-100, next (index 1) gets z-99
                  scale: 1 - index * 0.05,
                  y: index * 10,
                  height: '100%',
                  // filter: index > 0 ? 'brightness(0.5)' : 'none', // Managed in Card? Or keep here.
                  // pointerEvents: index === 0 ? 'auto' : 'none', // Handled by Card internal drag logic more gracefully? or keep.
                  // Keep pointerEvents here for click safety.
                  pointerEvents: index === 0 ? 'auto' : 'none',
                  willChange: 'transform, opacity' // Hardware acceleration hint
                }}
              />
            );
          })}
        </AnimatePresence>

        {profiles.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground animate-pulse">
            <span className="text-xl">このアプリは、人間のゲノム</span>
          </div>
        )}
      </main>

      <AnimatePresence>
        {selectedProfile && (
          <DetailView
            profile={selectedProfile}
            onClose={() => setSelectedProfile(null)}
          />
        )}
      </AnimatePresence>

      <OnboardingModal />
    </div>
  );
}

export default App;
