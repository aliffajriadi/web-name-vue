import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlignRight, Mail, Instagram, Linkedin, Github } from "lucide-react";

export const MenuBar = () => {
  return (
    <header className="w-full px-6 md:px-0 py-4 flex items-center justify-between">
      {/* Logo or Title */}
      <h1 className="text-xl font-semibold">
        alif <span className="bg-primary text-secondary px-1">f.</span>
      </h1>

      {/* Drawer Menu */}
      <div className="space-x-4 hidden md:block">
        <Link href="/" className="hover:underline transition-all duration-200">
          home
        </Link>

        <Link
          href="/projects"
          className="hover:underline transition-all duration-200"
        >
          projects
        </Link>
        <Link
          href="/contact"
          className="hover:underline transition-all duration-200"
        >
          contact me
        </Link>
      </div>

      <div className="md:hidden block">
        <Drawer>
          <DrawerTrigger asChild>
            <AlignRight />
          </DrawerTrigger>

          <DrawerContent>
            <DrawerHeader>
              <div className="flex justify-between">
                <DrawerTitle className="">
                  let's connect
                </DrawerTitle>
                <DrawerTitle className="">
                  alif <span className="bg-primary text-secondary px-1">f.</span>
                </DrawerTitle>
                
              </div>

              <div className="flex space-x-3 justify-around mt-3">
                <Github size={40} />
                <Instagram size={40} />
                <Linkedin size={40} />
                <Mail size={40} />
              </div>
            </DrawerHeader>

            {/* Menu Body */}
            <div className="px-4 py-2 space-y-3">
              <Button className="w-full">Home</Button>
              <Button className="w-full" variant="secondary">
                Tentang
              </Button>
              <Button className="w-full" variant="secondary">
                Kontak
              </Button>
            </div>

            {/* Footer Drawer */}
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Tutup</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      <div className="fixed bottom-6 right-6 z-30">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="default" aria-label="Contact Me">
              <Mail className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>let's contact</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
};
