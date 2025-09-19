@extends('layouts.app')

@section('content')
<div class="container py-4">
    <div class="card shadow-sm">
        <div class="card-header">
            <h2 class="mb-0">Dashboard</h2>
        </div>
        <div class="card-body">
            <p class="mb-0">
                ¡Has iniciado sesión correctamente, {{ Auth::user()->name }}!
            </p>
        </div>
    </div>
</div>
@endsection
