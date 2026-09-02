"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { createCoupon, updateCoupon, deleteCoupon, toggleCouponStatus } from "./_actions/coupons";

type Coupon = {
  id: string;
  tenant_id: string;
  code: string;
  discount_type: "PERCENTAGE" | "FIXED";
  discount_value: number;
  status: "ACTIVE" | "INACTIVE" | "EXPIRED";
  customer_eligibility: "ALL" | "VIP_ONLY" | "SPECIFIC_CUSTOMERS";
  eligible_customer_ids: string[];
  min_purchase_amount: number | null;
  usage_limit: number | null;
  usage_count: number;
  start_date: string | null;
  end_date: string | null;
  applies_to_shipping: boolean;
  applies_to_store: boolean;
  applies_to_extra_services: boolean;
  created_at: string;
  updated_at: string;
};

export default function CouponsClient({
  initialCoupons,
  subdomain,
  clients,
}: {
  initialCoupons: Coupon[];
  subdomain: string;
  clients: any[];
}) {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    discount_type: "PERCENTAGE",
    discount_value: 0,
    status: "ACTIVE",
    customer_eligibility: "ALL",
    eligible_customer_ids: "",
    min_purchase_amount: "",
    usage_limit: "",
    start_date: "",
    end_date: "",
    applies_to_shipping: false,
    applies_to_store: true,
    applies_to_extra_services: false,
  });

  const openNewModal = () => {
    setEditingCoupon(null);
    setFormData({
      code: "",
      discount_type: "PERCENTAGE",
      discount_value: 0,
      status: "ACTIVE",
      customer_eligibility: "ALL",
      eligible_customer_ids: "",
      min_purchase_amount: "",
      usage_limit: "",
      start_date: "",
      end_date: "",
      applies_to_shipping: false,
      applies_to_store: true,
      applies_to_extra_services: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      status: coupon.status,
      customer_eligibility: coupon.customer_eligibility,
      eligible_customer_ids: coupon.eligible_customer_ids ? coupon.eligible_customer_ids.join(", ") : "",
      min_purchase_amount: coupon.min_purchase_amount ? coupon.min_purchase_amount.toString() : "",
      usage_limit: coupon.usage_limit ? coupon.usage_limit.toString() : "",
      start_date: coupon.start_date ? new Date(coupon.start_date).toISOString().split("T")[0] : "",
      end_date: coupon.end_date ? new Date(coupon.end_date).toISOString().split("T")[0] : "",
      applies_to_shipping: coupon.applies_to_shipping,
      applies_to_store: coupon.applies_to_store,
      applies_to_extra_services: coupon.applies_to_extra_services,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este cupom?")) return;
    try {
      await deleteCoupon(subdomain, id);
      setCoupons(coupons.filter(c => c.id !== id));
      toast.success("Cupom excluído com sucesso");
    } catch (err: any) {
      toast.error(err.message || "Erro ao excluir cupom");
    }
  };

  const handleToggleStatus = async (coupon: Coupon) => {
    const newStatus = coupon.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await toggleCouponStatus(subdomain, coupon.id, newStatus);
      setCoupons(
        coupons.map(c => (c.id === coupon.id ? { ...c, status: newStatus } : c))
      );
      toast.success("Status atualizado com sucesso");
    } catch (err: any) {
      toast.error(err.message || "Erro ao atualizar status");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        discount_value: Number(formData.discount_value),
        min_purchase_amount: formData.min_purchase_amount ? Number(formData.min_purchase_amount) : null,
        usage_limit: formData.usage_limit ? Number(formData.usage_limit) : null,
        eligible_customer_ids: formData.eligible_customer_ids
          ? formData.eligible_customer_ids.split(",").map(s => s.trim()).filter(Boolean)
          : [],
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
      };

      if (editingCoupon) {
        await updateCoupon(subdomain, editingCoupon.id, dataToSubmit);
        toast.success("Cupom atualizado com sucesso");
      } else {
        await createCoupon(subdomain, dataToSubmit);
        toast.success("Cupom criado com sucesso");
      }
      
      // Reload page to get fresh data is simplest, but we can also just rely on revalidatePath
      window.location.reload(); 
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar cupom");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100">Cupons de Desconto</h1>
            <p className="text-zinc-400 mt-1">Gerencie cupons e promoções da sua loja</p>
          </div>
          <button
            onClick={openNewModal}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Novo Cupom
          </button>
        </div>

        <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-800/50 text-zinc-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Código</th>
                  <th className="px-6 py-4 font-medium">Desconto</th>
                  <th className="px-6 py-4 font-medium">Uso</th>
                  <th className="px-6 py-4 font-medium">Validade</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {coupons.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                      Nenhum cupom encontrado
                    </td>
                  </tr>
                ) : (
                  coupons.map(coupon => (
                    <tr key={coupon.id} className="hover:bg-zinc-800/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-amber-500">
                        {coupon.code}
                      </td>
                      <td className="px-6 py-4">
                        {coupon.discount_type === "PERCENTAGE" 
                          ? `${coupon.discount_value}%` 
                          : `R$ ${coupon.discount_value.toFixed(2)}`}
                      </td>
                      <td className="px-6 py-4">
                        {coupon.usage_count} / {coupon.usage_limit || "∞"}
                      </td>
                      <td className="px-6 py-4 text-zinc-400">
                        {coupon.end_date 
                          ? new Date(coupon.end_date).toLocaleDateString("pt-BR") 
                          : "Sem validade"}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(coupon)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            coupon.status === "ACTIVE" 
                              ? "bg-green-500/10 text-green-500 border border-green-500/20" 
                              : coupon.status === "INACTIVE"
                                ? "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
                                : "bg-red-500/10 text-red-500 border border-red-500/20"
                          }`}
                        >
                          {coupon.status === "ACTIVE" ? "Ativo" : coupon.status === "INACTIVE" ? "Inativo" : "Expirado"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => openEditModal(coupon)}
                            className="text-zinc-400 hover:text-amber-500 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon.id)}
                            className="text-zinc-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h2 className="text-xl font-semibold text-zinc-100">
                {editingCoupon ? "Editar Cupom" : "Novo Cupom"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Código do Cupom</label>
                  <input
                    required
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    placeholder="Ex: PROMO2024"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  >
                    <option value="ACTIVE">Ativo</option>
                    <option value="INACTIVE">Inativo</option>
                    <option value="EXPIRED">Expirado</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Tipo de Desconto</label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  >
                    <option value="PERCENTAGE">Porcentagem (%)</option>
                    <option value="FIXED">Valor Fixo (R$)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Valor do Desconto</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: Number(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Data de Início</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Data de Término</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Valor Mínimo de Compra</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.min_purchase_amount}
                    onChange={(e) => setFormData({ ...formData, min_purchase_amount: e.target.value })}
                    placeholder="Opcional"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Limite de Usos Totais</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                    placeholder="Opcional (ex: 100)"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <h3 className="text-sm font-medium text-zinc-100">Aplicabilidade</h3>
                <div className="flex gap-4 flex-wrap">
                  <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.applies_to_store}
                      onChange={(e) => setFormData({ ...formData, applies_to_store: e.target.checked })}
                      className="rounded border-zinc-700 bg-zinc-950 text-amber-500 focus:ring-amber-500/50"
                    />
                    Produtos da Loja
                  </label>
                  <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.applies_to_shipping}
                      onChange={(e) => setFormData({ ...formData, applies_to_shipping: e.target.checked })}
                      className="rounded border-zinc-700 bg-zinc-950 text-amber-500 focus:ring-amber-500/50"
                    />
                    Frete
                  </label>
                  <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.applies_to_extra_services}
                      onChange={(e) => setFormData({ ...formData, applies_to_extra_services: e.target.checked })}
                      className="rounded border-zinc-700 bg-zinc-950 text-amber-500 focus:ring-amber-500/50"
                    />
                    Serviços Extras
                  </label>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <h3 className="text-sm font-medium text-zinc-100">Elegibilidade de Clientes</h3>
                <div className="space-y-4">
                  <select
                    value={formData.customer_eligibility}
                    onChange={(e) => setFormData({ ...formData, customer_eligibility: e.target.value })}
                    className="w-full md:w-1/2 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  >
                    <option value="ALL">Todos os Clientes</option>
                    <option value="VIP_ONLY">Apenas Clientes VIP</option>
                    <option value="SPECIFIC_CUSTOMERS">Clientes Específicos</option>
                  </select>

                  {formData.customer_eligibility === "SPECIFIC_CUSTOMERS" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300">IDs dos Clientes</label>
                      <input
                        type="text"
                        value={formData.eligible_customer_ids}
                        onChange={(e) => setFormData({ ...formData, eligible_customer_ids: e.target.value })}
                        placeholder="Ex: id1, id2, id3 (separados por vírgula)"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-6 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-zinc-300 hover:text-white transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                >
                  {editingCoupon ? "Salvar Alterações" : "Criar Cupom"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
