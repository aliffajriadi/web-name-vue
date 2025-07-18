"use client";

import { toast } from "sonner";
import { igdata, lkdata, gitdata } from "@/lib/data";


import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlignRight, Mail, Instagram, Linkedin, Github } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import sendMessages from "@/lib/api/contact";
import { ContactForm } from "@/types/contactForm";
import { usePathname } from "next/navigation";

export const MenuBar = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClickSend = async () => {
    if (!name.trim() || !message.trim()) {
      toast.error("Please fill in all required fields.");

      return;
    }

    setLoading(true);
    try {
      const payload: ContactForm = { name, message };
      await sendMessages(payload);
      toast.success("success sending message.");
      setName("");
      setMessage("");
      setOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast(error.message || "Failed to send message");
      } else {
        toast.error(`error: ${error}`);
      }
    } finally {
      setLoading(false);
    }
  };
  const pathname: string = usePathname();

  return (
    <header className="w-full px-6 md:px-0 py-4 flex items-center justify-between">
      {/* Logo or Title */}
      <h1 className="text-xl font-semibold">
        alif <span className="bg-primary text-secondary px-1">f.</span>
      </h1>

      {/* Menu link desktop */}
      <div className="space-x-4 hidden md:block">
        <Link href="/" className={`hover:underline transition-all duration-200 ${pathname === '/' ? 'underline' : ''}`}>
          home
        </Link>
        <Link
          href="/project"
          className={`hover:underline transition-all duration-200 ${pathname === '/project' ? 'underline' : ''}`}
        >
          projects
        </Link>
        <Link
          href="/contact"
          className={`hover:underline transition-all duration-200 ${pathname === '/contact' ? 'underline' : ''}`}
        >
          contact me
        </Link>
      </div>

      {/* Drawer menu mobile */}
      <div className="md:hidden block">
        <Drawer>
          <DrawerTrigger asChild>
            <Button size="icon" variant="ghost">
              <AlignRight />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <div className="flex justify-between">
                <DrawerTitle>let&apos;s connect</DrawerTitle>
                <DrawerTitle>
                  alif{" "}
                  <span className="bg-primary text-secondary px-1">f.</span>
                </DrawerTitle>
              </div>
              <div className="flex space-x-3 justify-around mt-3">
                <Link href={gitdata}>
                <Github size={40} />
                </Link>
                <Link href={igdata}>
                <Instagram size={40} />
                </Link>
                <Link href={lkdata}>
                <Linkedin size={40} />
                </Link>
                <Link onClick={() => toast.error("coming soon")} href="#">
                <Mail size={40} />
                </Link>
              </div>
            </DrawerHeader>
            <div className="px-4 py-2 space-y-3">

              <Button asChild className="w-full" variant={pathname === '/' ? 'default' : 'secondary'}><Link href="/">home</Link></Button>
              <Button asChild className="w-full" variant={pathname === '/project' ? 'default' : 'secondary'}>
                <Link href="/project">projects</Link>
              </Button>
              <Button asChild className="w-full" variant={pathname === '/contact' ? 'default' : 'secondary'}>
                <Link href="/contact">contact</Link>
              </Button>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Floating Contact Button */}
      <div className="fixed bottom-6 right-6 z-30">
        <Dialog open={open} onOpenChange={setOpen}>
          <Tooltip>
            <DialogTrigger asChild>
              <TooltipTrigger asChild>
                <Button size="icon" variant="default" aria-label="Contact Me">
                  <Mail className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
            </DialogTrigger>
            <TooltipContent side="left">
              <p>let&apos;s talk!</p>
            </TooltipContent>
          </Tooltip>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send me a message</DialogTitle>
              <DialogDescription>
                Got something in mind? Send me a message and let&apos;s talk!
              </DialogDescription>
              <Input
                placeholder="your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Textarea
                placeholder="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </DialogHeader>

            <Button onClick={handleClickSend} disabled={loading}>
              {loading ? "sending..." : "send"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
};
