import { MenuBar } from "@/components/manual/MenuBar";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
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
  polibatam,
  blug,
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
        <h1 className="text-6xl">hello, im alif</h1>
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
        <div className="flex py-3 items-center ">
          <Image src={polibatam} alt="logo" className="w-20 h-20" />
          <div className="ps-5">
            <h5 className="hover:underline cursor-default">polytechinc state of batam</h5>
            <p className="text-sm text-slate-200">informatics engineering</p>
            <p className="text-sm text-slate-200">3nd semester, present</p>
          </div>
        </div>
        <hr className="border" />
        <div className="flex py-3 items-center ">
          <Image src={blug} alt="logo" className="w-20 h-20" />
          <div className="ps-5">
            <h5 className="hover:underline cursor-default">batam linux user group</h5>
            <p className="text-sm text-slate-200">division programing</p>
            <p className="text-sm text-slate-200"> &lt; 1 year, present</p>
          </div>
        </div>
      </div>
      <hr />
      <Footer/>
    </div>
  );
}
