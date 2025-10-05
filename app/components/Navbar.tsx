"use client";

import { useAuth } from "../context/AuthContext";
import { LogOut, User, Wallet, Search } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="navbar bg-base-100 border-b-2 border-primary/10 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl gap-2">
          <Wallet className="w-6 h-6 text-primary" />
          Expenza
        </a>
      </div>
      <div className="flex gap-2">
        <div className="form-control hidden md:block">
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="input input-bordered border-primary/10 w-24 md:w-auto" 
            />
          </div>
        </div>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg border-2 border-primary/10"
          >
            <li className="menu-title">
              <span className="flex flex-col gap-1">
                <span className="font-bold text-base">{user.username}</span>
                <span className="text-xs text-base-content/60">{user.email}</span>
              </span>
            </li>
            <div className="divider my-1"></div>
            <li>
              <a className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profil
              </a>
            </li>
            <li>
              <a onClick={logout} className="flex items-center gap-2 text-error">
                <LogOut className="w-4 h-4" />
                Déconnexion
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
