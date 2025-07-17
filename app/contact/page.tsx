"use client";
import React, { useState } from "react";
import { MenuBar } from "@/components/manual/MenuBar";
import Footer from "@/components/manual/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Github, Instagram, Linkedin } from "lucide-react";
import { gitdata, igdata, lkdata } from "@/lib/data";
import sendMessages from "@/lib/api/contact";
import { ContactForm } from "@/types/contactForm";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSending = async () => {
    if (!name.trim() || !message.trim()) {
      toast.error("Please fill in all required fields.");

      return;
    }
    setLoading(true);
    try {
      const payload: ContactForm = { name, message };
      await sendMessages(payload);
      console.log("success");
      toast.success("sending message success fully");
      setMessage("");
      setName("");
      setLoading(false);
    } catch (error) {
      toast(`error: ${error}`);
    }
  };
  return (
    <div>
      <MenuBar />
      <section className="container mx-auto px-6 py-4">
        <h2 className="text-2xl">contact me</h2>
        <p>
          feel free to reach out if you have any questions or just want to
          connect through my social media.
        </p>

        <div className="space-y-5 mt-5">
          <a
            href={igdata}
            className="flex space-x-3 items-center hover:underline font-bold active:text-amber-950"
          >
            <Instagram size={50} />
            <div>
              Instagram
              <p className="text-muted-foreground font-normal">@alifajri_</p>
            </div>
          </a>

          <a
            href={lkdata}
            className="flex space-x-3 items-center hover:underline font-bold active:text-amber-950"
          >
            <Linkedin size={50} />
            <div>
              Linkedin
              <p className="text-muted-foreground font-normal">Alif Fajriadi</p>
            </div>
          </a>

          <a
            href={gitdata}
            className="flex space-x-3 items-center hover:underline font-bold active:text-amber-950"
          >
            <Github size={50} />
            <div>
              Github
              <p className="text-muted-foreground font-normal">aliffajriadi</p>
            </div>
          </a>
        </div>

        <div className=" mt-10">
          <Card>
            <CardHeader>
              <CardTitle>send me message</CardTitle>
              <CardDescription>card Description</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Input
                placeholder="your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Textarea
                placeholder="your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </CardContent>
            <CardFooter>
              <Button onClick={handleSending} disabled={loading}>
                {loading ? "sending message ........" : "send message"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ContactPage;
