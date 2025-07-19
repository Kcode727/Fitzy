'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  FiActivity,
  FiCoffee,
  FiPlus,
  FiTrendingUp,
  FiTrendingDown,
  FiBarChart2,
} from 'react-icons/fi';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

declare global {
  interface Window {
    __confettiFired?: boolean;
  }
}

interface FoodItem {
  food_name: string;
  nf_calories: number;
  nf_protein: number;
  nf_total_fat: number;
  nf_total_carbohydrate: number;
  serving_qty: number;
  serving_unit: string;
  date?: string;
}

interface ExerciseItem {
  name: string;
  nf_calories: number;
  duration_min: number;
  met: number;
  date?: string;
}

type Entry = FoodItem | ExerciseItem;

function getPastNDays(n: number): string[] {
  const today = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (n - 1 - i));
    return d.toISOString().split('T')[0];
  });
}

function getLabel(dayStr: string): string {
  const d = new Date(dayStr);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function CalorieTracker() {
  const [activeTab, setActiveTab] = useState<'food' | 'exercise' | 'trend'>('food');
  const [query, setQuery] = useState('');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    async function loadLogs() {
      const res = await fetch('/api/log-calories');
      const data = await res.json();

      if (Array.isArray(data)) {
        const converted = data.map((log) => ({
          date: new Date(log.date).toISOString().split('T')[0],
          nf_calories: log.calories,
          ...(log.type === 'food'
            ? {
                food_name: log.description,
                nf_protein: log.protein ?? 0,
                nf_total_fat: log.fat ?? 0,
                nf_total_carbohydrate: log.carbs ?? 0,
                serving_qty: log.quantity ?? 1,
                serving_unit: 'unit',
              }
            : {
                name: log.description,
                duration_min: log.duration ?? 30,
                met: log.met ?? 6,
              }),
        }));
        setEntries(converted);
      }
    }

    loadLogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const endpoint = activeTab === 'food' ? '/api/food-search' : '/api/exercise-search';
      const method = activeTab === 'food' ? 'GET' : 'POST';
      const url =
        activeTab === 'food'
          ? `${endpoint}?query=${encodeURIComponent(query)}`
          : endpoint;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: activeTab === 'exercise' ? JSON.stringify({ query }) : undefined,
      });

      const data = await res.json();
      const newEntries = (activeTab === 'food' ? data.foods : data.exercises).map((item: Entry) => ({
        ...item,
        date: new Date().toISOString().split('T')[0],
      }));

      for (const entry of newEntries) {
        await fetch('/api/log-calories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: entry.date,
            type: activeTab,
            description: 'food_name' in entry ? entry.food_name : entry.name,
            calories: entry.nf_calories,
            protein: 'nf_protein' in entry ? entry.nf_protein : undefined,
            carbs: 'nf_total_carbohydrate' in entry ? entry.nf_total_carbohydrate : undefined,
            fat: 'nf_total_fat' in entry ? entry.nf_total_fat : undefined,
            duration: 'duration_min' in entry ? entry.duration_min : undefined,
            met: 'met' in entry ? entry.met : undefined,
            quantity: 'serving_qty' in entry ? entry.serving_qty : undefined,
          }),
        });
      }

      setEntries((prev) =>
        [...prev, ...newEntries].sort((a, b) =>
          new Date(b.date!) > new Date(a.date!) ? 1 : -1
        )
      );

      setQuery('');
      setAnimationKey((k) => k + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const foodEntries = entries.filter((e): e is FoodItem => 'food_name' in e);
  const exerciseEntries = entries.filter((e): e is ExerciseItem => 'name' in e);

  const totalCalories = foodEntries.reduce((sum, f) => sum + f.nf_calories * f.serving_qty, 0);
  const totalBurned = exerciseEntries.reduce((sum, e) => sum + e.nf_calories, 0);
  const netCalories = totalCalories - totalBurned;

  const days = getPastNDays(7);
  const netPerDay = days.map((day) => {
    const intake = foodEntries
      .filter((e) => e.date === day)
      .reduce((sum, e) => sum + e.nf_calories * e.serving_qty, 0);
    const burned = exerciseEntries
      .filter((e) => e.date === day)
      .reduce((sum, e) => sum + e.nf_calories, 0);
    return intake - burned;
  });

  const trendData = {
    labels: days.map(getLabel),
    datasets: [
      {
        label: 'Net Calories',
        data: netPerDay,
        borderColor: '#ff4f4f',
        backgroundColor: '#ff4f4f',
        tension: 0.3,
      },
    ],
  };

  const trendOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Weekly Net Calorie Trend' },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = context.raw;
            if (value < 0 && !window.__confettiFired) {
              confetti({ particleCount: 50, spread: 70, origin: { y: 0.3 } });
              window.__confettiFired = true;
              setTimeout(() => (window.__confettiFired = false), 1000);
            }
            return value > 0
              ? `You gained ${value} kcal`
              : value < 0
              ? `You burned ${Math.abs(value)} kcal`
              : 'No data';
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="pb-16 px-4 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Track Your <span className="text-[#ff4f4f]">Energy</span> Balance
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Monitor your nutrition and activity to optimize your health and fitness goals
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-50 p-1 rounded-xl shadow-inner">
              <div className="flex">
                {['food', 'exercise', 'trend'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`flex-1 py-3 px-4 rounded-lg transition-all ${
                      activeTab === tab ? 'bg-white shadow-md text-[#ff4f4f]' : 'text-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {tab === 'food' && <FiCoffee className="w-4 h-4" />}
                      {tab === 'exercise' && <FiActivity className="w-4 h-4" />}
                      {tab === 'trend' && <FiBarChart2 className="w-4 h-4" />}
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {activeTab !== 'trend' && (
              <motion.div layout className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  {activeTab === 'food' ? 'Add Food Entry' : 'Add Exercise'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={activeTab === 'food' ? 'e.g. 2 eggs and toast' : 'e.g. 30 min running'}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#ff4f4f]/50 focus:border-[#ff4f4f]/50 outline-none transition-all text-black"
                    />
                    {isLoading && (
                      <div className="absolute right-3 top-3.5">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#ff4f4f] border-t-transparent"></div>
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-[#ff4f4f] to-[#ff8e4f] text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    <FiPlus className="w-4 h-4" />
                    {isLoading ? 'Processing...' : 'Add Entry'}
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab !== 'trend' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Today's Summary</h2>
                <SummaryBar label="Calories Consumed" value={totalCalories} max={2000} color="#ff4f4f" />
                <SummaryBar label="Calories Burned" value={totalBurned} max={1000} color="#ff8e4f" />
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Net Calories</span>
                    <div className={`flex items-center ${netCalories >= 0 ? 'text-[#ff4f4f]' : 'text-green-500'}`}>
                      {netCalories >= 0 ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
                      <span className="font-bold">{netCalories >= 0 ? '+' : ''}{netCalories} kcal</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 h-full">
              {activeTab === 'trend' ? (
                <div className="h-96">
                  <Line data={trendData} options={trendOptions} />
                </div>
              ) : (
                <AnimatePresence>
                  {(activeTab === 'food' ? foodEntries : exerciseEntries).length === 0 ? (
                    <EmptyMessage
                      message={
                        activeTab === 'food'
                          ? 'No food entries yet. Add your first meal!'
                          : 'No exercise entries yet. Log your first activity!'
                      }
                    />
                  ) : (
                    <EntryList items={activeTab === 'food' ? foodEntries : exerciseEntries} animationKey={animationKey} />
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SummaryBar = ({ label, value, max, color }: { label: string; value: number; max: number; color: string }) => (
  <div className="mb-3">
    <div className="flex justify-between items-center mb-1">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="font-medium">{value} kcal</span>
    </div>
    <div className="w-full bg-gray-100 rounded-full h-2">
      <div className="h-2 rounded-full" style={{ width: `${Math.min((value / max) * 100, 100)}%`, backgroundColor: color }}></div>
    </div>
  </div>
);

const EmptyMessage = ({ message }: { message: string }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-50/50 p-8 rounded-lg text-center">
    <p className="text-gray-500">{message}</p>
  </motion.div>
);

const EntryList = ({ items, animationKey }: { items: Entry[]; animationKey: number }) => (
  <div className="space-y-3">
    {items.map((item, index) => (
      <motion.div
        key={`${item.date || 'today'}-${index}-${animationKey}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.2 }}
        className="p-4 rounded-lg border border-gray-100 hover:border-[#ff4f4f]/30 hover:shadow-sm transition-all"
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-800 capitalize">
              {'name' in item ? item.name : item.food_name}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(item.date!).toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              })}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {'duration_min' in item
                ? `${item.duration_min} min • ${item.nf_calories} kcal burned`
                : `${item.serving_qty} ${item.serving_unit} • ${item.nf_calories} kcal`}
            </p>
          </div>

          {'nf_protein' in item ? (
            <div className="flex space-x-2">
              <Badge text={`${item.nf_protein}g protein`} bg="blue" />
              <Badge text={`${item.nf_total_carbohydrate}g carbs`} bg="yellow" />
              <Badge text={`${item.nf_total_fat}g fat`} bg="red" />
            </div>
          ) : (
            <div className="flex items-center">
              <div className="w-24 mr-3">
                <div className="text-xs text-gray-500 mb-1">Intensity</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#ff4f4f] h-2 rounded-full" style={{ width: `${Math.min(item.met * 10, 100)}%` }}></div>
                </div>
              </div>
              <span className="text-[#ff4f4f] font-medium">-{item.nf_calories}</span>
            </div>
          )}
        </div>
      </motion.div>
    ))}
  </div>
);

const Badge = ({ text, bg }: { text: string; bg: 'blue' | 'yellow' | 'red' }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
  };
  return <span className={`px-2 py-1 text-xs rounded-full ${colorMap[bg]}`}>{text}</span>;
};
