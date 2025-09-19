<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>@yield('title', 'Admin Panel')</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
<style>
.sidebar { min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.sidebar .nav-link { color: rgba(255,255,255,0.8); border-radius: 8px; margin: 2px 0; }
.sidebar .nav-link:hover, .sidebar .nav-link.active { background: rgba(255,255,255,0.1); color: white; }
.main-content { background-color: #f8f9fa; min-height: 100vh; }
.card { border: none; box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075); }
.table th { background-color: #f8f9fa; border-top: none; }
.btn { border-radius: 6px; }
</style>
</head>
<body>
<div class="container-fluid">
<div class="row">
<!-- Sidebar -->
<div class="col-md-3 col-lg-2 px-0">
<div class="sidebar p-3">
<h5 class="text-white mb-4"><i class="fas fa-cogs me-2"></i>Admin Panel</h5>
<nav class="nav flex-column">
<a class="nav-link {{ request()->routeIs('admin.dashboard') ? 'active' : '' }}" href="{{ route('admin.dashboard') }}">
<i class="fas fa-tachometer-alt me-2"></i>Dashboard
</a>
<a class="nav-link {{ request()->routeIs('admin.users.*') ? 'active' : '' }}" href="{{ route('admin.users.index') }}">
<i class="fas fa-users me-2"></i>Gestión de Usuarios
</a>
<a class="nav-link {{ request()->routeIs('admin.roles.*') ? 'active' : '' }}" href="{{ route('admin.roles.index') }}">
<i class="fas fa-user-tag me-2"></i>Roles
</a>
</nav>
</div>
</div>

<!-- Main Content -->
<div class="col-md-9 col-lg-10 px-0">
<!-- Header -->
<div class="bg-white shadow-sm p-3 mb-4">
<div class="d-flex justify-content-between align-items-center">
<h4 class="mb-0">@yield('title', 'Panel de Administración')</h4>
<div class="dropdown">
<button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
<i class="fas fa-user me-2"></i>{{ auth()->user()->name }}
</button>
<ul class="dropdown-menu">
<li><a class="dropdown-item" href="{{ route('logout') }}" onclick="event.preventDefault();document.getElementById('logout-form').submit();">
<i class="fas fa-sign-out-alt me-2"></i>Cerrar Sesión
</a></li>
</ul>
<form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">@csrf</form>
</div>
</div>
</div>

<!-- Content -->
<div class="main-content p-4">
@if(session('success'))
<div class="alert alert-success alert-dismissible fade show" role="alert">
<i class="fas fa-check-circle me-2"></i>{{ session('success') }}
<button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>
@endif
@if(session('error'))
<div class="alert alert-danger alert-dismissible fade show" role="alert">
<i class="fas fa-exclamation-circle me-2"></i>{{ session('error') }}
<button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>
@endif
@yield('content')
</div>
</div>
</div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>