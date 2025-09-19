<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, $roles = null)
    {
        $user = $request->user();

        // no autenticado -> redirigir al login
        if (!$user) {
            return redirect()->route('login');
        }

        // si no se especificó rol, permitir
        if (!$roles) {
            return $next($request);
        }

        // permitir múltiples roles separados por '|' o coma
        $allowed = preg_split('/[|,]/', $roles);

        $userRoleName = $user->role->name ?? null;

        if (in_array($userRoleName, $allowed)) {
            return $next($request);
        }

        // opción: abort(403) o redirigir a home con mensaje
        abort(403, 'No autorizado.');
    }
}

