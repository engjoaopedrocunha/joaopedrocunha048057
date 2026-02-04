import { useEffect, useState } from "react";
import { getPets } from "../api/pets";
import PetCard from "../components/PetCard";
import { Link } from "react-router-dom";
import type { Pet } from "../types";
import { Search, Plus, Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { MOCK_PETS, getPaginatedMock } from "../api/mocks";
//Tela principal. Fiz um esquema de debounce na busca pra não ficar disparando requisição a cada tecla digitada.
export default function Home() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPets = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPets(page, 6, search);
      const data = res.data;
      
      if (Array.isArray(data)) {
        setPets(data);
        setTotalPages(1);
      } else if (data && 'content' in data) {
        setPets(data.content);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err: any) {
      console.error("Erro ao buscar pets, usando mocks:", err);
      const filteredMocks = MOCK_PETS.filter(p => 
        p.nome.toLowerCase().includes(search.toLowerCase()) || 
        p.especie.toLowerCase().includes(search.toLowerCase())
      );
      const paginated = getPaginatedMock(filteredMocks, page, 6);
      setPets(paginated.content);
      setTotalPages(paginated.totalPages);
      setError("O servidor no momento se encontra indisponível.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPets();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, search]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">RegistrePET Gov</h1>
          <p className="text-gray-500">Um lugar onde boas pessoas encontram boas patas.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Link to="/tutor-form" className="flex-1 md:flex-none bg-white border border-gray-5000 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            Novo Tutor
          </Link>
          <Link to="/pet-form" className="flex-1 md:flex-none bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <Plus size={20} /> Novo Pet
          </Link>
        </div>
      </header>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text"
          placeholder="Buscar por nome ou espécie..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
        />
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          <AlertCircle size={20} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {loading && pets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
          <p className="text-gray-500 font-medium">Buscando pets...</p>
        </div>
      ) : pets.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">Nenhum pet encontrado para sua busca.</p>
          <button onClick={() => setSearch("")} className="text-blue-600 font-semibold mt-2 hover:underline">Limpar filtros</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map(pet => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex justify-center items-center gap-4">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="p-2 border rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <span className="font-semibold text-gray-700">
                Página {page} de {totalPages}
              </span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="p-2 border rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
