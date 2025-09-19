<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        $adminRole = Role::where('name', 'admin')->first();
        $userRole = Role::where('name', 'user')->first();

        // Crear usuario admin por defecto
        User::firstOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name' => 'Administrador',
                'password' => Hash::make('admin123'),
                'role_id' => $adminRole->id,
                'status' => true,
            ]
        );

        // Crear usuario normal de ejemplo
        User::firstOrCreate(
            ['email' => 'usuario@test.com'],
            [
                'name' => 'Usuario Test',
                'password' => Hash::make('user123'),
                'role_id' => $userRole->id,
                'status' => true,
            ]
        );
    }
}
