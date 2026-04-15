"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  DollarSign,
  Settings,
  Bell,
  Search,
  LogOut,
  Shield,
  Ban,
  CheckCircle,
  X,
  MoreHorizontal,
  Download,
  Filter,
  RefreshCw,
  ArrowLeft,
  UserCheck,
  Activity,
  CreditCard,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getAdminUsers,
  getAdminTransactions,
  updateUserStatus,
  updateKycStatus,
} from "../lib/api";

// Fallback static data
const fallbackUsers = [
  { id: 1, name: "Rahul Sharma", email: "rahul@example.com", balance: 245000, trades: 156, status: "active", kyc: "verified", joined: "2 days ago" },
  { id: 2, name: "Priya Patel", email: "priya@example.com", balance: 189000, trades: 89, status: "active", kyc: "pending", joined: "5 days ago" },
  { id: 3, name: "Amit Kumar", email: "amit@example.com", balance: 50000, trades: 45, status: "suspended", kyc: "verified", joined: "1 week ago" },
  { id: 4, name: "Sneha Gupta", email: "sneha@example.com", balance: 320000, trades: 234, status: "active", kyc: "verified", joined: "2 weeks ago" },
  { id: 5, name: "Vikram Rao", email: "vikram@example.com", balance: 75000, trades: 12, status: "inactive", kyc: "rejected", joined: "1 month ago" },
];

const fallbackTransactions = [
  { id: 1, user: "Rahul Sharma", type: "deposit", amount: 50000, status: "completed", time: "5 mins ago" },
  { id: 2, user: "Priya Patel", type: "withdrawal", amount: 25000, status: "pending", time: "15 mins ago" },
  { id: 3, user: "Amit Kumar", type: "trade", amount: 125000, status: "completed", time: "1 hour ago" },
  { id: 4, user: "Sneha Gupta", type: "deposit", amount: 100000, status: "completed", time: "2 hours ago" },
];

const stats = []; // Removed static stats, now using dashboardStats with live data

function UserModal({ user, trades, isOpen, onClose, onAction }: { user: any; trades: any[]; isOpen: boolean; onClose: () => void; onAction: (action: string) => void }) {
  if (!isOpen || !user) return null;

  const uid = user._id || user.id;
  const userTrades = trades.filter(t => t.userId === uid || (typeof t.userId === 'object' && t.userId?._id === uid));

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">User Details</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="text-center shrink-0">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {user.name.split(" ").map((n: string) => n[0]).join("")}
            </div>
            <h4 className="text-lg font-bold text-gray-900">{user.name}</h4>
            <p className="text-sm text-gray-500">{user.email}</p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${
              user.status === "active" ? "bg-green-100 text-green-700" :
              user.status === "suspended" ? "bg-red-100 text-red-700" :
              "bg-gray-100 text-gray-700"
            }`}>
              {(user?.status || "").toUpperCase()}
            </span>
          </div>

          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Available Balance</p>
                <p className="text-xl font-bold text-gray-900">₹{(user.balance ?? 0).toLocaleString('en-IN')}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Total Trades</p>
                <p className="text-xl font-bold text-gray-900">{user.trades ?? 0}</p>
              </div>
            </div>

            <div className="flex gap-2">
              {user.status === "active" ? (
                <button onClick={() => onAction("suspend")} className="flex-1 py-2 bg-red-50 text-red-600 font-bold rounded-lg text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                  <Ban className="w-4 h-4" /> Suspend
                </button>
              ) : (
                <button onClick={() => onAction("activate")} className="flex-1 py-2 bg-green-50 text-green-600 font-bold rounded-lg text-sm hover:bg-green-100 transition-colors flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Activate
                </button>
              )}
              <button onClick={() => onAction("reset")} className="flex-1 py-2 bg-gray-50 text-gray-600 font-bold rounded-lg text-sm hover:bg-gray-100 transition-colors">
                Reset PW
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-600" />
            Trade History
          </h4>
          <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600 font-medium">
                <tr>
                  <th className="px-4 py-3 text-left">Stock</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-right">Qty</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">{userTrades.length > 0 ? userTrades.map((trade: any, idx: number) => (
                  <tr key={idx} className="hover:bg-white/50 transition-colors">
                    <td className="px-4 py-3 font-bold text-gray-900">{trade.stock}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${trade.type === 'buy' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                        {trade.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">{trade.quantity}</td>
                    <td className="px-4 py-3 text-right text-gray-600">₹{trade.price.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">₹{trade.total.toLocaleString('en-IN')}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400 italic">No trades recorded for this user</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function KycModal({ user, isOpen, onClose, onApprove, onReject }: { user: any; isOpen: boolean; onClose: () => void; onApprove: () => void; onReject: () => void }) {
  if (!isOpen || !user) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl p-6 max-w-md w-full"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">KYC Verification</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              {user.name.split(" ").map((n: string) => n[0]).join("")}
            </div>
            <div>
              <p className="font-bold text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 rounded-xl mb-4">
            <p className="text-sm text-yellow-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              KYC Status: {(user?.kyc || "").toUpperCase()}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">PAN Card</span>
              <span className="text-green-600 font-medium">Uploaded</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Aadhaar Card</span>
              <span className="text-green-600 font-medium">Uploaded</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Bank Statement</span>
              <span className="text-yellow-600 font-medium">Pending</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button
            onClick={onReject}
            className="flex-1 py-3 bg-red-100 text-red-700 font-semibold rounded-xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Reject
          </motion.button>
          <motion.button
            onClick={onApprove}
            className="flex-1 py-3 bg-green-500 text-white font-semibold rounded-xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Approve
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userList, setUserList] = useState(fallbackUsers);
  const [transactions, setTransactions] = useState(fallbackTransactions);
  const [allTrades, setAllTrades] = useState<any[]>([]);
  const [liveStats, setLiveStats] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const { getAdminStats } = await import("../lib/api");
      const [usersRes, transactionsRes, tradesRes, statsRes] = await Promise.all([
        getAdminUsers(),
        getAdminTransactions(),
        import("../lib/api").then(m => m.getAdminTrades()),
        getAdminStats()
      ]);
      if (usersRes.success) setUserList(usersRes.data);
      if (transactionsRes.success) setTransactions(transactionsRes.data);
      if (tradesRes.success) setAllTrades(tradesRes.data);
      if (statsRes.success) setLiveStats(statsRes.data);
    } catch (error) {
      console.log("Server not reachable, using static admin data");
    }
  };

  useEffect(() => {
    setMounted(true);
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      window.location.href = "/admin/login";
      return;
    }
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const dashboardStats = [
    { label: "Total Users", value: liveStats?.totalUsers || "0", change: "+2.1%", icon: Users, color: "blue" },
    { label: "Active Traders", value: liveStats?.activeTraders || "0", change: "+4.5%", icon: Activity, color: "green" },
    { label: "Total Volume", value: liveStats?.totalVolume || "₹0", change: "+10.2%", icon: TrendingUp, color: "purple" },
    { label: "Net Revenue", value: liveStats?.revenue || "₹0", change: "+5.8%", icon: DollarSign, color: "orange" },
  ];

  const handleUserAction = async (action: string) => {
    if (!selectedUser) return;
    const userId = selectedUser._id || selectedUser.id;
    try {
      if (action === "suspend") {
        await updateUserStatus(userId, "suspended");
        setUserList(userList.map((u: any) => (u._id || u.id) === userId ? { ...u, status: "suspended" } : u));
      } else if (action === "activate") {
        await updateUserStatus(userId, "active");
        setUserList(userList.map((u: any) => (u._id || u.id) === userId ? { ...u, status: "active" } : u));
      }
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
    setUserModalOpen(false);
  };

  const handleKycApprove = async () => {
    if (!selectedUser) return;
    const userId = selectedUser._id || selectedUser.id;
    try {
      await updateKycStatus(userId, "verified");
      setUserList(userList.map((u: any) => (u._id || u.id) === userId ? { ...u, kyc: "verified" } : u));
    } catch (error) {
      console.error("Failed to update KYC status:", error);
    }
    setKycModalOpen(false);
  };

  const handleKycReject = async () => {
    if (!selectedUser) return;
    const userId = selectedUser._id || selectedUser.id;
    try {
      await updateKycStatus(userId, "rejected");
      setUserList(userList.map((u: any) => (u._id || u.id) === userId ? { ...u, kyc: "rejected" } : u));
    } catch (error) {
      console.error("Failed to update KYC status:", error);
    }
    setKycModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* User Modal */}
      <AnimatePresence>
        {userModalOpen && (
          <UserModal
            user={selectedUser}
            trades={allTrades}
            isOpen={userModalOpen}
            onClose={() => setUserModalOpen(false)}
            onAction={handleUserAction}
          />
        )}
      </AnimatePresence>

      {/* KYC Modal */}
      <AnimatePresence>
        {kycModalOpen && (
          <KycModal
            user={selectedUser}
            isOpen={kycModalOpen}
            onClose={() => setKycModalOpen(false)}
            onApprove={handleKycApprove}
            onReject={handleKycReject}
          />
        )}
      </AnimatePresence>

      {/* Top Navigation */}
      <motion.nav
        className="bg-white border-b border-gray-200 sticky top-0 z-40"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <div onClick={() => setActiveTab("dashboard")} className="cursor-pointer">
                <motion.div
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                      TradeVerse
                    </span>
                    <span className="text-xs text-red-600 font-bold block">ADMIN</span>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              <motion.button
                className="relative p-2 text-gray-600 hover:text-blue-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </motion.button>
              <motion.button
                onClick={handleRefresh}
                className="p-2 text-gray-600 hover:text-blue-600"
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`} />
              </motion.button>
              <motion.button
                className={`flex items-center gap-2 p-2 hover:bg-gray-100 rounded-xl transition-all ${activeTab === "settings" ? "bg-red-50" : ""}`}
                whileHover={{ scale: 1.05 }}
                onClick={() => setActiveTab("settings")}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  A
                </div>
                <span className="hidden md:block font-medium text-gray-700">Admin</span>
              </motion.button>
              <motion.button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div
            className="lg:col-span-1 space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "users", label: "Users", icon: Users },
              { id: "transactions", label: "Transactions", icon: CreditCard },
              { id: "trades", label: "User Trades", icon: TrendingUp },
              { id: "kyc", label: "KYC Requests", icon: UserCheck },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeTab === item.id
                    ? "bg-red-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === "dashboard" && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {dashboardStats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ y: -4 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          stat.color === "blue" ? "bg-blue-100 text-blue-600" :
                          stat.color === "green" ? "bg-green-100 text-green-600" :
                          stat.color === "purple" ? "bg-purple-100 text-purple-600" :
                          "bg-orange-100 text-orange-600"
                        }`}>
                          <stat.icon className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-medium text-green-600">{stat.change}</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
                {/* Recent Users Section */}
                <motion.div className="bg-white rounded-2xl shadow-sm overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center"><h3 className="text-lg font-bold text-gray-900">Recent Users</h3><button onClick={() => setActiveTab("users")} className="text-sm font-medium text-red-600 hover:underline">View All</button></div>
                  <div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{userList.slice(0, 3).map((user, index) => (<tr key={user.id ?? index} className="hover:bg-gray-50"><td className="px-6 py-4 flex items-center gap-3"><div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">{user.name.split(" ").map((n) => n[0]).join("")}</div><div><p className="font-semibold text-gray-900">{user.name}</p></div></td><td className="px-6 py-4">₹{(user.balance ?? 0).toLocaleString('en-IN')}</td><td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{ (user.status || "").toUpperCase() }</span></td><td className="px-6 py-4"><button onClick={() => { setSelectedUser(user); setUserModalOpen(true); }} className="text-gray-400 hover:text-gray-600"><MoreHorizontal className="w-4 h-4" /></button></td></tr>))}</tbody></table></div>
                </motion.div>
              </>
            )}

            {activeTab === "users" && (
              <motion.div
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">All Registered Users</h3>
                  <div className="flex gap-2">
                    <motion.button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}><Filter className="w-4 h-4" /></motion.button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">KYC</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">{userList.map((user, index) => (
                        <tr key={user.id ?? index} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {user.name.split(" ").map((n) => n[0]).join("")}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900">₹{(user.balance ?? 0).toLocaleString('en-IN')}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.status === "active" ? "bg-green-100 text-green-700" :
                              user.status === "suspended" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                            }`}>{ (user.status || "").toUpperCase() }</span>
                          </td>
                          <td className="px-6 py-4">
                            <button onClick={() => { setSelectedUser(user); setKycModalOpen(true); }} className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.kyc === "verified" ? "bg-green-100 text-green-700" :
                              user.kyc === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                            }`}>{ (user.kyc || "").toUpperCase() }</button>
                          </td>
                          <td className="px-6 py-4">
                            <button onClick={() => { setSelectedUser(user); setUserModalOpen(true); }} className="p-2 hover:bg-gray-100 rounded-full"><MoreHorizontal className="w-4 h-4 text-gray-400" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === "transactions" && (
              <motion.div className="bg-white rounded-2xl shadow-sm overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="p-6 border-b border-gray-100 flex justify-between items-center"><h3 className="text-lg font-bold text-gray-900">Platform Transactions</h3></div>
                <div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th></tr></thead><tbody className="divide-y divide-gray-100">{transactions.map((tx: any, index) => (<tr key={tx._id ?? tx.id ?? index} className="hover:bg-gray-50"><td className="px-6 py-4 font-medium text-gray-900">{tx.user}</td><td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${tx.type === "deposit" ? "bg-green-100 text-green-700" : tx.type === "withdrawal" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>{ (tx.type || "").toUpperCase() }</span></td><td className="px-6 py-4 font-medium text-gray-900">₹{(tx.amount ?? 0).toLocaleString('en-IN')}</td><td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${tx.status === "completed" ? "bg-green-100 text-green-700" : tx.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{ (tx.status || "").toUpperCase() }</span></td><td className="px-6 py-4 text-sm text-gray-500">{tx.time}</td></tr>))}</tbody></table></div>
              </motion.div>
            )}

            {activeTab === "trades" && (
              <motion.div className="bg-white rounded-2xl shadow-sm overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="p-6 border-b border-gray-100 flex justify-between items-center"><h3 className="text-lg font-bold text-gray-900">User Trading Activity</h3></div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">{allTrades.length > 0 ? allTrades.map((trade: any, index: number) => (
                        <tr key={trade._id ?? trade.id ?? index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">{trade.user || 'Reddy'}</td>
                          <td className="px-6 py-4 font-bold text-gray-900">{trade.stock}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${trade.type === "buy" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
                              {(trade.type || "").toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4">{trade.quantity}</td>
                          <td className="px-6 py-4">₹{(trade.price ?? 0).toLocaleString('en-IN')}</td>
                          <td className="px-6 py-4 font-bold text-gray-900">₹{(trade.total ?? 0).toLocaleString('en-IN')}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{trade.time}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={7} className="px-6 py-10 text-center text-gray-500">No trading activity found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === "kyc" && (
              <motion.div className="bg-white rounded-2xl shadow-sm overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="p-6 border-b border-gray-100 flex justify-between items-center"><h3 className="text-lg font-bold text-gray-900">Pending KYC Requests</h3></div>
                <div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{userList.filter(u => u.kyc !== "verified").map((user, index) => (<tr key={user.id ?? index} className="hover:bg-gray-50"><td className="px-6 py-4 flex items-center gap-3"><div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">{user.name.split(" ").map((n) => n[0]).join("")}</div><div><p className="font-semibold text-gray-900">{user.name}</p><p className="text-sm text-gray-500">{user.email}</p></div></td><td className="px-6 py-4 text-sm text-gray-500">{user.joined}</td><td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.kyc === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{ (user.kyc || "").toUpperCase() }</span></td><td className="px-6 py-4"><button onClick={() => { setSelectedUser(user); setKycModalOpen(true); }} className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700">Review</button></td></tr>))}</tbody></table></div>
              </motion.div>
            )}

            {activeTab === "analytics" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div className="bg-white rounded-2xl shadow-sm p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><h3 className="text-lg font-bold text-gray-900 mb-4">User Growth</h3><div className="h-64 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-gray-400">Growth Chart Coming Soon</div></motion.div>
                <motion.div className="bg-white rounded-2xl shadow-sm p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}><h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Stream</h3><div className="h-64 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-gray-400">Revenue Chart Coming Soon</div></motion.div>
              </div>
            )}

            {activeTab === "settings" && (
              <motion.div className="bg-white rounded-2xl shadow-sm p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Admin Settings</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label><input type="email" defaultValue="admin@tradeverse.com" className="w-full px-4 py-2 border border-gray-200 rounded-xl" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label><input type="text" defaultValue="TradeVerse" className="w-full px-4 py-2 border border-gray-200 rounded-xl" /></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4">Security Settings</h4>
                    <div className="space-y-3"><div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"><span className="text-gray-700">Maintainance Mode</span><button className="w-12 h-6 bg-gray-300 rounded-full relative"><div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5"></div></button></div><div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"><span className="text-gray-700">Two-Factor Auth</span><button className="w-12 h-6 bg-red-600 rounded-full relative"><div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div></button></div></div>
                  </div>
                  <button className="w-full py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg">Save Configuration</button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
