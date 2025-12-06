import { Carrera } from "../types/carrera";

export type CarrerLevelInfo = {
  [key in Carrera["codigo"]]: {
    start: string;
    end: string;
    gradient: string;
    totalLevels: number;
    coursesPerLevel: number;
  };
};

export const colors: CarrerLevelInfo = {
  8266: {
    start: "hsl(121 30.7% 50.2%)",
    end: "hsl(121 44.3% 34.5%)",
    gradient:
      "dark:from-green-400 dark:to-green-500 from-green-500 to-green-600",
    totalLevels: 8,
    coursesPerLevel: 7,
  },
  8606: {
    start: "hsl(209 88.7% 54.9%)",
    end: "hsl(209 90.8% 33.9%)",
    gradient: "from-blue-400 to-blue-500",
    totalLevels: 10,
    coursesPerLevel: 7,
  },
  8616: {
    start: "hsl(18 87% 51.8%)",
    end: "hsl(18 61.1% 41.4%)",
    gradient: "from-orange-400 to-orange-500",
    totalLevels: 10,
    coursesPerLevel: 8,
  },
};
