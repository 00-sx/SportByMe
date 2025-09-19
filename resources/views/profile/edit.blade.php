@extends('layouts.app')

@section('content')
<div class="container">
    <h1 class="mb-4">Editar Perfil</h1>

    {{-- Mostrar errores de validación --}}
    @if ($errors->any())
        <div class="alert alert-danger">
            <ul class="mb-0">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    {{-- Mensaje de éxito --}}
    @if (session('status'))
        <div class="alert alert-success">
            {{ session('status') }}
        </div>
    @endif

    <form method="POST" action="{{ route('profile.update') }}" class="card shadow-sm p-4">
        @csrf
        @method('PATCH')

        <div class="mb-3">
            <label class="form-label">Nombre</label>
            <input 
                type="text" 
                name="name" 
                class="form-control" 
                value="{{ old('name', $user->name) }}" 
                required
            >
        </div>

        <div class="mb-3">
            <label class="form-label">Correo electrónico</label>
            <input 
                type="email" 
                name="email" 
                class="form-control" 
                value="{{ old('email', $user->email) }}" 
                required
            >
        </div>

        <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary">Guardar cambios</button>
            <a href="{{ url()->previous() }}" class="btn btn-secondary">Cancelar</a>
        </div>
    </form>
</div>
@endsection
