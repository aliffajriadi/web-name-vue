import { Project, Eduorga } from "@/types";
import { schedu, osc, aspirasikita, ifdclass, confess, ttwa, rewa, sentiment, blugWeb, botai, iot1 } from "@/public/assets/projects";
import { polibatam, blug } from "@/public/assets";

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
    category: "Web",
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
    category: "Backend",
    technologies: ["openwa", "llama2 8b"],
    image: botai,
    githubUrl: "close",
  },
  {
    id: 3,
    title: "OSC 2025 - Registration Website",
    description:
      "A responsive website for participant registration, competition category management, and verification system for Open Source Competition 2025.",
    category: "Web",
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
    category: "Web",
    technologies: ["nextjs", "typescript", "prisma", "postgresql"],
    image: aspirasikita,
    githubUrl: "close",
  },
  {
    id: 5,
    title: "BLUG Profile Website",
    description:
      "A static informational website for Batam Linux User Group to share learning resources, announcements, and event documentation.",
    category: "Web",
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
    category: "Web",
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
    category: "Web",
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
    category: "Backend",
    technologies: ["node.js", "javascript", "openwa", "scraping"],
    image: ttwa,
    githubUrl: "close",
  },
  {
    id: 9,
    title: "WhatsApp Bot - Task Scheduler",
    description:
      "A personal task scheduling bot on WhatsApp, supporting automated reminders and time-based notifications.",
    category: "Backend",
    technologies: ["node.js", "javascript", "openwa"],
    image: rewa,
    githubUrl: "close",
  },
  {
    id: 10,
    title: "Sentiment Analysis API",
    description:
      "A lightweight API for analyzing sentiment in text-based notes, designed for integration with writing or journaling tools.",
    category: "Backend",
    technologies: ["python", "flask"],
    image: sentiment,
    githubUrl: "close",
  },
  {
    id: 11,
    title: "Smart Student Access System Based on RFID with Web Monitoring and Daily Activity Tracking",
    description:
      "This system is designed to enhance school security and efficiency by using RFID technology for student access. It provides a web-based monitoring dashboard that allows administrators and teachers to track student attendance, entry and exit times, and daily activities in real-time. The solution helps improve discipline, transparency, and data accuracy within the school environment.",
    category: "Internet of Things",
    technologies: ["esp8266", "rfid", "oled", "nextjs", "express", "mqtt", "http restapi"],
    image: iot1,
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
