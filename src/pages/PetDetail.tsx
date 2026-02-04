import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPetById } from "../api/pets";
import { getTutorById } from "../api/tutores";
import type { Pet, Tutor } from "../types";
import { ArrowLeft, Edit, Loader2, AlertCircle } from "lucide-react";
import { MOCK_PETS, MOCK_TUTORES } from "../api/mocks";
//  Aqui é puxado os detalhes do pet e, se tiver o ID do tutor, já traz os dados dele também.
export default function PetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getPetById(Number(id))
        .then(res => {
          setPet(res.data);
          if (res.data.tutorId) {
            return getTutorById(res.data.tutorId);
          }
          return null;
        })
        .then(resTutor => {
          if (resTutor) setTutor(resTutor.data);
          setError(null);
        })
        .catch(err => {
          console.error("Erro ao buscar detalhes, tentando mocks:", err);
          const mockPet = MOCK_PETS.find(p => p.id === Number(id));
          if (mockPet) {
            setPet(mockPet);
            const mockTutor = MOCK_TUTORES.find(t => t.id === mockPet.tutorId);
            if (mockTutor) setTutor(mockTutor);
            setError("Nota: Exibindo dados locais.");
          } else {
            setError("Pet não encontrado.");
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto mb-2" /> Carregando detalhes...</div>;

  if (!pet && !loading) {
    return (
      <div className="p-8 text-center">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <p className="text-gray-600 mb-4">Pet não encontrado ou erro na conexão.</p>
        <button onClick={() => navigate("/")} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Voltar para Home
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
        <ArrowLeft size={20} /> Voltar
      </button>

      {error && error.includes("locais") && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2 rounded-lg mb-6 text-sm flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <div className="relative h-80 bg-gray-100">
          {pet?.foto ? (
            <img src={pet.foto} alt={pet.nome} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl">🐾</div>
          )}
          <Link 
            to={`/pet-form/${pet?.id}`} 
            className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg text-blue-600 hover:scale-110 transition-transform"
          >
            <Edit size={24} />
          </Link>
        </div>
        
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{pet?.nome}</h1>
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
              {pet?.especie}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-10">
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Idade</p>
              <p className="text-xl font-semibold text-gray-800">{pet?.idade} {pet?.idade === 1 ? 'ano' : 'anos'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Status</p>
              <p className="text-xl font-semibold text-green-600">Ativo</p>
            </div>
          </div>

          {tutor ? (
            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Informações do Tutor</h2>
              <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex justify-between items-center">
                <div>
                  <p className="text-xl font-bold text-gray-800 mb-1">{tutor.nome}</p>
                  <p className="text-gray-600">{tutor.telefone}</p>
                </div>
                <Link to={`/tutor/${tutor.id}`} className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold shadow-sm hover:bg-blue-600 hover:text-white transition-all">
                  Ver Perfil
                </Link>
              </div>
            </div>
          ) : (
            <div className="border-t pt-8 text-center py-6">
              <p className="text-gray-500 italic">Este pet ainda não possui um tutor vinculado.</p>
              <Link to={`/pet-form/${pet?.id}`} className="text-blue-600 font-semibold hover:underline mt-2 inline-block">
                Vincular um tutor agora
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
