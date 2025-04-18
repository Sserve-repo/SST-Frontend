"use client";

import { ShieldCheck, Lock, Users } from "lucide-react";
import Link from "next/link";

export default function Permissions() {
  return (
    <div className="space-y-6">
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                Powerful Role-Based Access Control
              </h2>
              <p className="max-w-2xl mx-auto text-xl text-gray-500">
                Manage users, roles, and permissions with a clean, intuitive
                interface. Complete control over who can access what in your
                application.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <Link href="/admin/dashboard/users">
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    User Management
                  </h3>
                  <p className="text-gray-500">
                    Create and manage users with ease. Assign roles to control
                    their access levels.
                  </p>
                </div>
              </Link>

              <Link href="/admin/dashboard/permissions">
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <ShieldCheck className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Role Management
                  </h3>
                  <p className="text-gray-500">
                    Define roles with specific permissions to create the perfect
                    access control structure.
                  </p>
                </div>
              </Link>

              <Link href="/admin/dashboard/roles">
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Lock className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Permission Control
                  </h3>
                  <p className="text-gray-500">
                    Create granular permissions to control access to different
                    resources and actions.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </main>
      </div>{" "}
    </div>
  );
}
