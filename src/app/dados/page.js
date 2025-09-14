// Caminho: src/app/dados/page.js

"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
// IMPORTANDO OS COMPONENTES DA RECHARTS
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';


// --- Ícones SVG ---
const PlayIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>);
const Spinner = (props) => (<svg {...props} className="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>);
const StatusIndicator = ({ connected }) => (<motion.div layout className="flex items-center gap-2 text-xs font-medium"><div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-500'}`}></div><span className={connected ? 'text-green-400' : 'text-gray-400'}>{connected ? 'Conectado' : 'Desconectado'}</span></motion.div>);

// --- COMPONENTE DE GRÁFICOS ---
const ChartViewer = ({ data }) => {
    if (!data || data.length === 0) return <p>Sem dados para exibir.</p>;

    const columns = Object.keys(data[0]);
    const COLORS = ['#06B6D4', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];

    // GRÁFICO 1: Clientes por Região
    if (columns.includes('nome_regiao') && columns.includes('numero_de_clientes')) {
        return (
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <XAxis dataKey="nome_regiao" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563' }} cursor={{ fill: 'rgba(6, 182, 212, 0.1)' }} />
                    <Legend wrapperStyle={{fontSize: "14px"}}/>
                    <Bar dataKey="numero_de_clientes" name="Nº de Clientes" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        );
    }
    
    // GRÁFICO 2: Produtos Mais Vendidos
    if (columns.includes('produto') && columns.includes('total_vendido')) {
        return (
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={data} dataKey="total_vendido" nameKey="produto" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                        {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563' }} />
                    <Legend wrapperStyle={{fontSize: "14px"}}/>
                </PieChart>
            </ResponsiveContainer>
        );
    }

    // GRÁFICO 3: Valor Total por Cliente
    if (columns.includes('cliente') && columns.includes('valor_total_gasto')) {
        return (
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                    <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
                    <YAxis type="category" dataKey="cliente" stroke="#9CA3AF" fontSize={12} width={120} interval={0} />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563' }} cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}/>
                    <Legend wrapperStyle={{fontSize: "14px"}}/>
                    <Bar dataKey="valor_total_gasto" name="Valor Gasto (R$)" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                </BarChart>
            </ResponsiveContainer>
        );
    }
    
    return <div className="flex items-center justify-center h-full text-gray-500"><p>Não há um gráfico disponível para esta consulta.</p></div>;
};

// --- Componente Principal da Página ---

export default function MysqlManagerPage() {
    const [connection, setConnection] = useState({ host: 'localhost', user: 'root', password: '', database: 'nextjs_db' });
    const [isConnected, setIsConnected] = useState(false);
    const [query, setQuery] = useState("SELECT * FROM clientes;");
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [viewMode, setViewMode] = useState('table');

    const handleConnectionChange = (e) => setConnection({ ...connection, [e.target.name]: e.target.value });

    const handleConnect = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const testQuery = 'SELECT 1+1 AS test;';
            const response = await fetch('/Nextjs/api/query', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...connection, query: testQuery }), });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            setIsConnected(true);
            setResults(null);
        } catch (err) {
            setError(err.message);
            setIsConnected(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRunQuery = async () => {
        if (!isConnected) { setError("Por favor, conecte-se ao banco de dados primeiro."); return; }
        setIsLoading(true);
        setError(null);
        setResults(null);
        try {
            const response = await fetch('/Nextjs/api/query', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...connection, query }), });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            setResults(data.results);
            setViewMode('table');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const columns = results && results.length > 0 ? Object.keys(results[0]) : [];

    return (
        <main className="min-h-screen w-full bg-[#0D1117] text-gray-300 font-sans flex flex-col">
            <header className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                    <svg className="w-7 h-7 text-amber-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9.75h4.875a2.625 2.625 0 010 5.25H12M8.25 9.75L6 12m2.25-2.25L6 7.5" /></svg>
                    <h1 className="text-xl font-bold text-white">Consulta de dados</h1>
                </div>
                <div className="flex items-center gap-6">
                    <StatusIndicator connected={isConnected} />
                    <Link href="/" className="text-sm text-gray-400 hover:text-amber-400 transition-colors">Voltar ao Portal</Link>
                </div>
            </header>

            {/* A DIV PRINCIPAL AGORA ENVOLVE DIRETAMENTE A ÁREA DE CONTEÚDO */}
            <div className="flex-grow flex flex-col p-6 overflow-y-auto">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-center">
                        <input name="host" value={connection.host} onChange={handleConnectionChange} placeholder="Host" className="bg-slate-900 text-sm p-2 rounded-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                        <input name="user" value={connection.user} onChange={handleConnectionChange} placeholder="Usuário" className="bg-slate-900 text-sm p-2 rounded-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                        <input name="password" value={connection.password} onChange={handleConnectionChange} type="password" placeholder="Senha" className="bg-slate-900 text-sm p-2 rounded-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                        <input name="database" value={connection.database} onChange={handleConnectionChange} placeholder="Banco de Dados" className="bg-slate-900 text-sm p-2 rounded-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                        <motion.button onClick={handleConnect} disabled={isLoading} whileTap={{ scale: 0.95 }} className="px-4 py-2 text-sm font-bold bg-amber-500 text-slate-900 rounded-md hover:bg-amber-400 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">{isLoading ? <Spinner className="w-4 h-4" /> : (isConnected ? "Reconectar" : "Conectar")}</motion.button>
                    </div>
                </motion.div>
                
                <div className="relative flex-shrink-0">
                    <textarea value={query} onChange={(e) => setQuery(e.target.value)} className="w-full h-48 p-4 font-mono text-base bg-slate-900 border-2 border-slate-700 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors" />
                    <motion.button onClick={handleRunQuery} disabled={isLoading} whileTap={{ scale: 0.95 }} className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 font-bold bg-amber-500 text-slate-900 rounded-lg hover:bg-amber-400 disabled:opacity-50 transition-colors shadow-lg">{isLoading ? <Spinner className="w-5 h-5"/> : <PlayIcon className="w-5 h-5"/>}<span>Executar</span></motion.button>
                </div>

                <div className="mt-6 flex-grow min-h-[20rem] bg-slate-900/50 border border-slate-700 rounded-lg p-4 flex flex-col overflow-hidden">
                    {results && !isLoading && !error && (
                        <div className="flex-shrink-0 mb-4 border-b border-slate-800">
                            <button onClick={() => setViewMode('table')} className={`px-4 py-2 text-sm font-medium ${viewMode === 'table' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-gray-400'}`}>Tabela</button>
                        </div>
                    )}
                    <div className="flex-grow overflow-auto">
                        <AnimatePresence mode="wait">
                            {isLoading && <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full items-center justify-center text-gray-400"><Spinner className="w-8 h-8"/> </motion.div>}
                            {error && <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center text-red-400"><h3 className="font-bold text-lg">Ocorreu um Erro</h3><p className="font-mono mt-2 text-sm bg-red-900/50 p-4 rounded">{error}</p></motion.div>}
                            
                            {results && !isLoading && !error && viewMode === 'table' && (
                                <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
                                    {results.length === 0 ? <p className="text-center text-gray-400 pt-10">A consulta não retornou resultados.</p> : (
                                        <table className="min-w-full text-sm">
                                            <thead className="sticky top-0 bg-slate-800"><tr>{columns.map(col => <th key={col} className="p-3 text-left font-semibold text-gray-300 uppercase tracking-wider">{col}</th>)}</tr></thead>
                                            <tbody className="divide-y divide-slate-800">{results.map((row, i) => (<motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="hover:bg-slate-800/50">{columns.map(col => <td key={col} className="p-3 whitespace-nowrap">{String(row[col])}</td>)}</motion.tr>))}</tbody>
                                        </table>
                                    )}
                                </motion.div>
                            )}
                            
                            {results && !isLoading && !error && viewMode === 'chart' && (
                                <motion.div key="chart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex items-center justify-center">
                                   <ChartViewer data={results} />
                                </motion.div>
                            )}

                            {!results && !isLoading && !error && <div className="h-full flex items-center justify-center text-gray-500"><p>Os resultados da sua consulta aparecerão aqui.</p></div>}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </main>
    );
}