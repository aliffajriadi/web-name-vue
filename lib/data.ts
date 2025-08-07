import { Project, Eduorga } from "@/types";
import { schedu, osc, aspirasikita, ifdclass, confess, ttwa, rewa, sentiment, blugWeb, botai } from "@/app/assets/projects";
import { polibatam, blug } from "@/app/assets";

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
    title: "SchedU",
    description:
      "A web-based app for managing academic schedules between students and teachers, featuring calendar integration and real-time notifications.",
    category: "web",
    technologies: ["laravel", "tailwindcss", "mysql", "docker"],
    image: schedu,
    githubUrl: "close",
    liveUrl: "https://polibatam.id/schedu",
  },
  {
    id: 2,
    title: "WhatsApp Bot AI - Event Organizer",
    description:
      "An automated WhatsApp bot integrated with AI to handle participant registration, category selection, and verification for an open-source competition.",
    category: "backend",
    technologies: ["openwa", "llama2 8b"],
    image: botai,
    githubUrl: "close",
  },
  {
    id: 3,
    title: "OSC 2025 - Registration Website",
    description:
      "A responsive website for participant registration, competition category management, and verification system for Open Source Competition 2025.",
    category: "web",
    technologies: ["reactjs", "typescript", "tailwindcss", "googlespreadsheet"],
    image: osc,
    githubUrl: "close",
    liveUrl: "https://osc-2025.pages.dev",
  },
  {
    id: 4,
    title: "Aspirasikita",
    description:
      "A web platform to collect and manage digital suggestions and feedback from users in a structured format.",
    category: "web",
    technologies: ["nextjs", "typescript", "prisma", "postgresql"],
    image: aspirasikita,
    githubUrl: "close",
  },
  {
    id: 5,
    title: "BLUG Profile Website",
    description:
      "A static informational website for Batam Linux User Group to share learning resources, announcements, and event documentation.",
    category: "web",
    technologies: ["react.js", "tailwindcss"],
    image: blugWeb,
    githubUrl: "close",
    liveUrl: "https://blug.polibatam.ac.id",
  },
  {
    id: 6,
    title: "Class Profile Website",
    description:
      "A static class website for sharing learning materials, announcements, and documentation, optimized with responsive design.",
    category: "web",
    technologies: ["vue.js", "tailwindcss"],
    image: ifdclass,
    githubUrl: "close",
    liveUrl: "https://ifdclass.vercel.app",
  },
  {
    id: 7,
    title: "Class Confession Website + WhatsApp Bot",
    description:
      "An anonymous confession platform integrated with a WhatsApp bot for real-time message broadcasting to students.",
    category: "web",
    technologies: ["vue.js", "express", "mongodb", "openwa", "nodejs"],
    image: confess,
    githubUrl: "close",
    liveUrl: "https://waifd.vercel.app",
  },
  {
    id: 8,
    title: "WhatsApp Bot - TikTok & Instagram Downloader",
    description:
      "A WhatsApp bot that downloads videos from TikTok and Instagram using scraping techniques and OpenWA library.",
    category: "backend",
    technologies: ["node.js", "javascript", "openwa", "scraping"],
    image: ttwa,
    githubUrl: "close",
  },
  {
    id: 9,
    title: "WhatsApp Bot - Task Scheduler",
    description:
      "A personal task scheduling bot on WhatsApp, supporting automated reminders and time-based notifications.",
    category: "backend",
    technologies: ["node.js", "javascript", "openwa"],
    image: rewa,
    githubUrl: "close",
  },
  {
    id: 10,
    title: "Sentiment Analysis API",
    description:
      "A lightweight API for analyzing sentiment in text-based notes, designed for integration with writing or journaling tools.",
    category: "backend",
    technologies: ["python", "flask"],
    image: sentiment,
    githubUrl: "close",
  },
];


export const eduorga: Eduorga[] = [
  {
    name: "politechnic state of batam",
    position: "informatics engineering",
    tenure: "3rd semester - present",
    image: polibatam,
    category: "education"
  },
  {
    name: "batam linux user group",
    position: "division of programing",
    tenure: "< 1 year - present",
    image: blug,
    category: "organization"
  },
];
