import re

with open("app/tenant/[subdomain]/app/register/RegisterClient.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Convert Dark Theme to Light Theme
content = content.replace('bg-zinc-950 flex', 'bg-zinc-50 flex')
content = content.replace('bg-zinc-900 border border-zinc-800 w-full', 'bg-white w-full')
content = content.replace('bg-zinc-900 border border-zinc-800', 'bg-white border-zinc-200')
content = content.replace('bg-zinc-900 border-zinc-800', 'bg-white border-zinc-200')
content = content.replace('text-zinc-300', 'text-zinc-700')
content = content.replace('bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-white placeholder:text-zinc-600', 'bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 ${theme.ring} ${theme.border} transition-all text-zinc-900 placeholder:text-zinc-400')
content = content.replace('bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 ${theme.ring} ${theme.border} transition-all text-white placeholder:text-zinc-600', 'bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 ${theme.ring} ${theme.border} transition-all text-zinc-900 placeholder:text-zinc-400')
content = content.replace('bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 ${theme.ring} ${theme.border} transition-all text-white placeholder:text-zinc-600', 'bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 ${theme.ring} ${theme.border} transition-all text-zinc-900 placeholder:text-zinc-400')
content = content.replace('bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 ${theme.ring} ${theme.border} transition-all text-white', 'bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 ${theme.ring} ${theme.border} transition-all text-zinc-900')

content = content.replace('text-white mb-2', 'text-zinc-900 mb-2')
content = content.replace('bg-zinc-900 relative', 'bg-white relative')
content = content.replace('border-t border-white/20', 'border-t border-zinc-100')
content = content.replace('text-orange-50', 'text-zinc-500')
content = content.replace('text-orange-100', 'text-zinc-500')
content = content.replace('bg-zinc-950 border-r border-zinc-800 hover:bg-indigo-500/20 text-white rounded-xl font-medium transition-all shadow-lg  flex justify-center items-center', 'w-full py-3.5 mt-4 ${theme.button} text-white rounded-xl font-medium transition-all flex justify-center items-center')
content = content.replace('border-t border-white/20', 'border-t border-zinc-100')

# Fix Left Panel entirely to match LoginClient structure
left_panel_old = r'<div className="md:w-5/12 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600.*?</div>\s+</div>\s+</div>'
left_panel_new = """<div className={`md:w-5/12 ${theme.panel} p-10 lg:p-12 flex flex-col relative overflow-hidden text-white`}>
          {/* Decorative Circles */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className={`absolute top-[20%] -left-[20%] w-[120%] h-[120%] ${theme.circle} rounded-full blur-[80px] opacity-60 mix-blend-multiply`} />
            <div className="absolute bottom-[-10%] right-[-20%] w-[100%] h-[100%] bg-white/10 rounded-full blur-[60px]" />
          </div>
          
          <div className="relative z-10">
            {/* Tenant Header */}
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">{organizationName}</span>
            </div>

            <div className="mb-4">
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                Comece hoje! ??
              </h1>
            </div>
            <p className={`${theme.text} text-lg lg:text-xl mb-12 max-w-sm font-medium mt-2 leading-relaxed opacity-90`}>
              Cadastre-se e tenha seu endereço exclusivo para compras internacionais.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span className="font-medium">Rastreamento em Tempo Real</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span className="font-medium">Histórico Completo</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span className="font-medium">Suporte Dedicado</span>
              </div>
            </div>
          </div>
        </div>"""
content = re.sub(left_panel_old, left_panel_new, content, flags=re.DOTALL)

with open("app/tenant/[subdomain]/app/register/RegisterClient.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Done")
