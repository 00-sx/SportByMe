<x-guest-layout>
    <h2 class="mb-4 text-center">Registro</h2>

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

    {{-- Formulario de registro --}}
    <form method="POST" action="{{ route('register') }}">
        @csrf

        <!-- Nombre -->
        <div class="mb-3">
            <label for="name" class="form-label">Nombre</label>
            <input id="name" 
                   type="text" 
                   class="form-control" 
                   name="name" 
                   value="{{ old('name') }}" 
                   required 
                   autofocus>
        </div>

        <!-- Correo -->
        <div class="mb-3">
            <label for="email" class="form-label">Correo electrónico</label>
            <input id="email" 
                   type="email" 
                   class="form-control" 
                   name="email" 
                   value="{{ old('email') }}" 
                   required>
        </div>

        <!-- Contraseña -->
        <div class="mb-3">
            <label for="password" class="form-label">Contraseña</label>
            <input id="password" 
                   type="password" 
                   class="form-control" 
                   name="password" 
                   required>
        </div>

        <!-- Confirmación -->
        <div class="mb-3">
            <label for="password_confirmation" class="form-label">Confirmar contraseña</label>
            <input id="password_confirmation" 
                   type="password" 
                   class="form-control" 
                   name="password_confirmation" 
                   required>
        </div>

        <!-- Botón -->
        <div class="d-grid">
            <button type="submit" class="btn btn-success">
                Registrarme
            </button>
        </div>
    </form>

    {{-- Enlace para login --}}
    <div class="mt-3 text-center">
        <span>¿Ya tienes cuenta?</span>
        <a href="{{ route('login') }}">Inicia sesión aquí</a>
    </div>
</x-guest-layout>
