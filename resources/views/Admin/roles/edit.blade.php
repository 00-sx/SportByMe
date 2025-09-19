@extends('layouts.app')

@section('content')
<div class="container">
    <h1>Editar Rol</h1>

    <form action="{{ route('admin.roles.update', $role) }}" method="POST">
        @csrf
        @method('PUT')
        <div class="mb-3">
            <label>Nombre</label>
            <input type="text" name="name" value="{{ $role->name }}" class="form-control" required>
        </div>

        <div class="mb-3">
            <label>Descripción</label>
            <textarea name="description" class="form-control">{{ $role->description }}</textarea>
        </div>

        <button type="submit" class="btn btn-success">Actualizar</button>
        <a href="{{ route('admin.roles.index') }}" class="btn btn-secondary">Cancelar</a>
    </form>
</div>
@endsection
