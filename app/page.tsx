import { MenuBar } from "@/components/manual/MenuBar";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
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
        <h2 className="text-6xl">hello, im alif</h2>
        <p className="text-2xl">soft dev</p>
        <Button variant="secondary" className="mt-2">
          contact me <Mail />
        </Button>
      </div>
      <hr />
      <div className="px-6 py-8 space-y-2">
        <h3 className="text-2xl font-semibold">what about me?</h3>
        <p className="text-sm text-slate-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum
          laborum veritatis doloremque suscipit, perspiciatis voluptates
          molestias! Voluptatem obcaecati quisquam alias voluptatum fugiat
          aperiam, eaque illo optio error ratione molestiae nobis.
        </p>
      </div>
      <hr />
      <div className="px-6 py-8 space-y-2">
        <h3 className="text-2xl">my tech stack.</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {techStack.map((iconT, i) => (
            <div key={i} className="flex items-center space-x-2">
            <Image src={iconT.icon} alt={iconT.label} className="w-6 h-6" />
            <span className="text-sm font-medium text-slate-600">{iconT.label}</span>
          </div>
          ))}
          
        </div>
      </div>
    </div>
  );
}
