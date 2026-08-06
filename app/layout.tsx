import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shangchen-knowledge-base-docs.gengegengengengen.chatgpt.site";
const title = "尚宸智能体知识库｜架构、部署与运行机制";
const description = "基于 AnythingLLM 的企业知识检索与数据分析系统：部署架构、镜像构建、RAG 与 TDengine SQL Agent 运行机制。";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    images: [{ url: `${siteUrl}/og.png`, width: 1200, height: 630, alt: "尚宸智能体知识库架构、部署与运行机制" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${siteUrl}/og.png`],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
