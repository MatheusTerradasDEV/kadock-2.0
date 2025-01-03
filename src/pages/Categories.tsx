import { FABRIC_CATEGORIES } from '../components/constants/categories';

export default function Categories() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Categorias de Produtos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(FABRIC_CATEGORIES).map(([category, subtypes]) => (
          <div
            key={category}
            className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium dark:text-white">{category}</h3>
            </div>
            <div className="space-y-1">
              {subtypes.map((subtype) => (
                <p key={subtype} className="text-sm text-gray-500 dark:text-gray-400">
                  • {subtype}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}