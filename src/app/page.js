"use client";

import Link from 'next/link';
import React, { useRef } from 'react';
import { motion } from 'framer-motion';

// --- Ícones SVG ---

const PortalIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
);

// --- Componente de Card Magnético ---

const MagneticCard = ({ children }) => {
  const ref = useRef(null);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x, y });
  };

  const mouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={mouseLeave}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 250, damping: 15, mass: 0.5 }}
      className="relative z-10"
    >
      {children}
    </motion.div>
  );
};


// --- Componente Principal da Página Inicial ---

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black p-8 text-white">
      {/* Efeito de fundo com gradiente sutil */}
      <div className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,255,255,0.08),rgba(255,255,255,0))]"></div>

      <div className="z-10 flex flex-col items-center text-center">
        {/* Título com animação de entrada */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="mb-4 text-6xl font-black tracking-tighter sm:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500"
        >
          Bem-vindo.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          className="max-w-md text-lg text-gray-400"
        >
          Um espaço para explorar experimentos interativos. Selecione um destino para começar sua jornada.
        </motion.p>
        
        <div className="mt-12 flex flex-col sm:flex-row gap-8">
    {/* Card 1 (o que já existia) */}
     <MagneticCard>
        <Link href="/dados" passHref>
            <motion.div
                className="group relative flex cursor-pointer items-center gap-4 rounded-full border border-white/10 bg-gray-900/50 px-8 py-5 text-xl font-semibold shadow-2xl transition-all duration-300 hover:border-white/30"
                whileHover={{ scale: 1.1, boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.2)" }}
            >
                <span className="bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
                    Analisar Dados
                </span>
                <motion.div initial={{ x: 0 }} whileHover={{ x: 5 }}>
                    <span className="text-pink-400">→</span>
                </motion.div>
            </motion.div>
        </Link>
    </MagneticCard>

    {/* Card 2 (o novo, com destino e estilo diferentes) */}
    <MagneticCard>
        <Link href="/portal" passHref>
            <motion.div
                className="group relative flex cursor-pointer items-center gap-4 rounded-full border border-white/10 bg-gray-900/50 px-8 py-5 text-xl font-semibold shadow-2xl transition-all duration-300 hover:border-white/30"
                whileHover={{ scale: 1.1, boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.2)" }}
            >
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    Portal de Projetos
                </span>
                <motion.div initial={{ x: 0 }} whileHover={{ x: 5 }}>
                    <span className="text-cyan-400">→</span>
                </motion.div>
            </motion.div>
        </Link>
    </MagneticCard>
    </div>
      </div>
    </main>
  );
}