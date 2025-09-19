<x-guest-layout>
    <h2 class="mb-4 text-center">Iniciar Sesión</h2>

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

    {{-- Formulario de login --}}
    <form method="POST" action="{{ route('login') }}">
        @csrf

        <!-- Correo -->
        <div class="mb-3">
            <label for="email" class="form-label">Correo electrónico</label>
            <input id="email" 
                   type="email" 
                   class="form-control" 
                   name="email" 
                   value="{{ old('email') }}" 
                   required 
                   autofocus>
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

        <!-- Recordarme -->
        <div class="mb-3 form-check">
            <input type="checkbox" 
                   class="form-check-input" 
                   name="remember" 
                   id="remember">
            <label class="form-check-label" for="remember">Recordarme</label>
        </div>

        <!-- Botón -->
        <button type="submit" class="btn btn-primary w-100">
            Ingresar
        </button>
    </form>

    {{-- Enlace para registrarse --}}
    <div class="mt-3 text-center">
        <span>¿No tienes cuenta?</span>
        <a href="{{ route('register') }}">Regístrate aquí</a>
    </div>
</x-guest-layout>
