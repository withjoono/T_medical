import type { Metadata } from "next";
import { getInterviewType } from "@/lib/interview-types";
import { InterviewTypePage } from "../_type-page";

const TYPE = getInterviewType("mmi")!;

export const metadata: Metadata = {
  alternates: { canonical: "/interview/mmi" },
  title: TYPE.metaTitle,
  description: TYPE.metaDescription,
};

export default function Page() {
  return <InterviewTypePage typeKey="mmi" />;
}
