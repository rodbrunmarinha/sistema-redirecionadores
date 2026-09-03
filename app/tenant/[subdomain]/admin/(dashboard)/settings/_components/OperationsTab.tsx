import { 
  Weight, 
  Banknote, 
  MapPin, 
  PackageSearch,
  ShoppingCart,
  ArchiveRestore, 
  Calculator,
  Mail
} from "lucide-react";
import { useState } from "react";

function Switch({ checked, onChange, label, description }: { checked: boolean, onChange: (v: boolean) => void, label: string, description?: string }) {
  return (
    <div className="flex items-start sm:items-center justify-between py-4 border-b border-zinc-800 last:border-0 gap-4">
      <div className="flex-1 pr-4">
        <div className="font-medium text-zinc-100 text-sm">{label}</div>
        {description && <div className="text-xs text-zinc-400 mt-1 leading-relaxed">{description}</div>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-amber-500' : 'bg-zinc-700'}`}
      >
        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

export function OperationsTab({ data, onChange }: { data?: any, onChange?: (data: any) => void }) {
  const weightUnit = data?.weightUnit ?? 'kg';
  const setWeightUnit = (val: string) => onChange?.({ ...data, weightUnit: val });
  
  const currency = data?.currency ?? 'USD';
  const setCurrency = (val: string) => onChange?.({ ...data, currency: val });
  
  const language = data?.language ?? 'pt-BR';
  const setLanguage = (val: string) => onChange?.({ ...data, language: val });
  
  // Exchange Rates
  const exchangeRatePix = data?.exchangeRatePix ?? "5.50";
  const setExchangeRatePix = (val: string) => onChange?.({ ...data, exchangeRatePix: val });
  
  const exchangeRateCard = data?.exchangeRateCard ?? "5.80";
  const setExchangeRateCard = (val: string) => onChange?.({ ...data, exchangeRateCard: val });
  
  // Storage
  const storageDays = data?.storageDays ?? 30;
  const setStorageDays = (val: number) => onChange?.({ ...data, storageDays: val });
  
  const storagePenalty = data?.storagePenalty ?? "1.00";
  const setStoragePenalty = (val: string) => onChange?.({ ...data, storagePenalty: val });
  
  const taxPercent = data?.taxPercent ?? "0";
  const setTaxPercent = (val: string) => onChange?.({ ...data, taxPercent: val });

  const serviceFeeType = data?.serviceFeeType ?? 'none';
  const setServiceFeeType = (val: string) => onChange?.({ ...data, serviceFeeType: val });

  const serviceFeeAmount = data?.serviceFeeAmount ?? "0";
  const setServiceFeeAmount = (val: string) => onChange?.({ ...data, serviceFeeAmount: val });

  // Address Rules
  const zipCodeRequired = data?.zipCodeRequired ?? 'required';
  const setZipCodeRequired = (val: string) => onChange?.({ ...data, zipCodeRequired: val });
  
  const requireAddress = data?.requireAddress ?? false;
  const setRequireAddress = (val: boolean) => onChange?.({ ...data, requireAddress: val });

  // Shipping / Customs
  const allowZeroCustoms = data?.allowZeroCustoms ?? false;
  const setAllowZeroCustoms = (val: boolean) => onChange?.({ ...data, allowZeroCustoms: val });
  
  const allowMultipleCoupons = data?.allowMultipleCoupons ?? false;
  const setAllowMultipleCoupons = (val: boolean) => onChange?.({ ...data, allowMultipleCoupons: val });
  
  const pauseShipping = data?.pauseShipping ?? false;
  const setPauseShipping = (val: boolean) => onChange?.({ ...data, pauseShipping: val });

  // Receiving
  const allowProductWithoutBox = data?.allowProductWithoutBox ?? false;
  const setAllowProductWithoutBox = (val: boolean) => onChange?.({ ...data, allowProductWithoutBox: val });
  
  const renewStorageOnProduct = data?.renewStorageOnProduct ?? false;
  const setRenewStorageOnProduct = (val: boolean) => onChange?.({ ...data, renewStorageOnProduct: val });

  // Sales / Groups
  const cancelUnpaidHours = data?.cancelUnpaidHours ?? "90";
  const setCancelUnpaidHours = (val: string) => onChange?.({ ...data, cancelUnpaidHours: val });
  
  const stopAtPaid = data?.stopAtPaid ?? false;
  const setStopAtPaid = (val: boolean) => onChange?.({ ...data, stopAtPaid: val });
  
  const paymentMethods = data?.paymentMethods ?? {
    parcelado: true,
    global: false,
    glin: false,
    pix: true
  };
  const setPaymentMethods = (val: any) => onChange?.({ ...data, paymentMethods: typeof val === 'function' ? val(paymentMethods) : val });

  const orderOpenMsg = data?.orderOpenMsg ?? "";
  const setOrderOpenMsg = (val: string) => onChange?.({ ...data, orderOpenMsg: val });
  
  const orderClosedMsg = data?.orderClosedMsg ?? "";
  const setOrderClosedMsg = (val: string) => onChange?.({ ...data, orderClosedMsg: val });

  return (
    <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-4 sm:p-8 space-y-12">
      
      {/* Unidade de Peso */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
          <Weight className="w-5 h-5 text-amber-500" />
          <span>Unidade de Peso</span>
        </h3>
        <p className="text-sm text-zinc-400">Esta unidade será usada em todo o sistema (admin e clientes).</p>
        
        <div className="flex gap-4">
          <label className={`cursor-pointer flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all w-32 ${weightUnit === 'kg' ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'}`}>
            <input type="radio" name="weight" checked={weightUnit === 'kg'} onChange={() => setWeightUnit('kg')} className="hidden" />
            <span className="text-2xl font-bold mb-1">KG</span>
            <span className="text-xs font-medium">Quilogramas</span>
          </label>
          <label className={`cursor-pointer flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all w-32 ${weightUnit === 'lb' ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'}`}>
            <input type="radio" name="weight" checked={weightUnit === 'lb'} onChange={() => setWeightUnit('lb')} className="hidden" />
            <span className="text-2xl font-bold mb-1">LB</span>
            <span className="text-xs font-medium">Libras</span>
          </label>
        </div>
      </section>

      <hr className="border-zinc-800" />

      {/* Moeda e Idioma */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
          <Banknote className="w-5 h-5 text-amber-500" />
          <span>Moeda e Idioma</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Moeda Base</label>
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-sm focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="JPY">Iene Japonês (JPY)</option>
              <option value="USD">Dólar Americano (USD)</option>
              <option value="BRL">Real Brasileiro (BRL)</option>
              <option value="EUR">Euro (EUR)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Idioma Padrão</label>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-sm focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">Inglês (US)</option>
              <option value="es">Espanhol</option>
            </select>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-800 space-y-6">
          <h4 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-amber-500" />
            Cotação p/ Reais (Aproximada)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Cotação via PIX</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">R$</span>
                <input
                  type="number"
                  step="0.01"
                  value={exchangeRatePix}
                  onChange={(e) => setExchangeRatePix(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Cotação via Cartão</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">R$</span>
                <input
                  type="number"
                  step="0.01"
                  value={exchangeRateCard}
                  onChange={(e) => setExchangeRateCard(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-zinc-800" />

      {/* Regras de Endereço */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-amber-500" />
          <span>Regras de Endereço (Clientes)</span>
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Código Postal Obrigatório</label>
            <p className="text-xs text-zinc-400 mb-3">Defina se o preenchimento do código postal (CEP/ZIP) é obrigatório ao cadastrar endereços.</p>
            <div className="grid grid-cols-2 gap-4">
              <label className={`cursor-pointer p-4 rounded-xl border-2 transition-colors flex items-center gap-3 ${zipCodeRequired === 'required' ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-700 hover:border-zinc-600'}`}>
                <input type="radio" checked={zipCodeRequired === 'required'} onChange={() => setZipCodeRequired('required')} className="hidden" />
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${zipCodeRequired === 'required' ? 'border-amber-500 bg-amber-500' : 'border-zinc-600'}`}>
                  {zipCodeRequired === 'required' && <div className="w-2 h-2 rounded-sm bg-white" />}
                </div>
                <span className="font-medium text-zinc-100 text-sm">Obrigatório</span>
              </label>
              <label className={`cursor-pointer p-4 rounded-xl border-2 transition-colors flex items-center gap-3 ${zipCodeRequired === 'optional' ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-700 hover:border-zinc-600'}`}>
                <input type="radio" checked={zipCodeRequired === 'optional'} onChange={() => setZipCodeRequired('optional')} className="hidden" />
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${zipCodeRequired === 'optional' ? 'border-amber-500 bg-amber-500' : 'border-zinc-600'}`}>
                  {zipCodeRequired === 'optional' && <div className="w-2 h-2 rounded-sm bg-white" />}
                </div>
                <span className="font-medium text-zinc-100 text-sm">Opcional</span>
              </label>
            </div>
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
            <Switch 
              checked={requireAddress} 
              onChange={setRequireAddress} 
              label="Obrigar o cliente a cadastrar pelo menos 1 endereço" 
              description="Se ativado, um modal bloqueante será exibido no aplicativo até que o cliente cadastre pelo menos um endereço."
            />
          </div>
        </div>
      </section>

      <hr className="border-zinc-800" />

      {/* Modo de Envio */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
          <PackageSearch className="w-5 h-5 text-amber-500" />
          <span>Modo de Envio e Declaração</span>
        </h3>
        
        <div className="bg-zinc-950 rounded-xl border border-zinc-800 px-4">
          <Switch 
            checked={allowZeroCustoms} 
            onChange={setAllowZeroCustoms} 
            label="Permitir valor zero na declaração aduaneira" 
            description="Quando ativado, clientes e admins podem salvar itens com valor declarado zero. Quando desativado (padrão), todos os itens precisam ter valor acima de zero."
          />
          <Switch 
            checked={allowMultipleCoupons} 
            onChange={setAllowMultipleCoupons} 
            label="Permitir acúmulo de cupons de frete" 
            description="Quando ativado, o cliente pode selecionar mais de um cupom de frete no mesmo envio, somando os descontos."
          />
          <Switch 
            checked={pauseShipping} 
            onChange={setPauseShipping} 
            label="Pausar abertura de envios" 
            description="Impede que os clientes abram novos envios. Envios já criados seguem normalmente."
          />
        </div>
      </section>

      <hr className="border-zinc-800" />

      {/* Recebimento */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
          <ArchiveRestore className="w-5 h-5 text-amber-500" />
          <span>Recebimento e Armazenagem</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Dias de Armazenamento Gratuito</label>
            <div className="flex items-center">
              <input 
                type="number" 
                value={storageDays}
                onChange={(e) => setStorageDays(parseInt(e.target.value) || 0)}
                className="w-24 bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-l-lg px-3 py-2 text-sm focus:ring-amber-500 focus:border-amber-500"
              />
              <span className="bg-zinc-800 border border-l-0 border-zinc-700 text-zinc-400 px-3 py-2 rounded-r-lg text-sm">dias</span>
            </div>
            <p className="text-xs text-zinc-400 mt-2">Após este período, a caixa cobrará multa diária.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Multa Diária (após vencimento)</label>
            <div className="flex items-center">
              <span className="bg-zinc-800 border border-r-0 border-zinc-700 text-zinc-400 px-3 py-2 rounded-l-lg text-sm">R$</span>
              <input 
                type="text" 
                value={storagePenalty}
                onChange={(e) => setStoragePenalty(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-r-lg px-3 py-2 text-sm focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-zinc-950 rounded-xl border border-zinc-800 px-4">
          <Switch 
            checked={allowProductWithoutBox} 
            onChange={setAllowProductWithoutBox} 
            label="Permitir cadastro de produto sem caixa" 
            description="Quando ativado, o admin pode selecionar o cliente e registrar o produto direto no dock, sem criar uma caixa antes."
          />
          <Switch 
            checked={renewStorageOnProduct} 
            onChange={setRenewStorageOnProduct} 
            label="Renovar armazenamento ao adicionar produto no dock" 
            description="Ao registrar um novo produto, os produtos não vencidos daquela dock têm o prazo renovado automaticamente."
          />
        </div>
      </section>

      <hr className="border-zinc-800" />

      {/* Grupos de Compras e Financeiro */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-amber-500" />
          <span>Grupos de Compras e Financeiro</span>
        </h3>
        
        {/* Cancelar pedido */}
        <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 sm:p-6 space-y-6">
          <div>
            <h4 className="font-medium text-zinc-100 text-sm mb-1">Cancelar pedido de grupo não pago</h4>
            <p className="text-xs text-zinc-400 mb-4">Pedido aguardando pagamento é cancelado depois do prazo, e o estoque volta para o grupo.</p>
            
            <label className="block text-sm font-medium text-zinc-300 mb-2">Cancelar após</label>
            <div className="flex items-center max-w-xs mb-6">
              <input 
                type="number" 
                value={cancelUnpaidHours}
                onChange={(e) => setCancelUnpaidHours(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-l-lg px-3 py-2 text-sm focus:ring-amber-500 focus:border-amber-500"
              />
              <span className="bg-zinc-800 border border-l-0 border-zinc-700 text-zinc-400 px-3 py-2 rounded-r-lg text-sm">horas</span>
            </div>

            <label className="block text-sm font-medium text-zinc-300 mb-2">Aplicar a estas formas de pagamento:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'parcelado', label: 'Parcelado USA' },
                { id: 'global', label: 'Global Pays' },
                { id: 'glin', label: 'Glin' },
                { id: 'infinite', label: 'InfinitePay' },
                { id: 'manual', label: 'Comprovante manual' },
              ].map(method => (
                <label key={method.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${paymentMethods[method.id as keyof typeof paymentMethods] ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-700 hover:border-zinc-600'}`}>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${paymentMethods[method.id as keyof typeof paymentMethods] ? 'border-amber-500 bg-amber-500' : 'border-zinc-600'}`}>
                    {paymentMethods[method.id as keyof typeof paymentMethods] && <div className="w-2 h-2 rounded-sm bg-white" />}
                  </div>
                  <span className="text-sm font-medium text-zinc-200">{method.label}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-zinc-500 mt-3">Sem nenhuma marcada, nada é cancelado automaticamente.</p>
          </div>

          <div className="pt-6 border-t border-zinc-800">
            <Switch 
              checked={stopAtPaid} 
              onChange={setStopAtPaid} 
              label="Parar em 'Pago' após a confirmação do pagamento" 
              description="O envio fica em 'Pago' em vez de ir direto para 'Em processamento'. Útil para fazer declaração antes de separar."
            />
          </div>
        </div>

        {/* Imposto */}
        <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 sm:p-6">
          <label className="block text-sm font-medium text-zinc-300 mb-1">Sales Tax (Imposto de Venda)</label>
          <p className="text-xs text-zinc-400 mb-3">Taxa de imposto aplicada nos cálculos do simulador e grupos de compra.</p>
          <div className="flex items-center max-w-xs">
            <input 
              type="text" 
              value={taxPercent}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '');
                if (!digits) {
                  setTaxPercent("0.00");
                } else {
                  setTaxPercent((parseInt(digits, 10) / 100).toFixed(2));
                }
              }}
              className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-l-lg px-3 py-2 text-sm focus:ring-amber-500 focus:border-amber-500"
            />
            <span className="bg-zinc-800 border border-l-0 border-zinc-700 text-zinc-400 px-3 py-2 rounded-r-lg text-sm">%</span>
          </div>
        </div>

        {/* Taxa de Serviço */}
        <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="w-5 h-5 text-amber-500" />
            <h4 className="font-medium text-zinc-100 text-sm">Taxa de Serviço do Redirecionador</h4>
          </div>
          <p className="text-xs text-zinc-400 mb-4">Como você deseja cobrar pelo seu serviço (cobrado no momento da montagem do envio).</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Método de Cobrança</label>
              <select 
                value={serviceFeeType}
                onChange={(e) => setServiceFeeType(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-sm focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="none">Nenhuma taxa de serviço</option>
                <option value="fixed_per_box">Taxa Fixa (por caixa enviada)</option>
                <option value="per_weight">Taxa por Peso (multiplicado pelo peso da caixa)</option>
                <option value="percentage_product">Porcentagem (%) sobre o valor real pago pelo produto</option>
              </select>
            </div>

            {serviceFeeType !== 'none' && (
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  {serviceFeeType === 'percentage_product' ? 'Porcentagem (%)' : `Valor`}
                </label>
                <div className="flex items-center max-w-xs">
                  {serviceFeeType !== 'percentage_product' && (
                    <span className="bg-zinc-800 border border-r-0 border-zinc-700 text-zinc-400 px-3 py-2 rounded-l-lg text-sm">
                      {currency}
                    </span>
                  )}
                  <input 
                    type="text" 
                    value={serviceFeeAmount}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '');
                      if (!digits) {
                        setServiceFeeAmount("0.00");
                      } else {
                        setServiceFeeAmount((parseInt(digits, 10) / 100).toFixed(2));
                      }
                    }}
                    className={`w-full bg-zinc-900 border border-zinc-700 text-zinc-100 px-3 py-2 text-sm focus:ring-amber-500 focus:border-amber-500 ${
                      serviceFeeType === 'percentage_product' ? 'rounded-l-lg' : 'rounded-r-lg'
                    }`}
                  />
                  {serviceFeeType === 'percentage_product' && (
                    <span className="bg-zinc-800 border border-l-0 border-zinc-700 text-zinc-400 px-3 py-2 rounded-r-lg text-sm">
                      %
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mensagens Padrão */}
        <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 sm:p-6 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-5 h-5 text-amber-500" />
            <h4 className="font-medium text-zinc-100 text-sm">Mensagens padrão de grupos de compras</h4>
          </div>
          <p className="text-xs text-zinc-400 mb-4">Pré-preenche automaticamente as mensagens ao criar um novo grupo.</p>
          
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Mensagem de abertura padrão</label>
            <textarea 
              rows={3}
              value={orderOpenMsg}
              onChange={(e) => setOrderOpenMsg(e.target.value)}
              placeholder="Ex: Olá! O grupo {{group_name}} foi aberto. Aproveite as ofertas!"
              className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-sm focus:ring-amber-500 focus:border-amber-500 resize-y"
            />
            <p className="text-xs text-zinc-500 mt-2">Variáveis disponíveis: {'{{group_name}}, {{group_link}}, {{store_name}}, {{available_products_count}}'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Mensagem de encerramento padrão</label>
            <textarea 
              rows={3}
              value={orderClosedMsg}
              onChange={(e) => setOrderClosedMsg(e.target.value)}
              placeholder="Ex: O grupo {{group_name}} foi encerrado. Obrigado!"
              className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-sm focus:ring-amber-500 focus:border-amber-500 resize-y"
            />
          </div>
        </div>

      </section>

    </div>
  );
}
