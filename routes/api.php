<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

 Route::middleware('auth:api')->get('/user', function (Request $request) {
     return $request->user();
 });

//Auth
Route::group(['prefix' => 'auth'], function () {
    Route::post('register', 'AuthController@register');
    Route::post('login', 'AuthController@login')->name('login');
    Route::get('refresh', 'AuthController@refresh');

    Route::group(['middleware' => 'auth:api'], function(){
//        Route::get('user', 'AuthController@user');
        Route::post('logout', 'AuthController@logout');
    });
});

//Test
Route::group(['middleware' => 'auth:api'], function () {
    Route::get('test', function () {
        return response()->json(['foo' => 'bar']);
    });
    Route::post('test', 'TestController@store');
    Route::apiResource('tests', 'TestController');
});
