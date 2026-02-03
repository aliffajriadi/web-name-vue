import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import HighlightProjects from "@/components/home/HighlightProjects";
import BlogPreview from "@/components/home/BlogPreview";
import Experience from "@/components/home/Experience";
import Skills from "@/components/home/Skills";
import HowIWork from "@/components/home/HowIWork";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <HighlightProjects />
      <BlogPreview />
      <Experience />
      <Skills />
      <HowIWork />
    </>
  );
}
