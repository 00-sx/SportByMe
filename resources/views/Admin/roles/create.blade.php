@extends('layouts.app')

@section('content')
<div class="container">
    <h1>Crear Rol</h1>

    <form action="{{ route('admin.roles.store') }}" method="POST">
        @csrf
        <div class="mb-3">
            <label>Nombre</label>
            <input type="text" name="name" class="form-control" required>
        </div>

        <div class="mb-3">
            <label>Descripción</label>
            <textarea name="description" class="form-control"></textarea>
        </div>

        <button type="submit" class="btn btn-success">Guardar</button>
        <a href="{{ route('admin.roles.index') }}" class="btn btn-secondary">Cancelar</a>
    </form>
</div>
@endsection
