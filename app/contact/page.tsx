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
      toast.success("Message sent successfully ✨");
      setMessage("");
      setName("");
    } catch (error) {
      toast(`error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen flex flex-col">
      <MenuBar />
      <section className="container mx-auto px-6 py-10 flex-1">
        <h2 className="text-3xl font-bold text-center mb-2">Get in Touch</h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
          Feel free to reach out if you have any questions, ideas, or just want
          to connect
        </p>

        {/* Social Media Section */}
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <a
            href={igdata}
            className="flex items-center gap-3 p-4 rounded-2xl border hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
          >
            <Instagram size={40}/>
            <div>
              <span className="font-semibold">Instagram</span>
              <p className="text-muted-foreground text-sm">@alifajri_</p>
            </div>
          </a>

          <a
            href={lkdata}
            className="flex items-center gap-3 p-4 rounded-2xl border hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
          >
            <Linkedin size={40} />
            <div>
              <span className="font-semibold">LinkedIn</span>
              <p className="text-muted-foreground text-sm">Alif Fajriadi</p>
            </div>
          </a>

          <a
            href={gitdata}
            className="flex items-center gap-3 p-4 rounded-2xl border hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
          >
            <Github size={40} />
            <div>
              <span className="font-semibold">GitHub</span>
              <p className="text-muted-foreground text-sm">aliffajriadi</p>
            </div>
          </a>
        </div>

        {/* Contact Form */}
        <div className="max-w-lg mx-auto mt-12">
          <Card className="shadow-xl rounded-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Send me a Message</CardTitle>
              <CardDescription>
                I’ll get back to you as soon as possible
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Textarea
                placeholder="Your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
              />
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                onClick={handleSending}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Sending message..." : "Send Message"}
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
