'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ShortlistBike {
  slug: string;
  brand: string;
  model: string;
  image?: string;
}

interface ShortlistContextType {
  shortlist: ShortlistBike[];
  addToShortlist: (bike: ShortlistBike) => void;
  removeFromShortlist: (slug: string) => void;
  isInShortlist: (slug: string) => boolean;
  clearShortlist: () => void;
}

const ShortlistContext = createContext<ShortlistContextType | undefined>(undefined);

export function ShortlistProvider({ children }: { children: React.ReactNode }) {
  const [shortlist, setShortlist] = useState<ShortlistBike[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('harkuhh_shortlist');
    if (saved) {
      try {
        setShortlist(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse shortlist:', e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('harkuhh_shortlist', JSON.stringify(shortlist));
    }
  }, [shortlist, isInitialized]);

  const addToShortlist = (bike: ShortlistBike) => {
    if (!shortlist.find(s => s.slug === bike.slug)) {
      setShortlist(prev => [...prev.slice(-2), bike]); // Max 3 items
    }
  };

  const removeFromShortlist = (slug: string) => {
    setShortlist(prev => prev.filter(s => s.slug !== slug));
  };

  const isInShortlist = (slug: string) => !!shortlist.find(s => s.slug === slug);

  const clearShortlist = () => setShortlist([]);

  return (
    <ShortlistContext.Provider value={{ shortlist, addToShortlist, removeFromShortlist, isInShortlist, clearShortlist }}>
      {children}
    </ShortlistContext.Provider>
  );
}

export function useShortlist() {
  const context = useContext(ShortlistContext);
  if (context === undefined) {
    throw new Error('useShortlist must be used within a ShortlistProvider');
  }
  return context;
}
