<?php


namespace App\Http\Controllers\Admin;


use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;


class RoleController extends Controller
{
public function index()
{
$roles = Role::withCount('users')->paginate(10);
return view('admin.roles.index', compact('roles'));
}


public function create()
{
return view('admin.roles.create');
}


public function store(Request $request)
{
$data = $request->validate([
'name' => 'required|string|max:255|unique:roles,name',
'description' => 'nullable|string|max:1000',
]);


Role::create($data);


return redirect()->route('admin.roles.index')->with('success','Rol creado.');
}


public function edit(Role $role)
{
return view('admin.roles.edit', compact('role'));
}


public function update(Request $request, Role $role)
{
$data = $request->validate([
'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
'description' => 'nullable|string|max:1000',
]);


$role->update($data);


return redirect()->route('admin.roles.index')->with('success','Rol actualizado.');
}


public function destroy(Role $role)
{
$role->delete();
return back()->with('success','Rol eliminado.');
}


public function show(Role $role)
{
return redirect()->route('admin.roles.edit', $role);
}
}