import Image from "next/image";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 lg:px-8 h-16 flex items-center">
        <div className="flex items-center justify-between w-full">
          <Link
            href="#"
            className="flex items-center gap-2 text-gray-800 dark:text-gray-100 font-bold"
            prefetch={false}
          >
            <BrushIcon className="h-8 w-8 text-blue-600" />
            <span className="text-lg">Chromanvas</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#"
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              prefetch={false}
            >
              Features
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              prefetch={false}
            >
              About
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              prefetch={false}
            >
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center justify-center p-2 rounded-lg text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800"
            aria-label="Open Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full pt-12 md:pt-24 lg:pt-32 border-y">
          <div className="container space-y-10 xl:space-y-16 px-4 md:px-6">
            <div className="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
              <div>
                <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                  Unleash Your Creativity with Chromanvas
                </h1>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Bring your ideas to life with our powerful drawing canvas.
                  Easily create stunning designs, wireframes, and more.
                </p>
                <div className="space-x-4">
                  <Link
                    href="#"
                    className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Get Started
                  </Link>
                  <Link
                    href="#"
                    className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex-1 relative">
              <canvas className="w-full h-[500px] bg-background rounded-t-xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground text-center">
                  Click and drag to draw shapes. CTRL+O to upload an image.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container space-y-12 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Powerful Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Bring Your Designs to Life
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our drawing canvas empowers you to create stunning visuals,
                  wireframes, and more. Explore our advanced tools and features
                  to unleash your creativity.
                </p>
              </div>
            </div>
            <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Shapes and Layers</h3>
                <p className="text-sm text-muted-foreground">
                  Create and manipulate a variety of shapes, and organize them
                  into layers for precise control.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Image Upload</h3>
                <p className="text-sm text-muted-foreground">
                  Easily import images and use them as a starting point for your
                  designs.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Color Palette</h3>
                <p className="text-sm text-muted-foreground">
                  Choose from a wide range of colors or create your own custom
                  palettes.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Text and Annotations</h3>
                <p className="text-sm text-muted-foreground">
                  Add text, labels, and annotations to your designs for clarity
                  and context.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Export and Share</h3>
                <p className="text-sm text-muted-foreground">
                  Export your creations in various formats and share them with
                  others.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Collaboration</h3>
                <p className="text-sm text-muted-foreground">
                  Invite team members to collaborate on designs in real-time.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
              <Link
                href="/canvas"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Start Drawing
              </Link>
              <Link
                href="#"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>
        <section className="w-full py-16 md:py-28 lg:py-36 bg-gray-50 dark:bg-gray-900 border-t">
          <div className="container grid gap-8 px-6 md:px-12 lg:px-20 text-center md:text-left">
            <div className="space-y-4">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-800 dark:text-gray-100 md:text-5xl lg:text-5xl">
                Ready to Unleash Your Creativity?
              </h2>
              <p className="max-w-xl mx-auto text-gray-600 dark:text-gray-300 md:mx-0 md:text-lg lg:text-xl">
                Sign up today and start creating stunning designs with the
                powerful tools of Chromanvas.
              </p>
            </div>
            <div className="w-full max-w-lg mx-auto md:mx-0">
              <form className="flex flex-col gap-4 sm:flex-row">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full flex-1 rounded-lg border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <Button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-lg text-white  focus:outline-none"
                >
                  Get Started
                </Button>
              </form>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Sign up to unlock the full potential of Chromanvas.{" "}
                <Link
                  href="#"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                  prefetch={false}
                >
                  Terms &amp; Conditions
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-4 sm:flex-row items-center justify-between py-6 w-full px-4 md:px-8 border-t bg-gray-50 dark:bg-gray-900">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Chromanvas. All rights reserved.
        </p>
        <nav className="flex gap-6">
          <Link
            href="#"
            className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            prefetch={false}
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            prefetch={false}
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

function BrushIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
      <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
    </svg>
  );
}
