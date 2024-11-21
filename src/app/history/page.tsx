"use client";
import DbData from "../components/charts/DbData";
import { NavBar } from "../components/NavBar";

export default function History() {
  return (
    <>
      <NavBar />
      <main className="container mx-auto px-4">
        <div className="p-6">
          <DbData />
        </div>
      </main>
    </>
  );
}
