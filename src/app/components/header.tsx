"use client"

import Link from "next/link";
import { useAuth } from '@/context/auth-context';

type HeaderVariant = 'compact' | 'full';

function Header({ variant = 'compact' }: { variant?: HeaderVariant }) {
  
  const { isLoggedIn, userEmail } = useAuth();
  
  return (
    <header className="w-full bg-slate-500 py-2 px-2 flex flex-wrap items-center justify-between shadow-md">
      <h1 className="text-sm text-white pl-4">どこに応募したのかすぐに分かる就職管理APP</h1>
      
      {/* variantがfullでかつログイン済みの場合のみユーザー情報を表示 */}
      <div className="flex items-center space-x-4 pt-0 min-w-[150px]">
        {variant === 'full' && isLoggedIn && (
          <>
            <span className="text-sm text-white truncate max-w-[150px]">{userEmail}</span>
            <Link href="/logout" className="text-sm bg-slate-500 hover:bg-slate-600 text-white px-3 rounded">
              ログアウト
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;