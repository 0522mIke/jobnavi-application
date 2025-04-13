import type { Metadata } from "next";
import { Noto_Sans_JP, Zen_Kaku_Gothic_New } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/context/auth-context';

const notoSans = Noto_Sans_JP({
  variable: "--font-noto-jp",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "就職活動管理アプリ",
  description: "応募状況や面接スケジュールを一括管理できるアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body
        className={`${notoSans.variable} ${zenKaku.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
