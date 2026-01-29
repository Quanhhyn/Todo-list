import React, { useState } from 'react';
import { Task, TaskStatus } from '../types';
import { CheckCircle2, Circle, Trash2, Calendar, Edit3, MessageSquarePlus, Filter, ArrowUpDown, Flame, Ticket } from 'lucide-react';
import { suggestSubtasks } from '../services/geminiService';

interface TaskListProps {
  tasks: Task[];
  onToggleStatus: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

type SortOption = 'DEADLINE_ASC' | 'DEADLINE_DESC' | 'STATUS';
type FilterOption = 'ALL' | 'PENDING' | 'DONE';

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleStatus, onDelete, onEdit }) => {
  const [filter, setFilter] = useState<FilterOption>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('DEADLINE_ASC');
  
  const [loadingSubtasks, setLoadingSubtasks] = useState<string | null>(null);
  const [subtasksMap, setSubtasksMap] = useState<Record<string, string[]>>({});

  // Filtering
  const filteredTasks = tasks.filter(t => {
    if (filter === 'ALL') return true;
    if (filter === 'PENDING') return t.status === TaskStatus.PENDING;
    if (filter === 'DONE') return t.status === TaskStatus.DONE;
    return true;
  });
  
  // Sorting
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'STATUS') {
      // Pending first, then Done
      if (a.status === b.status) return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      return a.status === TaskStatus.PENDING ? -1 : 1;
    }
    if (sortBy === 'DEADLINE_ASC') {
       return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    if (sortBy === 'DEADLINE_DESC') {
       return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
    }
    return 0;
  });

  const handleGetSubtasks = async (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    if (subtasksMap[task.id]) return; // Already have them

    setLoadingSubtasks(task.id);
    const steps = await suggestSubtasks(task.text);
    setSubtasksMap(prev => ({ ...prev, [task.id]: steps }));
    setLoadingSubtasks(null);
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-20 opacity-50 dark:opacity-70">
        <div className="text-6xl mb-4">📝</div>
        <p className="text-xl font-bold text-gray-600 dark:text-gray-300">No tasks yet.</p>
        <p className="text-gray-500 dark:text-gray-400">Add one to start earning ducks!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white/50 dark:bg-dark-surface/50 p-3 rounded-2xl backdrop-blur-sm border border-white dark:border-dark-border">
        
        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <Filter size={16} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
          <div className="flex gap-1">
             {(['ALL', 'PENDING', 'DONE'] as FilterOption[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                    ${filter === f 
                      ? 'bg-brand text-white shadow-md' 
                      : 'bg-white dark:bg-dark-surface text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-slate-700'}
                  `}
                >
                  {f}
                </button>
             ))}
          </div>
        </div>

        {/* Sorting */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
           <ArrowUpDown size={16} className="text-gray-500 dark:text-gray-400" />
           <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
           >
              <option value="DEADLINE_ASC">Deadline (Soonest)</option>
              <option value="DEADLINE_DESC">Deadline (Latest)</option>
              <option value="STATUS">Status (Pending First)</option>
           </select>
        </div>
      </div>

      {/* List */}
      <div className="grid gap-4">
        {sortedTasks.map(task => {
          const isDone = task.status === TaskStatus.DONE;
          const isOverdue = !isDone && new Date(task.deadline) < new Date();
          const isClaimed = task.rewardClaimed;

          return (
            <div 
              key={task.id} 
              className={`
                group relative p-5 rounded-2xl border-2 transition-all duration-300 
                ${isDone
                  ? 'bg-gray-100 dark:bg-dark-surface/40 border-gray-200 dark:border-dark-border opacity-75' 
                  : 'bg-white dark:bg-dark-surface border-white dark:border-dark-border shadow-lg hover:-translate-y-1 hover:shadow-xl dark:shadow-black/20'}
              `}
            >
              <div className="flex items-start gap-4">
                
                {/* Checkbox */}
                <button 
                  onClick={(e) => onToggleStatus(task.id, e)}
                  className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all relative
                    ${isDone
                      ? 'text-green-500 bg-green-100 dark:bg-green-900/20 scale-110' 
                      : 'text-gray-300 dark:text-gray-600 hover:text-brand hover:scale-110'}
                  `}
                >
                  {isDone ? <CheckCircle2 size={32} fill="currentColor" className="text-white dark:text-green-500" /> : <Circle size={32} />}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className={`text-lg font-bold truncate ${isDone ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
                    {task.text}
                  </h3>
                  {task.description && <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{task.description}</p>}
                  
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs font-semibold text-gray-400 dark:text-gray-500">
                    <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500 dark:text-red-400' : ''}`}>
                      <Calendar size={14} />
                      {new Date(task.deadline).toLocaleString()}
                    </div>
                    <span className={`px-2 py-0.5 rounded-md 
                      ${isDone 
                         ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                         : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}
                    >
                      {isDone ? 'DONE' : 'PENDING'}
                    </span>
                    {!isDone && !isClaimed && (
                      <span className="flex items-center gap-1 text-orange-500">
                        <Flame size={12} className="fill-orange-500" />
                        +20% Heat
                      </span>
                    )}
                    {!isDone && isClaimed && (
                       <span className="flex items-center gap-1 text-gray-400" title="You already got a ticket for this task!">
                         <Ticket size={12} className="opacity-50" />
                         Reward Claimed
                       </span>
                    )}
                  </div>

                  {/* AI Subtasks Section */}
                  {!isDone && (
                     <div className="mt-3">
                       {!subtasksMap[task.id] ? (
                          <button 
                            onClick={(e) => handleGetSubtasks(e, task)}
                            className="text-xs text-brand-dark flex items-center gap-1 hover:underline"
                            disabled={loadingSubtasks === task.id}
                          >
                            <MessageSquarePlus size={12} />
                            {loadingSubtasks === task.id ? 'Duck is thinking...' : 'Ask Duck for subtasks'}
                          </button>
                       ) : (
                          <div className="bg-brand-light/20 dark:bg-brand/10 p-2 rounded-lg mt-2">
                             <p className="text-xs font-bold text-brand-dark dark:text-brand mb-1">Duck suggests:</p>
                             <ul className="text-xs text-gray-600 dark:text-gray-400 list-disc list-inside">
                                {subtasksMap[task.id].map((step, idx) => (
                                  <li key={idx}>{step}</li>
                                ))}
                             </ul>
                          </div>
                       )}
                     </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEdit(task)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg">
                    <Edit3 size={18} />
                  </button>
                  <button onClick={() => onDelete(task.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskList;