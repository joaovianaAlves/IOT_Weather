"use client";
import DbData from "../components/charts/DbData";
import { NavBar } from "../components/NavBar";

export default function History() {
  return (
    <>
      <NavBar />
      <main className="container mx-auto px-4 py-8 bg-gray-100">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Weather History
        </h1>
        <div className="bg-white rounded-xl shadow-md p-6">
          <DbData />
        </div>
      </main>
    </>
  );
}
