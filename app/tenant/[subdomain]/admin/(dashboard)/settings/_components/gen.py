import os

components = [
    "BrandingTab", "OperationsTab", "AddressTab", 
    "ConversionTab", "MenuTab", "QuickLinksTab", "NotificationsTab"
]

base_dir = r"C:\Users\rodbr\OneDrive\Documentos\Sistema para redirecionadores\web\app\tenant\[subdomain]\admin\(dashboard)\settings\_components"

template = """export function {name}() {{
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{name}</h2>
      <p className="text-zinc-500 dark:text-zinc-400 mt-2">Em construção...</p>
    </div>
  );
}}
"""

for c in components:
    with open(os.path.join(base_dir, f"{c}.tsx"), "w", encoding="utf-8") as f:
        f.write(template.format(name=c))
        
print("Placeholders created")
