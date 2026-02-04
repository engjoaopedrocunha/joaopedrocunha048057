import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import { createPet, getPetById, updatePet } from "../api/pets";
import { getTutors } from "../api/tutores";
import type { Pet, Tutor } from "../types";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
// Formulário de cadastro/edição. Usei o react-hook-form pra facilitar a validação dos campos obrigatórios.
export default function PetForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Partial<Pet>>();

  useEffect(() => {
    getTutors(1, 100).then(res => {
      const data = res.data;
      if (Array.isArray(data)) setTutores(data);
      else if (data && 'content' in data) setTutores(data.content);
    }).catch(err => console.error("Erro ao carregar tutores:", err));

    if (id) {
      setFetching(true);
      getPetById(Number(id))
        .then(res => {
          reset(res.data);
        })
        .catch(err => {
          setError(err.message || "Erro ao carregar dados do pet.");
        })
        .finally(() => setFetching(false));
    }
  }, [id, reset]);

  const onSubmit = async (data: Partial<Pet>) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...data,
        idade: Number(data.idade),
        tutorId: data.tutorId ? Number(data.tutorId) : undefined
      };

      if (id) {
        await updatePet(Number(id), payload);
      } else {
        await createPet(payload);
      }
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Erro ao salvar pet.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto mb-2" /> Carregando dados...</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft size={20} /> Voltar para a lista
      </Link>

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h1 className="text-2xl font-bold mb-6">{id ? "Editar Pet" : "Cadastrar Novo Pet"}</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Nome do Pet *</label>
              <input 
                {...register("nome", { required: "Nome é obrigatório" })} 
                className={`w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none ${errors.nome ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Ex: Rex"
              />
              {errors.nome && <p className="text-red-500 text-xs">{errors.nome.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Espécie *</label>
              <input 
                {...register("especie", { required: "Espécie é obrigatória" })} 
                className={`w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none ${errors.especie ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Ex: Cachorro, Gato"
              />
              {errors.especie && <p className="text-red-500 text-xs">{errors.especie.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Idade (anos) *</label>
              <input 
                type="number" 
                {...register("idade", { required: "Idade é obrigatória", min: { value: 0, message: "Idade mínima é 0" } })} 
                className={`w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none ${errors.idade ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.idade && <p className="text-red-500 text-xs">{errors.idade.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Tutor</label>
              <select 
                {...register("tutorId")} 
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="">Selecione um tutor (opcional)</option>
                {tutores.map(t => (
                  <option key={t.id} value={t.id}>{t.nome}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">URL da Foto</label>
            <input 
              {...register("foto")} 
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="https://exemplo.com/foto.jpg"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {id ? "Atualizar Pet" : "Salvar Pet"}
            </button>
            <button 
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
