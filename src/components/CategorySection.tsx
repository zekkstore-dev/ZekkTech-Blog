import CategoryCard from './CategoryCard';
import SectionHeader from './SectionHeader';

const categories: { name: string; icon: string; variant: 'blue' | 'white'; href: string }[] = [
  { name: 'Pilihan Editor', icon: '/images/icon-category/Vector.svg', variant: 'blue', href: '/category/pilihan-editor' },
  { name: 'Tutorial Teknologi', icon: '/images/icon-category/Vector-3.svg', variant: 'white', href: '/category/tutorial-teknologi' },
  { name: 'Berita Teknologi', icon: '/images/icon-category/Vector-1.svg', variant: 'blue', href: '/category/berita-teknologi' },
  { name: 'Template', icon: '/images/icon-category/Vector-2.svg', variant: 'white', href: '/category/template' },
  { name: 'Tips & Trik', icon: '/images/icon-category/Dashboard.svg', variant: 'blue', href: '/category/tips-trik' },
];

export default function CategorySection() {
  return (
    <section id="kategori" className="w-full bg-gray-50 py-16 sm:py-20">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-24">
        <SectionHeader
          title="Telusuri Kategori"
          linkText="Lihat Semua"
          linkHref="#"
        />

        {/* Horizontal scroll on mobile, flex row on desktop */}
        <div className="flex gap-5 lg:gap-[29px] xl:gap-[37px] overflow-x-auto pb-4 sm:pb-0 snap-x snap-mandatory sm:snap-none scrollbar-hide">
          {categories.map((cat) => (
            <div key={cat.name} className="snap-start shrink-0 sm:shrink">
              <CategoryCard
                name={cat.name}
                icon={cat.icon}
                variant={cat.variant}
                href={cat.href}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
