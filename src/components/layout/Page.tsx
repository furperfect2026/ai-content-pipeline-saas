import { motion } from "framer-motion";

export function Page({ title, eyebrow, children, action }: { title: string; eyebrow?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-500">{eyebrow}</p>}
          <h1 className="mt-1 text-3xl font-black tracking-tight md:text-4xl">{title}</h1>
        </div>
        {action}
      </div>
      {children}
    </motion.div>
  );
}
