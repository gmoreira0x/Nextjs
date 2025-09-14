// Caminho: src/app/mysql/page.js

"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Ícones SVG ---
const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.949a.75.75 0 00.95.826L11.25 9.75v.5L4.643 11.71a.75.75 0 00-.95.826l-1.414 4.95a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.118A28.897 28.897 0 003.105 2.289Z" />
    </svg>
);
const Spinner = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

// --- Componente Principal da Página ---

export default function MysqlQueryPage() {
    const [query, setQuery] = useState("SELECT id, nome, email FROM usuarios LIMIT 10;");
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleRunQuery = async () => {
        setIsLoading(true);
        setError(null);
        setResults(null);

        try {
            const response = await fetch('/api/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ocorreu um erro na API');
            }

            setResults(data.results);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const columns = results && results.length > 0 ? Object.keys(results[0]) : [];

    return (
        <main className="relative min-h-screen w-full flex-col items-center bg-slate-950 p-4 sm:p-8 text-white">
            <div className="absolute inset-0 h-full w-full bg-slate-950 [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 max-w-5xl mx-auto"
            >
                <h1 className="text-4xl font-black tracking-tighter text-center bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                    Analisador de Banco de Dados MySQL
                </h1>
                <p className="text-center text-gray-500 mt-2 mb-8">
                    Digite sua consulta SQL abaixo e execute para ver os resultados em tempo real.
                </p>

                {/* Área de Texto para a Consulta */}
                <div className="relative">
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="SELECT * FROM sua_tabela;"
                        className="w-full h-40 p-4 font-mono text-green-400 bg-black/50 border-2 border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                    />
                    <motion.button
                        onClick={handleRunQuery}
                        disabled={isLoading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 font-semibold bg-cyan-600 rounded-md hover:bg-cyan-700 disabled:bg-gray-500 transition-colors"
                    >
                        {isLoading ? <Spinner /> : <SendIcon />}
                        {isLoading ? "Executando..." : "Executar Consulta"}
                    </motion.button>
                </div>

                {/* Seção de Resultados */}
                <div className="mt-8 min-h-[20rem] bg-black/50 border border-gray-700 rounded-lg p-4">
                    <AnimatePresence mode="wait">
                        {isLoading && (
                            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full text-gray-400">
                                <Spinner />
                                <p className="mt-2">Consultando o banco de dados...</p>
                            </motion.div>
                        )}
                        {error && (
                            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full text-red-400">
                                <h3 className="font-bold text-lg">Erro na Consulta</h3>
                                <p className="font-mono mt-2 bg-red-900/50 p-4 rounded">{error}</p>
                            </motion.div>
                        )}
                        {results && !isLoading && (
                            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                {results.length === 0 ? (
                                    <p className="text-center text-gray-400">A consulta não retornou resultados.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-700">
                                            <thead className="bg-gray-800/50">
                                                <tr>
                                                    {columns.map(col => <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{col}</th>)}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-800">
                                                {results.map((row, i) => (
                                                    <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                                                        {columns.map(col => <td key={col} className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{String(row[col])}</td>)}
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </main>
    );
}