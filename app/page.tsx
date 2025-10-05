"use client";

import { useEffect, useState } from "react";
import api from "./api";
import toast from "react-hot-toast";
import { ArrowDownCircle, ArrowUpCircle, Wallet, Activity, TrendingDown, TrendingUp, Trash, PlayCircle } from "lucide-react";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

type Transaction = {
  id: string;
  text: string;
  amount: number;
  created_at: string;
};

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [text, setText] = useState<string>("");
  const [amount, setAmount] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  // Fonction qui permet de charger les données
  const getTransactions = async () => {
    try {
      const res = await api.get("transactions/");
      console.log("Réponse transactions:", res.data);
  
      const transactionsData = Array.isArray(res.data)
        ? res.data
        : res.data.results || res.data.transactions || res.data.data || [];
  
      setTransactions(transactionsData);
      toast.success("Chargement des Transactions");
    } catch (error) {
      console.error("Erreur de chargement des transactions", error);
      toast.error("Erreur de chargement des transactions");
    }
  };
  

  // Fonction qui permet d'ajouter une transaction
  const addTransactions = async () => {
    if (!text || amount == "" || isNaN(Number(amount))) {
      toast.error("Merci de remplir les champs du texte et du montant valides");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("transactions/", {
        text,
        amount: Number(amount),
      });
      console.log("Réponse ajout transaction:", res.data);

      getTransactions();

      const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
      if (modal) {
        modal.close();
      }
      toast.success("Transaction effectuée");
      setText("");
      setAmount("");
    } catch (error: any) {
      console.error("Erreur lors de la transaction", error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Erreur lors de la transaction";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Fonction qui permet de supprimer une transaction
  const deleteTransactions = async (id: string) => {
    try {
      await api.delete(`transactions/${id}/`);
      getTransactions();
      toast.success("Transaction supprimée");
    } catch (error) {
      console.error("Erreur lors de la suppression de la transaction", error);
      toast.error("Erreur de la suppression de la transaction");
    }
  };

  useEffect(() => {
    getTransactions();
  }, []);

  // amounts est la somme totale que j'ai dans mon compte
  const amounts = transactions.map((t) => Number(t.amount) || 0);

  // balance est le reste de mon argent après une transaction
  const balance = amounts.reduce((acc, item) => acc + item, 0) || 0;

  // income est le revenu que j'ai sur mes transactions
  const income =
    amounts.filter((a) => a > 0).reduce((acc, item) => acc + item, 0) || 0;

  // expense sont les dépenses que j'ai effectuées
  const expense =
    amounts.filter((a) => a < 0).reduce((acc, item) => acc + item, 0) || 0;

  // ratio qui sont mes dépenses par rapport au revenu
  const ratio =
    income > 0 ? Math.min((Math.abs(expense) / income) * 100, 100) : 0;

  const formaDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-start p-5">
          <div className="w-full max-w-6xl flex flex-col gap-4">
            <div className="flex justify-between rounded-2xl border-2 border-primary/10 border-dashed bg-primary/5 p-5">
              <div className="flex flex-col gap-1">
                <div className="badge badge-soft">
                  <Wallet className="w-4 h-4" /> Votre Solde
                </div>
                <div className="stat-value">{balance.toFixed(2)} £</div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="badge badge-soft badge-success">
                  <ArrowUpCircle className="w-4 h-4" /> Revenus
                </div>
                <div className="stat-value">{income.toFixed(2)} £</div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="badge badge-soft badge-error">
                  <ArrowDownCircle className="w-4 h-4" /> Dépenses
                </div>
                <div className="stat-value">{expense.toFixed(2)} £</div>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-primary/10 border-dashed bg-primary/5 p-5">
              <div className="flex justify-between items-center mb-1">
                <div className="badge badge-soft badge-primary gap-1">
                  <Activity className="w-4 h-4" />
                  Dépenses vs Revenus
                </div>
                <div className="">{ratio.toFixed(0)}%</div>
              </div>

              {/* Barre de progression */}
              <progress
                className="progress progress-primary w-full"
                value={ratio}
                max={100}
              ></progress>
            </div>

            {/* Bouton ouvrir modal */}
            <button
              className="btn btn-primary rounded-xl"
              onClick={() =>
                (document.getElementById("my_modal_3") as HTMLDialogElement).showModal()
              }
            >
              <PlayCircle />
              Ajouter une transaction
            </button>

            <div className="overflow-x-auto rounded-2xl border-2 border-primary/10 border-dashed bg-primary/5">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Description</th>
                    <th>Montant</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, index) => (
                    <tr key={t.id}>
                      <th>{index + 1}</th>
                      <td>{t.text}</td>
                      <td className="font-semibold flex items-center gap-2">
                        {t.amount > 0 ? (
                          <TrendingUp className="text-success w-6 h-6" />
                        ) : (
                          <TrendingDown className="text-error w-6 h-6" />
                        )}
                        {t.amount > 0 ? `+${t.amount}` : `${t.amount}`}
                      </td>
                      <td>{formaDate(t.created_at)}</td>
                      <td>
                        <button
                          onClick={() => deleteTransactions(t.id)}
                          className="btn btn-sm btn-error btn-soft"
                          title="Supprimer"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <dialog id="my_modal_3" className="modal backdrop-blur">
              <div className="modal-box border-3 border-primary/30 border-dashed">
                <form method="dialog">
                  {/* Fermer modal */}
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    ✕
                  </button>
                </form>
                <h3 className="font-bold text-lg">Ajouter une transaction</h3>
                <div className="flex flex-col gap-4 mt-4">
                  <div className="flex flex-col gap-2">
                    <label className="label">Texte</label>
                    <input
                      type="text"
                      name="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Entrez le texte..."
                      className="input w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="label">
                      Montant (négatif - dépenses, positif - revenu)
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={amount}
                      onChange={(e) =>
                        setAmount(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      placeholder="Entrez le montant..."
                      className="input w-full"
                    />
                  </div>

                  <button
                    className="btn btn-primary w-full"
                    onClick={addTransactions}
                    disabled={loading}
                  >
                    <PlayCircle className="w-4 h-4" /> Ajouter
                  </button>
                </div>
              </div>
            </dialog>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
