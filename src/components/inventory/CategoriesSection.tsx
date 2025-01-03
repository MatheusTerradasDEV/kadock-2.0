import CategoryCard from './CategoryCard';
import { FABRIC_CATEGORIES } from '../constants/categories';

interface CategoriesSectionProps {
  onSelectCategory: (category: string) => void;
}

export default function CategoriesSection({ onSelectCategory }: CategoriesSectionProps) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Categorias</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.keys(FABRIC_CATEGORIES).map((category) => (
          <CategoryCard
            key={category}
            name={category}
            description={`Tecidos para confecção de ${category.toLowerCase()}`}
            onClick={() => onSelectCategory(category)}
          />
        ))}
      </div>
    </div>
  );
}