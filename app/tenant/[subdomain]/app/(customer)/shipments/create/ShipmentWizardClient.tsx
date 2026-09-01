"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Step1Products from "./steps/Step1Products";
import Step2Terms from "./steps/Step2Terms";
import Step3Address from "./steps/Step3Address";
import Step4Extras from "./steps/Step4Extras";
import Step5Shipping from "./steps/Step5Shipping";
import Step6Declaration from "./steps/Step6Declaration";
import Step7Summary from "./steps/Step7Summary";

export default function ShipmentWizardClient({ initialExtraServices = [], shippingTypes = [] }: { initialExtraServices?: any[], shippingTypes?: any[] }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [maxReachedStep, setMaxReachedStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    products: {},
    termsAccepted: false,
    address: null,
    extras: [],
    shippingMethod: null,
    declaration: [],
  });

  useEffect(() => {
    // Check if we have preselected products
    const preselected = sessionStorage.getItem("preselected_products");
    if (preselected) {
      try {
        const parsed = JSON.parse(preselected);
        setFormData((prev: any) => ({ ...prev, products: parsed }));
      } catch (e) {
        console.error("Error parsing preselected products", e);
      }
    }
  }, []);

  const steps = [
    { id: 1, name: "Produtos", component: Step1Products },
    { id: 2, name: "Termos", component: Step2Terms },
    { id: 3, name: "Endereço", component: Step3Address },
    { id: 4, name: "Extras", component: Step4Extras },
    { id: 5, name: "Frete", component: Step5Shipping },
    { id: 6, name: "Declaração", component: Step6Declaration },
    { id: 7, name: "Resumo", component: Step7Summary },
  ];

  const goToStep = (stepId: number) => {
    if (stepId <= maxReachedStep) {
      setCurrentStep(stepId);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      const next = currentStep + 1;
      setCurrentStep(next);
      setMaxReachedStep((prev) => Math.max(prev, next));
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps.find((s) => s.id === currentStep)?.component || Step1Products;

  return (
    <div className="-m-8 min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header and Stepper */}
        <div className="mb-8 mt-4 text-center">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Solicitar Novo Envio
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Configure seu envio em poucos passos simples.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 sm:px-8 pt-6 pb-7">
            <div className="relative flex items-start justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl shadow-lg">📦</div>
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate">Criar Novo Envio</h1>
                  <p className="text-blue-100 text-sm mt-0.5">
                    Etapa <span className="font-bold text-white">{currentStep}</span> de <span className="font-bold text-white">{steps.length}</span>
                    <span className="hidden sm:inline text-blue-200">
                      {" "}
                      · <span className="font-semibold">{steps.find((s) => s.id === currentStep)?.name}</span>
                    </span>
                  </p>
                </div>
              </div>
              <button onClick={() => router.push("/app/products")} className="shrink-0 text-white/80 hover:text-white transition p-2 rounded-xl hover:bg-white/15" title="Cancelar">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="relative mt-5 h-2.5 bg-white/25 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${Math.max(6, (currentStep / steps.length) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="flex justify-between gap-2 min-w-[500px]">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => goToStep(step.id)}
                  disabled={step.id > maxReachedStep}
                  className={`flex flex-col items-center gap-2 group flex-1 ${step.id <= maxReachedStep ? "cursor-pointer" : "cursor-not-allowed"}`}
                >
                  <div
                    className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      currentStep === step.id
                        ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-105"
                        : currentStep > step.id
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-400"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={`text-[11px] font-semibold text-center leading-tight transition-colors ${
                      currentStep === step.id ? "text-blue-600 dark:text-blue-400" : currentStep > step.id ? "text-gray-700 dark:text-gray-300" : "text-gray-400"
                    }`}
                  >
                    {step.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-3xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
          <CurrentStepComponent formData={formData} setFormData={setFormData} onNext={nextStep} onPrev={prevStep} availableExtras={initialExtraServices} shippingTypes={shippingTypes} />
        </div>
      </div>
    </div>
  );
}
