@extends('layouts.admin')

@section('title', 'Dashboard')

@section('content')
<!-- Estadísticas -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-500 bg-opacity-75">
                <i class="fas fa-users text-white text-xl"></i>
            </div>
            <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Total Usuarios</p>
                <p class="text-2xl font-semibold text-gray-900">{{ $usersCount }}</p>
            </div>
        </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-500 bg-opacity-75">
                <i class="fas fa-user-check text-white text-xl"></i>
            </div>
            <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Usuarios Activos</p>
                <p class="text-2xl font-semibold text-gray-900">{{ $activeUsersCount }}</p>
            </div>
        </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-500 bg-opacity-75">
                <i class="fas fa-user-tag text-white text-xl"></i>
            </div>
            <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Roles</p>
                <p class="text-2xl font-semibold text-gray-900">{{ $rolesCount }}</p>
            </div>
        </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
            <div class="p-3 rounded-full bg-red-500 bg-opacity-75">
                <i class="fas fa-user-shield text-white text-xl"></i>
            </div>
            <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Administradores</p>
                <p class="text-2xl font-semibold text-gray-900">{{ $adminCount }}</p>
            </div>
        </div>
    </div>
</div>

<!-- Acciones Rápidas -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Acciones Rápidas</h3>
        </div>
        <div class="p-6">
            <div class="grid grid-cols-1 gap-4">
                <a href="{{ route('admin.users.create') }}" 
                   class="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    <i class="fas fa-user-plus text-blue-500 text-xl mr-4"></i>
                    <div>
                        <p class="font-medium text-gray-900">Crear Usuario</p>
                        <p class="text-sm text-gray-600">Agregar un nuevo usuario al sistema</p>
                    </div>
                </a>
                <a href="{{ route('admin.users.index') }}" 
                   class="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                    <i class="fas fa-list text-green-500 text-xl mr-4"></i>
                    <div>
                        <p class="font-medium text-gray-900">Ver Usuarios</p>
                        <p class="text-sm text-gray-600">Gestionar usuarios existentes</p>
                    </div>
                </a>
            </div>
        </div>
    </div>

    <!-- Usuarios Recientes -->
    <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Usuarios Recientes</h3>
        </div>
        <div class="p-6">
            @if($recentUsers->count() > 0)
                <div class="space-y-4">
                    @foreach($recentUsers as $user)
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                <span class="text-sm font-medium text-gray-700">
                                    {{ strtoupper(substr($user->name, 0, 1)) }}
                                </span>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm font-medium text-gray-900">{{ $user->name }}</p>
                                <p class="text-sm text-gray-500">{{ $user->email }}</p>
                            </div>
                        </div>
                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {{ $user->role->name ?? 'Sin rol' }}
                        </span>
                    </div>
                    @endforeach
                </div>
            @else
                <p class="text-gray-500 text-center">No hay usuarios recientes</p>
            @endif
        </div>
    </div>
</div>
@endsection