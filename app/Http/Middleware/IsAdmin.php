<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        if (auth()->user()->role->name !== 'admin') {
            abort(403, 'Acceso denegado. Solo administradores.');
        }

        return $next($request);
    }
}
