import React, { useState, useEffect } from 'react';
import { User, Task, TaskStatus, Duck, DuckRarity } from './types';
import { SAMPLE_TASKS, MOCK_DUCKS_DB } from './constants';
import TaskList from './components/TaskList';
import DuckGacha from './components/DuckGacha';
import DuckInventory from './components/DuckInventory';
import EggIncubator from './components/EggIncubator';
import { getProductivityCoach } from './services/geminiService';
import { Plus, LayoutGrid, List, Search, LogOut, Ticket, Sparkles, Egg, Gift, Moon, Sun, AlertTriangle } from 'lucide-react';

// --- Auth Component ---
interface AuthProps {
   onLogin: (u: User) => void; 
   isDark: boolean;
   toggleTheme: () => void;
}

const AuthScreen: React.FC<AuthProps> = ({ onLogin, isDark, toggleTheme }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     setFormData({ ...formData, [e.target.name]: e.target.value });
     setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
       setError('Please fill in all fields');
       return;
    }

    if (isRegister && !formData.name) {
       setError('Name is required for registration');
       return;
    }

    // --- Simulated Backend Logic ---
    const storedUsers = JSON.parse(localStorage.getItem('duckdo_users_db') || '[]');
    
    if (isRegister) {
       if (storedUsers.find((u: User) => u.email === formData.email)) {
          setError('Email already exists');
          return;
       }
       const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          email: formData.email,
          name: formData.name,
          password: btoa(formData.password), // Mock hash
          tickets: 1, // Welcome gift
          eggs: 0,
          eggProgress: 0,
          streak: 0,
          pityCounter: 0
       };
       storedUsers.push(newUser);
       localStorage.setItem('duckdo_users_db', JSON.stringify(storedUsers));
       onLogin(newUser);
    } else {
       const user = storedUsers.find((u: User) => u.email === formData.email && u.password === btoa(formData.password));
       if (user) {
          onLogin({ ...user, pityCounter: user.pityCounter || 0 }); // Ensure pityCounter exists
       } else {
          setError('Invalid email or password');
       }
    }
  };

  const handleGoogleLogin = () => {
    // Simulate Google Login
    const googleUser: User = {
       id: 'google_' + Math.random().toString(36).substr(2, 9),
       name: 'Google User',
       email: `user_${Math.floor(Math.random()*1000)}@gmail.com`,
       image: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
       tickets: 5, // Bonus for google
       eggs: 0,
       eggProgress: 50, // Bonus start
       streak: 0,
       pityCounter: 0
    };
    onLogin(googleUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-brand-light to-sky-200 dark:from-slate-900 dark:to-slate-800 transition-colors">
      <div className="bg-white/90 dark:bg-dark-surface/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border-b-8 border-brand-dark dark:border-brand-dark animate-pop relative">
        
        <button onClick={toggleTheme} className="absolute top-4 right-4 p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors">
           {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="text-center mb-8">
           <div className="w-20 h-20 bg-brand rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg text-4xl">🦆</div>
           <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white">DuckDo</h1>
           <p className="text-gray-500 dark:text-gray-400">Task management meets Duck collection</p>
        </div>

        {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm font-bold text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
             <div>
               <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Display Name</label>
               <input 
                 name="name"
                 type="text" 
                 value={formData.name}
                 onChange={handleInputChange}
                 className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-dark-border dark:bg-slate-800 dark:text-white focus:border-brand focus:outline-none transition-colors"
                 placeholder="Your Name"
               />
             </div>
          )}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input 
              name="email"
              type="email" 
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-dark-border dark:bg-slate-800 dark:text-white focus:border-brand focus:outline-none transition-colors"
              placeholder="hello@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input 
              name="password"
              type="password" 
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-dark-border dark:bg-slate-800 dark:text-white focus:border-brand focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="w-full py-4 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl shadow-lg btn-3d mt-4">
            {isRegister ? 'Create Account' : 'Sign In'}
          </button>
          
          <div className="relative my-6">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-gray-600"></div></div>
             <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-dark-surface text-gray-500 dark:text-gray-400">Or continue with</span></div>
          </div>

          <button type="button" onClick={handleGoogleLogin} className="w-full py-3 border-2 border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
             <span className="text-lg font-bold text-blue-500">G</span> Google
          </button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6 cursor-pointer hover:underline" onClick={() => { setIsRegister(!isRegister); setError(''); }}>
            {isRegister ? 'Already have an account? Sign In' : 'New here? Create Account'}
          </p>
        </form>
      </div>
    </div>
  );
};

// --- Particles Component ---
const ConfettiExplosion = ({ x, y }: { x: number, y: number }) => {
  return (
    <div className="fixed pointer-events-none z-50" style={{ left: x, top: y }}>
       {[...Array(12)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-2 h-2 rounded-full animate-pop"
            style={{
              backgroundColor: ['#FFD54F', '#FF6B6B', '#4ECDC4', '#45B7D1'][i % 4],
              transform: `translate(${Math.cos(i * 30) * 50}px, ${Math.sin(i * 30) * 50}px)`,
              opacity: 0,
              animation: `pop 0.6s ease-out forwards`,
              animationDelay: `${Math.random() * 0.1}s`
            }}
          />
       ))}
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [ducks, setDucks] = useState<Duck[]>([]);
  
  // UI State
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [view, setView] = useState<'TASKS' | 'POND'>('TASKS');
  const [showGacha, setShowGacha] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [clickPos, setClickPos] = useState<{x: number, y: number} | null>(null);
  
  // Delete Confirmation State
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [deleteInput, setDeleteInput] = useState('');
  
  // Form State
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');
  
  const [aiMessage, setAiMessage] = useState<string>('');

  // --- Theme Logic ---
  useEffect(() => {
     if (theme === 'dark') {
        document.documentElement.classList.add('dark');
     } else {
        document.documentElement.classList.remove('dark');
     }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // --- Data Persistence ---
  useEffect(() => {
    const savedUser = localStorage.getItem('duckdo_current_user');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      // Ensure migrations
      if (typeof u.pityCounter === 'undefined') u.pityCounter = 0;
      setUser(u);
      loadUserData(u.id);
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
       setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('duckdo_current_user', JSON.stringify(user));
      saveUserData();
    }
  }, [user, tasks, ducks]);

  const loadUserData = (userId: string) => {
     const savedTasks = localStorage.getItem(`duckdo_tasks_${userId}`);
     const savedDucks = localStorage.getItem(`duckdo_ducks_${userId}`);
     setTasks(savedTasks ? JSON.parse(savedTasks) : []); 
     
     // Load ducks and ensure stars property exists
     const loadedDucks: Duck[] = savedDucks ? JSON.parse(savedDucks) : [];
     setDucks(loadedDucks.map(d => ({...d, stars: d.stars || 1})));
  };

  const saveUserData = () => {
     if (!user) return;
     localStorage.setItem(`duckdo_tasks_${user.id}`, JSON.stringify(tasks));
     localStorage.setItem(`duckdo_ducks_${user.id}`, JSON.stringify(ducks));
  };

  // --- AI Coach ---
  useEffect(() => {
    if (user && view === 'TASKS') {
       getProductivityCoach(tasks, user.name).then(setAiMessage);
    }
  }, [user, tasks.length, view]);

  // --- Handlers ---
  const handleLogin = (u: User) => {
    setUser(u);
    loadUserData(u.id);
  };

  const handleLogout = () => {
    localStorage.removeItem('duckdo_current_user');
    setUser(null);
    setTasks([]);
    setDucks([]);
  };

  // --- Duck Management Logic (Merge & Star Upgrade) ---
  const mergeDucks = (incomingDucks: Duck[]) => {
      const updatedInventory = [...ducks];
      
      incomingDucks.forEach(incoming => {
         // Check if duck exists by name (Assuming name is unique for species in this simple app)
         const existingIndex = updatedInventory.findIndex(d => d.name === incoming.name);
         
         if (existingIndex >= 0) {
             // Upgrade Stars
             updatedInventory[existingIndex] = {
                 ...updatedInventory[existingIndex],
                 stars: (updatedInventory[existingIndex].stars || 1) + 1
             };
         } else {
             // Add New
             updatedInventory.unshift({ ...incoming, stars: 1 });
         }
      });
      
      setDucks(updatedInventory);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTaskText) return;

    if (editingTask) {
       setTasks(tasks.map(t => t.id === editingTask.id ? { 
          ...t, 
          text: newTaskText, 
          deadline: newTaskDeadline || t.deadline 
       } : t));
       setEditingTask(null);
    } else {
       const newTask: Task = {
         id: Math.random().toString(36).substr(2, 9),
         userId: user.id,
         text: newTaskText,
         deadline: newTaskDeadline || new Date().toISOString(),
         status: TaskStatus.PENDING,
         createdAt: new Date().toISOString(),
         rewardClaimed: false, // Initial state
       };
       setTasks([...tasks, newTask]);
    }
    resetForm();
    setShowTaskForm(false);
  };

  const resetForm = () => {
     setNewTaskText('');
     setNewTaskDeadline('');
     setEditingTask(null);
  };

  const toggleTaskStatus = (id: string, e: React.MouseEvent) => {
    if (!user) return;
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newStatus = task.status === TaskStatus.DONE ? TaskStatus.PENDING : TaskStatus.DONE;
    
    // Logic updates
    let newTickets = user.tickets;
    let newProgress = user.eggProgress || 0;
    let isRewardClaimed = task.rewardClaimed || false;

    if (newStatus === TaskStatus.DONE) {
       // Only give rewards if not previously claimed
       if (!isRewardClaimed) {
           // Visual Effect
           setClickPos({ x: e.clientX, y: e.clientY });
           setTimeout(() => setClickPos(null), 1000);

           newTickets += 1; 
           
           // Egg Progress logic: +20% per task, cap at 100
           if (newProgress < 100) {
              newProgress = Math.min(newProgress + 20, 100);
           }
           
           isRewardClaimed = true; // Mark reward as claimed
       }
    }

    const updatedTask: Task = {
       ...task,
       status: newStatus,
       finishedTime: newStatus === TaskStatus.DONE ? new Date().toISOString() : undefined,
       rewardClaimed: isRewardClaimed
    };

    setTasks(tasks.map(t => t.id === id ? updatedTask : t));
    setUser({ ...user, tickets: newTickets, eggProgress: newProgress });
  };

  const hatchEgg = () => {
     if (!user || user.eggProgress < 100) return;

     const pool = MOCK_DUCKS_DB;
     const template = pool[Math.floor(Math.random() * pool.length)];
     const newDuck: Duck = {
        ...template,
        id: Math.random().toString(36).substr(2, 9),
        obtainedAt: new Date().toISOString(),
        stars: 1
     };

     mergeDucks([newDuck]);
     // Reset progress
     setUser({ ...user, eggProgress: 0, eggs: user.eggs + 1 });
     
     alert(`🥚 HATCHED! You got a ${newDuck.rarity} ${newDuck.name}!`);
  };

  const requestDeleteTask = (id: string) => {
    setTaskToDelete(id);
    setDeleteInput('');
  };

  const confirmDeleteTask = () => {
    if (!taskToDelete) return;
    
    if (deleteInput.toLowerCase() === 'okay') {
        setTasks(tasks.filter(t => t.id !== taskToDelete));
        setTaskToDelete(null);
        setDeleteInput('');
    }
  };

  const startEdit = (task: Task) => {
    setEditingTask(task);
    setNewTaskText(task.text);
    const date = new Date(task.deadline);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    setNewTaskDeadline(date.toISOString().slice(0, 16));
    setShowTaskForm(true);
  };

  const filteredTasks = tasks.filter(t => t.text.toLowerCase().includes(searchTerm.toLowerCase()));

  if (!user) return <AuthScreen onLogin={handleLogin} isDark={theme === 'dark'} toggleTheme={toggleTheme} />;

  return (
    <div className="min-h-screen pb-24 dark:bg-dark-bg transition-colors relative">
      
      {/* Click Effect */}
      {clickPos && <ConfettiExplosion x={clickPos.x} y={clickPos.y} />}

      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-border px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-xl shadow-inner text-white">🦆</div>
           <div>
             <h1 className="font-bold text-gray-800 dark:text-white leading-tight truncate max-w-[150px]">Hi, {user.name}</h1>
             <div className="flex items-center gap-2 text-xs font-bold">
                <span className="bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                   <Ticket size={12} /> {user.tickets}
                </span>
                <span className="bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                   <Egg size={12} /> {user.eggs}
                </span>
             </div>
           </div>
        </div>
        
        <div className="flex items-center gap-2">
           <button onClick={toggleTheme} className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors">
             {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
           </button>
           <button onClick={handleLogout} className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors">
             <LogOut size={20} />
           </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto p-4 space-y-6">
        
        {/* AI Coach Banner */}
        {view === 'TASKS' && (
           <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg flex items-start gap-3 relative overflow-hidden">
              <Sparkles className="flex-shrink-0 mt-1 animate-pulse" />
              <div className="relative z-10">
                 <p className="font-bold text-sm opacity-80 uppercase tracking-wide">Coach Quack says:</p>
                 <p className="font-medium text-lg italic">"{aiMessage || 'Loading wisdom...'}"</p>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-20 text-9xl">🦆</div>
           </div>
        )}

        {/* View Switcher */}
        <div className="flex bg-gray-200 dark:bg-dark-surface p-1 rounded-xl border border-gray-200 dark:border-dark-border">
           <button 
             onClick={() => setView('TASKS')} 
             className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2
               ${view === 'TASKS' 
                 ? 'bg-white dark:bg-slate-700 shadow text-brand-dark dark:text-brand' 
                 : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}
             `}
           >
             <List size={16} /> Tasks
           </button>
           <button 
             onClick={() => setView('POND')} 
             className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2
               ${view === 'POND' 
                 ? 'bg-white dark:bg-slate-700 shadow text-brand-dark dark:text-brand' 
                 : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}
             `}
           >
             <LayoutGrid size={16} /> Duck Pond
           </button>
        </div>

        {/* EGG INCUBATOR WIDGET (Always visible or just in Pond? Let's make it small in Task and big in Pond, or just put at top of tasks) */}
        {view === 'TASKS' && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
             <div className="md:col-span-2 space-y-4">
               {/* Search */}
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search tasks by text..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-brand bg-white dark:bg-dark-surface dark:text-white dark:placeholder-gray-500 transition-colors"
                  />
               </div>

               <TaskList 
                 tasks={filteredTasks} 
                 onToggleStatus={toggleTaskStatus} 
                 onDelete={requestDeleteTask}
                 onEdit={startEdit}
               />
             </div>

             <div className="md:col-span-1">
               {/* Sidebar Incubator */}
                <EggIncubator progress={user.eggProgress || 0} onHatch={hatchEgg} />
             </div>
           </div>
        )}

        {view === 'POND' && (
           <div className="space-y-6">
              <EggIncubator progress={user.eggProgress || 0} onHatch={hatchEgg} />
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                 <LayoutGrid /> Your Collection
              </h2>
              <DuckInventory ducks={ducks} />
           </div>
        )}

      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-40">
        {/* Gacha Button */}
        <button 
          onClick={() => setShowGacha(true)}
          className="w-16 h-16 bg-gradient-to-tr from-pink-500 to-rose-400 rounded-full shadow-xl flex items-center justify-center text-white btn-3d border-rose-600 animate-bounce-short relative group"
        >
          <Gift size={32} />
          {user.tickets > 0 && (
             <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full text-xs font-bold flex items-center justify-center border-2 border-white dark:border-dark-bg">
                {user.tickets}
             </span>
          )}
        </button>

        {/* Add Task Button */}
        <button 
          onClick={() => {
             resetForm();
             setShowTaskForm(true);
          }}
          className="w-16 h-16 bg-brand rounded-full shadow-xl flex items-center justify-center text-white btn-3d border-brand-dark"
        >
          <Plus size={36} />
        </button>
      </div>

      {/* Modals */}
      
      {/* Delete Confirmation Modal */}
      {taskToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-dark-surface rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-pop border-b-8 border-red-500 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
                
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Delete Task?</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                        This action cannot be undone. To confirm, please type 
                        <span className="font-bold text-gray-800 dark:text-white mx-1">okay</span> below.
                    </p>
                </div>

                <input 
                    type="text"
                    value={deleteInput}
                    onChange={(e) => setDeleteInput(e.target.value)}
                    placeholder="Type 'okay'"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-dark-border dark:bg-slate-900 dark:text-white focus:border-red-500 focus:outline-none mb-6 text-center font-bold"
                    autoFocus
                />

                <div className="flex gap-3">
                    <button 
                        onClick={() => { setTaskToDelete(null); setDeleteInput(''); }}
                        className="flex-1 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={confirmDeleteTask}
                        disabled={deleteInput.toLowerCase() !== 'okay'}
                        className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg btn-3d transition-all
                            ${deleteInput.toLowerCase() === 'okay' 
                                ? 'bg-red-500 border-red-700 hover:bg-red-400' 
                                : 'bg-gray-300 border-gray-400 cursor-not-allowed opacity-50'}
                        `}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Gacha Modal */}
      {showGacha && (
         <DuckGacha 
            tickets={user.tickets}
            pityCounter={user.pityCounter || 0}
            onSpendTickets={(amount) => setUser({ ...user, tickets: user.tickets - amount })}
            onObtainDucks={(newDucks, newPity) => {
               mergeDucks(newDucks);
               setUser(prev => prev ? ({ ...prev, pityCounter: newPity }) : null);
            }}
            onClose={() => setShowGacha(false)}
         />
      )}

      {/* Task Form Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
           <form onSubmit={handleAddTask} className="bg-white dark:bg-dark-surface rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-pop border-b-8 border-gray-200 dark:border-dark-border">
              <h2 className="text-xl font-bold mb-4 dark:text-white">{editingTask ? 'Edit Task' : 'New Task'}</h2>
              
              <div className="space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Task Content</label>
                    <input 
                      type="text" 
                      value={newTaskText}
                      onChange={(e) => setNewTaskText(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-dark-border focus:border-brand focus:outline-none dark:text-white"
                      placeholder="e.g. Buy birdseed"
                      autoFocus
                      required
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Deadline</label>
                    <input 
                      type="datetime-local" 
                      value={newTaskDeadline}
                      onChange={(e) => setNewTaskDeadline(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-dark-border focus:border-brand focus:outline-none dark:text-white"
                    />
                 </div>
              </div>

              <div className="flex gap-3 mt-8">
                 <button type="button" onClick={() => setShowTaskForm(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700">Cancel</button>
                 <button type="submit" className="flex-1 py-3 rounded-xl font-bold text-white bg-brand shadow-lg btn-3d border-brand-dark">
                    {editingTask ? 'Save' : 'Add Task'}
                 </button>
              </div>
           </form>
        </div>
      )}

    </div>
  );
};

export default App;