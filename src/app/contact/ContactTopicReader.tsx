"use client";

/**
 * Reads ?topic= from the URL and forwards as defaultTopic to ContactForm.
 * Lives in its own client component so the page can stay server-rendered.
 */

import { useSearchParams } from "next/navigation";
import { ContactForm } from "@/components/ContactForm";

export function ContactTopicReader({ topics }: { topics: string[] }) {
  const params = useSearchParams();
  const requested = params?.get("topic");
  const defaultTopic = requested && topics.includes(requested) ? requested : undefined;
  return <ContactForm defaultTopic={defaultTopic} />;
}
