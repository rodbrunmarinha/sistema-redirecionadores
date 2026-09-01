"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreateAddressPage() {
  const [phoneCountry, setPhoneCountry] = useState("BR");
  const [personType, setPersonType] = useState("fisica");
  const [loadingCep, setLoadingCep] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    cnpj: "",
    company_name: "",
    phone: "",
    zip_code: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    label: "",
    is_default: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Basic Masks (Simplified for React)
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    setFormData((prev) => ({ ...prev, cpf: value }));
  };

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 14) value = value.slice(0, 14);
    value = value.replace(/(\d{2})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1/$2");
    value = value.replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    setFormData((prev) => ({ ...prev, cnpj: value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (phoneCountry === "BR") {
      if (value.length > 11) value = value.slice(0, 11);
      value = value.replace(/(\d{2})(\d)/, "($1) $2");
      value = value.replace(/(\d{5})(\d)/, "$1-$2");
    }
    setFormData((prev) => ({ ...prev, phone: value }));
  };

  const handleZipChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (phoneCountry === "BR") {
      if (value.length > 8) value = value.slice(0, 8);
      value = value.replace(/(\d{5})(\d)/, "$1-$2");
      setFormData((prev) => ({ ...prev, zip_code: value }));

      const rawZip = value.replace(/\D/g, "");
      if (rawZip.length === 8) {
        setLoadingCep(true);
        try {
          const res = await fetch(`https://viacep.com.br/ws/${rawZip}/json/`);
          const data = await res.json();
          if (!data.erro) {
            setFormData((prev) => ({
              ...prev,
              street: data.logradouro || "",
              neighborhood: data.bairro || "",
              city: data.localidade || "",
              state: data.uf || "",
            }));
            // Automatically focus number if found
            document.getElementById("number")?.focus();
          }
        } catch (error) {
          console.error("Erro ao buscar CEP", error);
        } finally {
          setLoadingCep(false);
        }
      }
    } else {
      setFormData((prev) => ({ ...prev, zip_code: e.target.value }));
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPhoneCountry(e.target.value);
    setFormData((prev) => ({
      ...prev,
      phone: "",
      zip_code: "",
      street: "",
      neighborhood: "",
      city: "",
      state: "",
    }));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/app/addresses"
          className="p-2 rounded-lg hover:bg-zinc-100 transition text-zinc-600"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h2 className="font-bold text-2xl text-zinc-900">Novo Endereço</h2>
      </div>

      <form className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        <div className="p-8 space-y-8">
          {/* País */}
          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-2">
              País <span className="text-red-500">*</span>
            </label>
            <select
              value={phoneCountry}
              onChange={handleCountryChange}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
            >
              <option value="BR">🇧🇷 Brasil</option>
              <option value="US">🇺🇸 Estados Unidos</option>
              <option value="PT">🇵🇹 Portugal</option>
              <option value="ES">🇪🇸 Espanha</option>
              <option value="UK">🇬🇧 Reino Unido</option>
              <option value="OTHER">🌎 Outro</option>
            </select>
          </div>

          {phoneCountry === "BR" && <div className="border-t border-zinc-200"></div>}

          {/* Tipo de Pessoa (Brasil) */}
          {phoneCountry === "BR" && (
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-3">Tipo de pessoa:</label>
              <div className="grid grid-cols-2 gap-4">
                <label
                  className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition hover:shadow-md ${
                    personType === "fisica"
                      ? "border-violet-600 bg-violet-50"
                      : "border-zinc-200 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="person_type"
                    value="fisica"
                    checked={personType === "fisica"}
                    onChange={(e) => setPersonType(e.target.value)}
                    className="w-5 h-5 text-violet-600"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-bold text-zinc-900">Pessoa Física</div>
                    <div className="text-xs text-zinc-500">CPF</div>
                  </div>
                </label>

                <label
                  className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition hover:shadow-md ${
                    personType === "juridica"
                      ? "border-violet-600 bg-violet-50"
                      : "border-zinc-200 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="person_type"
                    value="juridica"
                    checked={personType === "juridica"}
                    onChange={(e) => setPersonType(e.target.value)}
                    className="w-5 h-5 text-violet-600"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-bold text-zinc-900">Pessoa Jurídica</div>
                    <div className="text-xs text-zinc-500">CNPJ</div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {phoneCountry === "BR" && <div className="border-t border-zinc-200"></div>}

          {/* Campos PF (Brasil) */}
          {phoneCountry === "BR" && personType === "fisica" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2">
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Nome completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nome do destinatário"
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  CPF <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleCpfChange}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Telefone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>
          )}

          {/* Campos PJ (Brasil) */}
          {phoneCountry === "BR" && personType === "juridica" && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">
                    CNPJ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleCnpjChange}
                    placeholder="00.000.000/0000-00"
                    maxLength={18}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">
                    Nome Responsável <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nome do responsável"
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">
                    Telefone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Razão Social <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  placeholder="Razão social ou nome fantasia"
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>
          )}

          {/* Dados Outros Países */}
          {phoneCountry !== "BR" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2">
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Nome completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nome completo"
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Identificação <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value.replace(/\D/g, '') }))}
                  placeholder="1234567890"
                  maxLength={20}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Telefone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }))}
                  placeholder="Apenas números"
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>
          )}

          <div className="border-t border-zinc-200"></div>

          {/* Informações do Endereço */}
          <div>
            <h3 className="text-lg font-bold text-zinc-900 mb-4 uppercase tracking-wide text-zinc-500">
              Informações do Endereço
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  CEP / ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleZipChange}
                  placeholder={phoneCountry === "BR" ? "00000-000" : "00000"}
                  maxLength={15}
                  className={`w-full px-4 py-3 bg-zinc-50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition ${loadingCep ? 'opacity-50' : ''}`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  {phoneCountry === "BR" ? "Rua/Logradouro" : "Endereço completo"} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder={phoneCountry === "BR" ? "Rua/Logradouro" : "Rua, número, avenida, bairro..."}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            {phoneCountry === "BR" && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 animate-in fade-in slide-in-from-top-2">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-2">
                    Número <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="number"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    placeholder="123"
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-bold text-zinc-700 mb-2">Complemento</label>
                  <input
                    type="text"
                    name="complement"
                    value={formData.complement}
                    onChange={handleInputChange}
                    placeholder="Apto, Bloco, etc."
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
            )}

            <div className={`grid grid-cols-1 gap-6 mb-6 ${phoneCountry === "BR" ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
              {phoneCountry === "BR" && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="block text-sm font-bold text-zinc-700 mb-2">
                    Bairro <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleInputChange}
                    placeholder="Bairro"
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  Cidade <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Cidade"
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">
                  {phoneCountry === "BR" ? "Estado" : "Província / Estado"} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: phoneCountry === "BR" ? e.target.value.toUpperCase() : e.target.value }))}
                  placeholder={phoneCountry === "BR" ? "UF" : "Nome do estado"}
                  maxLength={phoneCountry === "BR" ? 2 : 100}
                  className={`w-full px-4 py-3 bg-zinc-50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition ${phoneCountry === "BR" ? 'uppercase' : ''}`}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-zinc-700 mb-2">
                Apelido do Endereço (Opcional)
              </label>
              <input
                type="text"
                name="label"
                value={formData.label}
                onChange={handleInputChange}
                placeholder="Ex: Casa, Trabalho, Depósito..."
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="is_default"
                  checked={formData.is_default}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-violet-600 rounded border-zinc-300 focus:ring-2 focus:ring-violet-500"
                />
                <span className="ml-3 text-sm font-semibold text-zinc-700">
                  Definir como endereço padrão
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-8 py-6 bg-zinc-50 border-t border-zinc-200 flex gap-4 justify-end">
          <Link
            href="/app/addresses"
            className="px-6 py-3 bg-zinc-200 text-zinc-700 font-semibold rounded-xl hover:bg-zinc-300 transition"
          >
            Cancelar
          </Link>
          <button
            type="button"
            className="px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 transition shadow-lg shadow-violet-500/30 hover:-translate-y-0.5"
          >
            Salvar Endereço
          </button>
        </div>
      </form>
    </div>
  );
}
