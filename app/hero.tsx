"use client";
import { Typewriter } from "react-simple-typewriter";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <div className="bg-primary mb-4 text-secondary px-6 py-10">
      <h3 className="text-6xl">hello, im alif</h3>
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
        <a
          href="https://www.self.so/alif-fajriadi"
          className="flex items-center gap-1"
        >
          my resume
        </a>
      </Button>
    </div>
  );
};
