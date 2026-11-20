import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Story } from "@/components/story/Story";
import { StoryChrome } from "@/components/story/StoryChrome";
import { getStory, stories } from "@/content/stories";

export const dynamicParams = false;

export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) return {};
  const title = `${story.name} — Joe Baltazar`;
  return {
    title,
    description: story.description,
    openGraph: {
      title,
      description: story.description,
      images: story.hero.kind === "image" ? [{ url: story.hero.src, width: story.hero.width, height: story.hero.height }] : [],
      type: "article",
    },
  };
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();
  const next = getStory(story.next) ?? stories[0];

  return (
    <>
      <StoryChrome accent={story.theme.accent} />
      <Story story={story} next={next} />
    </>
  );
}
