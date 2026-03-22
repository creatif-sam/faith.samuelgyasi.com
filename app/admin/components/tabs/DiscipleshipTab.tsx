import { useState } from "react";
import { Edit, Trash2, Plus, Eye, Calendar, BookOpen, TrendingUp, User } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TW } from "../constants";
import { Disciple, DiscipleProgress } from "../types";

interface DiscipleshipTabProps {
  disciples: Disciple[];
  onNew: () => void;
  onEdit: (disciple: Disciple) => void;
  onDelete: (id: string, name: string) => Promise<void>;
  onViewProgress: (disciple: Disciple) => void;
}

export default function DiscipleshipTab({ 
  disciples, 
  onNew, 
  onEdit, 
  onDelete,
  onViewProgress 
}: DiscipleshipTabProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'graduated'>('all');

  const filteredDisciples = statusFilter === 'all' 
    ? disciples 
    : disciples.filter(d => d.status === statusFilter);

  const statusColors = {
    active: "bg-green-500/10 text-green-400 border-green-500/20",
    inactive: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    graduated: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  const stats = {
    total: disciples.length,
    active: disciples.filter(d => d.status === 'active').length,
    inactive: disciples.filter(d => d.status === 'inactive').length,
    graduated: disciples.filter(d => d.status === 'graduated').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Discipleship Tracking</h2>
          <p className="text-sm text-white/40 mt-1">Monitor individuals' spiritual growth and progress</p>
        </div>
        <button className={cn(TW.btn, TW.gold)} onClick={onNew}>
          <Plus size={14} /> Add Disciple
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white/[.02] border border-white/[.06] rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(212,168,67,.1)] flex items-center justify-center">
              <User size={20} className="text-[#d4a843]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-xs text-white/40">Total Disciples</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white/[.02] border border-white/[.06] rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.active}</div>
              <div className="text-xs text-white/40">Active</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white/[.02] border border-white/[.06] rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-500/10 flex items-center justify-center">
              <Calendar size={20} className="text-gray-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.inactive}</div>
              <div className="text-xs text-white/40">Inactive</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white/[.02] border border-white/[.06] rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <BookOpen size={20} className="text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.graduated}</div>
              <div className="text-xs text-white/40">Graduated</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          className={cn(
            "px-4 py-2 rounded-lg text-sm transition-all",
            statusFilter === 'all' 
              ? "bg-[#d4a843] text-[#09090d] font-medium" 
              : "bg-white/5 text-white/50 hover:bg-white/10"
          )}
          onClick={() => setStatusFilter('all')}
        >
          All ({stats.total})
        </button>
        <button
          className={cn(
            "px-4 py-2 rounded-lg text-sm transition-all",
            statusFilter === 'active' 
              ? "bg-green-500 text-white font-medium" 
              : "bg-white/5 text-white/50 hover:bg-white/10"
          )}
          onClick={() => setStatusFilter('active')}
        >
          Active ({stats.active})
        </button>
        <button
          className={cn(
            "px-4 py-2 rounded-lg text-sm transition-all",
            statusFilter === 'inactive' 
              ? "bg-gray-500 text-white font-medium" 
              : "bg-white/5 text-white/50 hover:bg-white/10"
          )}
          onClick={() => setStatusFilter('inactive')}
        >
          Inactive ({stats.inactive})
        </button>
        <button
          className={cn(
            "px-4 py-2 rounded-lg text-sm transition-all",
            statusFilter === 'graduated' 
              ? "bg-blue-500 text-white font-medium" 
              : "bg-white/5 text-white/50 hover:bg-white/10"
          )}
          onClick={() => setStatusFilter('graduated')}
        >
          Graduated ({stats.graduated})
        </button>
      </div>

      {/* Disciples Table */}
      {filteredDisciples.length === 0 ? (
        <div className="text-center py-16 text-white/30 text-sm">
          {statusFilter === 'all' 
            ? "No disciples added yet. Click 'Add Disciple' to start tracking." 
            : `No ${statusFilter} disciples found.`}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-white/50 text-xs uppercase tracking-wider">Disciple</th>
                <th className="text-left py-3 px-4 text-white/50 text-xs uppercase tracking-wider">Contact</th>
                <th className="text-left py-3 px-4 text-white/50 text-xs uppercase tracking-wider">Current Course</th>
                <th className="text-left py-3 px-4 text-white/50 text-xs uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-white/50 text-xs uppercase tracking-wider">Started</th>
                <th className="text-right py-3 px-4 text-white/50 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDisciples.map((disciple) => (
                <tr key={disciple.id} className="border-b border-white/5 hover:bg-white/[.02]">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {disciple.photo_url ? (
                        <img 
                          src={disciple.photo_url} 
                          alt={disciple.name}
                          className="w-10 h-10 rounded-full object-cover border border-white/10"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[rgba(212,168,67,.1)] flex items-center justify-center border border-[rgba(212,168,67,.2)]">
                          <span className="text-[#d4a843] font-medium text-sm">
                            {disciple.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="text-white/90 font-medium text-sm">{disciple.name}</div>
                        {disciple.notes && (
                          <div className="text-white/40 text-xs mt-0.5 max-w-[200px] truncate">
                            {disciple.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-0.5">
                      {disciple.email && (
                        <span className="text-white/60 text-xs">{disciple.email}</span>
                      )}
                      {disciple.phone && (
                        <span className="text-white/40 text-xs">{disciple.phone}</span>
                      )}
                      {!disciple.email && !disciple.phone && (
                        <span className="text-white/30 text-xs italic">No contact</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {disciple.current_course ? (
                      <span className="text-white/70 text-sm">{disciple.current_course}</span>
                    ) : (
                      <span className="text-white/30 text-sm italic">No course</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className={cn(TW.badge, "border", statusColors[disciple.status])}>
                      {disciple.status.charAt(0).toUpperCase() + disciple.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white/50 text-sm">
                      {new Date(disciple.started_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className={cn(TW.iconBtn, "!text-[#d4a843] hover:!text-[#e0b84e]")}
                        onClick={() => onViewProgress(disciple)}
                        title="View progress"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className={cn(TW.iconBtn, "!text-white/50 hover:!text-white/90")}
                        onClick={() => onEdit(disciple)}
                        title="Edit disciple"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className={cn(TW.iconBtn, "!text-red-400/50 hover:!text-red-400")}
                        onClick={() => {
                          if (confirm(`Delete ${disciple.name}? This will remove all progress records.`)) {
                            onDelete(disciple.id, disciple.name);
                          }
                        }}
                        title="Delete disciple"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
