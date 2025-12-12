import React, { useState, useEffect } from "react";
import {
  Activity, Timer, Dumbbell, Zap, Trophy,
  Play, Plus, Save
} from "lucide-react";
import api from "../api/api";

export default function PlayerDashboard() {
  const [performances, setPerformances] = useState([]);
  const [form, setForm] = useState({
    sport: "",
    speed: "",
    stamina: "",
    strength: "",
    videoUrl: "",
  });

  const [videoFile, setVideoFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await api.get("/performance/my");
      setPerformances(res.data);
    } catch (err) {
      console.log("Failed loading", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (videoFile) fd.append("videoFile", videoFile);

      const res = await api.post("/performance/add", fd);

      // Add new entry to UI
      setPerformances([res.data.performance, ...performances]);

      setMsg("Performance saved!");
      setForm({ sport: "", speed: "", stamina: "", strength: "", videoUrl: "" });
      setVideoFile(null);
      setTimeout(() => setMsg(""), 2500);
    } catch (err) {
      console.log(err);
      setMsg("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-slate-950 text-white">

      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Trophy className="text-blue-400" /> Player Dashboard
      </h1>

      <div className="grid lg:grid-cols-12 gap-6">

        {/* FORM */}
        <div className="lg:col-span-4 bg-slate-900 p-5 rounded border border-white/10">

          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Plus className="text-green-400" /> Add Performance
          </h2>

          <form onSubmit={submit} className="space-y-4">

            <input
              name="sport"
              value={form.sport}
              onChange={handleChange}
              required
              placeholder="Sport"
              className="w-full p-3 rounded bg-slate-800 border border-slate-700"
            />

            <div className="grid grid-cols-3 gap-3">
              <StatInput name="speed" icon={<Timer />} value={form.speed} onChange={handleChange} />
              <StatInput name="stamina" icon={<Zap />} value={form.stamina} onChange={handleChange} />
              <StatInput name="strength" icon={<Dumbbell />} value={form.strength} onChange={handleChange} />
            </div>

            <input
              name="videoUrl"
              value={form.videoUrl}
              onChange={handleChange}
              placeholder="Video URL"
              className="w-full p-3 rounded bg-slate-800 border border-slate-700"
            />

            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              className="block w-full text-sm mt-2"
            />

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-blue-600 rounded hover:bg-blue-500 transition"
            >
              {saving ? "Saving..." : "Save Performance"}
            </button>

            {msg && (
              <p className="text-green-400 text-sm text-center mt-2">{msg}</p>
            )}
          </form>

        </div>

        {/* HISTORY */}
        <div className="lg:col-span-8 bg-slate-900 p-5 rounded border border-white/10 h-[80vh] overflow-y-auto">

          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Activity className="text-purple-400" /> My Performances
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : performances.length === 0 ? (
            <p>No performances yet.</p>
          ) : (
            performances.map((p) => (
              <div key={p._id} className="p-4 rounded bg-slate-800 border border-slate-700 mb-3">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold">{p.sport}</h3>
                    <p className="text-xs text-slate-400">
                      {new Date(p.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {p.videoUrl && (
                      <a
                        href={p.videoUrl}
                        target="_blank"
                        className="text-blue-400"
                      >
                        <Play className="w-4 h-4" />
                      </a>
                    )}
                    {p.videoFile && (
                      <a
                        href={`http://localhost:5000${p.videoFile}`}
                        target="_blank"
                        className="text-green-400"
                      >
                        <Play className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3">
                  <Value label="Speed" value={p.speed} />
                  <Value label="Stamina" value={p.stamina} />
                  <Value label="Strength" value={p.strength} />
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

function StatInput({ name, icon, value, onChange }) {
  return (
    <input
      name={name}
      type="number"
      value={value}
      onChange={onChange}
      placeholder={name}
      className="p-3 rounded bg-slate-800 border border-slate-700"
    />
  );
}

function Value({ label, value }) {
  return (
    <div className="bg-slate-900 p-2 rounded text-center border border-slate-700">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}
