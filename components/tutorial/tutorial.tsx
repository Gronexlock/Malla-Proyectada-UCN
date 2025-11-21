import React, {useState} from "react";

export function Tutorial() {
    const [Open, setOpen] = useState(false);

    function openModal() {
        setOpen(true);
    }

    return (
        <div>
        <div className="flex min-h-screen items-center justify-center gap-2 bg-white/50">
            <button onClick={openModal} id="openModal" className="rounded-xl bg-blue-600 px-4 py-2 text-white">
                Ver tutorial
            </button>
        </div>

        <div id="Modal" className="fixed inset-0 flex hidden items-center justify-center">

            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

            <div className="relative w-80 rounded-2xl bg-green-500 p-6 shadow-xl">
                <h2 className="text-xl font-semibold">hola</h2>
                <p className="text-gray-600">contenido de ejemplo</p>
                <button id="closeModal" className="rounded-xl bg-blue-600 px-4 py-2 text-white">cerrar</button>
            </div>
        </div>
        </div>
    );
}