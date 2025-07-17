"use client";
import { MenuBar } from "@/components/manual/MenuBar";
import { Typewriter } from "react-simple-typewriter";
import { Button } from "@/components/ui/button";
import { Mail, GraduationCap, Users } from "lucide-react";
import Footer from "@/components/manual/Footer";
import {
  laravel,
  express,
  mongodb,
  mysql,
  nextdotjs,
  react,
  tailwind,
  typescript,
} from "@/app/assets";
import Image from "next/image";
import { eduorga } from "@/lib/data";
import Link from "next/link";

export default function Home() {
  interface techStackType {
    icon: string;
    label: string;
  }
  const techStack: techStackType[] = [
    { icon: laravel, label: "laravel" },
    { icon: express, label: "express" },
    { icon: mongodb, label: "mongodb" },
    { icon: mysql, label: "mysql" },
    { icon: nextdotjs, label: "next.js" },
    { icon: react, label: "react.js" },
    { icon: tailwind, label: "tailwindcss" },
    { icon: typescript, label: "typescript" },
  ];

  return (
    <div className="">
      <MenuBar />
      <div className="bg-primary mb-4 text-secondary px-6 py-10">
        <h1 className="text-6xl">hello, im alif</h1>
        <p className="text-2xl font-medium">
          <Typewriter
            words={[
              "software developer",
              "fullstack developer",
              "frontend developer",
              "backend engineer",
              "linux enthusiast",
            ]}
            loop={0} // 0 = infinite loop
            cursor
            cursorStyle="|"
            typeSpeed={80}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </p>
        <Button variant="secondary" className="mt-2">
          <Link href="/contact" className="flex items-center gap-1" >contact me <Mail /></Link>
          
        </Button>
      </div>
      <hr />
      <div className="px-6 py-8 space-y-2">
        <h3 className="text-2xl font-semibold">what about me?</h3>
        <p className="text-sm text-muted-foreground">
          Im a passionate software developer with a strong interest in building
          efficient, user-friendly, and scalable applications. Currently
          exploring full-stack development and IoT-based systems, I enjoy
          turning ideas into real, functional solutions. My journey began with
          curiosity and continues with continuous learning and real-world
          projects.
        </p>
      </div>
      <hr />
      <div className="px-6 py-8 space-y-2">
        <h3 className="text-2xl">my tech stack.</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {techStack.map((iconT, i) => (
            <div key={i} className="flex items-center space-x-2">
              <Image src={iconT.icon} alt={iconT.label} className="w-6 h-6" />
              <span className="text-sm font-medium text-slate-600">
                {iconT.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <hr />
      <div className="px-6 text-secondary py-8 bg-primary">
        <h4 className="text-2xl">my education & organization</h4>
        {eduorga.map((item, idx) => (
          <div key={idx}>
            <div className="flex items-center py-4">
              <Image
                src={item.image}
                alt={`${item.name} logo`}
                className="w-20 h-20 rounded-md object-contain"
              />
              <div className="ps-5">
                <p className="text-xs bg-muted-foreground w-fit text-foreground flex items-center gap-x-1 px-2 py-0.5 rounded">
                  {item.category === "education" ? (
                    <GraduationCap size={14} />
                  ) : (
                    <Users size={14} />
                  )}
                  {item.category}
                </p>
                <h5 className="text-base font-semibold hover:underline cursor-default capitalize">
                  {item.name}
                </h5>
                <p className="text-sm text-slate-200">{item.position}</p>
                <p className="text-sm text-slate-200">{item.tenure}</p>
              </div>
            </div>
            {idx !== eduorga.length - 1 && (
              <hr className="border-slate-300 my-2" />
            )}
          </div>
        ))}

        {/* <div className="flex py-3 items-center ">
          <Image src={blug} alt="logo" className="w-20 h-20" />
          <div className="ps-5">
          <p className="text-xs bg-muted-foreground w-fit text-foreground flex items-center gap-x-1 px-1"><Users size={15}/> organization</p>
            <h5 className="hover:underline cursor-default">batam linux user group</h5>
            <p className="text-sm text-slate-200">division programing</p>
            <p className="text-sm text-slate-200"> &lt; 1 year, present</p>
          </div>
        </div> */}
      </div>
      <hr />
      <Footer />
    </div>
  );
}
