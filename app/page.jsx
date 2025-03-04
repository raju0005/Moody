import { getDailyPrompts } from "@/actions/public";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import faqs from "@/data/faqs";

import {
  Calendar,
  ChevronRight,
  Book,
  Sparkles,
  Lock,
  FileText,
  BarChart2,
} from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const advice = await getDailyPrompts();
  const features = [
    {
      icon: Book,
      title: "Rich Text Editor",
      description:
        "Express yourself with a powerful editor supporting markdown, formatting, and more.",
    },
    {
      icon: Sparkles,
      title: "Daily Inspiration",
      description:
        "Get inspired with daily prompts and mood-based imagery to spark your creativity.",
    },
    {
      icon: Lock,
      title: "Secure & Private",
      description:
        "Your thoughts are safe with enterprise-grade security and privacy features.",
    },
  ];
  return (
    <div className="relative container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto text-center space-y-9  ">
        <h1 className="text-gradient-xl relative text-5xl md:text-5xl lg:text-8xl mb-20 gradient-title  font-custom flex flex-col items-center text-center z-10 uppercase pb-10 ">
          EVery mood tells a story.
          <span className="absolute text-gradient-sm md:bottom-1 -bottom-[1.5rem] font-custom3 font-semibold text-4xl md:text-5xl lg:text-6xl z-20 tracking-wide lowercase">
            Write it down, feel it, and let it go.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-blue-800 mb-8">
          Capture your thoughts, track your moods, and reflect your journey in a
          beautiful, secure space.
        </p>
        <div className="relative border-2 border-y-amber-100 rounded-lg border-x-blue-100">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-200 via-transparent to-white/50 pointer-events-none z-10 rounded-lg  " />
          <div className="bg-transparent rounded-2xl p-4 max-full mx-auto">
            <div className="border-b border-blue-100 pb-4 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2  ">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="text-blue-900 font-medium">
                  Today&rsquo;s Entry
                </span>
              </div>
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-400"></div>
                <div className="h-3 w-3 rounded-full bg-amber-300"></div>
                <div className="h-3 w-3 rounded-full bg-blue-400"></div>
              </div>
            </div>
            <div className="space-y-4 p-4 ">
              <h3 className="text-xl font-semibold text-blue-900">
                {advice ? advice : "My Thoughts Today"}
              </h3>
              <Skeleton className="h-4 bg-amber-100 rounded w-3/4" />
              <Skeleton className="h-4 bg-blue-100 rounded w-full" />
              <Skeleton className="h-4 bg-amber-400 rounded w-2/3" />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Link href="/dashboard">
            <Button
              variant="journal"
              className="px-8 py-6 rounded-full flex items-center gap-2 font-bold text-md"
            >
              Start Writing <ChevronRight className="h-5 w-5 " />
            </Button>
          </Link>
          <Link href="#features">
            <Button
              variant="outline"
              className="px-8 py-6 rounded-full border-amber-600 text-amber-600  hover:bg-blue-100 hover:border-blue-600 hover:text-blue-600 font-bold text-md"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </div>
      <section
        id="features"
        className="mt-24 grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {features.map((feature, index) => (
          <Card
            key={feature.title}
            className="shadow-lg bg-transparent border border-blue-100"
          >
            <CardContent className="p-6">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 ">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-xl text-blue-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-amber-700">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
      <div className="space-y-24 mt-24">
        <div className="grid md:grid-cols-2 gap-12 ">
          <div className="space-y-6">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center ">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-blue-900">
              Rich Text Editor
            </h3>
            <p className="text-lg text-amber-700">
              Express yourself fully with our powerful editor featuring:
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-400" />
                <span>Format text with ease</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-400" />
                <span>Embed links</span>
              </li>
            </ul>
          </div>
          <div className="space-y-4 bg-transparent rounded-2xl shadow-xl p-6 border border-amber-100">
            <div className="flex gap-2 mb-6">
              <div className="h-8 w-8 rounded bg-blue-100" />
              <div className="h-8 w-8 rounded bg-amber-100" />
              <div className="h-8 w-8 rounded bg-blue-100" />
            </div>
            <div className="h-4 bg-blue-50 rounded w-3/4" />
            <div className="h-4 bg-amber-50 rounded w-full" />
            <div className="h-4 bg-blue-50 rounded w-2/3" />
            <div className="h-4 bg-amber-50 rounded w-1/3" />
          </div>
        </div>
      </div>
      <div className="space-y-24 mt-24">
        <div className="grid md:grid-cols-2 gap-12 ">
          <div className="space-y-4 bg-transparent rounded-2xl shadow-xl p-6 border border-blue-100">
            <div className="h-40 bg-gradient-to-t from-blue-100 to-amber-50 rounded-lg"></div>
            <div className="flex justify-between bg-transparent">
              <div className="h-4 w-16 bg-blue-100 rounded " />
              <div className="h-4 w-16 bg-amber-100 rounded " />
              <div className="h-4 w-16 bg-blue-100 rounded " />
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center ">
              <BarChart2 className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold text-amber-900">
              Mood Analytics
            </h3>
            <p className="text-lg text-blue-700">
              Track your emotional journey with powerful analytics:
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-400" />
                <span>Visual mood trends</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-400" />
                <span>pattern recognition</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-24">
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full mx-auto">
          {faqs.map((faq, index) => {
            return (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-amber-600 text-lg font-bold">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-blue-700 text-lg">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
      <div className="mt-24">
        <Card className="bg-gradient-to-r from-blue-100 to-amber-100">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold text-blue-900 mb-6">
              Start Reflect-ing on Your Journey Today
            </h2>
            <p className="text-lg text-blue-700 mb-8 max-w-2xl mx-auto ">
              Join thousands of writers who have already discovered the power of
              digital journaling
            </p>
            <Link href="/dashboard">
              <Button size="lg" variant="journal" className="animate-bounce">
                Get Started for free <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
