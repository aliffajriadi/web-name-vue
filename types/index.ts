import { StaticImageData } from "next/image";

export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  image: StaticImageData;
  githubUrl?: string;
  liveUrl?: string;
}

export interface Eduorga {
  name: string;
  position: string;
  tenure: string;
  category: string;
  image: StaticImageData;
}