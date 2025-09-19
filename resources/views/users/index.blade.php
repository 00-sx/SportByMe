@extends('layouts.app')

@section('content')
<div class="container">
    <h1 class="mb-4">Lista de Usuarios</h1>

    @if(session('success'))
        <div class="alert alert-success">
            {{ session('success') }}
        </div>
    @endif

    <a href="{{ route('users.create') }}" class="btn btn-primary mb-3">Nuevo Usuario</a>

    <table class="table table-bordered table-striped">
        <thead class="table-light">
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            @forelse($users as $user)
                <tr>
                    <td>{{ $user->id }}</td>
                    <td>{{ $user->name }}</td>
                    <td>{{ $user->email }}</td>
                    <td>{{ $user->role->name ?? 'Sin rol' }}</td>
                    <td>
                        <a href="{{ route('users.edit', $user) }}" class="btn btn-warning btn-sm">
                            Editar
                        </a>
                        <form 
                            action="{{ route('users.destroy', $user) }}" 
                            method="POST" 
                            style="display:inline-block"
                        >
                            @csrf
                            @method('DELETE')
                            <button 
                                type="submit" 
                                class="btn btn-danger btn-sm"
                                onclick="return confirm('¿Eliminar este usuario?')"
                            >
                                Eliminar
                            </button>
                        </form>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" class="text-center">No hay usuarios registrados</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</div>
@endsection
