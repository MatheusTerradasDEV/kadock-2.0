import { ChevronRight } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  description: string;
  onClick: () => void;
}

export default function CategoryCard({ name, description, onClick }: CategoryCardProps) {
  return (
    <div
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
}