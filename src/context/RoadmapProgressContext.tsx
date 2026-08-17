"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface RoadmapProgressContextType {
  completedTopicIds: string[];
  isTopicCompleted: (topicId: string) => boolean;
  toggleTopicCompleted: (topicId: string) => void;
  getRoadmapProgress: (topicIds: string[]) => {
    completed: number;
    total: number;
    percentage: number;
  };
}

const RoadmapProgressContext = createContext<RoadmapProgressContextType | undefined>(undefined);

const STORAGE_KEY = "devprep_completed_topics";

export const RoadmapProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCompletedTopicIds(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage errors
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const toggleTopicCompleted = (topicId: string) => {
    setCompletedTopicIds((prev) => {
      const isAlreadyCompleted = prev.includes(topicId);
      const updated = isAlreadyCompleted
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId];

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }

      return updated;
    });
  };

  const isTopicCompleted = (topicId: string): boolean => {
    if (!isHydrated) return false;
    return completedTopicIds.includes(topicId);
  };

  const getRoadmapProgress = (topicIds: string[]) => {
    if (!topicIds.length) return { completed: 0, total: 0, percentage: 0 };
    const completed = topicIds.filter((id) => completedTopicIds.includes(id)).length;
    const total = topicIds.length;
    const percentage = Math.round((completed / total) * 100);
    return { completed, total, percentage };
  };

  return (
    <RoadmapProgressContext.Provider
      value={{
        completedTopicIds,
        isTopicCompleted,
        toggleTopicCompleted,
        getRoadmapProgress,
      }}
    >
      {children}
    </RoadmapProgressContext.Provider>
  );
};

export function useRoadmapProgress() {
  const context = useContext(RoadmapProgressContext);
  if (!context) {
    throw new Error("useRoadmapProgress must be used within a RoadmapProgressProvider");
  }
  return context;
}
