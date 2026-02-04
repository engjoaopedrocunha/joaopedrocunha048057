import { useNavigate } from "react-router-dom";
//Esse é o card que aparece na home. Ajustei o hover pra dar um feedback visual melhor pro usuário.
export default function PetCard({ pet }: any) {
  const navigate = useNavigate();
  
  return (
    <div 
      onClick={() => navigate(`/pet/${pet.id}`)} 
      className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden group"
    >
      <div className="relative h-48 bg-gray-100">
        {pet.foto ? (
          <img 
            src={pet.foto} 
            alt={pet.nome} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-4xl">🐾</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-1">{pet.nome}</h2>
        <div className="flex justify-between items-center">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold uppercase">
            {pet.especie}
          </span>
          <p className="text-gray-600 text-sm">{pet.idade} {pet.idade === 1 ? 'ano' : 'anos'}</p>
        </div>
      </div>
    </div>
  );
}
