import Image from 'next/image';
import Link from 'next/link';

interface CategoryCardProps {
  name: string;
  icon: string;
  variant: 'blue' | 'white';
  href: string;
}

export default function CategoryCard({ name, icon, variant, href }: CategoryCardProps) {
  const isBlue = variant === 'blue';

  return (
    <Link
      href={href}
      className={`
        group relative flex flex-col items-start justify-end w-[150px] sm:w-[220px] sm:w-full min-w-[140px] sm:min-w-[180px] h-[140px] sm:h-[200px]
        rounded-lg transition-all duration-300 cursor-pointer overflow-hidden
        ${isBlue
          ? 'bg-[#004dff] hover:bg-[#0040d6] shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30'
          : 'category-card-white bg-white hover:shadow-md hover:shadow-gray-200/60 border border-gray-100'
        }
      `}
    >
      {/* Icon */}
      <div className="absolute top-[18px] sm:top-[25px] left-1/2 -translate-x-1/2 w-[60px] h-[60px] sm:w-[92px] sm:h-[92px] flex items-center justify-center transition-transform group-hover:scale-110">
        <Image
          src={icon}
          alt={name}
          width={92}
          height={92}
          className={`w-full h-full object-contain ${
            isBlue ? '' : 'category-icon-dark'
          }`}
        />
      </div>

      {/* Label */}
      <p className={`px-[10px] sm:px-[14px] pb-[10px] sm:pb-[14px] text-[13px] sm:text-[20px] font-bold leading-tight capitalize ${
        isBlue ? 'text-white' : 'text-[#2b2c34]'
      }`}>
        {name}
      </p>
    </Link>
  );
}
