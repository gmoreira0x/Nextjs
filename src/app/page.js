"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

// --- Ícones SVG para os botões ---

const PanelIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12A2.25 2.25 0 0020.25 14.25V3M3.75 3l-1.48-1.48M3.75 3h16.5M12 3v13.5" />
    </svg>
);

const MachineIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5M11.25 4.5l-7.5 7.5 7.5 7.5" />
    </svg>
);

// --- Componente Principal da Página Inicial ---

export default function HomePage() {

  // Variantes para a animação do container principal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Anima os filhos com um atraso de 0.3s entre eles
        delayChildren: 0.2,
      },
    },
  };

  // Variantes para a animação dos itens filhos
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    // Container com fundo de grade e gradiente radial para um efeito de "palco"
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-950 p-8 text-white">
      <div className="absolute inset-0 h-full w-full bg-slate-950 [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
      <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>

      {/* Container de animação principal */}
      <motion.div
        className="z-10 flex flex-col items-center text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Título animado */}
        <motion.h1
          className="mb-4 text-5xl font-black tracking-tighter sm:text-7xl"
          variants={itemVariants}
        >
          <span className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            Portal de Projetos
          </span>
        </motion.h1>

        {/* Parágrafo animado */}
        <motion.p
          className="max-w-xl text-lg text-gray-400"
          variants={itemVariants}
        >
          Navegue pelos experimentos interativos criados com Next.js, React e Framer Motion.
        </motion.p>

        {/* Container para os links/portais, com animação própria */}
        <motion.div
          className="mt-12 flex flex-col items-center gap-6 sm:flex-row"
          variants={itemVariants}
        >
          <Link href="/panel" passHref>
            <motion.div
              className="group relative flex cursor-pointer items-center gap-4 rounded-lg border border-white/10 bg-gray-900/50 px-8 py-6 shadow-2xl transition-all duration-300 hover:border-cyan-400/50"
              whileHover={{ y: -5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative z-10 flex items-center gap-4">
                  <PanelIcon className="h-8 w-8 text-cyan-300" />
                  <div>
                      <h3 className="text-xl font-bold text-white">Painel de Controle</h3>
                      <p className="text-sm text-gray-400">Dashboard Interativo</p>
                  </div>
              </div>
            </motion.div>
          </Link>

          <Link href="/panel2" passHref>
            <motion.div
              className="group relative flex cursor-pointer items-center gap-4 rounded-lg border border-white/10 bg-gray-900/50 px-8 py-6 shadow-2xl transition-all duration-300 hover:border-pink-400/50"
              whileHover={{ y: -5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
                <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative z-10 flex items-center gap-4">
                    <MachineIcon className="h-8 w-8 text-pink-300" />
                    <div>
                        <h3 className="text-xl font-bold text-white">Reator de Singularidade</h3>
                        <p className="text-sm text-gray-400">A Máquina Enorme</p>
                    </div>
                </div>
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}