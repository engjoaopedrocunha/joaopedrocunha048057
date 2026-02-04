import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getTutorById } from "../api/tutores";
import { getPets } from "../api/pets";
import type { Tutor, Pet } from "../types";
import { ArrowLeft, Edit, Phone, Mail, MapPin, Loader2 } from "lucide-react";
import PetCard from "../components/PetCard";
//Perfil do tutor. Aproveitei pra listar todos os pets que estão vinculados ao CPF/ID dele.
export default function TutorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      Promise.all([
        getTutorById(Number(id)),
        getPets(1, 100)
      ])
        .then(([resTutor, resPets]) => {
          setTutor(resTutor.data);
          
          const allPets = resPets.data;
          let tutorPets: Pet[] = [];
          
          if (Array.isArray(allPets)) {
            tutorPets = allPets.filter(p => p.tutorId === Number(id));
          } else if (allPets && 'content' in allPets) {
            tutorPets = allPets.content.filter(p => p.tutorId === Number(id));
          }
          
          setPets(tutorPets);
          setError(null);
        })
        .catch(err => {
          console.error("Erro ao buscar detalhes do tutor:", err);
          setError(err.message || "Tutor não encontrado.");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto mb-2" /> Carregando detalhes...</div>;

  if (error || !tutor) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">{error || "Tutor não encontrado."}</p>
        <button onClick={() => navigate("/")} className="text-blue-500 hover:underline flex items-center justify-center gap-2 mx-auto">
          <ArrowLeft size={16} /> Voltar para Home
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
        <ArrowLeft size={20} /> Voltar
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white border rounded-xl shadow-sm p-6 sticky top-4">
            <div className="flex justify-between items-start mb-4">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold">
                {tutor.nome.charAt(0)}
              </div>
              <Link to={`/tutor-form/${tutor.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                <Edit size={20} />
              </Link>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{tutor.nome}</h1>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Phone size={18} className="text-gray-400" />
                <span>{tutor.telefone}</span>
              </div>
              {tutor.email && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail size={18} className="text-gray-400" />
                  <span className="truncate">{tutor.email}</span>
                </div>
              )}
              {tutor.endereco && (
                <div className="flex items-start gap-3 text-gray-600">
                  <MapPin size={18} className="text-gray-400 mt-1" />
                  <span>{tutor.endereco}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Pets Vinculados ({pets.length})</h2>
            <Link to="/pet-form" className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">
              + Novo Pet
            </Link>
          </div>

          {pets.length === 0 ? (
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-10 text-center text-gray-500">
              Este tutor ainda não possui pets cadastrados.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pets.map(pet => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
