"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { UserPlus, User, Mail, Lock, Phone, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const [last_name, setLastName] = useState("");
  const [first_name, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!last_name || !first_name || !phone || !email || !password || !password2) {
      return;
    }

    if (password !== password2) {
      return;
    }

    setLoading(true);
    try {
      await register(last_name, first_name, phone, email, password, password2);
    } catch (error) {
      // déjà géré
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border-2 border-primary/10 border-dashed bg-primary/5 p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-primary/20 p-4 rounded-full mb-4">
              <UserPlus className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Inscription</h1>
            <p className="text-base-content/60 mt-2">Créez votre compte</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nom
                </span>
              </label>
              <input
                type="text"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Entrez votre nom"
                className="input w-full"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Prénom
                </span>
              </label>
              <input
                type="text"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Entrez votre prénom"
                className="input w-full"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Téléphone
                </span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex : +229 01 23 45 67"
                className="input w-full"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre adresse email"
                className="input w-full"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Mot de passe
                </span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choisissez un mot de passe"
                className="input w-full"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Confirmez le mot de passe
                </span>
              </label>
              <input
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="Confirmez le mot de passe"
                className="input w-full"
                required
              />
            </div>

            {password && password2 && password !== password2 && (
              <div className="alert alert-error">
                <span>Les mots de passe ne correspondent pas</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full mt-4"
              disabled={loading || (password !== password2 && password2 !== "")}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Inscription en cours...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  S'inscrire
                </>
              )}
            </button>
          </form>

          <div className="divider">OU</div>

          <div className="text-center">
            <p className="text-base-content/60">
              Vous avez déjà un compte ?{" "}
              <Link href="/login" className="link link-primary font-semibold">
                Connectez-vous
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
