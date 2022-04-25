<?php

namespace App\Http\Middleware;

use Closure;

class BasketSharedData
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $basket = $request->session()->get('basket');
        view()->share('basketNumberItems', $basket->numberItems);

        return $next($request);
    }
}
