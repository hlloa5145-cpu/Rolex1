import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();

  const navItems = [
    { name: 'الرئيسية', icon: '🏠', path: '/' },
    { name: 'الأسواق', icon: '📊', path: '/markets' },
    { name: 'تداول', icon: '🔄', path: '/trade' },
    { name: 'الفريق', icon: '👥', path: '/team' },
    { name: 'الأصول', icon: '💰', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1a0b3c] border-t border-white/5 pb-6 pt-3 px-6 flex justify-between items-center z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      {navItems.map((item) => {
        const isActive = router.pathname === item.path;
        return (
          <Link key={item.path} href={item.path} className="flex flex-col items-center">
            <span className={`text-2xl mb-1 transition-all ${isActive ? 'scale-125' : 'opacity-50'}`}>
              {item.icon}
            </span>
            <span className={`text-[10px] font-bold ${isActive ? 'text-purple-400' : 'text-gray-500'}`}>
              {item.name}
            </span>
            {isActive && <div className="w-1 h-1 bg-purple-400 rounded-full mt-1"></div>}
          </Link>
        );
      })}
    </nav>
  );
}
