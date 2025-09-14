// Caminho: src/app/teste/page.js

"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// Importando os blocos de construção da Framer Motion
import { motion, AnimatePresence } from 'framer-motion';

// --- Ícones SVG como Componentes ---
// Usar SVGs assim permite animá-los e estilizá-los facilmente com Tailwind

const ClicksIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
  </svg>
);

const TimerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SecretIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H5v-2H3v-2H1v-4a6 6 0 017.743-5.743z" />
  </svg>
);

// --- Componentes Reutilizáveis e Animados ---

const StatCard = ({ title, value, icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm"
  >
    <div className="flex items-center gap-4">
      <div className="text-cyan-400">{icon}</div>
      <div>
        <p className="text-gray-400 font-medium">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </div>
  </motion.div>
);

const ProgressBar = ({ value }) => {
    // Garante que o valor fique entre 0 e 100
    const clampedValue = Math.min(Math.max(value, 0), 100);
    return (
        <div className="w-full bg-gray-700 rounded-full h-4">
            <motion.div
                className="bg-gradient-to-r from-purple-500 to-cyan-500 h-4 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${clampedValue}%` }}
                transition={{ duration: 1, ease: "circOut" }}
            />
        </div>
    );
};


// --- Componente Principal da Página ---

export default function PaginaTesteAvancada() {
  const [clickCount, setClickCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [showSecret, setShowSecret] = useState(false);
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleProgressClick = () => {
      setProgress(p => (p + 20 > 100 ? 10 : p + 20));
      setClickCount(c => c + 1);
  };
  
  // Variantes de animação para o container dos cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2 // A mágica do efeito "stagger"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <main className="min-h-screen w-full bg-black bg-dot-white/[0.2] relative flex flex-col items-center p-4 sm:p-8 md:p-12 text-white overflow-x-hidden">
        {/* Fundo com efeito de gradiente e blur */}
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      
        <div className="w-full max-w-6xl mx-auto z-10">
            {/* Cabeçalho */}
            <motion.header
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="flex justify-between items-center mb-12"
            >
                <h1 className="text-4xl sm:text-5xl font-black tracking-tighter">Painel Interativo</h1>
                <Link href="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors border-b-2 border-transparent hover:border-cyan-400 pb-1">
                    ← Voltar
                </Link>
            </motion.header>

            {/* Grid de Estatísticas com animação "stagger" */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
                <motion.div variants={itemVariants}><StatCard title="Cliques Totais" value={clickCount} icon={<ClicksIcon />} /></motion.div>
                <motion.div variants={itemVariants}><StatCard title="Tempo na Página" value={`${timer}s`} icon={<TimerIcon />} /></motion.div>
                <motion.div variants={itemVariants}><StatCard title="Status do Segredo" value={showSecret ? 'Revelado' : 'Oculto'} icon={<SecretIcon />} /></motion.div>
            </motion.div>

            {/* Seção Interativa Principal */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="bg-gray-900/40 border border-gray-700/50 rounded-2xl p-8 mb-12 shadow-2xl backdrop-blur-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Interações</h2>
                <div className="flex flex-wrap items-center justify-center gap-6">
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(100, 180, 255, 0.5)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleProgressClick}
                        className="px-6 py-3 font-bold text-black bg-white rounded-lg"
                    >
                        Aumentar Progresso
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowSecret(!showSecret)}
                        className="px-6 py-3 font-bold bg-purple-600 rounded-lg"
                    >
                        {showSecret ? 'Ocultar' : 'Revelar'} Mensagem
                    </motion.button>
                </div>

                {/* Gráfico de progresso animado */}
                <div className="mt-8">
                    <p className="text-sm text-gray-400 mb-2">Progresso da Tarefa Fictícia</p>
                    <ProgressBar value={progress} />
                </div>
            </motion.div>

            {/* Mensagem Secreta com Animação de Presença */}
            <AnimatePresence>
                {showSecret && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 50 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 rounded-xl text-center shadow-lg"
                    >
                        <p className="text-xl font-semibold">
                            Animações com Framer Motion são declarativas e divertidas!
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    </main>
  );
}