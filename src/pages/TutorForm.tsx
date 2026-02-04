import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import { createTutor, getTutorById, updateTutor } from "../api/tutores";
import type { Tutor } from "../types";
import { ArrowLeft, Save, Loader2, User } from "lucide-react";
// Cadastro de tutores. O campo de e-mail tem uma regex simples pra evitar erro de digitação bobo.
export default function TutorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Partial<Tutor>>();

  useEffect(() => {
    if (id) {
      setFetching(true);
      getTutorById(Number(id))
        .then(res => {
          reset(res.data);
        })
        .catch(err => {
          setError(err.message || "Erro ao carregar dados do tutor.");
        })
        .finally(() => setFetching(false));
    }
  }, [id, reset]);

  const onSubmit = async (data: Partial<Tutor>) => {
    setLoading(true);
    setError(null);
    try {
      if (id) {
        await updateTutor(Number(id), data);
      } else {
        await createTutor(data);
      }
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Erro ao salvar tutor.");
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
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <User size={24} />
          </div>
          <h1 className="text-2xl font-bold">{id ? "Editar Tutor" : "Cadastrar Novo Tutor"}</h1>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Nome Completo *</label>
            <input 
              {...register("nome", { required: "Nome é obrigatório" })} 
              className={`w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none ${errors.nome ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Ex: João Silva"
            />
            {errors.nome && <p className="text-red-500 text-xs">{errors.nome.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Telefone *</label>
              <input 
                {...register("telefone", { required: "Telefone é obrigatório" })} 
                className={`w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none ${errors.telefone ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="(00) 00000-0000"
              />
              {errors.telefone && <p className="text-red-500 text-xs">{errors.telefone.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">E-mail</label>
              <input 
                type="email"
                {...register("email", { 
                  pattern: { 
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                    message: "E-mail inválido" 
                  } 
                })} 
                className={`w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="joao@exemplo.com"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Endereço</label>
            <input 
              {...register("endereco")} 
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Rua, Número, Bairro, Cidade"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {id ? "Atualizar Tutor" : "Salvar Tutor"}
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
