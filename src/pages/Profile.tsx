import React from "react";

import { Button, Layout } from "src/components";

const Profile: React.FC = () => {
  return (
    <Layout>
      <div className="flex items-start justify-center w-full bg-[#f9fafb] text-gray-900 min-h-screen p-8">
        <div className="flex items-center w-full max-w-5xl bg-white rounded-2xl shadow-sm p-10 gap-12 transition-all duration-500">
          
          <div className="flex flex-col items-center text-center flex-1">
            <div className="relative">
              <img
                src="https://i.pravatar.cc/150?img=12"
                alt="Avatar"
                className="w-36 h-36 rounded-full border-4 border-indigo-500 hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-3 right-3 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            <h2 className="mt-4 text-2xl font-semibold">Marlon Moncayo</h2>
            <p className="text-indigo-600 font-medium">Rey del Sistema</p>
          </div>

         
          <div className="flex flex-col flex-1 space-y-4">
            <h3 className="text-xl font-semibold">Información del perfil</h3>
            <hr className="border-gray-200" />
            <p>
              <span className="font-semibold">Correo:</span>{" "}
              marlon@example.com
            </p>
            <p>
              <span className="font-semibold">Teléfono:</span> +57 300 456 7890
            </p>
            <p>
              <span className="font-semibold">Ubicación:</span> Mocoa, Putumayo, Colombia
            </p>
            <p>
              <span className="font-semibold">Miembro desde:</span> Enero 2023
            </p>
            <Button className="mt-6 bg-indigo-600 text-white hover:bg-indigo-700 transition">
              Editar perfil
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
