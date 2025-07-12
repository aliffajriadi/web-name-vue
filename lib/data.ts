import { Project } from "@/types";
import { schedu, osc, aspirasikita, ifdclass, confess, ttwa, rewa, sentiment } from "@/app/assets/projects";

//data sosmed
export const igdata: string = "https://www.instagram.com/alfjrd_/";
export const gitdata: string = "https://github.com/aliffajriadi";
export const lkdata: string = "https://www.linkedin.com/in/alif-fajriadi-434815276/";
export const emaildata: string = "aliffajriadi@gmail.com";


//data projects
//
export const projects: Project[] = [
  {
    id: 1,
    title: "schedu",
    description:
      "web-based application for managing academic schedules between students and teachers, featuring real-time notifications and calendar integration.",
    category: "web",
    technologies: ["laravel", "tailwindcss", "mysql", "docker"],
    image: schedu,
    githubUrl: "close",
    liveUrl: "close",
  },
  {
    id: 2,
    title: "open source competition website register",
    description:
      "web-based registration system for managing participants, competition categories, and verification in an open source event by batam linux user group.",
    category: "web",
    technologies: ["reactjs", "typescript", "tailwindcss", "googlespreadsheet"],
    image: osc,
    githubUrl: "close",
    liveUrl: "https://osc-2025.pages.dev",
  },
  {
    id: 3,
    title: "aspirasikita",
    description:
      "web platform for collecting and managing digital aspirations or suggestions from users in an organized and structured format.",
    category: "web",
    technologies: ["nextjs", "typescript", "prisma", "postgresql"],
    image: aspirasikita,
    githubUrl: "close",
  },
  {
    id: 4,
    title: "website for class",
    description:
      "static class website for sharing learning resources, announcements, and documentation with responsive design.",
    category: "web",
    technologies: ["vue.js", "tailwindcss"],
    image: ifdclass,
    githubUrl: "close",
    liveUrl: "https://ifdclass.vercel.app",
  },
  {
    id: 5,
    title: "web confess class integrated bot whatsapp",
    description:
      "anonymous confession website for students integrated with a whatsapp bot, allowing real-time message broadcasting.",
    category: "web",
    technologies: ["vue.js", "express", "mongodb", "openwa", "nodejs"],
    image: confess,
    githubUrl: "close",
    liveUrl: "https://waifd.vercel.app",
  },
  {
    id: 6,
    title: "bot whatsapp downloading tiktok & instagram",
    description:
      "whatsapp bot for downloading videos from tiktok and instagram using scraping techniques and openwa library.",
    category: "backend",
    technologies: ["node.js", "javascript", "openwa", "scraping"],
    image: ttwa,
    githubUrl: "close",
  },
  {
    id: 7,
    title: "bot whatsapp for scheduling task",
    description:
      "whatsapp automation bot for personal task scheduling, built with openwa and supports reminder features.",
    category: "backend",
    technologies: ["node.js", "javascript", "openwa"],
    image: rewa,
    githubUrl: "close",
  },
  {
    id: 8,
    title: "api analytic sentiment notes",
    description:
      "api service for sentiment analysis on text-based notes using python and flask, designed for integration with writing tools.",
    category: "backend",
    technologies: ["python", "flask"],
    image: sentiment,
    githubUrl: "close",
  },
];

