import { MenuBar } from "@/components/manual/MenuBar";
import { GraduationCap, Users } from "lucide-react";
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
  iot,
  cpp,
  python,
  aurduino,
  ubuntu,
  fastapi,
} from "@/public/assets";
import Image from "next/image";
import { eduorga } from "@/lib/data";
import { Hero } from "./hero";

export default function Home() {
  interface techStackType {
    icon: string;
    label: string;
  }
  const techStack: techStackType[] = [
    { icon: nextdotjs, label: "next.js" },
    { icon: express, label: "express" },
    { icon: iot, label: "IoT" },
    { icon: cpp, label: "c++" },
    { icon: python, label: "python" },
    { icon: aurduino, label: "aurduino" },
    { icon: fastapi, label: "fastapi" },
    { icon: typescript, label: "typescript" },
    { icon: laravel, label: "laravel" },
    { icon: mongodb, label: "mongodb" },
    { icon: ubuntu, label: "linux ubuntu" },
    { icon: mysql, label: "mysql" },
    { icon: react, label: "react.js" },
    { icon: tailwind, label: "tailwindcss" },
  ];

  return (
    <div className="">
      <h1 className="hidden">Alif Fajriadi Blug Polibatam Portofolio</h1>
      <h2 className="hidden">Alif Fajriadi</h2>
      <MenuBar />
      <Hero />
      <hr />
      <div className="px-6 py-8 space-y-2">
        <h3 className="text-2xl font-semibold">what about me?</h3>
        <p className="text-sm text-muted-foreground">
          Hello im Alif Fajriadi as a Software Developer and Linux & IoT
          Enthusiast with a focus on Internet of Things (IoT) and Web
          Development. I have experience in developing web applications using
          Node.js, TypeScript, Next.js, Vue, Express, and Laravel, as well as
          building backend systems with FastAPI and Python. In the IoT domain, I
          have developed solutions using C++ and Arduino/ESP, with communication
          via MQTT and HTTP. I am also interested in Computer Vision,
          integrating IoT and AI technologies like YOLO, OCR, Tesseract, and
          recognition systems. I am passionate about experimenting with new
          technologies and creating efficient, scalable, and beneficial digital
          solutions.
        </p>
      </div>
      <hr />
      <div className="px-6 py-8 space-y-2">
        <h3 className="text-2xl">tech skill</h3>
        <div className="flex gap-6 mt-4 overflow-x-auto pb-2 scrollbar-hide">
          {techStack.map((iconT, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center p-4 min-w-[120px] hover:scale-105 transition"
            >
              <Image src={iconT.icon} alt={iconT.label} className="w-10 h-10" />
              <span className="mt-2 text-sm font-medium text-slate-600 capitalize">
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
      </div>
      <hr />
      <Footer />
    </div>
  );
}
