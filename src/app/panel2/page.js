// Caminho: src/app/teste/page.js

"use client";

import React, { useState, useEffect, useReducer, useMemo } from 'react';
import Link from 'next/link';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

// --- GERENCIAMENTO DE ESTADO COMPLEXO COM useReducer ---
// Ideal para quando múltiplos estados dependem uns dos outros.

const initialState = {
  isOnline: false,
  powerLevel: 0,
  systemLogs: [{ id: Date.now(), message: "Reator de Singularidade em standby." }],
  subsystems: [
    { id: 1, name: "Núcleo de Contenção", status: "Offline" },
    { id: 2, name: "Injetores de Plasma", status: "Offline" },
    { id: 3, name: "Refrigeramento Quântico", status: "Offline" },
  ],
};

function reactorReducer(state, action) {
  switch (action.type) {
    case 'POWER_ON':
      return {
        ...state,
        isOnline: true,
        powerLevel: 20,
        subsystems: state.subsystems.map(s => ({ ...s, status: "Online" })),
      };
    case 'POWER_OFF':
      return {
        ...initialState,
        systemLogs: [...state.systemLogs, { id: Date.now(), message: "Desligamento de emergência iniciado." }],
      };
    case 'ADJUST_POWER':
      if (!state.isOnline) return state;
      return { ...state, powerLevel: action.payload };
    case 'ADD_LOG':
      return { ...state, systemLogs: [...state.systemLogs, { id: Date.now(), message: action.payload }] };
    default:
      throw new Error();
  }
}

// --- CUSTOM HOOK ---
// Para encapsular lógica e deixar o componente principal mais limpo.
const useSystemLog = (dispatch) => {
    const addLog = (message) => {
        const timestamp = new Date().toLocaleTimeString('pt-BR');
        dispatch({ type: 'ADD_LOG', payload: `[${timestamp}] ${message}` });
    };
    return addLog;
};


// --- COMPONENTES VISUAIS DA MÁQUINA ---

const CoreVisualizer = ({ powerLevel, isOnline }) => {
  const controls = useAnimation();

  useEffect(() => {
    if (isOnline) {
      controls.start({
        scale: [1, 1.2, 1, 1.1, 1],
        opacity: [0.8, 1, 0.8, 1, 0.8],
        transition: { duration: 2 / (powerLevel / 50 + 0.1), repeat: Infinity },
      });
    } else {
      controls.stop();
      controls.start({ scale: 0, opacity: 0, transition: { duration: 1 } });
    }
  }, [isOnline, powerLevel, controls]);

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <motion.svg viewBox="0 0 200 200" className="absolute w-full h-full">
        {/* Anéis externos */}
        {[...Array(3)].map((_, i) => (
          <motion.circle
            key={i}
            cx="100" cy="100" r={40 + i * 20}
            stroke={isOnline ? `rgba(0, 255, 255, ${0.2 + i * 0.1})` : "#333"}
            strokeWidth="2" fill="none"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
          />
        ))}
        {/* Núcleo Pulsante */}
        <motion.circle cx="100" cy="100" r="30" fill="cyan" animate={controls} />
      </motion.svg>
    </div>
  );
};

const LogPanel = ({ logs }) => (
  <div className="h-64 bg-black/50 p-4 rounded-lg border border-gray-700 font-mono text-sm overflow-y-auto">
    <AnimatePresence>
      {logs.slice(-10).map((log, i) => (
        <motion.p
          key={log.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: i * 0.05 }}
          className="text-green-400 whitespace-pre-wrap"
        >
          {`> ${log.message}`}
        </motion.p>
      ))}
    </AnimatePresence>
  </div>
);

const ControlButton = ({ children, onClick, disabled, variant = 'primary' }) => {
    const colors = {
        primary: "border-cyan-400 text-cyan-400 hover:bg-cyan-400/20",
        danger: "border-red-500 text-red-500 hover:bg-red-500/20",
    }
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            disabled={disabled}
            className={`px-6 py-2 rounded-md border-2 font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${colors[variant]}`}
        >
            {children}
        </motion.button>
    );
}

// --- COMPONENTE PRINCIPAL (A MÁQUINA) ---

export default function MaquinaEnormePage() {
  const [state, dispatch] = useReducer(reactorReducer, initialState);
  const addLog = useSystemLog(dispatch);

  // Simula leituras do sistema em tempo real
  useEffect(() => {
    if (!state.isOnline) return;
    const diagnosticsInterval = setInterval(() => {
      const randomSubsystem = state.subsystems[Math.floor(Math.random() * state.subsystems.length)];
      const messages = [
        `Leitura de ${randomSubsystem.name}: ${Math.random().toFixed(4)}GW`,
        `Temperatura do núcleo: ${(state.powerLevel * 20 + Math.random() * 5).toFixed(2)}K`,
        "Fluxo de partículas estável."
      ];
      addLog(messages[Math.floor(Math.random() * messages.length)]);
    }, 3000);
    return () => clearInterval(diagnosticsInterval);
  }, [state.isOnline, state.powerLevel, state.subsystems, addLog]);


  return (
    <main className="min-h-screen w-full bg-black flex flex-col items-center p-4 sm:p-8 text-gray-300 overflow-hidden">
      {/* Efeito de Grid de Fundo */}
      <div className="absolute inset-0 h-full w-full bg-slate-950 [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="w-full max-w-7xl mx-auto z-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-center bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
                PAINEL DE CONTROLE DO REATOR
            </h1>
            <p className="text-center text-gray-500 mb-8">Interface de Gerenciamento de Singularidade v2.7</p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna de Controle Principal */}
            <motion.div 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:col-span-1 bg-gray-900/50 border border-gray-700 rounded-xl p-6 flex flex-col items-center gap-6 backdrop-blur-sm"
            >
                <h2 className="text-xl font-bold text-white">NÚCLEO</h2>
                <CoreVisualizer powerLevel={state.powerLevel} isOnline={state.isOnline} />
                <div className="w-full text-center">
                    <p>Potência: {state.powerLevel.toFixed(0)}%</p>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={state.powerLevel}
                        disabled={!state.isOnline}
                        onChange={(e) => dispatch({ type: 'ADJUST_POWER', payload: parseInt(e.target.value) })}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:accent-gray-500"
                    />
                </div>
                <div className="flex gap-4 mt-4">
                    <ControlButton onClick={() => { dispatch({ type: 'POWER_ON' }); addLog("Iniciando sequência de ignição..."); }} disabled={state.isOnline}>
                        IGNIÇÃO
                    </ControlButton>
                    <ControlButton onClick={() => dispatch({ type: 'POWER_OFF' })} disabled={!state.isOnline} variant="danger">
                        DESLIGAR
                    </ControlButton>
                </div>
            </motion.div>

            {/* Coluna de Informações */}
            <motion.div 
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="lg:col-span-2 bg-gray-900/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm flex flex-col gap-6"
            >
                <div>
                    <h2 className="text-xl font-bold text-white mb-2">LOGS DO SISTEMA</h2>
                    <LogPanel logs={state.systemLogs} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white mb-2">STATUS DOS SUBSISTEMAS</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {state.subsystems.map(sub => (
                            <div key={sub.id} className="bg-gray-800/70 p-4 rounded-md border border-gray-700">
                                <p className="font-semibold text-white">{sub.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <motion.div 
                                        className={`h-3 w-3 rounded-full ${sub.status === 'Online' ? 'bg-green-400' : 'bg-red-500'}`}
                                        animate={{ scale: sub.status === 'Online' ? [1, 1.2, 1] : 1 }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    />
                                    <p className={sub.status === 'Online' ? 'text-green-400' : 'text-red-500'}>
                                        {sub.status}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>

        <motion.footer 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-center mt-12 text-gray-600"
        >
            <p>Este painel é uma simulação. Nenhuma singularidade foi prejudicada na criação deste componente.</p>
            <Link href="/" className="hover:text-cyan-400 transition-colors">Voltar para a simplicidade</Link>
        </motion.footer>
      </div>
    </main>
  );
}