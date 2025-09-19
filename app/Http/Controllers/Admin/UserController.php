<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;


class UserController extends Controller
{
public function index()
{
$users = User::with('role')->paginate(10);
return view('admin.users.index', compact('users'));
}


public function create()
{
$roles = Role::where('name', '!=', 'admin')->pluck('name','id');
return view('admin.users.create', compact('roles'));
}


public function store(Request $request)
{
$data = $request->validate([
'name' => 'required|string|max:255',
'email' => 'required|email|unique:users,email',
'role_id' => 'required|exists:roles,id',
'password' => 'required|string|min:8|confirmed',
'status' => 'boolean',
]);


$data['password'] = Hash::make($data['password']);


User::create($data);


return redirect()->route('admin.users.index')->with('success', 'Usuario creado exitosamente.');
}


public function edit(User $user)
{
$roles = Role::where('name', '!=', 'admin')->pluck('name','id');
return view('admin.users.edit', compact('user','roles'));
}


public function update(Request $request, User $user)
{
$data = $request->validate([
'name' => 'required|string|max:255',
'email' => 'required|email|unique:users,email,' . $user->id,
'role_id' => 'required|exists:roles,id',
'password' => 'nullable|string|min:8|confirmed',
'status' => 'boolean',
]);


if(!empty($data['password'])){
$data['password'] = Hash::make($data['password']);
} else {
unset($data['password']);
}


$user->update($data);


return redirect()->route('admin.users.index')->with('success', 'Usuario actualizado exitosamente.');
}


public function destroy(User $user)
{
$user->delete();
return redirect()->route('admin.users.index')->with('success', 'Usuario eliminado exitosamente.');
}


public function show(User $user)
{
return redirect()->route('admin.users.edit', $user);
}
}