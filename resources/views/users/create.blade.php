@extends('layouts.app')

@section('content')
<div class="container">
    <h1 class="mb-4">Crear Usuario</h1>

    {{-- Errores de validación --}}
    @if ($errors->any())
        <div class="alert alert-danger">
            <ul class="mb-0">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    {{-- Formulario --}}
    <form action="{{ route('users.store') }}" method="POST" class="card shadow-sm p-4">
        @csrf

        <div class="mb-3">
            <label class="form-label">Nombre</label>
            <input 
                type="text" 
                name="name" 
                class="form-control" 
                value="{{ old('name') }}" 
                required
            >
        </div>

        <div class="mb-3">
            <label class="form-label">Correo electrónico</label>
            <input 
                type="email" 
                name="email" 
                class="form-control" 
                value="{{ old('email') }}" 
                required
            >
        </div>

        <div class="mb-3">
            <label class="form-label">Contraseña</label>
            <input 
                type="password" 
                name="password" 
                class="form-control" 
                required
            >
        </div>

        <div class="mb-3">
            <label class="form-label">Confirmar contraseña</label>
            <input 
                type="password" 
                name="password_confirmation" 
                class="form-control" 
                required
            >
        </div>

        <div class="mb-3">
            <label class="form-label">Rol</label>
            <select name="role_id" class="form-select" required>
                <option value="">-- Selecciona un rol --</option>
                @foreach($roles as $role)
                    <option value="{{ $role->id }}" {{ old('role_id') == $role->id ? 'selected' : '' }}>
                        {{ ucfirst($role->name) }}
                    </option>
                @endforeach
            </select>
        </div>

        <div class="d-flex gap-2">
            <button type="submit" class="btn btn-success">Guardar</button>
            <a href="{{ route('users.index') }}" class="btn btn-secondary">Cancelar</a>
        </div>
    </form>
</div>
@endsection
